"""
=========================================================
FILE: app.py  (UPDATED — with CORS for React integration)
=========================================================
"""
"""
=========================================================
FILE: app.py  (UPDATED — with model_loader and CORS)
=========================================================
"""

import json
import torch
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS

#  Import your helper functions
from utils import get_doctor, detect_gynecology, detect_pediatric, detect_orthopedic, detect_neurology

# -------------------------------------------------------
# LOAD MODEL USING model_loader.py
# -------------------------------------------------------
#  CHANGED: Instead of directly using BertForSequenceClassification.from_pretrained(),
#             we now use model_loader.py to safely load the trained model.
from model_loader import get_model
tokenizer, model, label_encoder = get_model()

# Set device and evaluation mode
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()

# Decode label from model output index
def decode_label(idx):
    #  CHANGED: Now uses label_encoder loaded from JSON instead of classes hardcoded
    return label_encoder["classes"][idx]

# -------------------------------------------------------
# INITIALIZE FLASK APP + CORS
# -------------------------------------------------------
app = Flask(__name__)
CORS(app)  # Allows React frontend to call API without CORS issues

# -------------------------------------------------------
# ROUTE 1 — Home page (Flask UI)
# -------------------------------------------------------
@app.route("/")
def home():
    return render_template("index.html")


# -------------------------------------------------------
# ROUTE 2 — Flask prediction page (standalone)
# -------------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    text = request.form["symptoms"].strip()

    # Pre-check with simple rules
    if detect_gynecology(text):
        return render_template("result.html",
                               disease="Possible Female Health Issue",
                               doctor="Gynecologist")
    if detect_pediatric(text):
        return render_template("result.html",
                               disease="Child-related Health Issue",
                               doctor="Pediatrician")
    if detect_orthopedic(text):
        return render_template("result.html",
                               disease="Possible Orthopedic Condition",
                               doctor="Orthopedic")

    # Tokenize input
    inputs = tokenizer(text, return_tensors="pt", truncation=True,
                       padding=True, max_length=64)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Predict
    with torch.no_grad():
        logits = model(**inputs).logits

    predicted_id = torch.argmax(logits, dim=1).item()
    disease = decode_label(predicted_id)
    doctor = get_doctor(disease)

    return render_template("result.html", disease=disease, doctor=doctor)


# -------------------------------------------------------
# ROUTE 3 — JSON API for React integration
# -------------------------------------------------------
@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.get_json()
    text = data.get("symptoms", "").strip()

    if not text:
        return jsonify({"error": "No symptoms provided"}), 400

    # Simple rules first
    if detect_gynecology(text):
        return jsonify({"disease": "Possible Female Health Issue",
                        "doctor": "Gynecologist"})
    if detect_pediatric(text):
        return jsonify({"disease": "Child-related Health Issue",
                        "doctor": "Pediatrician"})
    if detect_orthopedic(text):
        return jsonify({"disease": "Possible Orthopedic Condition",
                        "doctor": "Orthopedic"})

    # Tokenize input
    inputs = tokenizer(text, return_tensors="pt", truncation=True,
                       padding=True, max_length=64)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Predict
    with torch.no_grad():
        logits = model(**inputs).logits

    predicted_id = torch.argmax(logits, dim=1).item()
    disease = decode_label(predicted_id)
    doctor = get_doctor(disease)

    return jsonify({"disease": disease, "doctor": doctor})


# -------------------------------------------------------
# RUN SERVER
# -------------------------------------------------------
if __name__ == "__main__":
    #  Keep debug=True for development
    app.run(debug=True, port=5000)
