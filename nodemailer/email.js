const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: '231408@astanait.edu.kz',
        pass: '@Zh197173'
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to mail server:', error);
    } else {
        console.log('Mail server is ready to send messages');
    }
});

const mailOptions = {
    from: '231408@astanait.edu.kz',
    to: 'zhalgasovaida@gmail.com',
    subject: 'Test Email using Nodemailer',
    text: 'Hello! This is a test email sent using Node.js and Nodemailer.'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error while sending email:', error);
    } else {
        console.log('Email sent successfully:', info.response);
    }
});

async function sendEmail() {
    try {
        const info = await transporter.sendMail({
            from: '231408@astanait.edu.kz',
            to: 'zhalgasovaida@gmail.com',
            subject: 'Async Test Email',
            text: 'This is an asynchronous email sent using Nodemailer!'
        });
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error while sending email:', error);
    }
}

sendEmail();

async function sendEmailWithAttachment() {
    try {
        const info = await transporter.sendMail({
            from: '231408@astanait.edu.kz',
            to: 'zhalgasovaida@gmail.com',
            subject: 'Hi',
            text: 'Hello, how are you?',
            attachments: [
                {
                    filename: 'sample.txt',
                    content: 'This is a sample attachment'
                }
            ]
        });
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        if (error.response) {
            console.error('Error response from server:', error.response);
        } else {
            console.error('General error:', error);
        }
    }
}

sendEmailWithAttachment();