async function getCsrf() {
    const res = await fetch('/server/utils/get_csrf.php');
    const json = await res.json();
    return json.token;
}

async function submitForm(e) {
    e.preventDefault();
    const token = await getCsrf();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let url = '/server/api/create.php';
    let body = { name, email, password };

    if (id) {
        url = '/server/api/update.php';
        body = { id, data: { name, email, password } };
        if (!password) delete body.data.password;
    }

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify(body)
    });

    const json = await res.json();
    console.log(json);
    if (json.success) {
        alert('Success!');
        window.location.href = '/client/list.html';
    } else {
        alert('Error: ' + JSON.stringify(json));
    }
}

async function loadUserIfEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) return;

    document.querySelector('h1').textContent = 'Edit User';
    document.querySelector('button[type="submit"]').textContent = 'Update';
    document.querySelector('#password').required = false;

    const res = await fetch(`/server/api/get_user.php?id=${id}`);
    if (res.ok) {
        const user = await res.json();
        document.querySelector('#name').value = user.name;
        document.querySelector('#email').value = user.email;
    } else {
        alert('User not found');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userForm').addEventListener('submit', submitForm);
    loadUserIfEdit();
});
