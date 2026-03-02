<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/db_connect.php';

$email = 'student1@example.com';
$password = 'password123';

$stmt = $pdo->prepare("SELECT password FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user) {
    if (password_verify($password, $user['password'])) {
        echo "VERIFY SUCCESS!\n";
    } else {
        echo "VERIFY FAILED!\n";
        echo "Input Password: $password\n";
        echo "Stored Hash: " . $user['password'] . "\n";
    }
} else {
    echo "User not found.\n";
}
?>
