<?php
namespace App;

require_once  '../config/Database.php';
require_once __DIR__ . '/../classes/User.php';
require_once  '../config/Csrf.php';

class UserController
{

    public static function create($input)
    {
        // basic validation
        if (empty($input['name']) || empty($input['email']) || empty($input['password'])) {
            http_response_code(422);
            return ['error' => 'Missing fields'];
        }

        // check if email exists
        if (User::findByEmail($input['email'])) {
            http_response_code(409);
            return ['error' => 'Email already exists'];
        }

        $user = new User($input['name'], $input['email'], $input['password']);
        $id = $user->save();
        return ['success' => true, 'id' => $id];
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

    public static function login($email, $password)
    {
        $row = User::findByEmail($email);
        if (!$row)
            return null;
        if (!password_verify($password, $row['password']))
            return null;
        unset($row['password']);
        return $row;
    }
}
