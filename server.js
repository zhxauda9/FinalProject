import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

import bmiRouter from './bmi/bmi.js';
import blogRouter from './blog/blog.js';
import authRouter from './auth/auth.js';
import qrRouter from './qr/qr.mjs';
import mailRouter from './nodemailer/email.js';
import weatherRouter from './weather/weather.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/bmi/public', express.static(path.join(process.cwd(), 'bmi', 'public')));
app.use('/qr/public', express.static(path.join(process.cwd(), 'qr', 'public')));
app.use('/weather/public', express.static(path.join(process.cwd(), 'weather', 'public')));
app.use('/auth/public', express.static(path.join(process.cwd(), 'auth', 'public')));

app.set('view engine', 'ejs');
app.set('views', [
    path.join(process.cwd(), 'bmi', 'views'),
    path.join(process.cwd(), 'blog', 'views'),
    path.join(process.cwd(), 'auth', 'views'),
    path.join(process.cwd(), 'qr', 'views'),
    path.join(process.cwd(), 'nodemailer', 'views'),
]);

app.use('/blog', blogRouter);
app.use('/bmi', bmiRouter);
app.use('/auth', authRouter);
app.use('/mail', mailRouter);
app.use('/qr', qrRouter);
app.use('/weather',weatherRouter);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB error:', error));


app.use('/qr/public', express.static(path.join(process.cwd(), 'qr', 'public')));


app.get('/', (req, res) => {
    res.redirect('/auth');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});




