document.addEventListener('DOMContentLoaded', function () {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');
    const submitButton = messageForm.querySelector('button[type="submit"]');
    const micBtn = document.getElementById('mic-btn');
    const contextToggle = document.getElementById('context-toggle');

    let recognition = null;
    let useContext = false;

    // Initialize context toggle
    if (contextToggle) {
        contextToggle.addEventListener('change', () => {
            useContext = contextToggle.checked;
        });
    }

    // Fetch existing messages
    fetchMessages();

    // Form submit
    messageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message) {
            displayUserMessage(message);
            messageInput.value = '';
            setFormDisabled(true);
            showTypingIndicator();
            sendMessage(message);
        }
    });

    // Microphone Setup
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        if (micBtn) {
            micBtn.disabled = false;
            micBtn.addEventListener('click', function () {
                if (micBtn.classList.contains('listening')) {
                    recognition.stop();
                } else {
                    checkNetworkConnectivity()
                        .then(() => {
                            try {
                                micBtn.disabled = true;
                                setTimeout(() => {
                                    if (!micBtn.classList.contains('listening')) {
                                        micBtn.disabled = false;
                                    }
                                }, 100);
                                recognition.start();
                            } catch (err) {
                                console.error('Failed to start speech recognition:', err);
                                displayErrorMessage('Voice recognition could not start. Try again.');
                            }
                        })
                        .catch(() => {
                            displayErrorMessage('Internet connection required for voice input.');
                        });
                }
            });

            recognition.onstart = () => {
                micBtn.classList.add('listening');
                micBtn.innerHTML = '<i class="fas fa-microphone-lines"></i>';
            };

            recognition.onend = () => {
                micBtn.classList.remove('listening');
                micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                micBtn.disabled = false;
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event);
                let errorMessage = 'Voice recognition failed: ';
                switch (event.error) {
                    case 'no-speech':
                        errorMessage += 'No speech detected.';
                        break;
                    case 'audio-capture':
                        errorMessage += 'Microphone not accessible.';
                        break;
                    case 'not-allowed':
                        errorMessage += 'Microphone access denied.';
                        break;
                    case 'network':
                        errorMessage += 'Network error. Use HTTPS or a supported browser.';
                        break;
                    case 'service-not-allowed':
                        errorMessage += 'Speech service blocked. Use Chrome over HTTPS.';
                        break;
                    case 'aborted':
                        errorMessage += 'Speech recognition aborted.';
                        break;
                    default:
                        errorMessage += event.error;
                }
                displayErrorMessage(errorMessage);
                micBtn.classList.remove('listening');
                micBtn.textContent = '🎤';
                micBtn.disabled = false;
            };

            recognition.onresult = (event) => {
                const voiceText = event.results[0][0].transcript;
                messageInput.value = voiceText;
                setTimeout(() => {
                    messageForm.dispatchEvent(new Event('submit'));
                }, 300);
            };
        }
    } else {
        if (micBtn) {
            micBtn.disabled = true;
            micBtn.title = 'Voice input not supported in this browser.';
            micBtn.style.opacity = '0.5';
        }
    }

    function checkNetworkConnectivity() {
        return new Promise((resolve, reject) => {
            if (!navigator.onLine) {
                reject(new Error('Offline'));
            } else {
                fetch('https://www.google.com/favicon.ico', { method: 'HEAD', mode: 'no-cors' })
                    .then(() => resolve(true))
                    .catch(() => reject(new Error('Network failed')));
            }
        });
    }

    function sendMessage(message) {
        if (useContext) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_TRANSCRIPT' }, function (response) {
                    const transcript = response?.transcript || "";
                    console.log("Context Captured", transcript);
                    sendToServer(message, transcript);
                });
            });
        } else {
            sendToServer(message, "");
        }
    }

    function sendToServer(message, context) {
        const formData = new FormData();
        formData.append('message', message);
        formData.append('context', context);

        fetch('http://localhost:5000/send_message', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                hideTypingIndicator();
                displayBotMessage(data.response?.content || data.response || 'No response received.');
                setFormDisabled(false);
                messageInput.focus();
            })
            .catch(error => {
                console.error('Error:', error);
                hideTypingIndicator();
                displayErrorMessage('Failed to send message.');
                setFormDisabled(false);
            });
    }

    function fetchMessages() {
        fetch('http://localhost:5000/get_messages')
            .then(response => response.json())
            .then(data => {
                chatMessages.innerHTML = '';
                if (!data.messages || data.messages.length === 0) {
                    showEmptyState();
                    return;
                }

                data.messages.forEach(msg => {
                    if (msg.is_user) {
                        displayUserMessage(msg.content, msg.timestamp);
                    } else {
                        displayBotMessage(msg.content, msg.timestamp);
                    }
                });
                scrollToBottom();
            })
            .catch(err => {
                console.error(err);
                displayErrorMessage('Failed to load messages.');
            });
    }

    function displayUserMessage(content, timestamp = null) {
        const el = document.createElement('div');
        el.classList.add('message', 'user');
        el.innerHTML = `
            <div class="message-content">${escapeHtml(content)}</div>
            <div class="message-time">${timestamp || getCurrentTimeString()}</div>
        `;
        chatMessages.appendChild(el);
        scrollToBottom();
    }

    function displayBotMessage(content, timestamp = null) {
        const el = document.createElement('div');
        el.classList.add('message', 'bot');
        el.innerHTML = `
            <div class="message-content">${escapeHtml(content)}</div>
            <div class="message-time">${timestamp || getCurrentTimeString()}</div>
        `;
        chatMessages.appendChild(el);
        scrollToBottom();
    }

    function showTypingIndicator() {
        hideTypingIndicator();
        const el = document.createElement('div');
        el.id = 'typing-indicator';
        el.classList.add('typing-indicator');
        el.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        chatMessages.appendChild(el);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    function showEmptyState() {
        const el = document.createElement('div');
        el.classList.add('empty-state');
        el.innerHTML = `<h3>Welcome to the Chat</h3><p>Start a conversation below.</p>`;
        chatMessages.appendChild(el);
    }

    function displayErrorMessage(msg) {
        const el = document.createElement('div');
        el.classList.add('message', 'bot');
        el.style.background = '#fee2e2';
        el.style.borderColor = '#fecaca';
        el.style.color = '#dc2626';
        el.innerHTML = `
            <div class="message-content">⚠️ ${escapeHtml(msg)}</div>
            <div class="message-time">${getCurrentTimeString()}</div>
        `;
        chatMessages.appendChild(el);
        scrollToBottom();
    }

    function setFormDisabled(disabled) {
        messageInput.disabled = disabled;
        submitButton.disabled = disabled;
        submitButton.textContent = disabled ? 'Sending...' : 'Send';
    }

    function scrollToBottom() {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 10);
    }

    function getCurrentTimeString() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    messageInput.focus();

    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            messageForm.dispatchEvent(new Event('submit'));
        }
    });
});
