# 🧠 AI Classroom Assistant

An AI-powered real-time classroom assistant built using FLAN-T5-Large and optimized with Intel OpenVINO. This project is designed to function both as a web-based chatbot and as a Chrome extension, making it easy for students and teachers to interact during live sessions.

---

## 🚀 Technologies Used

- **Python** (Core backend language)
- **Flask** (Web framework for serving the chatbot)
- **Transformers (Hugging Face)** (For model handling)
- **Intel OpenVINO** (For model optimization and faster inference)
- **HTML/CSS/JavaScript** (Chat interface & Chrome extension)
- **Google Chrome Extension API**

---

## ⚙️ Installation Guide

### 📥 1. Clone the Repository

```bash
git clone https://github.com/aryannaithani/aiClassroomAssistant.git
cd aiClassroomAssistant
```

### 📦 2. Install Required Dependencies

Create a virtual environment (recommended):

```bash
python -m venv .venv
source .venv/bin/activate     # On Windows: .venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### 📁 3. Download the Optimized Model

The OpenVINO-optimized FLAN-T5 model is too large to be stored in the repository.

**➡️ [Download the model from Google Drive](https://drive.google.com/file/d/19cG_zJHKsJ4gHKBWSnPSSO-5ltBk_vEO/view?usp=drive_link)**

- After downloading, **extract the model folder** into your project directory.
- The final structure should look like this:

```
aiClassroomAssistant/
├── flan-t5-large-ov-fp32/
│   ├── openvino_model.xml
│   ├── openvino_model.bin
│   └── ...
├── main.py
├── modelLoading.py
├── templates/
├── static/
└── ...
```

---

## ▶️ Running the App

### 🧠 1. Start the Flask Server

```bash
python main.py
```

- Visit `http://localhost:5000` in your browser or click on the link that appears in the console.
- Type a question in the chat input box and get a response from the AI Assistant.

---

## 🌐 [Optional but Recommended] Use as Chrome Extension

### 📁 1. Load the Extension

1. Open Google Chrome.
2. Go to `chrome://extensions`.
3. Enable **Developer Mode** (top right).
4. Click **"Load Unpacked"**.
5. Select the `chatbotextension/` folder provided in the repository.

### 💬 2. Use the Extension

- The extension icon will appear on the toolbar.
- Click it to open the chatbot in a popup.
- Ask questions and get AI-generated responses in real-time — powered by your local Flask app.

---

## 🔮 Future Features

- 🎙️ **Voice Input**: Enable speech-to-text for hands-free interaction.
- 📺 **Google Meet Integration**: Seamless overlay in Google Meet for real-time doubt resolution.
- ✨ **Dynamic Context Awareness**: Improved understanding of ongoing classroom topics.
- 📚 **Learning Analytics**: Track engagement and types of doubts for educators.

---

## 📩 Feedback & Contributions

Feel free to fork the repository, suggest changes, or raise issues.  
For queries, reach out via GitHub or email at `aryan.naithani_cs.h24@gla.ac.in`
