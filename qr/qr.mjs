import express from "express";
import fs from "fs";
import path from "path";
import qr from "qr-image";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "qr")));
app.use(express.static(path.join(__dirname, "web")));

app.post("/generate-qr", (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, error: "URL cannot be empty" });
    }

    const qrCode = qr.image(url, { type: "png" });
    const fileName = `qr-${Date.now()}.png`;
    const filePath = path.join(__dirname, "qr", fileName);

    const writeStream = fs.createWriteStream(filePath);
    qrCode.pipe(writeStream);

    writeStream.on("finish", () => {
        res.json({ success: true, qrUrl: `/${fileName}` });
    });

    writeStream.on("error", (err) => {
        console.error("Error generating QR code:", err);
        res.status(500).json({ success: false, error: "Failed to generate QR code" });
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "web", "qr.html"));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
