async function submitRegistration(event) {
    event.preventDefault();
    const username = document.getElementById("res-username").value;
    const password = document.getElementById("res-password").value;
    console.log("called")
    const result = await fetch("/register/submit", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json());

    if (result.status === 'error') {
        alert(result.error);
    }
    else {
        alert('success!');
    }
}


(function () {
    const button = document.getElementById("submit");
    const login = document.getElementById("to-login");
    login.onclick = () => window.location.href = "http://localhost:3000/login";
    button.addEventListener('click', submitRegistration);
})();