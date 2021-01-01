class WebSocket {
    connection(user) {
        user.on('disconnect', () => {
            console.log("disconnect");
        })
        user.on('connection', (username) => {
            console.log("connect: " + username + "socket: " + user.id);
        })
    }
}

exports.Socket = new WebSocket();