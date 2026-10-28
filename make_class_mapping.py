import os
import json
from tensorflow.keras.preprocessing.image import ImageDataGenerator

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_ROOT = os.path.join(BASE_DIR, "data")
DATA_DIR = os.path.join(DATA_ROOT, "New Plant Diseases Dataset(Augmented)")

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

def main():
    print("[INFO] Creating generator just to read class names...")

    datagen = ImageDataGenerator(rescale=1.0/255, validation_split=0.2)

    gen = datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="training"
    )

    class_indices = gen.class_indices  # dict: {'Apple___Apple_scab': 0, ...}

    print("[INFO] Classes found:")
    for label, idx in class_indices.items():
        print(f"  {idx}: {label}")

    # Save to json for app.py
    mapping_path = os.path.join(BASE_DIR, "class_indices.json")
    with open(mapping_path, "w") as f:
        json.dump(class_indices, f, indent=2)

    print(f"[INFO] Saved mapping to {mapping_path}")

if __name__ == "__main__":
    main()
