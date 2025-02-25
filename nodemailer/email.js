import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path, {dirname} from "path";
import {fileURLToPath} from "url";

dotenv.config();
const router = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'email.html'));
});

router.post('/send-email', async (req, res) => {
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

export default router;