import fs from "fs";
import http from "http";
import inquirer from "inquirer";
import qr from "qr-image";


async function generateQRCode() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'url',
            message: 'Enter URL for creating QR-code:',
            validate: input => input ? true : 'URL can not be empty',
        },
    ]);

    const qrCode = qr.image(answers.url, { type: 'png' });
    const outputFilePath = './qr-code.png';

    qrCode.pipe(fs.createWriteStream(outputFilePath));

    console.log(`QR-code created as ${outputFilePath}`);
    startServer(outputFilePath);
}

function startServer(filePath) {
    http.createServer((req, res) => {
        if (req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body>
                    <h1>Your QR-code:</h1>
                    <img src="/qr-code.png" alt="QR Code">
                </body>
                </html>
            `);
        } else if (req.url === '/qr-code.png') {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('QR-code not found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'image/png' });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Web site not found');
        }
    }).listen(8081, () => {
        console.log('Server started on http://localhost:8081');
    });
}

generateQRCode();