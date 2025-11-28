<?php

require_once '../../server/classes/FileUploader.php';

header('Content-Type: application/json');

try {
    if (!isset($_FILES['file'])) {
        throw new Exception('No file received');
    }

    $result = FileUploader::upload($_FILES['file']);
    echo json_encode($result);

} catch (FileUploadException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
    error_log('Upload failed: ' . $e->getMessage());
}