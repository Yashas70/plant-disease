import io
import os
import json
from datetime import datetime

import numpy as np
from PIL import Image
from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    send_file,
    send_from_directory,
)
import tensorflow as tf

from advisory import get_advisory
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# ------------------------------------------------------
# Flask app – HTML/CSS/JS in frontend/, images in static/
# ------------------------------------------------------
app = Flask(
    __name__,
    template_folder="frontend",  # index.html, style.css, script.js
    static_folder="static",      # pesticide images, default_pesticide.png, etc.
)

# ------------------------------------------------------
# Model + class labels
# ------------------------------------------------------
MODEL_PATH = "plant_model.h5"   # your saved model
IMG_SIZE = (160, 160)           # matches training size

print("[INFO] Loading model from", MODEL_PATH)
model = tf.keras.models.load_model(MODEL_PATH)

# class_indices.json created during training
# e.g. {"Apple___Apple_scab": 0, "Apple___Black_rot": 1, ...}
with open("class_indices.json", "r") as f:
    class_indices = json.load(f)

index_to_label = {idx: name for name, idx in class_indices.items()}
print("[INFO] Loaded", len(index_to_label), "classes from class_indices.json")


# ------------------------------------------------------
# Helper functions
# ------------------------------------------------------
def preprocess_image(file_storage):
    img = Image.open(file_storage.stream).convert("RGB")
    img = img.resize(IMG_SIZE)
    arr = np.array(img, dtype=np.float32)
    arr = preprocess_input(arr)      # 🔹 instead of /255.0
    arr = np.expand_dims(arr, axis=0)
    return arr



def make_nice_label(raw_label: str) -> str:
    """Turn 'Tomato___Late_blight' into 'Tomato – Late blight'."""
    if "___" in raw_label:
        crop, disease = raw_label.split("___", 1)
        crop = crop.replace("_", " ")
        disease = disease.replace("_", " ")
        return f"{crop} – {disease}"
    return raw_label.replace("_", " ")


# ------------------------------------------------------
# Routes – frontend
# ------------------------------------------------------
@app.route("/")
def index():
    # Loads frontend/index.html
    return render_template("index.html")


# Let HTML use /style.css and /script.js
@app.route("/style.css")
def style_css():
    return send_from_directory("frontend", "style.css", mimetype="text/css")


@app.route("/script.js")
def script_js():
    return send_from_directory("frontend", "script.js", mimetype="text/javascript")


