const socket = io();
(function () {
    socket.emit('connection', sessionStorage.getItem('token'));

    socket.on('redirect', () => {
        alert("Login to access the functionalities");
        window.location.href = "/login";
    });
})();