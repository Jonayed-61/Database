<?php
require_once 'db_connect.php';
$stmt = $pdo->query('SELECT COUNT(*) FROM users');
$count = $stmt->fetchColumn();
echo "Total Users: $count\n\n";

$stmt = $pdo->query('SELECT email, role, first_name, last_name FROM users');
echo "Current Users in Database:\n";
while($row = $stmt->fetch()) {
    echo "- " . $row['email'] . " (Role: " . $row['role'] . ", Name: " . $row['first_name'] . " " . $row['last_name'] . ")\n";
}
?>
