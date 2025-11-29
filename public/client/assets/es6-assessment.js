

// ============================================================================
// EXERCISE 1: Arrow Functions & Promises
// ============================================================================

/**
 * Fetch user data from API using ES6 arrow function
 * @param {number} userId - User ID to fetch
 * @returns {Promise<Object>} User data
 */
const fetchUserData = async (userId) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

/**
 * Fetch user with comprehensive error handling
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User data or error
 */
const fetchUserWithErrorHandling = async (userId) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        // Network error or fetch failed
        if (error.name === 'TypeError') {
            return {
                success: false,
                error: 'Network error. Please check your connection.'
            };
        }

        // Other errors
        return {
            success: false,
            error: error.message
        };
    }
};



// UI Functions for Exercise 1
function arrowFunctionsFetchUser() {
    const output = document.getElementById('output1');
    output.innerHTML = '⏳ Fetching user data...\n';

    fetchUserData(1)
        .then(user => {
            output.innerHTML = `✅ Success!\n\n${JSON.stringify(user, null, 2)}`;
            output.className = 'output success';
        })
        .catch(error => {
            output.innerHTML = `❌ Error: ${error.message}`;
            output.className = 'output error';
        });
}

function arrowFunctionsFetchUserError() {
    const output = document.getElementById('output1');
    output.innerHTML = '⏳ Testing error handling...\n';

    fetchUserWithErrorHandling(999) // Invalid user ID
        .then(result => {
            if (result.success) {
                output.innerHTML = `✅ Success!\n\n${JSON.stringify(result.data, null, 2)}`;
                output.className = 'output success';
            } else {
                output.innerHTML = `⚠️ Handled Error:\n\n${result.error}`;
                output.className = 'output error';
            }
        });
}



// ============================================================================
// EXERCISE 2: Destructuring & Spread Operator
// ============================================================================

/**
 * Remove email from user object using destructuring
 * @param {Object} user - User object
 * @returns {Object} User object without email
 */
const removeEmail = (user) => {
    const { email, ...userWithoutEmail } = user;
    return userWithoutEmail;
};



// UI Functions for Exercise 2
function spreadOperatorDestructuring() {
    const output = document.getElementById('output2');

    const user = {
        name: "John Doe",
        email: "john@example.com",
        address: {
            city: "New York",
            state: "NY"
        }
    };

    const userWithoutEmail = removeEmail(user);

    output.innerHTML = `Original User:\n${JSON.stringify(user, null, 2)}\n\n`;
    output.innerHTML += `After Removing Email:\n${JSON.stringify(userWithoutEmail, null, 2)}`;
    output.className = 'output success';
}



// ============================================================================
// EXERCISE 3: PHP & JavaScript Integration
// ============================================================================

/**
 * Submit form data to PHP backend using fetch()
 * @param {Event} event - Form submit event
 */
async function submitForm(event) {
    event.preventDefault();

    const output = document.getElementById('output3');
    const form = document.getElementById('userForm');
    const formData = new FormData(form);

    // Convert FormData to JSON
    const data = {
        name: formData.get('name'),
        email: formData.get('email')
    };

    output.innerHTML = '⏳ Submitting to backend...\n';

    try {
        // Get CSRF token
        const tokenRes = await fetch('/server/utils/get_csrf.php');
        const { token } = await tokenRes.json();

        // Submit to backend
        const response = await fetch('/api/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                password: 'defaultPassword123'
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            output.innerHTML = `✅ Success! User registered:\n\n`;
            output.innerHTML += `Name: ${result.user.name}\n`;
            output.innerHTML += `Email: ${result.user.email}\n`;
            output.innerHTML += `ID: ${result.user.id}\n`;
            output.innerHTML += `Created: ${result.user.created_at}\n\n`;
            output.innerHTML += `Full Response:\n${JSON.stringify(result, null, 2)}`;
            output.className = 'output success';

            form.reset();
        } else {
            output.innerHTML = `⚠️ Server Response:\n\n${result.error || result.message}`;
            output.className = 'output error';
        }

    } catch (error) {
        output.innerHTML = `❌ Error:\n\n${error.message}`;
        output.className = 'output error';
        console.error('Submission error:', error);
    }
}




