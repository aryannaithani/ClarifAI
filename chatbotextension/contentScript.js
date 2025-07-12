// contentScript.js

let transcriptBuffer = '';
let lastCaption = '';

const captureInterval = 500; // How often to check captions (in ms)

function getCaptionText() {
    const captionElement = document.querySelector('div.ygicle.VbkSUe');
    if (captionElement) {
        const currentText = captionElement.innerText.trim();

        // Only add if it's new content
        if (currentText && currentText !== lastCaption) {
            lastCaption = currentText;
            transcriptBuffer += ' ' + currentText;
            console.log("Context Captured", currentText);
        }
    }
}

// Expose method for popup.js to get transcript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_TRANSCRIPT') {
        sendResponse({ transcript: transcriptBuffer.trim() });
    }
});

setInterval(getCaptionText, captureInterval);
