<?php
namespace App;

require_once '../config/Database.php';
require_once __DIR__ . '/../classes/User.php';
require_once '../config/Csrf.php';

class UserController
{

    public static function create($input)
    {
        // Validation
        if (empty($input['name']) || empty($input['email']) || empty($input['password'])) {
            http_response_code(422);
            return ['error' => 'Missing fields'];
        }

        if (User::findByEmail($input['email'])) {
            http_response_code(409);
            return ['error' => 'Email already exists'];
        }

        $user = new User($input['name'], $input['email'], $input['password']);
        $user->save();
        return ['success' => true, 'message' => 'User created successfully'];
    }

    public static function listAll()
    {
        return User::getAllUsers();
    }

    public static function get($id)
    {
        return User::findById($id);
    }

    public static function recentActive($limit = 50)
    {
        return User::getRecentActive($limit);
    }

    public static function update($id, $data)
    {
        return User::update($id, $data);
    }

    public static function delete($id)
    {
        return User::delete($id);
    }

    public static function login(string $email, string $password): ?array
    {
        $user = User::findByEmail($email);

        // User not found or wrong password
        if (!$user || !password_verify($password, $user['password'])) {
            return null; // Do NOT reveal which one is wrong (security)
        }

        unset($user['password']);
        return $user;
    }
}
