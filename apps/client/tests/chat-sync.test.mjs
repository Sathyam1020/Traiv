import assert from 'node:assert/strict';
import test from 'node:test';
import { createChatRefreshGate, mergeChatPage } from '../../../packages/ui/src/lib/chat-sync.ts';

test('repeated heartbeat refreshes share a slow request and allow it to finish', async () => {
  const gate = createChatRefreshGate();
  let finish;
  let calls = 0;
  let committed = false;
  const blocked = new Promise(resolve => { finish = resolve; });
  const task = async () => { calls++; await blocked; committed = true; };
  const first = gate.run(task);
  await Promise.resolve();
  for (let i = 0; i < 10; i++) assert.equal(gate.run(task), first);
  assert.equal(calls, 1);
  finish();
  await first;
  assert.equal(committed, true);
  await gate.run(async () => { calls++; });
  assert.equal(calls, 2);
});
test('an old history response cannot remove a just-acknowledged outgoing message', () => {
  const first = { id: '1', createdAt: '2026-11-02T10:00:00Z', mine: false };
  const sent = { id: '2', createdAt: '2026-11-02T10:00:02Z', mine: true };
  assert.deepEqual(mergeChatPage([first, sent], [first]), [first, sent]);
  const read = { ...sent, read: true };
  assert.deepEqual(mergeChatPage([first, sent], [first, read]), [first, read]);
});
test('failed refresh does not lock the next retry', async () => {
  const gate = createChatRefreshGate();
  await assert.rejects(gate.run(async () => { throw Error('offline'); }));
  let loaded = false;
  await gate.run(async () => { loaded = true; });
  assert.equal(loaded, true);
});
