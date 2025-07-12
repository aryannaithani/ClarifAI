from flask import Flask, render_template, request, jsonify, session
from datetime import datetime
import uuid
import os
from modelLoading import generate_answer
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.secret_key = os.urandom(24)

messages = []


@app.route('/')
def index():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    return render_template('index.html')


@app.route('/send_message', methods=['POST'])
def send_message():
    content = request.form.get('message')
    transcript = request.form.get('context')
    user_id = session.get('user_id', str(uuid.uuid4()))
    if len(transcript.split()) > 100:
        transcript = ' '.join(transcript.split[-100:])

    if not content:
        return jsonify({'error': 'Message cannot be empty'}), 400

    timestamp = datetime.now().strftime('%H:%M:%S')
    if not transcript:
        prompt = (
        "You are a helpful AI tutor for high school students."
        " Explain the following concept clearly and briefly (in under 5 sentences)."
        " Include one real-world example and one simple follow-up question.\n\n"
        f"Question: {content}\n\n"
        "Answer:"
    )
    else:
        prompt = (
            "You are a helpful AI tutor for high school students."
            " Explain the following concept clearly and briefly (in under 5 sentences)."
            " Include one real-world example and one simple follow-up question."
            " Use the given class transcript and reference to that in the answer if you see fit.\n\n"
            f"Question: {content}\n\n"
            f"Class Transcript: {transcript}\n\n"
            "Answer:"
        )

    print(prompt)

    message = {
        'user_id': user_id,
        'content': content,
        'timestamp': timestamp,
        'is_user': True
    }
    messages.append(message)


    response = {
        'user_id': 'system',
        'content': generate_answer(prompt).split("Answer:")[-1].strip(),
        'timestamp': timestamp,
        'is_user': False
    }
    messages.append(response)

    return jsonify({'message': message, 'response': response})


@app.route('/get_messages', methods=['GET'])
def get_messages():
    return jsonify({'messages': messages})


if __name__ == '__main__':
    app.run(debug=True)