<?php
require_once 'db_connect.php';

try {
    // Update course 1 to be taught by test.faculty (id 7)
    $stmt = $pdo->prepare("UPDATE courses SET instructor_id = 7 WHERE id = 1");
    $stmt->execute();

    // Verify the update
    $verifyStmt = $pdo->prepare("SELECT id, name, code, instructor_id FROM courses WHERE id = 1");
    $verifyStmt->execute();
    $course = $verifyStmt->fetch();

    echo json_encode([
        'success' => true,
        'message' => 'Course 1 now assigned to test.faculty (id 7)',
        'updated_course' => $course
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
