import torch
import torchvision.models as models
import torch.nn as nn
import os

CLASSES = ["Normal", "Cancer"]

def load_model():
    # Attempt to load EfficientNet-B0
    model = models.efficientnet_b0(pretrained=True)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, 2)
    
    weights_path = "model/efficientnet_lung_best.pth"
    if os.path.exists(weights_path):
        try:
            model.load_state_dict(torch.load(weights_path, map_location='cpu'))
            print("Loaded fine-tuned model weights successfully.")
        except Exception as e:
            print(f"Failed to load weights: {e}. Using pre-trained only.")
    else:
        print(f"Weights file not found at {weights_path}. Using base model.")
        
    model.eval()
    return model

def predict_image(model, image_tensor):
    with torch.no_grad():
        output = model(image_tensor)
        prob = torch.softmax(output, dim=1)
        confidence, pred_idx = torch.max(prob, 1)
        
    pred_class = CLASSES[pred_idx.item()]
    prob_val = confidence.item() * 100.0
    
    # Calculate Risk Level and Message
    if pred_class == "Cancer":
        risk = "High" if prob_val >= 80 else "Medium"
        message = "Consult an oncologist immediately." if risk == "High" else "Further medical evaluation recommended."
    else:
        risk = "High" if prob_val < 60 else "Low" # If it's normal but low confidence, maybe medium risk
        if risk == "High":
             risk = "Medium"
             message = "Normal prediction with low confidence. Consider a follow-up."
        else:
             risk = "Low"
             message = "No significant abnormalities detected. Routine checkup advised."

    return pred_class, prob_val, risk, message