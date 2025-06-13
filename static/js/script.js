document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');

    // Fetch existing messages when page loads
    fetchMessages();

    // Set up event listener for form submission
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const message = messageInput.value.trim();
        if (message) {
            sendMessage(message);
            messageInput.value = '';
        }
    });

    // Function to send messages to the server
    function sendMessage(message) {
        const formData = new FormData();
        formData.append('message', message);

        fetch('/send_message', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Display both the user message and the response
            displayMessage(data.message);
            displayMessage(data.response);

            // Scroll to the bottom of the chat
            scrollToBottom();
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to fetch all messages
    function fetchMessages() {
        fetch('/get_messages')
        .then(response => response.json())
        .then(data => {
            // Clear existing messages
            chatMessages.innerHTML = '';

            // Display each message
            data.messages.forEach(message => {
                displayMessage(message);
            });

            // Scroll to the bottom of the chat
            scrollToBottom();
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to display a message in the chat
    function displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        if (message.is_user) {
            messageElement.classList.add('user-message');
        } else {
            messageElement.classList.add('system-message');
        }

        messageElement.innerHTML = `
            <div class="message-content">${message.content}</div>
            <div class="message-time">${message.timestamp}</div>
        `;

        chatMessages.appendChild(messageElement);
    }

    // Function to scroll to the bottom of the chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
