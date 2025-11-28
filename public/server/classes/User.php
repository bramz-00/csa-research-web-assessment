<?php
namespace App;

require_once    '../config/Database.php';

class User
{
    private $id;
    private $name;
    private $email;
    private $password; 
    private $is_active;

    public function __construct($name, $email, $password = null, $is_active = 1)
    {
        $this->name = $name;
        $this->email = $email;
        if ($password !== null)
            $this->setPassword($password);
        $this->is_active = $is_active;
    }

    // getters
    public function getName()
    {
        return $this->name;
    }
    public function getEmail()
    {
        return $this->email;
    }
    public function getId()
    {
        return $this->id;
    }
    public function isActive()
    {
        return $this->is_active;
    }

    public function setPassword($password)
    {
        $this->password = password_hash($password, PASSWORD_DEFAULT);
    }

    // persist user
    public function save()
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, is_active) VALUES (?, ?, ?, ?)");
        $stmt->execute([$this->name, $this->email, $this->password, $this->is_active]);
        $this->id = $pdo->lastInsertId();
        return $this->id;
    }

    // static: get all users
    public static function getAllUsers()
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT id, name, email, is_active, created_at FROM users");
        return $stmt->fetchAll();
    }

    // static: find by email
    public static function findByEmail($email)
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    // static: find by id
    public static function findById($id)
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id, name, email, is_active, created_at FROM users WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    // static: get 50 most recent active users (optimized)
    public static function getRecentActive($limit = 50)
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id, name, email, created_at FROM users WHERE is_active = 1 ORDER BY created_at DESC LIMIT ?");
        $stmt->bindValue(1, (int) $limit, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // update & delete helpers (simple)
    public static function update($id, $data)
    {
        $pdo = Database::getConnection();
        $fields = [];
        $params = [];
        foreach ($data as $k => $v) {
            if ($k === 'password') {
                $v = password_hash($v, PASSWORD_DEFAULT);
            }
            $fields[] = "$k = ?";
            $params[] = $v;
        }
        $params[] = $id;
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute($params);
    }

    public static function delete($id)
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
