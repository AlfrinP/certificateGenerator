// Interactive Certificate Preview
let canvas, ctx, certImage;
let isDragging = false;
let textX = 100, textY = 100;
let fontSize = 60;
let previewText = 'Sample Name';

function initializeCanvas() {
    canvas = document.getElementById('previewCanvas');
    certImage = document.getElementById('certImage');
    
    if (!canvas || !certImage) return;
    
    ctx = canvas.getContext('2d');
    
    // Get preview text from first name in data
    const firstNameInput = document.getElementById('first_name');
    if (firstNameInput && firstNameInput.value) {
        previewText = firstNameInput.value;
    }
    
    // Wait for image to load
    if (certImage.complete) {
        setupCanvas();
    } else {
        certImage.addEventListener('load', setupCanvas);
    }
}

function setupCanvas() {
    // Set canvas size to match image
    canvas.width = certImage.width;
    canvas.height = certImage.height;
    
    // Get initial values from inputs
    const xInput = document.getElementById('x_coord');
    const yInput = document.getElementById('y_coord');
    const fontInput = document.getElementById('font_size');
    
    if (xInput && xInput.value) textX = parseInt(xInput.value);
    if (yInput && yInput.value) textY = parseInt(yInput.value);
    if (fontInput && fontInput.value) fontSize = parseInt(fontInput.value);
    
    drawPreview();
    setupCanvasInteractions();
    setupInputListeners();
}

function drawPreview() {
    if (!ctx || !canvas) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw semi-transparent overlay for text area
    ctx.save();
    
    // Measure text
    ctx.font = `${fontSize}px Arial`;
    const textMetrics = ctx.measureText(previewText);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;
    
    // Draw background box for text
    const padding = 10;
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.fillRect(
        textX - padding, 
        textY - textHeight - padding, 
        textWidth + padding * 2, 
        textHeight + padding * 2
    );
    
    // Draw border
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        textX - padding, 
        textY - textHeight - padding, 
        textWidth + padding * 2, 
        textHeight + padding * 2
    );
    
    // Draw text
    ctx.fillStyle = 'black';
    ctx.font = `${fontSize}px Arial`;
    ctx.textBaseline = 'bottom';
    ctx.fillText(previewText, textX, textY);
    
    // Draw crosshair at text origin
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    const crosshairSize = 10;
    ctx.beginPath();
    ctx.moveTo(textX - crosshairSize, textY);
    ctx.lineTo(textX + crosshairSize, textY);
    ctx.moveTo(textX, textY - crosshairSize);
    ctx.lineTo(textX, textY + crosshairSize);
    ctx.stroke();
    
    ctx.restore();
}

function setupCanvasInteractions() {
    canvas.addEventListener('mousedown', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Check if mouse is near the text position
        const distance = Math.sqrt(Math.pow(mouseX - textX, 2) + Math.pow(mouseY - textY, 2));
        if (distance < 50) {
            isDragging = true;
            canvas.style.cursor = 'grabbing';
        }
    });
    
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        if (isDragging) {
            textX = Math.max(0, Math.min(canvas.width, mouseX));
            textY = Math.max(fontSize, Math.min(canvas.height, mouseY));
            
            // Update input fields
            document.getElementById('x_coord').value = Math.round(textX);
            document.getElementById('y_coord').value = Math.round(textY);
            
            drawPreview();
        } else {
            // Change cursor if hovering near text
            const distance = Math.sqrt(Math.pow(mouseX - textX, 2) + Math.pow(mouseY - textY, 2));
            canvas.style.cursor = distance < 50 ? 'grab' : 'move';
        }
    });
    
    canvas.addEventListener('mouseup', function() {
        isDragging = false;
        canvas.style.cursor = 'move';
    });
    
    canvas.addEventListener('mouseleave', function() {
        isDragging = false;
        canvas.style.cursor = 'move';
    });
    
    // Click anywhere to move text
    canvas.addEventListener('click', function(e) {
        if (!isDragging) {
            const rect = canvas.getBoundingClientRect();
            textX = e.clientX - rect.left;
            textY = e.clientY - rect.top;
            
            // Update input fields
            document.getElementById('x_coord').value = Math.round(textX);
            document.getElementById('y_coord').value = Math.round(textY);
            
            drawPreview();
        }
    });
}

