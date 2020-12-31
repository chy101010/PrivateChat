class WebSocket {
    connection(user) {
        user.on('disconnect', () => {
            console.log("disconnect");
        })
        user.on('connection', (hello) => {
            console.log("connect" + hello);
        })
    }
}

exports.Socket = new WebSocket();