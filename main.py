from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uuid
import os
from pydantic import BaseModel
from typing import Optional
from modelLoading import generate_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

messages = []

@app.post("/send_message")
async def send_message(message: str = Form(...), context: str = Form(default="")):
    user_id = str(uuid.uuid4())
    
    transcript = context
    if transcript and len(transcript.split()) > 100:
        transcript = ' '.join(transcript.split()[-100:])

    if not message:
        return {"error": "Message cannot be empty"}

    timestamp = datetime.now().strftime('%H:%M:%S')
    if not transcript:
        prompt = (
        "You are a helpful AI tutor for high school students."
        " Explain the following concept clearly and briefly (in under 5 sentences)."
        " Include one real-world example and one simple follow-up question.\n\n"
        f"Question: {message}\n\n"
        "Answer:"
        )
    else:
        prompt = (
            "You are a helpful AI tutor for high school students."
            " Explain the following concept clearly and briefly (in under 5 sentences)."
            " Include one real-world example and one simple follow-up question."
            " Use the given class transcript and reference to that in the answer if you see fit.\n\n"
            f"Question: {message}\n\n"
            f"Class Transcript: {transcript}\n\n"
            "Answer:"
        )

    user_message = {
        'user_id': user_id,
        'content': message,
        'timestamp': timestamp,
        'is_user': True
    }
    messages.append(user_message)

    bot_content = generate_answer(prompt).split("Answer:")[-1].strip()
    
    response_message = {
        'user_id': 'system',
        'content': bot_content,
        'timestamp': timestamp,
        'is_user': False
    }
    messages.append(response_message)

    return {'message': user_message, 'response': response_message}

@app.get("/get_messages")
async def get_messages():
    return {'messages': messages}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)