function setupInputListeners() {
    const xInput = document.getElementById('x_coord');
    const yInput = document.getElementById('y_coord');
    const fontInput = document.getElementById('font_size');
    
    if (xInput) {
        xInput.addEventListener('input', function() {
            textX = parseInt(this.value) || 0;
            drawPreview();
        });
    }
    
    if (yInput) {
        yInput.addEventListener('input', function() {
            textY = parseInt(this.value) || 0;
            drawPreview();
        });
    }
    
    if (fontInput) {
        fontInput.addEventListener('input', function() {
            fontSize = parseInt(this.value) || 60;
            drawPreview();
        });
    }
    
    // Reset button
    const resetBtn = document.getElementById('resetPosition');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            textX = 100;
            textY = 100;
            fontSize = 60;
            
            document.getElementById('x_coord').value = textX;
            document.getElementById('y_coord').value = textY;
            document.getElementById('font_size').value = fontSize;
            
            drawPreview();
            showToast('Position reset to defaults', 'info');
        });
    }
}

// File input preview handlers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize canvas preview if on the data page
    initializeCanvas();
    // Certificate file input
    const certInput = document.getElementById('certificate');
    const certFileName = document.getElementById('certFileName');
    
    if (certInput && certFileName) {
        certInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                certFileName.textContent = this.files[0].name;
                certFileName.style.color = '#10b981';
                certFileName.style.fontWeight = '600';
            }
        });
    }

    // Excel file input
    const excelInput = document.getElementById('excel');
    const excelFileName = document.getElementById('excelFileName');
    
    if (excelInput && excelFileName) {
        excelInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                excelFileName.textContent = this.files[0].name;
                excelFileName.style.color = '#10b981';
                excelFileName.style.fontWeight = '600';
            }
        });
    }

    // Form validation and loading overlay for upload form
    const uploadForm = document.getElementById('uploadForm');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            const certFile = certInput ? certInput.files[0] : null;
            const excelFile = excelInput ? excelInput.files[0] : null;

            // Validate certificate file
            if (!certFile) {
                e.preventDefault();
                showToast('Please select a certificate image', 'error');
                return false;
            }

            // Validate certificate file type
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validImageTypes.includes(certFile.type)) {
                e.preventDefault();
                showToast('Certificate must be a PNG or JPG image', 'error');
                return false;
            }

            // Validate Excel file
            if (!excelFile) {
                e.preventDefault();
                showToast('Please select an Excel file', 'error');
                return false;
            }

            // Validate Excel file type
            const validExcelTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];
            const excelExtension = excelFile.name.split('.').pop().toLowerCase();
            if (!validExcelTypes.includes(excelFile.type) && !['xls', 'xlsx'].includes(excelExtension)) {
                e.preventDefault();
                showToast('Please select a valid Excel file (.xlsx or .xls)', 'error');
                return false;
            }

            // Show loading overlay with upload messages
            if (loadingOverlay) {
                loadingOverlay.classList.add('active');
                
                const loadingText = document.getElementById('loadingText');
                const loadingSubtext = document.getElementById('loadingSubtext');
                
                if (loadingText) {
                    loadingText.textContent = 'Uploading Files...';
                }
                if (loadingSubtext) {
                    loadingSubtext.textContent = 'Reading Excel data...';
                }
            }
        });
    }

    // Form validation for generate form
    const generateForm = document.getElementById('generateForm');
    
    if (generateForm) {
        generateForm.addEventListener('submit', function(e) {
            const xCoord = document.getElementById('x_coord');
            const yCoord = document.getElementById('y_coord');
            const fontSize = document.getElementById('font_size');

            // Validate coordinates
            if (xCoord && (xCoord.value === '' || parseInt(xCoord.value) < 0)) {
                e.preventDefault();
                showToast('Please enter a valid X coordinate', 'error');
                xCoord.focus();
                return false;
            }

            if (yCoord && (yCoord.value === '' || parseInt(yCoord.value) < 0)) {
                e.preventDefault();
                showToast('Please enter a valid Y coordinate', 'error');
                yCoord.focus();
                return false;
            }

            if (fontSize && (fontSize.value === '' || parseInt(fontSize.value) < 10 || parseInt(fontSize.value) > 200)) {
                e.preventDefault();
                showToast('Font size must be between 10 and 200', 'error');
                fontSize.focus();
                return false;
            }

            // Show loading overlay with smart hide logic and progress messages
            if (loadingOverlay) {
                loadingOverlay.classList.add('active');
                
                const loadingText = document.getElementById('loadingText');
                const loadingSubtext = document.getElementById('loadingSubtext');
                const dataRows = document.querySelectorAll('.data-table tbody tr');
                const totalCerts = dataRows.length;
                
                // Update loading messages
                if (loadingText) {
                    loadingText.textContent = 'Generating Certificates...';
                }
                if (loadingSubtext) {
                    loadingSubtext.textContent = `Processing ${totalCerts} certificate${totalCerts > 1 ? 's' : ''}`;
                }
                
                // Progress messages
                setTimeout(function() {
                    if (loadingSubtext) loadingSubtext.textContent = 'Rendering templates...';
                }, 2000);
                
                setTimeout(function() {
                    if (loadingSubtext) loadingSubtext.textContent = 'Creating ZIP file...';
                }, 4000);
                
                setTimeout(function() {
                    if (loadingSubtext) loadingSubtext.textContent = 'Preparing download...';
                }, 6000);
                
                // Use multiple detection methods for download completion
                let isDownloadDetected = false;
                
                // Method 1: Monitor window focus (user returns after download dialog)
                const focusHandler = function() {
                    if (!isDownloadDetected) {
                        isDownloadDetected = true;
                        setTimeout(function() {
                            if (loadingOverlay) {
                                loadingOverlay.classList.remove('active');
                                showToast(`✓ ${totalCerts} certificate${totalCerts > 1 ? 's' : ''} generated successfully!`, 'success');
                            }
                        }, 1000);
                        window.removeEventListener('focus', focusHandler);
                    }
                };
                
                setTimeout(function() {
                    window.addEventListener('focus', focusHandler);
                }, 1000);
                
                // Method 2: Fallback timer - hide after reasonable time
                const fallbackTime = Math.max(10000, totalCerts * 500); // Scale with number of certs
                setTimeout(function() {
                    if (!isDownloadDetected) {
                        isDownloadDetected = true;
                        if (loadingOverlay) {
                            loadingOverlay.classList.remove('active');
                            showToast('✓ Processing complete! Check your downloads folder.', 'success');
                        }
                    }
                    window.removeEventListener('focus', focusHandler);
                }, fallbackTime);
            }
        });

        // Number input validation helpers
        const numberInputs = document.querySelectorAll('input[type="number"]');
        numberInputs.forEach(input => {
            input.addEventListener('keypress', function(e) {
                // Allow only numbers and control keys
                if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                }
            });
        });
    }

    // Smooth scroll to data section when it appears
    const dataSection = document.querySelector('.content-section');
    if (dataSection) {
        setTimeout(() => {
            dataSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }

    // Enhanced table row hover effects
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Auto-dismiss messages after 5 seconds
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        setTimeout(() => {
            message.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            message.style.opacity = '0';
            message.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                message.remove();
            }, 500);
        }, 5000);
    });
});

// Toast notification function
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.95rem',
        zIndex: '10000',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: '400px'
    });

    // Set color based on type
    if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    } else if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
    }

    // Add to document
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
