document.addEventListener("DOMContentLoaded", function () {
    const urlInput = document.getElementById("url");
    const titleInput = document.getElementById("title");
    const centerType = document.getElementById("center-type");
    const centerTextGroup = document.getElementById("center-text-group");
    const centerTextInput = document.getElementById("center-text");
    const centerImageGroup = document.getElementById("center-image-group");
    const centerImageInput = document.getElementById("center-image");
    const centerImageUrlInput = document.getElementById("center-image-url");
    const qrColorInput = document.getElementById("qr-color");
    const bgColorInput = document.getElementById("bg-color");
    const dotStyleInput = document.getElementById("dot-style");
    const downloadFormatInput = document.getElementById("download-format");
    const includeUrlCheckbox = document.getElementById("include-url");
    const generateButton = document.getElementById("generate");
    const saveSettingsButton = document.getElementById("save-settings");
    const qrcodeContainer = document.getElementById("qrcode");
    const urlDisplay = document.getElementById("url-display");

    let centerImageData = null;

    // Load saved settings
    function loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem("qrSettings")) || {};
        urlInput.value = savedSettings.url || "";
        titleInput.value = savedSettings.title || "";
        centerType.value = savedSettings.centerType || "none";
        centerTextInput.value = savedSettings.centerText || "";
        qrColorInput.value = savedSettings.qrColor || "#000000";
        bgColorInput.value = savedSettings.bgColor || "#FFFFFF";
        dotStyleInput.value = savedSettings.dotStyle || "square";
        downloadFormatInput.value = savedSettings.downloadFormat || "png";
        includeUrlCheckbox.checked = savedSettings.includeUrl || false;

        if (savedSettings.centerImageData) {
            centerImageData = savedSettings.centerImageData;
        }

        toggleCenterElement();
    }

    // Save settings
    function saveSettings() {
        const settings = {
            url: urlInput.value,
            title: titleInput.value,
            centerType: centerType.value,
            centerText: centerTextInput.value,
            qrColor: qrColorInput.value,
            bgColor: bgColorInput.value,
            dotStyle: dotStyleInput.value,
            downloadFormat: downloadFormatInput.value,
            includeUrl: includeUrlCheckbox.checked,
            centerImageData: centerImageData,
        };
        localStorage.setItem("qrSettings", JSON.stringify(settings));
        alert("Settings saved!");
    }

    // Toggle center element
    function toggleCenterElement() {
        if (centerType.value === "text") {
            centerTextGroup.style.display = "block";
            centerImageGroup.style.display = "none";
        } else if (centerType.value === "image") {
            centerTextGroup.style.display = "none";
            centerImageGroup.style.display = "block";
        } else {
            centerTextGroup.style.display = "none";
            centerImageGroup.style.display = "none";
        }
    }

    // Handle image upload
    centerImageInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                centerImageData = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Generate QR Code
    generateButton.addEventListener("click", function () {
        const url = urlInput.value;
        if (!url) {
            alert("Please enter a URL");
            return;
        }

        const options = {
            color: {
                dark: qrColorInput.value,
                light: bgColorInput.value,
            },
        };

        qrcodeContainer.innerHTML = "";
        QRCode.toCanvas(qrcodeContainer, url, options, function (error) {
            if (error) {
                console.error(error);
                alert("Failed to generate QR Code");
                return;
            }

            if (includeUrlCheckbox.checked) {
                urlDisplay.textContent = url;
                urlDisplay.style.display = "block";
            } else {
                urlDisplay.style.display = "none";
            }
        });
    });

    // Save settings button
    saveSettingsButton.addEventListener("click", saveSettings);

    // Toggle center element on change
    centerType.addEventListener("change", toggleCenterElement);

    // Load settings on page load
    loadSettings();
});
