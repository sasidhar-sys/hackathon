import torch
from torchvision import transforms, models
from PIL import Image

device = torch.device("cpu")

model = models.efficientnet_b0(pretrained=False)
model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, 3)
model.load_state_dict(torch.load("model/medvision_model.pth", map_location=device))
model.eval()

classes = ["Normal", "Lung Cancer", "Esophageal"]

def predict_image(img_path):
    transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor()
    ])

    image = Image.open(img_path).convert("RGB")
    img_tensor = transform(image).unsqueeze(0)

    outputs = model(img_tensor)
    probs = torch.softmax(outputs, dim=1)

    confidence, pred = torch.max(probs, 1)

    return classes[pred.item()], round(confidence.item()*100,2)