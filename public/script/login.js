async function submitLogin(event) {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    console.log("hello");
    const result = await fetch('/login/submit', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json());
    if (result.status === "ok") {
        sessionStorage.setItem("token", result.token);
        window.location.href = "/chat";
    }
    else {
        alert(result.error);
    }
}

(function () {
    const form = document.getElementById("submit-login");
    console.log(form);
    const register = document.getElementById("to-register");
    register.onclick = () => window.location.href = "http://localhost:3000/register";
    form.addEventListener('click', submitLogin);
})();