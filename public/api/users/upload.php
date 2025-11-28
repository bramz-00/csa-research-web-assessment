<?php
require_once '../../server/config/Csrf.php';
use App\Csrf;

header('Content-Type: application/json');

Csrf::init();
$csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (!Csrf::verifyToken($csrfToken)) {
    http_response_code(403);
    echo json_encode(['error' => 'Invalid CSRF token']);
    exit;
}

try {
    if (!isset($_FILES['file'])) {
        throw new RuntimeException('No file uploaded');
    }
    $file = $_FILES['file'];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Upload error code: ' . $file['error']);
    }
    // size check (example: 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        throw new RuntimeException('File too large');
    }
    // allowed types
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'application/pdf' => 'pdf'];
    if (!array_key_exists($mime, $allowed)) {
        throw new RuntimeException('Invalid file type');
    }
    $ext = $allowed[$mime];
    $targetDir = __DIR__ . '/../../uploads';
    if (!is_dir($targetDir)) mkdir($targetDir, 0755, true);
    $filename = sprintf('%s.%s', bin2hex(random_bytes(8)), $ext);
    $destination = $targetDir . '/' . $filename;
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new RuntimeException('Failed to move uploaded file');
    }
    echo json_encode(['success' => true, 'file' => $filename]);
} catch (RuntimeException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
