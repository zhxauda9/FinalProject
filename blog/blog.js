import express from 'express';
import path from 'path';
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: String, default: "Anonymous" },
}, { timestamps: true });

const Blog = mongoose.model('BlogPost', blogSchema);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'blog.html'));
});

router.post('/blogs', async (req, res) => {
    try {
        const { title, body, author } = req.body;
        if (!title || !body) {
            return res.status(400).json({ message: "The title and body are required" });
        }

        const blog = new Blog({ title, body, author });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "The blog was not found" });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.put('/blogs/:id', async (req, res) => {
    try {
        const { title, body, author } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { title, body, author }, { new: true });

        if (!updatedBlog) return res.status(404).json({ message: "Server error" });
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.delete('/blogs/:id', async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ message: "The blog was not found" });

        res.json({ message: "Blog deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;