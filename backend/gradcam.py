import cv2
import numpy as np
import base64
import torch

try:
    from pytorch_grad_cam import GradCAM
    from pytorch_grad_cam.utils.image import show_cam_on_image
except ImportError:
    pass

def generate_gradcam_base64(model, input_tensor, original_img_np):
    """
    Generates a GradCAM heatmap overlaid on the original image.
    Returns a Base64 encoded data URI.
    """
    try:
        # EfficientNet-B0 has `features` block. The last element is a Conv2dNormActivation or similar
        target_layers = [model.features[-1]]
        
        cam = GradCAM(model=model, target_layers=target_layers)
        
        # You can optionally pass targets. Targets=None uses highest scoring category
        grayscale_cam = cam(input_tensor=input_tensor, targets=None)
        
        # Process first (and only) image in batch
        grayscale_cam = grayscale_cam[0, :]
        
        # Normalize original image to [0,1] for overlay
        original_img_norm = np.float32(original_img_np) / 255.0
        
        # Generate the visualization
        cam_image = show_cam_on_image(original_img_norm, grayscale_cam, use_rgb=True)
        
        # Encode to PNG Base64
        # Need to convert RGB to BGR for cv2.imencode
        cam_image_bgr = cv2.cvtColor(cam_image, cv2.COLOR_RGB2BGR)
        _, buffer = cv2.imencode('.png', cam_image_bgr)
        b64_string = base64.b64encode(buffer).decode('utf-8')
        
        return f"data:image/png;base64,{b64_string}"
        
    except Exception as e:
        print(f"Failed to generate GradCAM: {e}")
        # Fallback to just sending the resized original image if GradCAM fails
        try:
            original_bgr = cv2.cvtColor(original_img_np, cv2.COLOR_RGB2BGR)
            _, buffer = cv2.imencode('.png', original_bgr)
            b64_string = base64.b64encode(buffer).decode('utf-8')
            return f"data:image/png;base64,{b64_string}"
        except:
            return ""