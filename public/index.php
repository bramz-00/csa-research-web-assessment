<?php
session_start();
$isLoggedIn = isset($_SESSION['user']);
?>
<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <title>Home</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    main {
        display: flex;
          align-items: center;
          justify-content: center;
    }
    .btn {
      display: inline-block;
      padding: 12px 10px;
      margin: 10px;
      background-color: gray;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      cursor: pointer;
      border: none;
      font-size: 16px;
    }

    .btn:hover {
      background: orangered;
    }
  </style>
</head>

<body>

  <h1>Welcome to User Management</h1>
  <main>

    <?php if ($isLoggedIn): ?>
      <a href="/client/list.html" class="btn">User List</a>
      <button onclick="logout()" class="btn">Logout</button>

      <script>
        async function logout() {
          await fetch('/server/api/logout.php');
          location.reload();
        }
      </script>
    <?php else: ?>
      <a href="/client/form.html" class="btn">Register</a>
      <a href="/client/login.html" class="btn">Login</a>
    <?php endif; ?>
    </main>

</body>

</html>