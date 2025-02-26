import { delayMessageFallback } from './constants';
import axios, { AxiosResponse } from 'axios';

type OpenAPIResponse = {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
  }[];
};

export async function generateAIDelayMessage(origin: string, destination: string, delay: number) {
  try {
    // I am applying Directional stimulus prompting to give more context to the model to generate a friendly message
    const prompt = `Company name: Levity.ai. Customer Name: Moses: Generate a brief friendly notification message for customer informing him of a ${delay}-minute traffic delay between ${origin}} and ${destination}`;

    const response: AxiosResponse<OpenAPIResponse> = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
        },
      },
    );

    return response.data.choices[0]?.message?.content || delayMessageFallback;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to generate AI message');
    }
  }
}
