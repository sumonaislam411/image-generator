const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";
const HF_TOKEN = "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"; // Your Hugging Face Token

const promptInput = document.getElementById("prompt-input");
const aspectRatioInput = document.getElementById("aspect-ratio");
const imageUpload = document.getElementById("image-upload");
const generateBtn = document.getElementById("generate-btn");
const regenerateBtn = document.getElementById("regenerate-btn");
const downloadBtn = document.getElementById("download-btn");
const imageContainer = document.getElementById("image-container");
const videoAdModal = document.getElementById("video-ad-modal");

let generatedImageUrl = null;

// Initialize Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Expand the Web App to full screen

// Generate Image
generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    const aspectRatio = aspectRatioInput.value.trim();
    const uploadedImage = imageUpload.files[0];

    if (!prompt) {
        alert("Please enter a prompt!");
        return;
    }

    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";

    try {
        const formData = new FormData();
        formData.append("inputs", prompt);
        if (aspectRatio) formData.append("aspect_ratio", aspectRatio);
        if (uploadedImage) formData.append("image", uploadedImage);

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to generate image");
        }

        const imageBlob = await response.blob();
        generatedImageUrl = URL.createObjectURL(imageBlob);

        imageContainer.innerHTML = `<img src="${generatedImageUrl}" alt="Generated Image">`;
        regenerateBtn.style.display = "inline-block";
        downloadBtn.style.display = "inline-block";
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while generating the image.");
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerText = "Generate Image";
    }
});

// Regenerate Image
regenerateBtn.addEventListener("click", () => {
    generateBtn.click();
});

// Download Image with Video Ad
downloadBtn.addEventListener("click", () => {
    videoAdModal.style.display = "block";

    // Show OnClickAds Video Ad
    const videoAd = document.createElement("div");
    videoAd.id = "onclicka-video-ad";
    document.querySelector(".modal-content").appendChild(videoAd);

    // Simulate video ad completion
    setTimeout(() => {
        videoAdModal.style.display = "none";
        const link = document.createElement("a");
        link.href = generatedImageUrl;
        link.download = "generated-image.png";
        link.click();
    }, 10000); // 10 seconds delay for video ad
});

// Close Video Ad Modal
document.querySelector(".close").addEventListener("click", () => {
    videoAdModal.style.display = "none";
});
