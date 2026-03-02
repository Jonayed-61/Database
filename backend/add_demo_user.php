<?php
require_once 'db_connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Only POST method is allowed"]);
    exit;
}

try {
    // Basic mock user data for the demo
    $firstName = "Demo";
    $lastName = "Student_" . rand(100, 999);
    $email = strtolower($firstName . "." . $lastName . "@university.edu");
    $password = password_hash("demo123", PASSWORD_DEFAULT);
    $role = "student";

    // Insert into MS SQL Server securely
    $sql = "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$firstName, $lastName, $email, $password, $role]);

    echo json_encode([
        "status" => "success",
        "message" => "Demo user $firstName $lastName added successfully!"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to add user: " . $e->getMessage()
    ]);
}
?>
