"""
=========================================================
FILE: app.py  (UPDATED — with CORS for React integration)
=========================================================
"""

import json
import torch
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from transformers import BertTokenizer, BertForSequenceClassification
from utils import get_doctor, detect_gynecology, detect_pediatric, detect_orthopedic, detect_neurology, detect_generalphysician

app = Flask(__name__)

# Allow React app to call this Flask API
CORS(app)

# -------------------------------------------------------
# LOAD MODEL
# -------------------------------------------------------
MODEL_PATH = "model/bert_model"
model      = BertForSequenceClassification.from_pretrained(MODEL_PATH)
tokenizer  = BertTokenizer.from_pretrained(MODEL_PATH)

with open("model/label_encoder.json", "r") as f:
    classes = json.load(f)["classes"]

def decode_label(idx):
    return classes[idx]

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()

print(f"Model loaded | {len(classes)} diseases | device: {device}")


# -------------------------------------------------------
# ROUTE 1 — Home page (Flask UI — still works standalone)
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

    inputs = tokenizer(text, return_tensors="pt", truncation=True,
                       padding=True, max_length=64)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        logits = model(**inputs).logits

    predicted_id = torch.argmax(logits, dim=1).item()
    disease      = decode_label(predicted_id)
    doctor       = get_doctor(disease)

    return render_template("result.html", disease=disease, doctor=doctor)


# -------------------------------------------------------
# ROUTE 3 — JSON API for React integration
# React calls this endpoint and gets JSON back
# -------------------------------------------------------
@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.get_json()
    text = data.get("symptoms", "").strip()

    if not text:
        return jsonify({"error": "No symptoms provided"}), 400

    if detect_gynecology(text):
        return jsonify({
            "disease": "Possible Female Health Issue",
            "doctor":  "Gynecologist"
        })
    if detect_pediatric(text):
        return jsonify({
            "disease": "Child-related Health Issue",
            "doctor":  "Pediatrician"
        })
    if detect_orthopedic(text):
        return jsonify({
            "disease": "Possible Orthopedic Condition",
            "doctor":  "Orthopedic"
        })
    if detect_neurology(text):
        return jsonify({
            "disease": "Possible Neurological Condition",
            "doctor":  "Neurologist"
        })
    if detect_generalphysician(text):
        return jsonify({
            "disease": "Possible General Health Issue",
            "doctor":  "General Physician"
        })

    inputs = tokenizer(text, return_tensors="pt", truncation=True,
                       padding=True, max_length=64)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        logits = model(**inputs).logits

    predicted_id = torch.argmax(logits, dim=1).item()
    disease      = decode_label(predicted_id)
    doctor       = get_doctor(disease)

    return jsonify({
        "disease": disease,
        "doctor":  doctor
    })


# -------------------------------------------------------
# RUN SERVER
# -------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)