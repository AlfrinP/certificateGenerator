# Certificate Generator

A modern, user-friendly FastAPI web application for generating personalized certificates in batch from Excel data.

## Features

- 🎨 Beautiful, modern UI with smooth animations
- 📤 Easy file upload for certificate templates and Excel data
- 👁️ **Interactive live preview** - see text on certificate in real-time
- 🖱️ **Click and drag positioning** - visually place text on certificate
- 📊 Live preview of Excel data with all columns
- ⚙️ Configurable text positioning (X, Y coordinates)
- 📝 Adjustable font size with live preview
- 🎯 Batch generation for all entries
- 📦 Automatic ZIP download of all certificates
- 📱 Fully responsive design

## Installation

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

## Usage

1. Start the FastAPI server:
```bash
uvicorn main:app --reload
```

2. Open your browser and navigate to:
```
http://localhost:8000
```

3. Follow the workflow:
   - **Step 1**: Upload your certificate template image (PNG, JPG, JPEG)
   - **Step 2**: Upload your Excel file with names and data (.xlsx, .xls)
   - **Step 3**: Review the data displayed in the table
   - **Step 4**: Use interactive preview - click or drag to position text on certificate
   - **Step 5**: Adjust font size and see live preview updates
   - **Step 6**: Fine-tune position using input fields or visual drag
   - **Step 7**: Click "Generate All Certificates"
   - **Step 8**: Download the ZIP file containing all certificates

### Interactive Preview
- **Click anywhere** on the certificate to place text at that position
- **Click and drag** the text box to move it around
- **Adjust font size** to see real-time changes
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
-----------------|---------------------|-------------
John Doe         | john@example.com    | Engineering
Jane Smith       | jane@example.com    | Marketing
```

## Project Structure

```
.
├── main.py                  # FastAPI application
├── certificateGeneration.py # Certificate generation logic
├── templates/
│   └── home.html           # Main HTML template
├── static/
│   ├── home.css            # Styling
│   └── animations.js       # Interactive features
├── arial/                  # Font files
├── uploads/                # Temporary uploaded files
├── certificates/           # Generated certificates (temporary)
└── requirements.txt        # Python dependencies
```

## Configuration

### Font Settings
- Default font: `arial/ARIAL.TTF`
- Font size: Adjustable (10-200px)
- Text color: Black (can be modified in code)

### Coordinate System
- X coordinate: Pixels from left edge
- Y coordinate: Pixels from top edge
- Coordinates must be within image bounds

## Technical Details

- **Backend**: FastAPI (Python)
- **Template Engine**: Jinja2
- **Excel Parsing**: Pandas + OpenPyXL
- **Image Processing**: Pillow (PIL)
- **File Handling**: Python-multipart
- **Frontend**: Vanilla JavaScript with CSS animations

## Color Scheme

- Primary: Soft blue (#6366f1 - indigo)
- Secondary: Light purple (#a78bfa)
- Success: Mint green (#10b981)
- Background: Off-white (#f8fafc)
- Text: Slate gray (#334155)

## Development

Run in development mode with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Notes

- Uploaded files are temporarily stored in the `uploads/` directory
- Generated certificates are packaged into a ZIP file
- Temporary files are cleaned up after ZIP creation
- All file operations use unique identifiers to prevent conflicts

## License

MIT License - Feel free to use and modify as needed.
