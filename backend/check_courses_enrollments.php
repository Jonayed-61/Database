<?php
require_once 'db_connect.php';

try {
    // Get courses taught by test faculty
    $stmt = $pdo->prepare("SELECT * FROM courses WHERE instructor_id = 7");
    $stmt->execute();
    $courses = $stmt->fetchAll();

    // Get enrollments
    $enrollStmt = $pdo->prepare("SELECT * FROM enrollments");
    $enrollStmt->execute();
    $enrollments = $enrollStmt->fetchAll();

    echo json_encode([
        'success' => true,
        'courses' => $courses,
        'enrollments' => $enrollments
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
