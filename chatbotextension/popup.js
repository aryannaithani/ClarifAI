document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');
    const submitButton = messageForm.querySelector('button[type="submit"]');

    // Fetch existing messages when page loads
    fetchMessages();

    // Set up event listener for form submission
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const message = messageInput.value.trim();
        if (message) {
            // Display user message immediately
            displayUserMessage(message);

            // Clear input and disable form
            messageInput.value = '';
            setFormDisabled(true);

            // Show typing indicator
            showTypingIndicator();

            // Send message to server
            sendMessage(message);
        }
    });

    // Function to send messages to the server
    function sendMessage(message) {
        const formData = new FormData();
        formData.append('message', message);

        fetch('http://127.0.0.1:5000/send_message', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Remove typing indicator
            hideTypingIndicator();

            // Display bot response - handle both possible response formats
            if (data.response) {
                displayBotMessage(data.response.content || data.response);
            } else if (data.content) {
                displayBotMessage(data.content);
            } else {
                console.log('Unexpected response format:', data);
                displayErrorMessage('Received unexpected response format.');
            }

            // Re-enable form
            setFormDisabled(false);

            // Focus input for next message
            messageInput.focus();

            // Scroll to the bottom of the chat
            scrollToBottom();
        })
        .catch(error => {
            console.error('Error:', error);

            // Remove typing indicator and show error
            hideTypingIndicator();
            displayErrorMessage('Failed to send message. Please try again.');

            // Re-enable form
            setFormDisabled(false);
            messageInput.focus();
        });
    }

    // Function to fetch all messages
    function fetchMessages() {
        fetch('http://127.0.0.1:5000/get_messages')
        .then(response => response.json())
        .then(data => {
            // Clear existing messages
            chatMessages.innerHTML = '';

            // Check if there are no messages and show empty state
            if (!data.messages || data.messages.length === 0) {
                showEmptyState();
                return;
            }

            // Display each message
            data.messages.forEach(message => {
                if (message.is_user) {
                    displayUserMessage(message.content, message.timestamp);
                } else {
                    displayBotMessage(message.content, message.timestamp);
                }
            });

            // Scroll to the bottom of the chat
            scrollToBottom();
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage('Failed to load messages.');
        });
    }

    // Function to display a user message
    function displayUserMessage(content, timestamp = null) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user');

        const timeStr = timestamp || getCurrentTimeString();

        messageElement.innerHTML = `
            <div class="message-content">${escapeHtml(content)}</div>
            <div class="message-time">${timeStr}</div>
        `;

        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    // Function to display a bot message
    function displayBotMessage(content, timestamp = null) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot');

        const timeStr = timestamp || getCurrentTimeString();

        messageElement.innerHTML = `
            <div class="message-content">${escapeHtml(content)}</div>
            <div class="message-time">${timeStr}</div>
        `;

        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        // Remove existing typing indicator if any
        hideTypingIndicator();

        const typingElement = document.createElement('div');
        typingElement.classList.add('typing-indicator');
        typingElement.id = 'typing-indicator';

        typingElement.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        chatMessages.appendChild(typingElement);
        scrollToBottom();
    }

    // Function to hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Function to show empty state
    function showEmptyState() {
        const emptyStateElement = document.createElement('div');
        emptyStateElement.classList.add('empty-state');
        emptyStateElement.innerHTML = `
            <h3>Welcome to Flask Chat!</h3>
            <p>Start a conversation by typing a message below.</p>
        `;
        chatMessages.appendChild(emptyStateElement);
    }

    // Function to display error messages
    function displayErrorMessage(errorText) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('message', 'bot');
        errorElement.style.background = '#fee2e2';
        errorElement.style.borderColor = '#fecaca';
        errorElement.style.color = '#dc2626';

        errorElement.innerHTML = `
            <div class="message-content">⚠️ ${escapeHtml(errorText)}</div>
            <div class="message-time">${getCurrentTimeString()}</div>
        `;

        chatMessages.appendChild(errorElement);
        scrollToBottom();
    }

    // Function to enable/disable form
    function setFormDisabled(disabled) {
        messageInput.disabled = disabled;
        submitButton.disabled = disabled;

        if (disabled) {
            submitButton.textContent = 'Sending...';
        } else {
            submitButton.textContent = 'Send';
        }
    }

    // Function to scroll to the bottom of the chat
    function scrollToBottom() {
        // Use setTimeout to ensure DOM has updated
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 10);
    }

    // Function to get current time string
    function getCurrentTimeString() {
        const now = new Date();
        return now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Function to escape HTML to prevent XSS
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Auto-focus on input when extension opens
    messageInput.focus();

    // Handle Enter key in input (in case form doesn't catch it)
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            messageForm.dispatchEvent(new Event('submit'));
        }
    });
});
