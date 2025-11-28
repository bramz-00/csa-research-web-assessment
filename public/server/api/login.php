<?php
require_once __DIR__ . '/../../server/controllers/UserController.php';
use App\UserController;
use App\Csrf;
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

$user = UserController::login($email, $password);
if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}

// create simple session
session_start();
$_SESSION['user'] = $user;
echo json_encode(['success' => true, 'user' => $user]);
