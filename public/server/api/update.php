<?php
require_once '../../server/controllers/UserController.php';
require_once '../../server/config/Csrf.php';
use App\Csrf;
use App\UserController;


session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (!Csrf::verifyToken($csrfToken)) {
    http_response_code(403);
    echo json_encode(['error' => 'Invalid CSRF token']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;
$data = $input['data'] ?? [];

if (!$id || empty($data)) {
    http_response_code(422);
    echo json_encode(['error' => 'Missing id or data']);
    exit;
}

$ok = UserController::update($id, $data);
echo json_encode(['success' => (bool) $ok]);
