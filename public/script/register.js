async function submitRegistration(event) {
    event.preventDefault();
    const username = document.getElementById("res-username").value;
    const password = document.getElementById("res-password").value;
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
    const form = document.getElementById("res-form");
    form.addEventListener('submit', submitRegistration);
})();