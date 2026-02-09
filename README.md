# Certificate Generator

A modern, user-friendly FastAPI web application for generating personalized certificates in batch from Excel data.

## Features

- Beautiful, modern UI with smooth animations
- Easy file upload for certificate templates and Excel data
- Interactive live preview - see text on certificate in real-time
- Click and drag positioning - visually place text on certificate
- Live preview of Excel data with all columns
- Configurable text positioning (X, Y coordinates)
- Adjustable font size with live preview
- Batch generation for all entries
- Automatic ZIP download of all certificates
- Fully responsive design

## Project Structure

```
.
├── Dockerfile
├── README.md
├── requirements.txt
└── app/
    ├── main.py                  # FastAPI application
    ├── certificateGeneration.py # Certificate generation logic
    ├── arial/                   # Font files
    ├── static/
    │   ├── home.css             # Styling
    │   └── animations.js        # Interactive features
    └── templates/
        └── home.html            # Main HTML template
```

## Installation

### Local Development

1. Create a virtual environment and activate it:

```bash
python3 -m venv .venv
source .venv/bin/activate  # On Linux/Mac
# or
.venv\Scripts\activate  # On Windows
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

4. Open your browser and navigate to `http://localhost:8000`

### Docker

1. Build the Docker image:

```bash
docker build -t certificate-generator .
```

2. Run the container:

```bash
docker run -p 80:80 certificate-generator
```

3. Open your browser and navigate to `http://localhost`

## Usage

1. **Upload** your certificate template image (PNG, JPG, JPEG)
2. **Upload** your Excel file with names and data (.xlsx, .xls)
3. **Review** the data displayed in the table
4. **Position** text using the interactive preview - click or drag on the certificate
5. **Adjust** font size and see live preview updates
6. **Fine-tune** position using input fields or visual drag
7. **Generate** all certificates
8. **Download** the ZIP file containing all certificates

### Interactive Preview

- Click anywhere on the certificate to place text at that position
- Click and drag the text box to move it around
- Adjust font size to see real-time changes
- Blue box shows text area, red crosshair shows exact coordinates
- Input fields update automatically as you drag

## Excel File Format

Your Excel file should have:
- **First row**: Column headers (e.g., Name, Email, Department)
- **Subsequent rows**: Data for each certificate
- **First column**: Will be used as the name on certificates

Example:

```
Name             | Email                | Department
-----------------|----------------------|-------------
John Doe         | john@example.com     | Engineering
Jane Smith       | jane@example.com     | Marketing
```

## Configuration

### Font Settings

- Default font: `arial/ArialCE.ttf`
- Font size: Adjustable (10-200px)
- Text color: Black (can be modified in code)

### Coordinate System

- X coordinate: Pixels from left edge
- Y coordinate: Pixels from top edge
- Coordinates must be within image bounds

## Technical Details

- **Backend**: FastAPI (Python 3.9)
- **Template Engine**: Jinja2
- **Excel Parsing**: Pandas + OpenPyXL
- **Image Processing**: Pillow (PIL)
- **File Handling**: Python-multipart
- **Frontend**: Vanilla JavaScript with CSS animations
- **Containerization**: Docker

## Notes

- Uploaded files are temporarily stored in the `uploads/` directory (created at runtime)
- Generated certificates are packaged into a ZIP file
- Temporary files are cleaned up after ZIP creation
- All file operations use unique identifiers to prevent conflicts

## License

MIT License - Feel free to use and modify as needed.
