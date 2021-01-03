const socket = io();
(function () {
    socket.emit('identity', sessionStorage.getItem('token'));

    socket.on('redirect', () => {
        window.location.href = "/login";
    });

    socket.on('display-message', (msg, sender) => {
        console.log(`Message: ${msg}, Sender:${sender}`);
    });

    document.getElementById("lol").addEventListener("click", () => {
        console.log("called");
        socket.emit("message", sessionStorage.getItem('token'), "12341234", "lol")
    });
})();