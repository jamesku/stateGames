import openSocket from 'socket.io-client';

import io from 'socket.io-client';

const server = io('http://192.168.1.16:3000');
const socket = openSocket('http://192.168.1.16:3000');

function connectToServer() {
  socket.on('connect', return(true));
}


export { connectToServer };
