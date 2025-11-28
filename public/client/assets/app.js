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
        url = '/api/auth/register.php';
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

        // Read response as text first
        const responseText = await res.text();

        let json;
        try {
            json = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response text:', responseText);
            alert('Server error: Invalid response format. Check console for details.');
            return;
        }

        if (res.ok && (json.success || json.message)) {
            const message = id
                ? 'User updated successfully!'
                : (json.message || 'Registration successful! You are now logged in.');
            alert(message);
            window.location.href = '/client/list.html';
        } else {
            // Show specific error message
            const errorMsg = json.error || json.message || 'Unknown error occurred';
            alert('Error: ' + errorMsg);
        }
    } catch (err) {
        console.error('Request error:', err);
        alert('Network error: ' + err.message);
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