import { Connection, Client } from '@temporalio/client';
import { trafficWorkflow } from './workflows';
import { nanoid } from 'nanoid';
import { destination, origin } from './util/constants';

async function run() {
  // Connect to the default Server location
  const connection = await Connection.connect({ address: 'localhost:7233' });

  const client = new Client({
    connection,
  });

  const handle = await client.workflow.start(trafficWorkflow, {
    taskQueue: 'levity-ai',
    // type inference works! args: [name: string]
    args: [origin, destination],
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: 'workflow-' + nanoid(),
  });
  console.log(`Started workflow ${handle.workflowId}`);

  // optional: wait for client result
  console.log(await handle.result()); // Hello, Temporal!
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
