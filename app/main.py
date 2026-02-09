from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse, HTMLResponse
import pandas as pd
import os
import uuid
import shutil
from pathlib import Path
import zipfile
from app.certificateGeneration import generate_certificate

app = FastAPI()

# Create necessary directories
UPLOAD_DIR = Path("uploads")
CERT_OUTPUT_DIR = Path("certificates")
UPLOAD_DIR.mkdir(exist_ok=True)
CERT_OUTPUT_DIR.mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

templates = Jinja2Templates(directory="app/templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Render the initial upload form"""
    return templates.TemplateResponse("home.html", {"request": request})

@app.post("/", response_class=HTMLResponse)
async def upload_files(
    request: Request,
    certificate: UploadFile = File(...),
    excel: UploadFile = File(...)
):
    """Handle file uploads and parse Excel data"""
    try:
        # Validate certificate file type
        if not certificate.content_type.startswith('image/'):
            return templates.TemplateResponse(
                "home.html",
                {"request": request, "error": "Certificate must be an image file (PNG, JPG, JPEG)"}
            )
        
        # Generate unique filenames
        cert_ext = os.path.splitext(certificate.filename)[1]
        excel_ext = os.path.splitext(excel.filename)[1]
        cert_filename = f"{uuid.uuid4()}{cert_ext}"
        excel_filename = f"{uuid.uuid4()}{excel_ext}"
        
        # Save certificate image
        cert_path = UPLOAD_DIR / cert_filename
        with open(cert_path, "wb") as buffer:
            shutil.copyfileobj(certificate.file, buffer)
        
        # Save Excel file
        excel_path = UPLOAD_DIR / excel_filename
        with open(excel_path, "wb") as buffer:
            shutil.copyfileobj(excel.file, buffer)
        
        # Parse Excel file
        try:
            df = pd.read_excel(excel_path)
            
            # Get headers from first row
            headers = df.columns.tolist()
            
            # Get all data rows
            data_rows = df.values.tolist()
            
            if len(data_rows) == 0:
                return templates.TemplateResponse(
                    "home.html",
                    {"request": request, "error": "Excel file is empty or has no data rows"}
                )
            
            return templates.TemplateResponse(
                "home.html",
                {
                    "request": request,
                    "data": data_rows,
                    "headers": headers,
                    "cert_filename": cert_filename,
                    "excel_filename": excel_filename,
                    "success": f"Files uploaded successfully! Found {len(data_rows)} entries."
                }
            )
        
        except Exception as e:
            return templates.TemplateResponse(
                "home.html",
                {"request": request, "error": f"Error reading Excel file: {str(e)}"}
            )
    
    except Exception as e:
        return templates.TemplateResponse(
            "home.html",
            {"request": request, "error": f"Error uploading files: {str(e)}"}
        )

@app.post("/generate")
async def generate_certificates(
    request: Request,
    cert_filename: str = Form(...),
    excel_filename: str = Form(...),
    x_coord: int = Form(...),
    y_coord: int = Form(...),
    font_size: int = Form(60)
):
    """Generate certificates for all names in Excel and return as ZIP"""
    try:
        # Load Excel data
        excel_path = UPLOAD_DIR / excel_filename
        df = pd.read_excel(excel_path)
        
        # Get certificate template path
        cert_path = UPLOAD_DIR / cert_filename
        
        # Create a unique folder for this batch
        batch_id = str(uuid.uuid4())
        batch_dir = CERT_OUTPUT_DIR / batch_id
        batch_dir.mkdir(exist_ok=True)
        
        # Generate certificate for each row
        generated_files = []
        first_column_name = df.columns[0]  # Use first column for names
        
        for idx, row in df.iterrows():
            name = str(row[first_column_name])
            output_filename = f"certificate_{idx + 1}_{name.replace(' ', '_')}.png"
            output_path = batch_dir / output_filename
            
            # Generate certificate
            generate_certificate(
                template_path=str(cert_path),
                name=name,
                x=x_coord,
                y=y_coord,
                output_path=str(output_path),
                font_size=font_size
            )
            
            generated_files.append(output_path)
        
        # Create ZIP file
        zip_filename = f"certificates_{batch_id}.zip"
        zip_path = CERT_OUTPUT_DIR / zip_filename
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in generated_files:
                zipf.write(file_path, file_path.name)
        
        # Clean up individual certificate files
        shutil.rmtree(batch_dir)
        
        # Return ZIP file
        return FileResponse(
            path=zip_path,
            media_type='application/zip',
            filename=f"certificates.zip",
            headers={"Content-Disposition": f"attachment; filename=certificates.zip"}
        )
    
    except Exception as e:
        return templates.TemplateResponse(
            "home.html",
            {"request": request, "error": f"Error generating certificates: {str(e)}"}
        )