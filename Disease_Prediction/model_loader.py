import os
from transformers import AutoTokenizer, AutoModel
import json

MODEL_DIR = "./model"

def get_model():
    """
    Loads trained model if present.
    If not present, instructs user to download manually.
    """

    if not os.path.exists(MODEL_DIR) or len(os.listdir(MODEL_DIR)) == 0:
        raise Exception(
            "❌ Model not found.\n"
            "Please download the trained model folder and place it inside 'Disease_Prediction/model/'"
        )

    print("✅ Loading trained model...")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModel.from_pretrained(MODEL_DIR)

    # Load label encoder
    with open(os.path.join(MODEL_DIR, "label_encoder.json"), "r") as f:
        label_encoder = json.load(f)

    return tokenizer, model, label_encoder