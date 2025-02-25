const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'web')));

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: '231408@astanait.edu.kz',
        pass: '@Zh197173'
    }
});

app.post('/send-email', async (req, res) => {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
        return res.status(400).json({ success: false, error: "Missing fields" });
    }

    try {
        const info = await transporter.sendMail({
            from: '231408@astanait.edu.kz',
            to,
            subject,
            text: message
        });
        console.log('Email sent:', info.response);
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'web', 'email.html'));
});

app.listen(3000, () => console.log('Server running on port 3000'));
