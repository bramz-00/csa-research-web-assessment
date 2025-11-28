<?php

require_once __DIR__ . '/../config/Csrf.php';
use App\Csrf;

class FileUploadException extends RuntimeException
{
}

class FileUploader
{
    private const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    private const UPLOAD_DIR = '/var/www/uploads';

    private const ALLOWED_MIMES = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'application/pdf' => 'pdf',
    ];

    /**
     * Upload a file with full validation and security
     *
     * @param array $file $_FILES['file']
     * @param string|null $csrfToken Optional: pass token manually (for API use)
     * @return array Success response with file info
     * @throws FileUploadException on any error
     */
    public static function upload(array $file, ?string $csrfToken = null): array
    {
        // CSRF Protection (skip if token provided externally)
        if ($csrfToken === null) {
            Csrf::init();
            $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
            if (!Csrf::verifyToken($token)) {
                throw new FileUploadException('Invalid or missing CSRF token');
            }
        } else {
            if (!Csrf::verifyToken($csrfToken)) {
                throw new FileUploadException('Invalid CSRF token');
            }
        }

        // 1. Basic file presence
        if (!isset($file['error']) || $file['error'] === UPLOAD_ERR_NO_FILE) {
            throw new FileUploadException('No file was uploaded.');
        }

        // 2. Handle PHP upload errors with friendly messages
        $errors = [
            UPLOAD_ERR_INI_SIZE => 'File too large (exceeds server limit)',
            UPLOAD_ERR_FORM_SIZE => 'File too large (exceeds form limit)',
            UPLOAD_ERR_PARTIAL => 'File upload was interrupted',
            UPLOAD_ERR_NO_TMP_DIR => 'Server error: missing temp folder',
            UPLOAD_ERR_CANT_WRITE => 'Server error: cannot write file',
            UPLOAD_ERR_EXTENSION => 'Upload blocked by PHP extension',
        ];

        if (isset($errors[$file['error']])) {
            throw new FileUploadException($errors[$file['error']]);
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new FileUploadException('Upload failed with error code: ' . $file['error']);
        }

        // 3. Size validation
        if ($file['size'] > self::MAX_SIZE) {
            $sizeMB = round($file['size'] / (1024 * 1024), 2);
            throw new FileUploadException("File too large ({$sizeMB} MB). Max allowed: 5 MB");
        }

        // 4. MIME type detection (secure)
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $detectedMime = $finfo->file($file['tmp_name']);

        if (!isset(self::ALLOWED_MIMES[$detectedMime])) {
            throw new FileUploadException("Invalid file type: {$detectedMime}. Allowed: JPG, PNG, PDF");
        }

        $extension = self::ALLOWED_MIMES[$detectedMime];

        // 5. Secure filename
        $filename = bin2hex(random_bytes(16)) . '.' . $extension;
        $destination = self::UPLOAD_DIR . '/' . $filename;

        // Ensure upload directory exists
        if (!is_dir(self::UPLOAD_DIR)) {
            if (!mkdir(self::UPLOAD_DIR, 0755, true)) {
                throw new FileUploadException('Cannot create upload directory');
            }
        }

        // 6. Move file
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new FileUploadException('Failed to save uploaded file');
        }

        // Success!
        return [
            'success' => true,
            'message' => 'File uploaded successfully',
            'filename' => $filename,
            'size' => $file['size'],
            'type' => $detectedMime,
            'url' => '/uploads/' . $filename
        ];
    }
}