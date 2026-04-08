"""
=========================================================
FILE: train_bert.py
PURPOSE: Train BERT model for Disease Prediction
FLOW:
1. Load dataset
2. Clean data
3. Encode labels
4. Tokenize text
5. Create dataset class
6. Train BERT model
7. Save model + tokenizer
=========================================================
"""
 
# -------------------------------
# IMPORT LIBRARIES
# -------------------------------
import os
import json
import pandas as pd
import torch
 
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
 
from transformers import BertTokenizer, BertForSequenceClassification
from transformers import Trainer, TrainingArguments
 
# -------------------------------
# STEP 1: LOAD DATASET
# -------------------------------
data = pd.read_csv("dataset/Symptom_Disease.csv")
data = data.drop(columns=["Unnamed: 0"])
 
texts  = data['text'].astype(str).tolist()
labels = data['label'].astype(str).tolist()
 
 
# -------------------------------
# STEP 2: ENCODE LABELS
# -------------------------------
label_encoder  = LabelEncoder()
encoded_labels = label_encoder.fit_transform(labels)
 
# Create model folder if not exists
os.makedirs("model", exist_ok=True)
 
# -----------------------------------------------
# SAVE AS JSON — no pickle, works any Python version
# -----------------------------------------------
with open("model/label_encoder.json", "w") as f:
    json.dump({"classes": label_encoder.classes_.tolist()}, f, indent=2)
 
print("label_encoder.json saved to model/")
print("Classes:", label_encoder.classes_.tolist())
 
 
# -------------------------------
# STEP 3: SPLIT DATA
# -------------------------------
train_texts, val_texts, train_labels, val_labels = train_test_split(
    texts, encoded_labels, test_size=0.2, random_state=42
)
 
 
# -------------------------------
# STEP 4: TOKENIZATION
# -------------------------------
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
 
train_encodings = tokenizer(train_texts, truncation=True, padding=True, return_transors="pt")
val_encodings   = tokenizer(val_texts,   truncation=True, padding=True, return_transors="pt")
 
 
# -------------------------------
# STEP 5: CREATE DATASET CLASS
# -------------------------------
class DiseaseDataset(torch.utils.data.Dataset):
 
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels    = labels
 
    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item
 
    def __len__(self):
        return len(self.labels)
 
 
train_dataset = DiseaseDataset(train_encodings, train_labels)
val_dataset   = DiseaseDataset(val_encodings,   val_labels)
 
 
# -------------------------------
# STEP 6: LOAD BERT MODEL
# -------------------------------
model = BertForSequenceClassification.from_pretrained(
    'bert-base-uncased',
    num_labels=len(set(encoded_labels))
)
 
 
# -------------------------------
# STEP 7: TRAINING SETTINGS
# -------------------------------
training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=6,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    logging_dir='./logs',
    load_best_model_at_end=True
)
 
 
# -------------------------------
# STEP 8: TRAIN MODEL
# -------------------------------
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)
 
trainer.train()
 
 
# -------------------------------
# STEP 9: SAVE MODEL + TOKENIZER
# -------------------------------
model.save_pretrained("model/bert_model")
tokenizer.save_pretrained("model/bert_model")
 
print("\nTraining complete!")
print("Model saved to    : model/bert_model")
print("Encoder saved to  : model/label_encoder.json")