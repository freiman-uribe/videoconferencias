import io from 'socket.io-client';
const sockets = io('https://social-else-freiman-e495e76c.koyeb.app/', { autoConnect: true, forceNew: true });
// const sockets = io('/');
export default sockets;
