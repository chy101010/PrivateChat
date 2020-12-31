const socket = io();

socket.emit('connection', "hello");