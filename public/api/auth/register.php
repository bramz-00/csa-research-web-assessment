<?php
require_once '../../server/controllers/UserController.php';
require_once '../../server/config/Csrf.php';
require_once '../../server/classes/User.php';

use App\Csrf;
use App\UserController;
use App\User;

header('Content-Type: application/json');

// CSRF token verification
$csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (!Csrf::verifyToken($csrfToken)) {
    http_response_code(403);
    echo json_encode(['error' => 'Invalid CSRF token']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

// Create the user
$result = UserController::create($input);

// If successful, automatically log in the user
if (isset($result['success']) && $result['success']) {
    // Start session only if not already started
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Fetch the newly created user
    $user = User::findById($result['id']);

    if ($user) {
        // Remove password from session data (if it exists)
        if (isset($user['password'])) {
            unset($user['password']);
        }
        $_SESSION['user'] = $user;

        $result['user'] = $user;
        $result['message'] = 'Registration successful. You are now logged in.';
    }
}

echo json_encode($result);
