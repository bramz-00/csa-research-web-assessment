/**
 * JavaScript ES6 Assessment Solutions
 * Complete implementations with error handling and best practices
 */

// ============================================================================
// EXERCISE 1: Arrow Functions & Promises
// ============================================================================

/**
 * Fetch user data from API using ES6 arrow function
 * @param {number} userId - User ID to fetch
 * @returns {Promise<Object>} User data
 */
const fetchUserData = (userId) => {
    return fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            throw error;
        });
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

/**
 * Fetch multiple users using Promise.all
 * @param {Array<number>} userIds - Array of user IDs
 * @returns {Promise<Array>} Array of user data
 */
const fetchMultipleUsers = (userIds) => {
    const promises = userIds.map(id => fetchUserData(id));

    return Promise.all(promises)
        .then(users => {
            console.log('All users fetched successfully');
            return users;
        })
        .catch(error => {
            console.error('Error fetching multiple users:', error);
            throw error;
        });
};

// UI Functions for Exercise 1
function exercise1_fetchUser() {
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

function exercise1_fetchUserError() {
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

function exercise1_fetchMultipleUsers() {
    const output = document.getElementById('output1');
    output.innerHTML = '⏳ Fetching multiple users...\n';

    fetchMultipleUsers([1, 2, 3])
        .then(users => {
            const names = users.map(u => u.name).join(', ');
            output.innerHTML = `✅ Fetched ${users.length} users:\n\n${names}\n\n${JSON.stringify(users, null, 2)}`;
            output.className = 'output success';
        })
        .catch(error => {
            output.innerHTML = `❌ Error: ${error.message}`;
            output.className = 'output error';
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

/**
 * Deep clone and remove email (handles nested objects)
 * @param {Object} user - User object with nested properties
 * @returns {Object} Cloned user without email
 */
const removeEmailDeep = (user) => {
    // Deep clone to avoid mutating original
    const clonedUser = JSON.parse(JSON.stringify(user));
    const { email, ...userWithoutEmail } = clonedUser;
    return userWithoutEmail;
};

/**
 * Merge multiple user objects
 * @param {...Object} users - User objects to merge
 * @returns {Object} Merged user object
 */
const mergeUsers = (...users) => {
    return users.reduce((merged, user) => ({ ...merged, ...user }), {});
};

// UI Functions for Exercise 2
function exercise2_removeEmail() {
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

function exercise2_deepClone() {
    const output = document.getElementById('output2');

    const user = {
        name: "Jane Smith",
        email: "jane@example.com",
        address: {
            city: "Los Angeles",
            state: "CA",
            zip: "90001"
        },
        preferences: {
            theme: "dark",
            notifications: true
        }
    };

    const clonedUser = removeEmailDeep(user);

    output.innerHTML = `Original (with nested objects):\n${JSON.stringify(user, null, 2)}\n\n`;
    output.innerHTML += `Deep Cloned (without email):\n${JSON.stringify(clonedUser, null, 2)}`;
    output.className = 'output success';
}

function exercise2_mergeUsers() {
    const output = document.getElementById('output2');

    const user1 = { name: "John", age: 30 };
    const user2 = { email: "john@example.com", city: "NYC" };
    const user3 = { role: "admin", verified: true };

    const merged = mergeUsers(user1, user2, user3);

    output.innerHTML = `User 1: ${JSON.stringify(user1)}\n`;
    output.innerHTML += `User 2: ${JSON.stringify(user2)}\n`;
    output.innerHTML += `User 3: ${JSON.stringify(user3)}\n\n`;
    output.innerHTML += `Merged Result:\n${JSON.stringify(merged, null, 2)}`;
    output.className = 'output success';
}

// ============================================================================
// EXERCISE 3: PHP & JavaScript Integration
// ============================================================================

/**
 * Submit form data to PHP backend using fetch()
 * @param {Event} event - Form submit event
 */
async function exercise3_submitForm(event) {
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
                password: 'defaultPassword123' // In real app, would have password field
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

// ============================================================================
// BONUS: Additional ES6 Features Demonstration
// ============================================================================

/**
 * Demonstrate template literals
 */
const formatUser = (user) => {
    return `
User Profile:
-------------
Name: ${user.name}
Email: ${user.email}
Location: ${user.address?.city}, ${user.address?.state}
    `.trim();
};

/**
 * Demonstrate array destructuring
 */
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log('Array destructuring:', { first, second, rest });

/**
 * Demonstrate default parameters
 */
const greet = (name = 'Guest', greeting = 'Hello') => {
    return `${greeting}, ${name}!`;
};

console.log('ES6 Assessment loaded successfully! ✅');
