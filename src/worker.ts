import { NativeConnection, Worker } from '@temporalio/worker';
import dotenv from 'dotenv';
import * as activities from './activities';

// Load environment variables from.env file.
dotenv.config();

async function run() {
  //  Establish a connection with Temporal server.
  const connection = await NativeConnection.connect({
    address: 'localhost:7233',
    // TLS and gRPC metadata configuration goes here.
  });
  try {
    // Register Workflows and Activities with the Worker.
    const worker = await Worker.create({
      connection,
      namespace: 'default',
      taskQueue: 'levity-ai',
      // Workflows are registered using a path as they run in a separate JS context.
      workflowsPath: require.resolve('./workflows'),
      activities,
    });

    // Start accepting tasks on the `hello-world` queue
    await worker.run();
  } finally {
    // Close the connection once the worker has stopped
    await connection.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
