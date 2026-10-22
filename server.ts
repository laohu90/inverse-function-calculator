import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API route for AI Math Tutor
app.post('/api/ai-tutor', async (req: Request, res: Response) => {
  try {
    const { problem, userQuestion, stepsContext } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in the environment.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an expert, encouraging High School & AP Precalculus math tutor in the United States.
You specialize in inverse functions and completing the square.
The student is viewing a problem with the following context:
Current Function/Problem: ${problem || 'N/A'}
Current Solution Steps: ${stepsContext || 'N/A'}

Student's Question: "${userQuestion}"

Guidelines:
1. Answer directly with clear, friendly pedagogy.
2. Use LaTeX formatting for all mathematical expressions (e.g. $f(x) = x^2 + 4x + 1$, $x \\ge -2$, $f^{-1}(x) = -2 + \\sqrt{x + 3}$).
3. When explaining completing the square, explicitly highlight the $(b/2a)^2$ step and why we restrict the domain (Horizontal Line Test / one-to-one function).
4. Emphasize that swapping x and y reflects across the line y = x.
5. Keep explanations concise, scannable, and encouraging.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
      ],
    });

    const reply = response.text || 'Unable to generate tutor response at this time.';
    res.json({ reply });
  } catch (error: any) {
    console.error('AI Tutor error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while contacting AI Tutor.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
