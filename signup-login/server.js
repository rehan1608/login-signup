const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

// Load user data from users.json
let users = [];
try {
    const data = fs.readFileSync('users.json', 'utf-8');
    users = JSON.parse(data);
} catch (err) {
    console.error('Error reading users.json:', err);
}

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ success: true, message: `Welcome ${user.username}, You are being logged in ....` });
    } else if (users.some(u => u.email === email)) {
        res.status(401).json({ success: false, message: 'Email and password do not match.' });
    } else {
        res.status(401).json({ success: false, message: 'User not found. Please create an account.' });
    }
});

// Signup route
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const userExists = users.some(u => u.email === email);

    if (userExists) {
        res.status(400).json({ success: false, message: 'Email already exists. Please use a different email.' });
    } else if (password.length < 8) {
        res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    } else {
        users.push({ username, email, password });
        fs.writeFileSync('users.json', JSON.stringify(users, null, 4));
        res.json({ success: true, message: 'Account created successfully. Please login.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
