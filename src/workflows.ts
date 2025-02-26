import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { getTrafficDelay, checkDelayThreshold, generateMessage, sendMessage } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function trafficWorkflow(origin: string, destination: string): Promise<string> {
  try {
    const delayInMinutes = await getTrafficDelay(origin, destination);
    if (!delayInMinutes) {
      return 'No traffic data available';
    }

    // check delay if it is greater than threshold
    const delayThresholdExceeded = await checkDelayThreshold(delayInMinutes);
    if (delayThresholdExceeded) {
      const message = await generateMessage(origin, destination, delayInMinutes);
      return await sendMessage(message);
    }

    // Delay is not greater than threshold
    return 'Delay is under the threshold';
  } catch (err) {
    console.error('Error in traffic workflow:', err);
    return 'Failed to process request. Please try again later.';
  }
}