# ------------------------------------------------------
# Prediction API
# ------------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    """
    Handle image upload, run model, and return JSON for script.js.

    Frontend sends:
      - leafImage (file)
      - language (string, currently used only on frontend)
    """
    if "leafImage" not in request.files:
        return jsonify({"error": "No file field 'leafImage' in request"}), 400

    file = request.files["leafImage"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        # Preprocess and predict
        img_tensor = preprocess_image(file)
        preds = model.predict(img_tensor)[0]  # shape: (num_classes,)

        class_index = int(np.argmax(preds))
        confidence = float(np.max(preds) * 100.0)

        predicted_label = index_to_label.get(
            class_index, f"Unknown_class_{class_index}"
        )
        nice_label = make_nice_label(predicted_label)

        # Get advisory from advisory.py
        advisory = get_advisory(predicted_label)
        pesticide_name = advisory.get(
            "pesticide_name", "General Fungicide (Safe Option)"
        )
        pesticide_info = advisory.get("pesticide_info", "")
        pesticide_image = advisory.get("pesticide_image", "default_pesticide.png")
        organic_note = advisory.get("organic_note", "")

        organic_option = bool(organic_note.strip())

        print(
            "[INFO] Predicted:",
            predicted_label,
            "| conf=",
            round(confidence, 2),
            "| pesticide=",
            pesticide_name,
            "| image=",
            pesticide_image,
        )

        result = {
            "predicted_label": predicted_label,
            "nice_label": nice_label,
            "confidence": confidence,          # %
            "pesticide_name": pesticide_name,
            "pesticide_info": pesticide_info,
            "pesticide_image": pesticide_image,
            "organic_option": organic_option,
            "organic_note_en": organic_note,
        }

        return jsonify(result)

    except Exception as e:
        print("[ERROR] /predict:", e)
        return jsonify({"error": str(e)}), 500


# ------------------------------------------------------
# PDF report API (with pesticide image)
# ------------------------------------------------------
@app.route("/download_report")
def download_report():
    """
    Generate an English PDF farmer report.

    Frontend passes:
      - label
      - confidence
    (pesticide info is always recomputed from advisory.py)
    """
    label = request.args.get("label", "Unknown")
    confidence = request.args.get("confidence", "")

    advisory = get_advisory(label)
    nice_label = make_nice_label(label)

    pesticide_name = advisory.get(
        "pesticide_name", "General Fungicide (Safe Option)"
    )
    pesticide_info = advisory.get("pesticide_info", "")
    pesticide_image = advisory.get("pesticide_image", "default_pesticide.png")
    organic_note = advisory.get("organic_note", "")

    # Use reportlab to build PDF
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas
    except ImportError:
        return (
            "Python package 'reportlab' is not installed. "
            "Install it with: pip install reportlab",
            500,
        )

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    y = height - 50

    # Title
    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, y, "Smart Farmer – Plant Health Report")

    # Date
    y -= 30
    c.setFont("Helvetica", 10)
    c.drawString(50, y, f"Generated on: {datetime.now().strftime('%d-%m-%Y %H:%M')}")

    # Disease block
    y -= 40
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Disease Prediction")

    y -= 20
    c.setFont("Helvetica", 12)
    c.drawString(50, y, f"Disease: {nice_label}")

    if confidence:
        y -= 20
        c.drawString(50, y, f"Model confidence: {confidence}%")

    # Helper for wrapping vertical text
    def draw_wrapped_text(text, start_y, max_chars=90, font="Helvetica", size=11):
        c.setFont(font, size)
        y_pos = start_y
        for raw_line in (text or "").split("\n"):
            line = raw_line.strip()
            if not line:
                y_pos -= 15
                continue
            while len(line) > max_chars:
                part = line[:max_chars]
                c.drawString(50, y_pos, part)
                line = line[max_chars:]
                y_pos -= 15
                if y_pos < 80:
                    c.showPage()
                    y_pos = height - 80
                    c.setFont(font, size)
            c.drawString(50, y_pos, line)
            y_pos -= 15
            if y_pos < 80:
                c.showPage()
                y_pos = height - 80
                c.setFont(font, size)
        return y_pos

    # Pesticide block
    y -= 30
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Recommended Pesticide")

    y -= 20
    c.setFont("Helvetica", 12)
    c.drawString(50, y, f"Name: {pesticide_name}")

    y -= 24
    y = draw_wrapped_text(pesticide_info, y)

    # Organic note
    if organic_note:
        if y < 140:
            c.showPage()
            y = height - 80
        y -= 10
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, "Organic / Safer Option")
        y -= 18
        y = draw_wrapped_text(organic_note, y)

    # Try to add pesticide image at bottom-right
    try:
        img_path = os.path.join(app.static_folder, pesticide_image)
        if os.path.exists(img_path):
            img_width = 180
            img_height = 210
            img_x = width - img_width - 50
            img_y = 80
            c.drawImage(
                img_path,
                img_x,
                img_y,
                width=img_width,
                height=img_height,
                preserveAspectRatio=True,
                mask="auto",
            )
    except Exception as e:
        print("[WARN] Could not add pesticide image to PDF:", e)

    # Safety note
    if y < 160:
        c.showPage()
        y = height - 80

    y -= 10
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, y, "Important Safety Note")

    safety = (
        "This advisory is based on AI prediction. Confirm with your local agricultural "
        "officer or extension worker before using any chemical pesticide. Always wear "
        "safety gear (gloves, mask, long clothes) and strictly follow label instructions."
    )
    y -= 20
    y = draw_wrapped_text(safety, y)

    c.showPage()
    c.save()
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="SmartFarmer_Plant_Report.pdf",
        mimetype="application/pdf",
    )


# ------------------------------------------------------
# Run app
# ------------------------------------------------------
if __name__ == "__main__":
    # run from project folder: python app.py
    app.run(host="0.0.0.0", port=5000, debug=True)
