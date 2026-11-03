/** Order workout writes and tell callers whether their result still represents
 * the latest user intent for that row. A failed write must not poison later saves. */
export function createSaveQueue() {
  let tail: Promise<void> = Promise.resolve();
  const revisions = new Map<string, number>();
  return {
    run(key: string, work: (isLatest: () => boolean) => Promise<void>) {
      const revision = (revisions.get(key) ?? 0) + 1;
      revisions.set(key, revision);
      const task = tail.then(() => work(() => revisions.get(key) === revision));
      tail = task.catch(() => {});
      return task;
    },
  };
}
