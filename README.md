# 📎 AI Classroom Assistant – Chrome Extension Powered by Phi-2 + OpenVINO

An AI-powered **Chrome extension** designed to assist students in real time using the **Phi-2 language model optimized with Intel OpenVINO**. It runs locally, uses a lightweight backend, and supports **voice input** for hands-free interaction — making it a perfect assistant during online or in-person classroom sessions.

---

## 🚀 Technologies Used

- **Python + Flask** – lightweight backend server
- **Intel OpenVINO** – optimized inference for Microsoft Phi-2 model
- **Transformers (Hugging Face)** – for tokenizer/model utilities
- **HTML/CSS/JavaScript** – Chrome Extension UI with voice input
- **Web Speech API** – for speech-to-text functionality

---

## ⚙️ Installation Guide

### 📥 1. Clone the Repository

```bash
git clone https://github.com/aryannaithani/aiClassroomAssistant.git
cd aiClassroomAssistant
```

### 📦 2. Set Up the Backend

1. **Create and activate a virtual environment:**

   ```bash
   python -m venv .venv
   source .venv/bin/activate     # On Windows: .venv\Scripts\activate
   ```

2. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Download and extract the optimized model:**

   ➡️ [Download Phi-2 (OpenVINO) model from Google Drive](https://drive.google.com/file/d/1cvPKY5FTYq06RCnXel17F4jcUjRmcmhX/view?usp=sharing)

   After extracting, the structure should be:

   ```
   aiClassroomAssistant/
   ├── phi-2-ov/
   │   ├── openvino_model.xml
   │   ├── openvino_model.bin
   ├── main.py
   ├── modelLoading.py
   └── ...
   ```

4. **Run the Flask server:**

   ```bash
   python main.py
   ```

   This will serve the model at `http://localhost:5000`.

---

## 🌐 Chrome Extension Setup (Main Interface)

### 📁 1. Load the Extension

1. Open **Chrome** or any Chromium browser.
2. Navigate to `chrome://extensions`.
3. Enable **Developer Mode**.
4. Click **Load Unpacked** and select the `chatbotextension/` folder.

### 💬 2. Using the Extension

- Click the extension icon in the browser toolbar.
- Ask your doubt by typing or using **🎤 voice input** (click the mic icon).
- The chatbot responds using the optimized Phi-2 model via your local server.

---

## 🔮 Future Enhancements

- 📺 **Google Meet Overlay**: Display AI responses directly during live classes.
- 🧠 **Dynamic Context Awareness**: Understand current topics in class.
- 📊 **Analytics Dashboard**: Track student queries and engagement patterns.

---

## 📩 Feedback & Contributions

Have suggestions or want to contribute? Fork this repo or raise an issue!  
📧 Email: `aryan.naithani_cs.h24@gla.ac.in`