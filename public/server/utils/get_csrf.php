<?php
require_once __DIR__ . '/../config/Csrf.php';
use App\Csrf;
header('Content-Type: application/json');
Csrf::init();
$token = Csrf::generateToken();
echo json_encode(['token' => $token]);
