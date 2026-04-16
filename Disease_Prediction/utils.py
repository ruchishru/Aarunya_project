"""
=========================================================
FILE: utils.py
PURPOSE:
1. Map disease → doctor
2. Detect special cases (gynecology & pediatric)
=========================================================
"""


# -------------------------------
# FUNCTION 1: DISEASE → DOCTOR
# -------------------------------
def get_doctor(disease):

    mapping = {

        # Dermatology
        "Fungal infection" : "Dermatologist",
        "Psoriasis"        : "Dermatologist",
        "Impetigo"         : "Dermatologist",
        "Allergy"          : "Dermatologist",
        "Acne"             : "Dermatologist",

        # Neurology
        "Migraine"                     : "Neurologist",
        "Cervical spondylosis"         : "Neurologist",
        "Paralysis (brain hemorrhage)" : "Neurologist",

        # Gastroenterology
        "GERD"                 : "Gastroenterologist",
        "Chronic cholestasis"  : "Gastroenterologist",
        "Peptic ulcer disease" : "Gastroenterologist",
        "Hepatitis A"          : "Gastroenterologist",
        "Hepatitis B"          : "Gastroenterologist",
        "Dimorphic Hemorrhoids": "Gastroenterologist",
        "gastroesophageal reflux disease": "Gastroenterologist",
        "peptic ulcer disease" : "Gastroenterologist",

        # General Physician
        "Diabetes"    : "General Physician",
        "Hypertension": "General Physician",
        "Malaria"     : "General Physician",
        "Common Cold" : "General Physician",
        "Chicken pox" : "General Physician",
        "Bronchial Asthma": "General Physician",
        "Jaundice"    : "General Physician",
        "urinary tract infection" : "General Physician",
        "drug reaction" : "General Physician",

        # Orthopedics
        "Ankle Sprain": "Orthopedic",
        "Knee Pain"   : "Orthopedic",
        "Back Pain"   : "Orthopedic",
        "Fracture"    : "Orthopedic",
        "Joint Pain"  : "Orthopedic",
        "Arthritis"   : "Orthopedic",

        # Pediatrics
        "Measles"                : "Pediatrician",
        "Common Cold in children": "Pediatrician",

        # Gynecology
        "Pregnancy"               : "Gynecologist",
        "PCOS"                    : "Gynecologist",
        "Menstrual irregularities": "Gynecologist",
        "Urinary tract infection" : "Gynecologist",
        "Period"                  : "Gynecologist",
        "Period pain"             : "Gynecologist",
        "PCOD"                    : "Gynecologist",
    }

    return mapping.get(disease, "General Physician")


# -------------------------------
# FUNCTION 2: GYNECOLOGY DETECTION
# -------------------------------
def detect_gynecology(text):

    keywords = [
        "pregnancy", "pregnant",
        "period", "missed period",
        "menstrual", "menopause",
        "pcos",
        "uterus", "ovary",
        "vaginal", "fertility", "pcod", "girl", "female", "woman", "women"
    ]

    text_lower = text.lower()
    for word in keywords:
        if word in text_lower:
            return True

    return False


# -------------------------------
# FUNCTION 3: PEDIATRIC DETECTION
# -------------------------------
def detect_pediatric(text):

    keywords = [
        "child", "children",
        "baby", "infant", "newborn",
        "kid", "toddler",
        "school child",
        "my son", "my daughter",
        "years old child", "baby"
    ]

    text_lower = text.lower()
    for word in keywords:
        if word in text_lower:
            return True

    return False


# FUNCTION 4: ORTHOPEDIC DETECTION
def detect_orthopedic(text):

    keywords = [
        "ankle sprain", "fracture", "sprain", "bone"
    ]

    text_lower = text.lower()
    for word in keywords:
        if word in text_lower:
            return True

    return False


# FUNCTION 5: NEUROLOGIST DETECTION
def detect_neurology(text):

    keywords = [
        "stroke", "epilepsy", "stroke", "severe headache"
    ]

    text_lower = text.lower()
    for word in keywords:
        if word in text_lower:
            return True

    return False

# Function 6: GENERAL HEALTH ISSUE
def detect_generalphysician(text):

    keywords = [
        "bleeding", "back pain", "headache", "fever"
    ]

    text_lower = text.lower()
    for word in keywords:
        if word in text_lower:
            return True

    return False
