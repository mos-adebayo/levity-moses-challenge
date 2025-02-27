import { TestWorkflowEnvironment } from '@temporalio/testing';
import { after, before, it } from 'mocha';
import { Worker } from '@temporalio/worker';
import { trafficWorkflow } from '../workflows';
import assert from 'assert';

describe('traffic workflow with mocks', () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  it('successfully completes the Workflow with a traffic delay above the threshold', async () => {
    const { client, nativeConnection } = testEnv;
    const taskQueue = 'test';

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue,
      workflowsPath: require.resolve('../workflows'),
      activities: {
        getTrafficDelay: async () => 40,
        checkDelayThreshold: async () => true,
        generateMessage: async () => 'Generated AI message',
        sendMessage: async () => 'Notification sent',
      },
    });

    const result = await worker.runUntil(
      client.workflow.execute(trafficWorkflow, {
        args: ['Berlin', 'Lagos'],
        workflowId: 'test',
        taskQueue,
      }),
    );
    assert.equal(result, 'Notification sent');
  });

  it('successfully completes the Workflow with traffic delay below the threshold', async () => {
    const { client, nativeConnection } = testEnv;
    const taskQueue = 'test';

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue,
      workflowsPath: require.resolve('../workflows'),
      activities: {
        getTrafficDelay: async () => 2,
        checkDelayThreshold: async () => false,
        generateMessage: async () => 'Generated AI message',
        sendMessage: async () => 'Notification sent',
      },
    });

    const result = await worker.runUntil(
      client.workflow.execute(trafficWorkflow, {
        args: ['Berlin', 'Lagos'],
        workflowId: 'test',
        taskQueue,
      }),
    );
    assert.equal(result, 'Notification skipped because delay is under the threshold');
  });
});
