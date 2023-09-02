document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const message = document.getElementById('message');
    const toggleButton = document.getElementById('toggle-button');
    const toggleButtonText = document.getElementById('toggle-button-text');

    // Initially hide the signup form
    signupForm.style.display = 'none';

    // Function to toggle between login and signup forms
    const toggleForms = () => {
        if (loginForm.style.display === 'block') {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            toggleButtonText.textContent = 'Switch to Login';
            message.textContent = ''; // Clear any previous error message
        } else {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            toggleButtonText.textContent = 'Switch to Signup';
            message.textContent = ''; // Clear any previous error message
        }
    };

    // Add event listener to the toggle button
    toggleButton.addEventListener('click', toggleForms);

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('email', email);
            message.textContent = data.message;
            setTimeout(() => {
                window.location.href = '/welcome.html';
            }, 1000);
        } else {
            message.textContent = data.message;
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            message.textContent = 'Passwords do not match.';
        } else if (password.length < 8) {
            message.textContent = 'Password must be at least 8 characters long.';
        } else {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            message.textContent = data.message;
        }
    });
});
