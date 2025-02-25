import pkg from 'pg';
import session from "express-session";
import express from 'express';
import bcrypt from 'bcryptjs';
import path from "path";
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pkg;
dotenv.config();
const router = express.Router();

const pool = new Pool({
    user: process.env.SQL_USER,
    host: process.env.SQL_HOST,
    database: process.env.SQL_DB,
    password: process.env.SQL_PASS,
    port: process.env.SQL_PORT,
});

router.use(session({
    secret: '4Imp3xlavgXmbWCIXl9dCEomHW4LyGSBCXfuOrF',
    resave: false,
    saveUninitialized: true,
}));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','auth_home.html'));
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (password.length < 8) {
        return res.send('Password must be at least 8 characters long');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.send('Username already exists');
        }
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.redirect('/auth/public/auth_login.html');
    } catch (err) {
        console.error(err);
        res.send('Error registering user');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                req.session.user = user;
                res.render('auth_profile', { username: user.username, email: user.username || 'example@mail.com' });
            } else {
                res.send('Invalid credentials');
            }
        } else {
            res.send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.send('Error logging in');
    }
});


router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        const userData = {
            username: req.session.user.username,
            email: req.session.user.username || 'example@mail.com',
        };
        res.render('/auth/public/auth_profile', userData);
    } else {
        res.redirect('/auth/public/auth_login.html');
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/auth_login.html');
        }
    });
});

export default router;