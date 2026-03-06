<?php
require_once __DIR__ . '/../core/db_connect.php';
require_once __DIR__ . '/../auth/auth_helper.php';

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
}

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit;
}

$token = $matches[1];
$userId = verifyToken($token);

if (!$userId) {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid or expired token']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['enrollment_id']) || !isset($data['grade']) || !isset($data['grade_point'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing required fields']);
    exit;
}

try {
    // 1. Verify this instructor actually teaches the course for this enrollment
    $stmt = $pdo->prepare("
        SELECT e.id 
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.id = ? AND c.instructor_id = ?
    ");
    $stmt->execute([$data['enrollment_id'], $userId]);
    if (!$stmt->fetch()) {
        http_response_code(403);
        echo json_encode(['message' => 'You do not have permission to grade this student']);
        exit;
    }

    // 2. Insert the grade
    $stmt = $pdo->prepare("
        INSERT INTO grades (enrollment_id, grade, grade_point, assessment_type) 
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['enrollment_id'],
        $data['grade'],
        $data['grade_point'],
        $data['assessment_type'] ?? 'Assignment'
    ]);

    echo json_encode(['message' => 'Grade recorded successfully']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to record grade: ' . $e->getMessage()]);
}
?>
