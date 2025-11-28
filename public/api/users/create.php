<?php
require_once  '../../server/controllers/UserController.php';
require_once '../../server/config/Csrf.php';
use App\Csrf;
use App\UserController;

header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

$result = UserController::create($input);
echo json_encode($result);
