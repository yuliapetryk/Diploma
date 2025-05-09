from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

MODEL_NAME = "./model"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

LABELS = [
    "admiration", "amusement", "anger", "annoyance", "approval", "caring",
    "confusion", "curiosity", "desire", "disappointment", "disapproval",
    "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief",
    "joy", "love", "nervousness", "optimism", "pride", "realization", "relief",
    "remorse", "sadness", "surprise", "neutral"
]
#
def predict_emotions(text: str):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1).squeeze()

    top_indices = torch.topk(probs, 3).indices.tolist()
    results = [{"label": LABELS[i], "score": float(probs[i])} for i in top_indices]
    return results
