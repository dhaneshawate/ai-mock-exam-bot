// server.js – using Ollama locally to generate questions
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-question', async (req, res) => {
    const { syllabus, papers = '' } = req.body;
    const context = `${syllabus.trim()} ${papers.trim()}`;
    const prompt = `Generate possible clear, factual, and well-structured questions based on the following passage. Avoid repetition and be specific. Context:${context}`;
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3', // change if you're using a different model like phi3, mistral, etc.
                prompt: prompt,
                stream: false
            })
        });
        const data = await response.json();
        // clean and split into list of questions
        const questions = data.response
            .trim()
            .split('\n')
            .map((q) => q.replace(/^[-*\d:\s]+/, '').trim())
            .filter((q) =>
                q.length > 0 &&
                !q.toLowerCase().startsWith('here are') &&
                !q.startsWith('(') && // filter answers
                !q.toLowerCase().startsWith('answer:')
            );

        res.status(200).json({ questions });
    } catch (err) {
        console.error('Ollama error:', err);
        res.status(500).json({ error: 'Failed to generate questions via Ollama.' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
