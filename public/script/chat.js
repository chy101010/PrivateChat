// Initialize a client side socket
const socket = io();
(function () {
    // Container for messages
    const messagesContainer = document.getElementById("chat-message-list");
    // TextArea for message input
    const type = document.getElementById("chat-form");
    // The search bar
    const search = document.getElementById("search-container");
    // Container for conversations
    const conversations = document.getElementById("conversation-list");
    // Conversation title representing the username you are send messages to.
    const talkingTo = document.getElementById("receiver");
    // log off button
    const logoff = document.getElementById("logOff");


    // Create a HTML element of the given (type) with class name of (classes) and innerText of (text) 
    function createElement(type, classes, text = '') {
        const element = document.createElement(type);
        element.className = classes;
        element.innerText = text;
        return element;
    }

    // Appending the list of children nodes to the parent node
    function appendChildren(parent, children) {
        children.forEach((child) => parent.appendChild(child));
    }

    // Display the username and socket Id
    function frontDisplayUserInfo(username, id) {
        document.getElementById("username").innerText += username;
        document.getElementById("socket").innerText += id;
    }

    // {conId} conversation Id 
    // {username} username of the receiver of the request
    // {time} the time inwhich the conversation is created
    // Displays a send-request conversation tag
    function frontDisplayRequest(conId, receiver, time) {
        time = time.slice(0, 10);
        // container
        const container = createElement("div", "reqconfirmation");
        container.id = conId;
        // username
        const username = createElement("div", "title-text", receiver);
        // message
        const message = createElement("div", "title-text b", "Friend request has been sent...");
        // date
        const date = createElement("div", "created-date", time);
        // button 
        const button = createElement("button", "close-conversation", "x");
        // Adding delete-conversation functionality
        addFunctionalityChild(button, deleteConversation);
        appendChildren(container, [username, message, date, button]);
        conversations.appendChild(container);
    }

    // takes in a element and a function, then add that function to an event of the element. The parameter
    // for that function is the parentElement's Id
    async function addFunctionalityChild(btn, func, type = "click") {
        btn.addEventListener(type, async (event) => {
            event.stopPropagation();
            func(event.target.parentElement.id);
        })
    }

    // takes in a element and a functionm then add that function to an event of the element. The parameter
    // for that function is the element's Id
    async function addFunctionality(ele, func, type = "click") {
        ele.addEventListener(type, async (event) => {
            event.stopPropagation();
            func(event.target.id);
        })
    }

    // {conId} conversation Id 
    // {username} username of the sender of the request 
    // {time} the time inwhich the conversation is created
    // Displays a receive-request conversation tag
    function frontDisplayReceiveRequest(conId, username, time) {
        time = time.slice(0, 10);
        // container 
        const container = createElement("div", "friendrequest");
        container.id = conId;
        // username
        const usern = createElement("div", "title-text", username);
        // date
        const date = createElement("div", "created-date", time);
        // message
        const msg = createElement("p", "", "wants to be your friend...");
        // accept btn
        const accept = createElement("button", "accept", "Accept");
        addFunctionalityChild(accept, acceptConversationRequest);
        // reject btn
        const reject = createElement("button", "reject", "Reject");
        addFunctionalityChild(reject, deleteConversation);
        appendChildren(container, [usern, date, msg, accept, reject]);
        conversations.appendChild(container);
    }

    // {conId} conversation Id 
    // {username} username of the receiver
    // {time} the time inwhich the conversation is created
    // Display a established-conversation tag 
    function frontDisplayConversation(conId, usern, time) {
        time = time.slice(0, 10);
        // container
        const container = createElement("div", "conversation active");
        container.id = conId;
        addFunctionality(container, retrieveMessages);
        // username
        const username = createElement("div", "title-text", usern);
        // date
        const date = createElement("div", "created-date", time);
        // message
        const msg = createElement("div", "conversation-message", " ");
        // button
        const button = createElement("button", "close-conversation", "x");
        [username, msg, date].forEach((element) => addFunctionalityChild(element, retrieveMessages));
        addFunctionalityChild(button, deleteConversation);
        appendChildren(container, [username, msg, date, button]);
        conversations.appendChild(container);
    }

    // Clear the all the displaying messages 
    function frontClearMessages() {
        messagesContainer.innerHTML = "";
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

    // Delete an html element by Id
    function frontDeleteElement(id) {
        const remove = document.getElementById(id);
        if (remove) {
            remove.parentNode.removeChild(remove);
        }
    }

    // Handles/Display accepted request
    function frontHandleAccepted(conId, username, time) {
        frontDeleteElement(conId);
        frontDisplayConversation(conId, username, time);
    }


    //{isSend}, indicates whether the current user is the sender or the receiver. 
    //{message}, the message to be displayed
    //{time}, the time in which the message is sent
    function frontDisplayMessage(isSend, message, time) {
        const container = createElement("div", "message-row");
        if (isSend) {
            container.classList.add("your-message");
        } else {
            container.classList.add("other-message");
        }
        // message
        const msg = createElement("div", "message-text", message);
        // message-time
        const msgTime = createElement("div", "message-time", time);
        appendChildren(container, [msg, msgTime]);
        messagesContainer.prepend(container);
    }

    //{messages} is an array of messages retrieved from the db in the form of {isSender, Message, CreatedAt}. 
    function frontDisplayMessages(messages) {
        messages.forEach((msg) => frontDisplayMessage(msg.isSender, msg.message, msg.createdAt));
    }

    // {username} is the username of the receiver
    // {conId} the conversation id
    // Displays the receiver's username in the chat title
    function frontDisplayReceiver(username, conId) {
        const span = document.getElementById("receiver");
        span.innerHTML = username;
        span.value = conId;
    }


    // To work 
    function frontUpdateConversation(data) {
        const container = document.getElementById(data.conId);
        container.children[1].innerHTML = data.message;
    }

    // Send identity 
    socket.emit('identity', sessionStorage.getItem('token'));
    // Receive identity 
    socket.on("receive-identity", (username, id) => {
        frontDisplayUserInfo(username, id);
    })
    // Redirect to login
    socket.on('redirect', () => {
        window.location.href = "/login";
    });
    // retrieve messages
    retrieveConversations();
    // Display real time conversation request
    socket.on("request-conversation", (data) => {
        frontDisplayReceiveRequest(data.conId, data.creator, data.createdAt);
    });
    // Displays real time conversation request accepted
    socket.on("accept-conversation", (data) => {
        frontHandleAccepted(data.conId, data.receiver, data.createdAt);
    })
    // Displays real time conversation request deleted
    socket.on("delete-conversation", (data) => {
        frontDeleteElement(data.conId);
        if(talkingTo.value = data.conId) {
            frontClearMessages();
            talkingTo.value = "";
        }
    })
    // Displays real time message receives 
    socket.on("display-receive", (data) => {
        frontDisplayMessage(false, data.message, data.time);
        data.message = "from: " + data.message;
        frontUpdateConversation(data)
    })
    // log off/ redirecting to login and removing the access token
    logoff.addEventListener("click", () => {
        sessionStorage.removeItem('token');
        window.location.href = "/login";
    });

    // Sends a conversation request to the username typed in the search bar 
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
                },
            }).then((res) => (res.json()));
            if (request.status === "ok") {
                frontDisplayRequest(request.conversationId, receiver, request.createdAt);
            }
            else if (request.status === "duplicate") {
                frontDuplicateRequest(request.conversationId, receiver);
            } else if (request.status === "failure") {
                frontDisableSearch("Invalid Username");
            }
        }
    }


    // accept conversations given conversation Id
    async function acceptConversationRequest(conId) {
        const request = await fetch("/api/chat/accept", {
            method: "POST",
            body: JSON.stringify({
                conId
            }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then((res) => res.json());
        if (request.status === "ok") {
            frontHandleAccepted(conId, request.user, request.createdAt);
        }
        else {
            frontDeleteElement(condId);
        }
    }

    // Delete conversations given conversation Id
    async function deleteConversation(conId) {
        const request = await fetch("/api/chat/delete", {
            method: "POST",
            body: JSON.stringify({
                conId
            }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then((res) => res.json());
        if (request.status === "ok") {
            frontDeleteElement(conId);
            if(talkingTo.value == conId) {
                frontClearMessages();
                talkingTo.value = "";
            }
        }
        // else ?
    }

    // Retrieve all existing converstaions of the current user 
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
                    frontDisplayRequest(conversation._id, conversation.creator, conversation.createdAt);
                }
                // Request sent to the current user
                else {
                    frontDisplayReceiveRequest(conversation._id, request["receiver"], conversation.createdAt);
                }
            }
            // established conversations
            else {
                const name = (conversation.userIds[0] === request["receiver"]) ? conversation.userIds[1] : conversation.userIds[0];
                frontDisplayConversation(conversation._id, name, conversation.createdAt);
            }
        });
    }

    // Retrieve messages from a conversation given conversation Id
    async function retrieveMessages(conId) {
        const request = await fetch(`/api/chat/messages/${conId}`, {
            method: "GET",
            headers: {
                'authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then((res) => res.json());
        if (request.status === "ok") {
            frontClearMessages();
            frontDisplayReceiver(request.other, conId)
            frontDisplayMessages(request.result);
        }
    }


    // Sends message to the receiver and the database
    type.onkeypress = async () => {
        const key = window.event.keyCode;
        const receiver = document.getElementById("receiver").innerText;
        if (key === 13 && receiver) {
            const message = document.getElementById("user-input").value;
            const conId = document.getElementById("receiver").value;
            if (message) {
                const result = await fetch("/api/chat/post", {
                    method: "POST",
                    body: JSON.stringify({
                        conId,
                        receiver,
                        message
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${sessionStorage.getItem("token")}`
                    }
                }).then((res) => res.json());
                if (result.status === "ok") {
                    frontDisplayMessage(true, result.result.message, result.result.createdAt);
                    frontUpdateConversation({conId: result.result.conversationId, message: "to: " + message});
                }
                document.getElementById("user-input").value = "";
            }
        }
    }



})();


