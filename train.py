import os
import json
import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import (
    ModelCheckpoint,
    EarlyStopping,
    ReduceLROnPlateau,
)

# ---------------- PATHS ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_DIR = os.path.join(
    BASE_DIR,
    "data",
    "New Plant Diseases Dataset(Augmented)",
    "Dataset",
    "train",
)

MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "plant_model.h5")
CLASS_INDICES_PATH = os.path.join(BASE_DIR, "class_indices.json")

# ---------------- HYPERPARAMETERS ----------------
IMG_SIZE = (160, 160)
BATCH_SIZE = 32
VAL_SPLIT = 0.2
EPOCHS_STAGE1 = 8       # frozen base
EPOCHS_STAGE2 = 10      # fine-tuning (can stop early via EarlyStopping)


def main():
    # -------------------------------------------------
    # 1. Check data directory
    # -------------------------------------------------
    if not os.path.isdir(DATA_DIR):
        raise FileNotFoundError(
            f"[ERROR] DATA_DIR not found at:\n  {DATA_DIR}\n"
            "Open your 'data' folder in VS Code, confirm the exact path, "
            "then update DATA_DIR at the top of train.py."
        )

    print(f"[INFO] Using DATA_DIR: {DATA_DIR}")
    print("[INFO] Class folders:")
    for name in sorted(os.listdir(DATA_DIR)):
        full = os.path.join(DATA_DIR, name)
        if os.path.isdir(full):
            print("  -", name)

    # -------------------------------------------------
    # 2. Data generators with stronger augmentation
    #    IMPORTANT: use preprocess_input (no rescale=1./255 here)
    # -------------------------------------------------
    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        validation_split=VAL_SPLIT,
        rotation_range=30,
        width_shift_range=0.15,
        height_shift_range=0.15,
        shear_range=0.15,
        zoom_range=0.2,
        horizontal_flip=True,
        brightness_range=(0.6, 1.4),
        fill_mode="nearest",
    )

    train_gen = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="training",
        shuffle=True,
    )

    val_gen = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="validation",
        shuffle=False,
    )

    num_classes = train_gen.num_classes
    print(f"[INFO] Number of classes: {num_classes}")

    # Save class_indices for app.py
    with open(CLASS_INDICES_PATH, "w") as f:
        json.dump(train_gen.class_indices, f, indent=2)
    print(f"[INFO] Saved class_indices to: {CLASS_INDICES_PATH}")

    # -------------------------------------------------
    # 3. Class weights (manage imbalance)
    # -------------------------------------------------
    class_counts = np.bincount(train_gen.classes)
    total = float(class_counts.sum())
    class_weights = {
        i: total / (num_classes * count)
        for i, count in enumerate(class_counts)
        if count > 0
    }

    print("[INFO] Class counts:", class_counts)
    print("[INFO] Class weights:", class_weights)

    # -------------------------------------------------
    # 4. Build model (MobileNetV2)
    # -------------------------------------------------
    base_model = MobileNetV2(
        input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3),
        include_top=False,
        weights="imagenet",
    )

    # Stage 1: freeze base
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dropout(0.35)(x)
    outputs = Dense(num_classes, activation="softmax")(x)
    model = Model(inputs=base_model.input, outputs=outputs)

    model.compile(
        optimizer=Adam(learning_rate=1e-4),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    print(model.summary())

    # -------------------------------------------------
    # 5. Callbacks
    # -------------------------------------------------
    checkpoint_cb = ModelCheckpoint(
        MODEL_PATH,
        monitor="val_accuracy",
        save_best_only=True,
        save_weights_only=False,
        verbose=1,
    )

    earlystop_cb = EarlyStopping(
        monitor="val_accuracy",
        patience=5,
        restore_best_weights=True,
        verbose=1,
    )

    reducelr_cb = ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=2,
        min_lr=1e-6,
        verbose=1,
    )

    callbacks = [checkpoint_cb, earlystop_cb, reducelr_cb]

    # -------------------------------------------------
    # 6. Train – Stage 1 (frozen base)
    # -------------------------------------------------
    print("[INFO] Starting training: Stage 1 (frozen base)...")

    history1 = model.fit(
        train_gen,
        epochs=EPOCHS_STAGE1,
        validation_data=val_gen,
        class_weight=class_weights,
        callbacks=callbacks,
    )

    # -------------------------------------------------
    # 7. Fine-tune: unfreeze top layers of base model
    # -------------------------------------------------
    print("[INFO] Unfreezing top MobileNetV2 layers for fine-tuning...")

    N = 60  # unfreeze more layers for better adaptation
    for layer in base_model.layers[-N:]:
        layer.trainable = True

    model.compile(
        optimizer=Adam(learning_rate=1e-5),  # smaller LR for fine-tuning
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    print("[INFO] Starting training: Stage 2 (fine-tuning)...")

    initial_epoch = len(history1.history["loss"])
    history2 = model.fit(
        train_gen,
        epochs=EPOCHS_STAGE1 + EPOCHS_STAGE2,
        initial_epoch=initial_epoch,
        validation_data=val_gen,
        class_weight=class_weights,
        callbacks=callbacks,
    )

    print("[INFO] Training complete. Best model saved to:", MODEL_PATH)


if __name__ == "__main__":
    main()
