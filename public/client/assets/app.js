async function getCsrf() {
    const res = await fetch('/server/utils/get_csrf.php');
    const json = await res.json();
    return json.token;
}

async function submitForm(e) {
    e.preventDefault();
    const token = await getCsrf();

    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let url;
    let method = 'POST';
    let body = { name, email };

    if (password) {
        body.password = password;
    }

    if (id) {
        url = `/api/users/update.php/${id}`;
        method = 'PUT';  
    } else {
        url = '/api/users/create.php';
    }

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify(body)
        });

        const json = await res.json();

        if (res.ok && (json.success || json.message)) {
            alert(id ? 'User updated successfully!' : 'User created successfully!');
            window.location.href = '/client/list.html';
        } else {
            alert('Error : ' + (json.error || JSON.stringify(json)));
        }
    } catch (err) {
        console.error(err);
        alert('Error');
    }
}

async function loadUserIfEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) return;

    document.querySelector('h1').textContent = 'Edit User';
    document.querySelector('button[type="submit"]').textContent = 'Update';
    document.querySelector('#password').placeholder = 'Leave empty to not change';
    document.querySelector('#password').required = false;

    const res = await fetch(`/api/users/get_user.php?id=${id}`);
    if (res.ok) {
        const user = await res.json();
        document.querySelector('#name').value = user.name || '';
        document.querySelector('#email').value = user.email || '';
    } else {
        alert('User not found');
    }
}

// Lancement
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userForm').addEventListener('submit', submitForm);
    loadUserIfEdit();
});