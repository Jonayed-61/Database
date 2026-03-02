<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/db_connect.php';

echo "Database: $db\n";
echo "Host: $host\n";

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute(['student1@example.com']);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($u) {
        echo "FOUND student1@example.com:\n";
        echo "ID: {$u['id']} | Role: {$u['role']} | Name: {$u['first_name']} {$u['last_name']}\n";
    } else {
        echo "student1@example.com NOT FOUND in database!\n";
    }

    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    echo "Total Users: " . $stmt->fetchColumn() . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>
