//  http request for the username
//  create an active conversation
//  if the user is not online push to database 
//  if the user is online use socket to send directly
const socket = io();
(function () {
    // const messages = document.getElementById("chat-message-list");
    // const type = document.getElementById("chat-form");
    // const search = document.getElementById("search-container");
    // const conversations = document.getElementById("conversation-list");
    // const receiver = document.getElementById("receiver-username");

    // // Send identity 
    // socket.emit('identity', sessionStorage.getItem('token'));
    // socket.on('redirect', () => {
    //     window.location.href = "/login";
    // });

    // // Displays real time receive
    // socket.on("display-receive", (msg) => {
    //     displayMessage(false, msg.message);
    // })

    // socket.on("incoming-conversation", (sender) => {
    //     creatConversationTag(sender);
    // })

    // /*
    //     Displays send/receive messages
    //     @param{side} if false display to receiver, else display yours
    // */
    // function displayMessage(side, msg) {
    //     const container = document.createElement("div");
    //     if (side) {
    //         container.className = "message-row your-message";
    //     }
    //     else {
    //         container.className = "message-row other-message";
    //     }
    //     const message = document.createElement("div");
    //     message.className = "message-text";
    //     message.innerHTML = msg;
    //     container.appendChild(message);
    //     messages.prepend(container);
    // }

    // function creatConversationTag(username) {
    //     const container = document.createElement("button");
    //     container.className = "conversation title-text";
    //     container.innerHTML = username;
    //     container.id = username;
    //     container.addEventListener("click", (event) => {
    //         for (var i = 0; i < conversations.children.length; i++) {
    //             conversations.children[i].classList.remove("active");
    //         }
    //         username = event.target.id;
    //         receiver.innerHTML = username;
    //         event.target.classList.add("active");
    //     })
    //     conversations.appendChild(container);
    // }

    // function searchConversationTag(username) {
    //     for (var i = 0; i < conversations.children.length; i++) {
    //         if (conversations.children[i].id === username) {
    //             conversations.children[i].click();
    //             return true;
    //         }
    //     }
    // }

    // function disableSearch() {
    //     const container = document.getElementById("search-username");
    //     container.disabled = true;
    //     container.classList.add("invalid");
    //     container.placeholder = "Undefined Username"
    //     setTimeout(() => {
    //         container.disabled = false;
    //         container.classList.remove("invalid")
    //         container.placeholder = "Search Username";
    //     }, 1000);
    // }

    // type.onkeypress = async () => {
    //     const key = window.event.keyCode;
    //     if (key === 13) {
    //         const message = document.getElementById("user-input").value;
    //         const receiver = document.getElementById("receiver-username").innerHTML;
    //         if (message) {
    //             // Backend
    //             const result = await fetch("/api/chat/post", {
    //                 method: "POST",
    //                 body: JSON.stringify({
    //                     receiver,
    //                     message
    //                 }),
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'authorization': `Bearer ${sessionStorage.getItem("token")}`
    //                 }
    //             }).then((res) => res.json());
    //             if (result.status === "ok") {
    //                 displayMessage(true, result.message);
    //             } else {
    //                 console.log("posted unsuccessfully");
    //             }
    //             document.getElementById("user-input").value = "";
    //         }
    //     }
    // }

    // // creating a conversation
    // search.onkeypress = async () => {
    //     const key = window.event.keyCode;
    //     if (key === 13) {
    //         const container = document.getElementById("search-username");
    //         const username = container.value;
    //         container.value = "";
    //         // set up a conversation with the given username
    //         const result = await fetch(`/api/chat/create/${username}`, {
    //             method: "GET",
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'authorization': `Bearer ${sessionStorage.getItem("token")}`
    //             }
    //         }).then((res) => res.json()).catch((err) => console.log(err.message));
    //         if (result.status === "ok") {
    //             if (!searchConversationTag(result.receiver)) {
    //                 creatConversationTag(result.receiver);
    //             }
    //         }
    //         else {
    //             disableSearch();
    //         }
    //     }
    // }



    // send conversations

    // delete conversations

    // accept conversations

    // retrieve converstaions 

    // type message


})();