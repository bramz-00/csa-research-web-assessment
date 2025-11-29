# JavaScript ES6 Assessment - Solutions

Complete implementations of all ES6 exercises with comprehensive error handling and best practices.

## 📁 Files

- **`/client/es6-assessment.html`** - Interactive demo page
- **`/client/assets/es6-assessment.js`** - All solutions with detailed comments

## 🚀 Access the Demo

Visit: **http://localhost:8000/client/es6-assessment.html**

---

## 1️⃣ Arrow Functions & Promises

### Basic Implementation

```javascript
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
```

### With Async/Await & Error Handling

```javascript
const fetchUserWithErrorHandling = async (userId) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.status}`);
        }
        
        const data = await response.json();
        return { success: true, data };
        
    } catch (error) {
        if (error.name === 'TypeError') {
            return { 
                success: false, 
                error: 'Network error. Please check your connection.' 
            };
        }
        
        return { success: false, error: error.message };
    }
};
```

### Bonus: Promise.all for Multiple Requests

```javascript
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

// Usage
fetchMultipleUsers([1, 2, 3])
    .then(users => console.log(users))
    .catch(error => console.error(error));
```

### Error Handling Strategies

1. **Try-Catch with Async/Await** (Recommended)
   - Clean, readable code
   - Easy to handle different error types
   - Works well with modern JavaScript

2. **Promise .catch()**
   - Good for chaining promises
   - Can catch errors at any point in the chain

3. **Custom Error Objects**
   ```javascript
   class APIError extends Error {
       constructor(message, status) {
           super(message);
           this.status = status;
           this.name = 'APIError';
       }
   }
   ```

---

## 2️⃣ Destructuring & Spread Operator

### Basic Solution

```javascript
const removeEmail = (user) => {
    const { email, ...userWithoutEmail } = user;
    return userWithoutEmail;
};

// Usage
const user = {
    name: "John Doe",
    email: "john@example.com",
    address: {
        city: "New York",
        state: "NY"
    }
};

const result = removeEmail(user);
// { name: "John Doe", address: { city: "New York", state: "NY" } }
```

### Deep Clone (Handles Nested Objects)

```javascript
const removeEmailDeep = (user) => {
    // Deep clone to avoid mutating original
    const clonedUser = JSON.parse(JSON.stringify(user));
    const { email, ...userWithoutEmail } = clonedUser;
    return userWithoutEmail;
};
```

### Bonus: Merge Multiple Objects

```javascript
const mergeUsers = (...users) => {
    return users.reduce((merged, user) => ({ ...merged, ...user }), {});
};

// Usage
const user1 = { name: "John", age: 30 };
const user2 = { email: "john@example.com", city: "NYC" };
const merged = mergeUsers(user1, user2);
// { name: "John", age: 30, email: "john@example.com", city: "NYC" }
```

### Key Concepts

- **Destructuring**: Extract properties from objects
- **Spread Operator (`...`)**: Copy/merge objects
- **Rest Parameters**: Collect remaining properties

---

## 3️⃣ PHP & JavaScript Integration

### HTML Form

```html
<form id="userForm" onsubmit="submitForm(event)">
    <label for="userName">Name:</label>
    <input type="text" id="userName" name="name" required>
    
    <label for="userEmail">Email:</label>
    <input type="email" id="userEmail" name="email" required>
    
    <button type="submit">Submit</button>
</form>
```

### JavaScript (Frontend)

```javascript
async function submitForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('userForm');
    const formData = new FormData(form);
    
    const data = {
        name: formData.get('name'),
        email: formData.get('email')
    };
    
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
            console.log('Success!', result);
            form.reset();
        } else {
            console.error('Error:', result.error);
        }
        
    } catch (error) {
        console.error('Submission error:', error);
    }
}
```

### PHP Backend (Already Implemented)

The backend uses:
- **`/api/auth/register.php`** - Handles user registration
- **CSRF Protection** - Validates tokens
- **Database Storage** - Saves user data
- **JSON Response** - Returns confirmation

---

## 🎯 Key ES6 Features Demonstrated

### 1. Arrow Functions
```javascript
const add = (a, b) => a + b;
const greet = name => `Hello, ${name}!`;
```

### 2. Template Literals
```javascript
const message = `User ${user.name} from ${user.city}`;
```

### 3. Destructuring
```javascript
const { name, email } = user;
const [first, second, ...rest] = array;
```

### 4. Spread Operator
```javascript
const newUser = { ...user, age: 30 };
const combined = [...array1, ...array2];
```

### 5. Default Parameters
```javascript
const greet = (name = 'Guest') => `Hello, ${name}!`;
```

### 6. Promises & Async/Await
```javascript
const data = await fetch(url).then(r => r.json());
```

### 7. Rest Parameters
```javascript
const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);
```

---

## 🧪 Testing

1. **Start the application:**
   ```bash
   docker compose up -d
   ```

2. **Access the demo:**
   ```
   http://localhost:8000/client/es6-assessment.html
   ```

3. **Test each exercise:**
   - Click buttons to see live demonstrations
   - Check console for detailed logs
   - Submit form to test PHP integration

---

## 📚 Additional Resources

- [MDN: Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN: Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN: Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [MDN: Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## ✅ Best Practices Implemented

1. **Error Handling**: Comprehensive try-catch blocks
2. **CSRF Protection**: Secure form submissions
3. **Async/Await**: Modern promise handling
4. **Code Comments**: Clear documentation
5. **Validation**: Input validation on both client and server
6. **User Feedback**: Clear success/error messages
7. **Clean Code**: Readable, maintainable structure

---

**Created by:** Antigravity AI  
**Date:** 2025-11-29
