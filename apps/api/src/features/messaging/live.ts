import { EventEmitter } from "node:events";

const events = new EventEmitter();
events.setMaxListeners(2000);
const typing = new Map<string, { role: string; until: number }>();
export function changed(clientId: string) {
  events.emit(clientId);
}
export function subscribe(clientId: string, listener: () => void) {
  events.on(clientId, listener);
  return () => {
    events.off(clientId, listener);
  };
}
export function setTyping(clientId: string, channel: string, role: string) {
  if (typing.size > 5000) for (const [k, v] of typing) if (v.until < Date.now()) typing.delete(k);
  typing.set(`${clientId}:${channel}:${role}`, { role, until: Date.now() + 6000 });
  changed(clientId);
}
export function isTyping(clientId: string, channel: string, role: string) {
  return (typing.get(`${clientId}:${channel}:${role}`)?.until ?? 0) > Date.now();
}
