from PIL import Image, ImageDraw, ImageFont
import os
from pathlib import Path

def generate_certificate(
    template_path: str,
    name: str,
    x: int,
    y: int,
    output_path: str,
    font_size: int = 60,
    font_path: str = "app/arial/ArialCE.ttf",
    text_color: str = "black"
):
    """
    Generate a certificate by overlaying a name on a template image.
    
    Args:
        template_path: Path to the certificate template image
        name: Name to be placed on the certificate
        x: X coordinate for text placement (pixels from left)
        y: Y coordinate for text placement (pixels from top)
        output_path: Path where the generated certificate will be saved
        font_size: Size of the text font (default: 60)
        font_path: Path to the font file (default: arial/ArialCE.ttf)
        text_color: Color of the text (default: black)
    
    Returns:
        str: Path to the generated certificate
    
    Raises:
        FileNotFoundError: If template or font file doesn't exist
        ValueError: If coordinates are invalid
    """
    try:
        # Validate inputs
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template image not found: {template_path}")
        
        if not os.path.exists(font_path):
            raise FileNotFoundError(f"Font file not found: {font_path}")
        
        if x < 0 or y < 0:
            raise ValueError(f"Coordinates must be non-negative: x={x}, y={y}")
        
        if font_size < 10 or font_size > 200:
            raise ValueError(f"Font size must be between 10 and 200: {font_size}")
        
        # Open template image
        img = Image.open(template_path)
        
        # Verify coordinates are within image bounds
        img_width, img_height = img.size
        if x > img_width:
            raise ValueError(f"X coordinate {x} exceeds image width {img_width}")
        if y > img_height:
            raise ValueError(f"Y coordinate {y} exceeds image height {img_height}")
        
        # Create drawing context
        draw = ImageDraw.Draw(img)
        
        # Load font
        try:
            font = ImageFont.truetype(font_path, font_size)
        except Exception as e:
            raise ValueError(f"Error loading font: {e}")
        
        # Draw text on image
        draw.text((x, y), name, fill=text_color, font=font)
        
        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        if output_dir:
            Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        # Save the certificate
        img.save(output_path)
        
        return output_path
    
    except Exception as e:
        raise Exception(f"Error generating certificate for '{name}': {str(e)}")