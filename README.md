# 🧠 ClarifAI – Context-Aware Classroom Assistant Powered by Phi-2 + OpenVINO

**ClarifAI** is a real-time AI-powered **Chrome Extension** designed to assist students during online or in-person classroom sessions. Powered by **Microsoft's Phi-2 model**, optimized with **Intel OpenVINO**, it runs locally with a lightweight Flask backend. With support for **voice input** and **contextual awareness via Google Meet captions**, ClarifAI ensures seamless and intelligent doubt resolution when students need it most.

---

## 🚀 Technologies Used

- **Python + Flask** – Lightweight backend server
- **Intel OpenVINO** – Optimized inference engine for Phi-2
- **Transformers (Hugging Face)** – Tokenization and model handling
- **HTML/CSS/JavaScript** – Chrome Extension frontend
- **Web Speech API** – Speech-to-text voice input
- **Chrome Extensions API + Content Scripts** – For Google Meet caption integration

---

## ⚙️ Installation Guide

### 📥 1. Clone the Repository

```bash
git clone https://github.com/aryannaithani/ClarifAI.git
cd ClarifAI
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

3. **Download and extract the optimized Phi-2 model:**

   ➡️ [Download from Google Drive](https://drive.google.com/file/d/1cvPKY5FTYq06RCnXel17F4jcUjRmcmhX/view?usp=sharing)

   After extracting, ensure the structure is:

   ```
   ClarifAI/
   ├── phi-2-ov/
   │   ├── openvino_model.xml
   │   ├── openvino_model.bin
   ├── main.py
   ├── modelLoading.py
   └── ...
   ```

4. **Start the Flask server:**

   ```bash
   python main.py
   ```

   The app will be accessible at `http://localhost:5000`.

---

## 🌐 Chrome Extension Setup (Main Interface)

### 📁 1. Load the Extension

1. Open **Chrome** (or any Chromium-based browser).
2. Visit `chrome://extensions`.
3. Enable **Developer Mode**.
4. Click **Load Unpacked** and select the `chatbotextension/` folder.

### 💬 2. Using the Extension

- Click the **ClarifAI** icon in the Chrome toolbar.
- Type your question or click the **🎙 mic icon** to ask using your voice.
- The AI assistant will respond in real-time via your local server.

---

## 🧠 Context-Aware Responses

ClarifAI understands what’s going on in your **Google Meet** class by reading **live captions** and using them as context for your questions.

### 🔄 How It Works:

- A **content script** runs in Google Meet tabs and captures live captions.
- When the "Use Context" checkbox in the extension is enabled, this transcript is sent alongside your question.
- The backend uses this to formulate more accurate, relevant answers.

### ✅ How to Enable:

1. Join a **Google Meet** session where captions are ON.
2. Open the **ClarifAI** Chrome Extension.
3. **Check the “Use Context” toggle.**
4. Ask your question — ClarifAI will combine your question with the current class context.

> 📌 Make sure captions are visible (`div.ygicle.VbkSUe` is the class currently used).

---

## 🔮 Future Enhancements

- 📺 **Google Meet Overlay**: Show answers as floating bubbles over the Meet window.
- 📚 **Smart Topic Detection**: Automatically summarize the ongoing lecture.
- 🧾 **Class Notes Generator**: Turn doubts + context into usable study notes.
- 📈 **Analytics Dashboard**: Monitor usage stats, frequent topics, and more.
- 🗂 **Context Memory**: Carry context across multiple doubts within a session.

---

## 📩 Feedback & Contributions

Have ideas, bugs, or feedback?  
Feel free to fork the repo, raise issues, or contribute via PRs.

📧 Email: `aryan.naithani_cs.h24@gla.ac.in`

---

### 👨‍🏫 Built with ❤️ for better learning experiences.
