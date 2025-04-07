import { Request, Response, Router } from 'express';
import axios from 'axios';

const router = Router();

/**
 * POST /api/agents/command
 * Accepts a user command, forwards to Python AI API, returns response.
 */
router.post('/command', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const aiResponse = await axios.post<{ response: string }>('http://127.0.0.1:5000/generate', { prompt });
    return res.json({ response: aiResponse.data.response });
  } catch (error) {
    console.error('Error forwarding to AI API:', error);
    return res.status(500).json({ error: 'AI API error' });
  }
});

export default router;