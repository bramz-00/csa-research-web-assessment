<?php
session_start();
require_once  '../controllers/UserController.php';
use App\UserController;

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

echo json_encode(UserController::listAll());