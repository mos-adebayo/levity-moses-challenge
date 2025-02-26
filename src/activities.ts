import { MAXIMUM_TRAFFIC_THRESHOLD } from './util/constants';
import { generateAIDelayMessage } from './util/openai-connect';
import { deliverNotification } from './util/send-message';
import { fetchTrafficDelay } from './util/fetch-traffic-delay';

// Step 1:  Fetch traffic data
export async function getTrafficDelay(origin: string, destination: string): Promise<number | undefined> {
  try {
    const delayTimeInMinutes = await fetchTrafficDelay(origin, destination);

    console.log(`Total traffic delay time: ${delayTimeInMinutes}`);

    return delayTimeInMinutes;
  } catch (error) {
    console.error('Error fetching traffic data:', error);
  }
}

// Step 2: Check the delay exceeds the maximum threshold
export async function checkDelayThreshold(threshold?: number): Promise<boolean> {
  if (!threshold) {
    return false;
  }

  return threshold > MAXIMUM_TRAFFIC_THRESHOLD;
}

// Step 3: Delay notification if it exceeds the maximum
export async function generateMessage(origin: string, destination: string, delayInMinutes: number): Promise<string> {
  try {
    const message = await generateAIDelayMessage(origin, destination, delayInMinutes);

    console.log(`AI message: ${message}`);
    return message;
  } catch (err) {
    console.error(`Error generating AI message:`, err);
    return 'Failed to generate AI message. Please try again later.';
  }
}

// Step 4: Send the AI-generated message
export async function sendMessage(message: string): Promise<string> {
  try {
    await deliverNotification(message);
    console.log(`Notification sent: ${message}`);
    return `Notification sent: ${message}`;
  } catch (err) {
    console.error(`Error in sending notification:`, err);
    return 'Failed to send notification. Please try again later.';
  }
}
