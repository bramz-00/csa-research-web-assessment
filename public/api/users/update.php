<?php
require_once '../../server/controllers/UserController.php';
require_once '../../server/config/Csrf.php';

use App\UserController;

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}


$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));
$id = end($segments);

if (!$id || !is_numeric($id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid ID required in URL']);
    exit;
}
$id = (int)$id;

$input = json_decode(file_get_contents('php://input'), true) ?: [];

if (empty($input)) {
    http_response_code(422);
    echo json_encode(['error' => 'No data sent for update']);
    exit;
}

$success = UserController::update($id, $input);

http_response_code($success ? 200 : 400);
echo json_encode([
    'success' => $success,
    'message' => $success ? 'User updated successfully' : 'Update failed',
    'updated_id' => $id
]);