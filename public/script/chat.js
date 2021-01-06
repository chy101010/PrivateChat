//  http request for the username
//  create an active conversation
//  if the user is not online push to database 
//  if the user is online use socket to send directly
const socket = io();
(function () {
    const messages = document.getElementById("chat-message-list");
    const type = document.getElementById("chat-form");
    const search = document.getElementById("search-container");
    const conversations = document.getElementById("conversation-list");
    const receiver = document.getElementById("receiver-username");

    // Create a HTML element of the given (type) with class name of (classes) and innerText of (text) 
    function createElement(type, classes, text = '') {
        const element = document.createElement(type);
        element.className = classes;
        element.innerText = text;
        return element;
    }

    function appendChildren(parent, children) {
        children.forEach((child) => parent.appendChild(child));
    }

    // Displays a send-request conversation tag
    function frontDisplayRequest(conId, receiver) {
        // container
        const container = createElement("div", "reqconfirmation");
        container.id = conId;
        // username
        const username = createElement("div", "title-text", receiver);
        // message
        const message = createElement("div", "title-text b", "Friend request has been sent...");
        // date
        const date = createElement("div", "created-date", "Apr 16");
        // button 
        const button = createElement("button", "close-conversation", "x");
        appendChildren(container, [username, message, date, button]);
        conversations.appendChild(container);
    }

    // Displays a receive-request conversation tag
    function frontDisplayReceiveRequest(conId, username) {
        // container 
        const container = createElement("div", "friendrequest");
        container.id = conId;
        // username
        const usern = createElement("div", "title-text", username);
        // date
        const date = createElement("div", "created-date", "Apr 16");
        // message
        const msg = createElement("p", "", "wants to be your friend...");
        // accept btn
        const accept = createElement("button", "accept", "Accept");
        // accept btn
        const reject = createElement("button", "reject", "Reject");
        appendChildren(container, [usern, date, msg, accept, reject]);
        conversations.appendChild(container);
    }

    // Display a established-conversation tag 
    function frontDisplayConversation(conId, usern) {
        // container
        const container = createElement("div", "conversation active");
        container.id = conId;
        // username
        const username = createElement("div", "title-text", usern);
        // date
        const date = createElement("div", "created-date", "Apr 16");
        // message
        const msg = createElement("div", "conversation-message", "Placeholder");
        // button
        const button = createElement("button", "close-conversation", "x");
        appendChildren(container, [username, date, msg, button]);
        conversations.appendChild(container);
    }

    // Handles duplicates request in the frontend 
    function frontDuplicateRequest(conId, receiver) {
        const container = document.getElementById(conId);
        if (!container) {
            frontDisplayRequest(conId, receiver);
        }
        else {
            container.classList.add("duplicate");
            setTimeout(() => {
                container.classList.remove('duplicate');
            }, 5000);
        }
    }

    // Disables the search bar for 1.5 second 
    function frontDisableSearch(msg) {
        const searchBar = document.getElementById("search-username");
        searchBar.disabled = true;
        searchBar.classList.add("invalid");
        searchBar.placeholder = msg;
        setTimeout(() => {
            searchBar.disabled = false;
            searchBar.classList.remove("invalid")
            searchBar.placeholder = "Search Username";
        }, 1500);
    }

    // Send identity 
    socket.emit('identity', sessionStorage.getItem('token'));
    // Redirect to login
    socket.on('redirect', () => {
        window.location.href = "/login";
    });
    // display real time conversation request
    socket.on("request-conversation", (data) => {
        frontDisplayReceiveRequest(data.conId, data.creator);
    });

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


    // Search/Send Conversations
    search.onkeypress = async function () {
        const key = window.event.keyCode;
        if (key === 13) {
            const container = document.getElementById("search-username");
            const receiver = container.value;
            container.value = "";
            // Send request
            const request = await fetch(`/api/chat/send/${receiver}`, {
                method: "GET",
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem("token")}`
                }
            }).then((res) => (res.json()));
            if (request.status === "ok") {
                frontDisplayRequest(request.conversationId, receiver);
            }
            else if (request.status === "duplicate") {
                frontDuplicateRequest(request.conversationId, receiver);
            } else if (request.status === "failure") {
                frontDisableSearch("Invalid Username");
            }
        }
    }

    // accept conversations
    async function acceptConversationRequest(conId) {
        
    }


    // delete conversations


    // retrieve converstaions 
    async function retrieveConversations() {
        const request = await fetch(`/api/chat/retrieve`, {
            method: "GET",
            headers: {
                'authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then((res) => (res.json()));
        request["conversations"].forEach((conversation) => {
            if (conversation.status === "pending") {
                // Request sent by the current user
                if (conversation.creator === request["receiver"]) {
                    frontDisplayRequest(conversation.conversationId, conversation.creator);
                }
                // Request sent to the current user
                else {
                    frontDisplayReceiveRequest(conversation.conversationId, request["receiver"]);
                }
            }
            // established conversations
            else {
                const name = (conversation.creator === request["receiver"]) ? conversation.userIds[1] : request[1];
                frontDisplayConversation(conversation.conversationId, name);
            }
        });
    }
    retrieveConversations();

    // Type message

    // Get message 

})();