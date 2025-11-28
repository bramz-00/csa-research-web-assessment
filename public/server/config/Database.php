<?php
namespace App;

class Database {
    private static $pdo = null;

    public static function getConnection() {
        if (self::$pdo === null) {
            $host = getenv('DB_HOST') ?: 'db';
            $db = getenv('DB_NAME') ?: 'assessment_db';
            $user = getenv('DB_USER') ?: 'appuser';
            $pass = getenv('DB_PASS') ?: 'apppassword';
            $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
            $options = [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_EMULATE_PREPARES => false,
            ];
            self::$pdo = new \PDO($dsn, $user, $pass, $options);
        }
        return self::$pdo;
    }
}
