<?php
require_once 'db_connect.php';

try {
    // Get all courses
    $stmt = $pdo->prepare("SELECT id, name, code, instructor_id FROM courses");
    $stmt->execute();
    $courses = $stmt->fetchAll();

    // Get course 1 details
    $courseStmt = $pdo->prepare("SELECT c.*, u.email, u.first_name, u.last_name FROM courses c LEFT JOIN users u ON c.instructor_id = u.id WHERE c.id = 1");
    $courseStmt->execute();
    $course1 = $courseStmt->fetch();

    echo json_encode([
        'success' => true,
        'all_courses' => $courses,
        'course_1_details' => $course1
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
