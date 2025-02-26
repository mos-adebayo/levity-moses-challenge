import { MockActivityEnvironment } from '@temporalio/testing';
import { describe, it } from 'mocha';
import * as activities from '../activities';
import assert from 'assert';

describe('traffic workflow activities', async () => {
  it('returns true if delay is greater than maximum threshold', async () => {
    const env = new MockActivityEnvironment();
    const result = await env.run(activities.checkDelayThreshold, 100);
    assert.equal(result, true);
  });

  it('returns false if delay is less than maximum threshold', async () => {
    const env = new MockActivityEnvironment();
    const result = await env.run(activities.checkDelayThreshold, 1);
    assert.equal(result, false);
  });
});
