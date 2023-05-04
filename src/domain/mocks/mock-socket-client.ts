/* eslint-disable */
let EVENTS: any = {};
function emit(event: any, ...args: any) {
  EVENTS[event].forEach((func: any) => func(...args));
}
const socket = {
  on(event: any, func: any) {
    if (EVENTS[event]) {
      return EVENTS[event].push(func);
    }
    EVENTS[event] = [func];
  },
  off(event: any, func: any) {
    if (EVENTS[event]) {
      return (EVENTS[event] = []);
    }
    EVENTS[event] = [func];
  },
  emit
};
export const io = {
  connect() {
    return socket;
  }
};

export const serverSocket = { emit };

export function cleanup() {
  EVENTS = {};
}
