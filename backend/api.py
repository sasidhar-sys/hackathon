from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
from torchvision import transforms
from torchvision.models import efficientnet_b0
from PIL import Image
import io

app = FastAPI()

# 🔥 ALLOW FRONTEND ACCESS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- LOAD MODEL ----------
MODEL_PATH = "../model/model.pth"

model = efficientnet_b0()
model.classifier[1] = nn.Linear(model.classifier[1].in_features, 3)
model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
model.eval()

classes = ["Esophageal", "Lung Cancer", "Normal"]

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor()
])

# ---------- API ROUTE ----------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")

    img = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(img)
        probs = torch.softmax(outputs, dim=1)
        confidence, pred = torch.max(probs, 1)

    result = classes[pred.item()]
    confidence = float(confidence.item() * 100)

    return {
        "prediction": result,
        "confidence": round(confidence, 2)
    }