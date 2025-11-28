<?php
require_once  '../../server/controllers/UserController.php';
require_once '../../server/config/Csrf.php';
use App\Csrf;
use App\UserController;

header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

// verify CSRF token from header X-CSRF-Token
$csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (!Csrf::verifyToken($csrfToken)) {
    http_response_code(403);
    echo json_encode(['error' => 'Invalid CSRF token']);
    exit;
}

$result = UserController::create($input);
echo json_encode($result);
