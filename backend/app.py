from flask import Flask, request, jsonify
import torch
from torchvision import transforms
from PIL import Image
import numpy as np
import io

from model import load_model, predict_image
from gradcam import generate_gradcam_base64

try:
    import fitz # PyMuPDF for PDF extraction
    HAS_PDF_SUPPORT = True
except ImportError:
    HAS_PDF_SUPPORT = False

app = Flask(__name__)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

model = load_model()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def process_file(file):
    filename = file.filename.lower()
    
    if filename.endswith('.pdf'):
        if not HAS_PDF_SUPPORT:
            raise ValueError("PDF support missing. Please install PyMuPDF (fitz).")
            
        pdf_bytes = file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        if len(doc) == 0:
            raise ValueError("Empty PDF file.")
        
        # Load the first page as an image
        page = doc.load_page(0)
        pix = page.get_pixmap()
        image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
    elif filename.endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
        image = Image.open(file).convert('RGB')
    else:
        raise ValueError("Unsupported file type. Please upload Image or PDF.")
        
    # Resize image explicitly for the original base image
    base_image = image.resize((224, 224))
    base_image_np = np.array(base_image)
    
    # Run through transforms
    input_tensor = transform(image).unsqueeze(0)
    
    return input_tensor, base_image_np

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    try:
        input_tensor, base_image_np = process_file(file)
        
        # Predict
        pred_class, prob_val, risk, message = predict_image(model, input_tensor)
        
        # Generate Heatmap
        heatmap_b64 = generate_gradcam_base64(model, input_tensor, base_image_np)
        
        return jsonify({
            "prediction": pred_class,
            "probability": prob_val,
            "risk": risk,
            "message": message,
            "heatmap": heatmap_b64
        })
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)