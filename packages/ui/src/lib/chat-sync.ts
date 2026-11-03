/** Share concurrent refresh triggers so slow responses can finish instead of being superseded. */
export function createChatRefreshGate() {
  let active: Promise<void> | null = null;
  return {
    run(task: () => Promise<void>): Promise<void> {
      if (active) return active;
      const result = Promise.resolve().then(task);
      active = result;
      const clear = () => {
        if (active === result) active = null;
      };
      void result.then(clear, clear);
      return result;
    },
    busy() {
      return active !== null;
    },
    reset() {
      active = null;
    },
  };
}
type ChatRow = { id: string; createdAt: string; mine: boolean };
/** A refresh may have started before a POST committed; retain acknowledged outgoing rows. */
export function mergeChatPage<T extends ChatRow>(existing: T[], incoming: T[]): T[] {
  const ids = new Set(incoming.map((m) => m.id));
  const first = incoming[0]?.createdAt;
  const retained = existing.filter(
    (m) => !ids.has(m.id) && (!first || m.createdAt < first || m.mine),
  );
  return [...retained, ...incoming].sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
  );
}
