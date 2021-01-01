const socket = io();

socket.emit('connection', sessionStorage.getItem('token'));