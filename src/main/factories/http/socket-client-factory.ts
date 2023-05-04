import { io, Socket } from 'socket.io-client';

const url = process.env.VITE_API_SOCKET as string;

export const makeSocketClient = (): Socket => io(url);
