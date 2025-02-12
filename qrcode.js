// First, add this script tag to the HTML head section
// <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const urlInput = document.getElementById('url');
    const showTitleCheckbox = document.getElementById('showTitle');
    const titleInput = document.getElementById('title');
    const centerTypeSelect = document.getElementById('centerType');
    const centerTextInput = document.getElementById('centerTextInput');
    const centerText = document.getElementById('centerText');
    const centerImageInput = document.getElementById('centerImageInput');
    const imageUpload = document.getElementById('imageUpload');
    const imageUrl = document.getElementById('imageUrl');
    const qrColor = document.getElementById('qrColor');
    const backgroundColor = document.getElementById('backgroundColor');
    const dotStyle = document.getElementById('dotStyle');
    const downloadFormat = document.getElementById('downloadFormat');
    const showUrlInImage = document.getElementById('showUrlInImage');
    const qrCodeDiv = document.getElementById('qrCode');
    const previewTitle = document.getElementById('previewTitle');
    const previewUrl = document.getElementById('previewUrl');
    const downloadBtn = document.getElementById('downloadBtn');
    const saveBtn = document.getElementById('saveBtn');
    const saveAlert = document.getElementById('saveAlert');

    let qrCode = null;
    let centerImage = null;

    // Initialize QR Code
    function generateQRCode() {
        qrCodeDiv.innerHTML = '';
        
        if (!urlInput.value) return;

        const options = {
            text: urlInput.value,
            width: 256,
            height: 256,
            colorDark: qrColor.value,
            colorLight: backgroundColor.value,
            correctLevel: QRCode.CorrectLevel.H,
            dotScale: dotStyle.value === 'dots' ? 0.7 : 1,
            rounded: dotStyle.value === 'rounded'
        };

        qrCode = new QRCode(qrCodeDiv, options);

        // Update preview elements
        previewTitle.style.display = showTitleCheckbox.checked ? 'block' : 'none';
        previewTitle.textContent = titleInput.value;
        
        previewUrl.style.display = showUrlInImage.checked ? 'block' : 'none';
        previewUrl.textContent = urlInput.value;

        // Add center element if specified
        if (centerTypeSelect.value !== 'none') {
            setTimeout(addCenterElement, 100);
        }
    }

    // Add center element (text or image)
    function addCenterElement() {
        const qrImage = qrCodeDiv.querySelector('img');
        if (!qrImage) return;

        const centerElement = document.createElement('div');
        centerElement.style.position = 'absolute';
        centerElement.style.top = '50%';
        centerElement.style.left = '50%';
        centerElement.style.transform = 'translate(-50%, -50%)';
        centerElement.style.background = backgroundColor.value;
        centerElement.style.padding = '5px';

        if (centerTypeSelect.value === 'text' && centerText.value) {
            centerElement.textContent = centerText.value;
            centerElement.style.fontSize = '14px';
            centerElement.style.fontWeight = 'bold';
        } else if (centerTypeSelect.value === 'image' && centerImage) {
            const img = document.createElement('img');
            img.src = centerImage;
            img.style.width = '40px';
            img.style.height = '40px';
            img.style.objectFit = 'contain';
            centerElement.appendChild(img);
        }

        qrCodeDiv.appendChild(centerElement);
    }

    // Handle image upload and URL
    function handleImageInput(source) {
        if (source === 'upload') {
            const file = imageUpload.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    centerImage = e.target.result;
                    generateQRCode();
                };
                reader.readAsDataURL(file);
            }
        } else {
            centerImage = imageUrl.value;
            generateQRCode();
        }
    }

    // Download QR Code
    function downloadQRCode() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const qrImage = qrCodeDiv.querySelector('img');
        
        // Set canvas size with padding for title and URL
        const padding = 40;
        canvas.width = qrImage.width + padding * 2;
        canvas.height = qrImage.height + (showTitleCheckbox.checked ? 40 : 0) + 
                       (showUrlInImage.checked ? 40 : 0) + padding * 2;
        
        // Fill background
        ctx.fillStyle = backgroundColor.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw title if enabled
        let yOffset = padding;
        if (showTitleCheckbox.checked && titleInput.value) {
            ctx.fillStyle = qrColor.value;
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(titleInput.value, canvas.width / 2, 30);
            yOffset += 40;
        }

        // Draw QR code
        ctx.drawImage(qrImage, padding, yOffset);

        // Draw center element if present
        const centerElement = qrCodeDiv.querySelector('div');
        if (centerElement) {
            if (centerTypeSelect.value === 'image' && centerImage) {
                const centerImg = centerElement.querySelector('img');
                ctx.drawImage(centerImg, 
                    canvas.width / 2 - 20,
                    yOffset + qrImage.height / 2 - 20,
                    40, 40);
            } else if (centerTypeSelect.value === 'text') {
                ctx.fillStyle = qrColor.value;
                ctx.font = 'bold 14px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(centerText.value,
                    canvas.width / 2,
                    yOffset + qrImage.height / 2);
            }
        }

        // Draw URL if enabled
        if (showUrlInImage.checked) {
            ctx.fillStyle = qrColor.value;
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(urlInput.value, 
                canvas.width / 2,
                yOffset + qrImage.height + 30);
        }

        // Download the image
        const link = document.createElement('a');
        link.download = `qr-code.${downloadFormat.value}`;
        link.href = canvas.toDataURL(`image/${downloadFormat.value}`);
        link.click();
    }

    // Save settings to localStorage
    function saveSettings() {
        const settings = {
            showTitle: showTitleCheckbox.checked,
            title: titleInput.value,
            centerType: centerTypeSelect.value,
            centerText: centerText.value,
            qrColor: qrColor.value,
            backgroundColor: backgroundColor.value,
            dotStyle: dotStyle.value,
            downloadFormat: downloadFormat.value,
            showUrlInImage: showUrlInImage.checked
        };
        localStorage.setItem('qrCodeSettings', JSON.stringify(settings));
        
        saveAlert.classList.add('show');
        setTimeout(() => saveAlert.classList.remove('show'), 3000);
    }

    // Load settings from localStorage
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('qrCodeSettings'));
        if (settings) {
            showTitleCheckbox.checked = settings.showTitle;
            titleInput.value = settings.title;
            centerTypeSelect.value = settings.centerType;
            centerText.value = settings.centerText;
            qrColor.value = settings.qrColor;
            backgroundColor.value = settings.backgroundColor;
            dotStyle.value = settings.dotStyle;
            downloadFormat.value = settings.downloadFormat;
            showUrlInImage.checked = settings.showUrlInImage;
            
            titleInput.style.display = settings.showTitle ? 'block' : 'none';
            updateCenterTypeDisplay();
        }
    }

    // Update center type input display
    function updateCenterTypeDisplay() {
        centerTextInput.style.display = 
            centerTypeSelect.value === 'text' ? 'block' : 'none';
        centerImageInput.style.display = 
            centerTypeSelect.value === 'image' ? 'block' : 'none';
    }

    // Tab switching for image input
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            document.querySelectorAll('.tab').forEach(t => 
                t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => 
                c.classList.remove('active'));
            
            tab.classList.add('active');
            document.querySelector(`.tab-content[data-tab="${tabName}"]`)
                .classList.add('active');
        });
    });

    // Event listeners
    urlInput.addEventListener('input', generateQRCode);
    showTitleCheckbox.addEventListener('change', () => {
        titleInput.style.display = showTitleCheckbox.checked ? 'block' : 'none';
        generateQRCode();
    });
    titleInput.addEventListener('input', generateQRCode);
    centerTypeSelect.addEventListener('change', () => {
        updateCenterTypeDisplay();
        generateQRCode();
    });
    centerText.addEventListener('input', generateQRCode);
    imageUpload.addEventListener('change', () => handleImageInput('upload'));
    imageUrl.addEventListener('input', () => handleImageInput('url'));
    qrColor.addEventListener('input', generateQRCode);
    backgroundColor.addEventListener('input', generateQRCode);
    dotStyle.addEventListener('change', generateQRCode);
    showUrlInImage.addEventListener('change', generateQRCode);
    downloadBtn.addEventListener('click', downloadQRCode);
    saveBtn.addEventListener('click', saveSettings);

    // Load saved settings on page load
    loadSettings();
});
