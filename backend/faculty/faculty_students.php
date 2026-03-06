<?php
require_once __DIR__ . '/../core/db_connect.php';
require_once __DIR__ . '/../auth/auth_helper.php';

// Get authorization token
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';

if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit;
}

$token = $matches[1];
$facultyId = verifyToken($token);

if (!$facultyId) {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid token']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

try {
    if ($method === 'GET') {
        // Get all students in instructor's courses
        $courseId = $_GET['course_id'] ?? null;
        
        if ($courseId) {
            // Get students for specific course
            $stmt = $pdo->prepare("
                SELECT 
                    u.id,
                    u.first_name,
                    u.last_name,
                    u.email,
                    e.id as enrollment_id,
                    e.status,
                    (SELECT COUNT(*) FROM assignments WHERE enrollment_id = e.id) as submissions_count,
                    (SELECT AVG(faculty_rating) FROM assignments WHERE enrollment_id = e.id AND faculty_rating IS NOT NULL) as avg_rating
                FROM enrollments e
                JOIN users u ON e.student_id = u.id
                WHERE e.course_id = ? AND (SELECT instructor_id FROM courses WHERE id = ?) = ?
                ORDER BY u.last_name, u.first_name
            ");
            $stmt->execute([$courseId, $courseId, $facultyId]);
        } else {
            // Get all students in all instructor's courses
            $stmt = $pdo->prepare("
                SELECT 
                    u.id,
                    u.first_name,
                    u.last_name,
                    u.email,
                    c.name as course_name,
                    c.id as course_id,
                    e.id as enrollment_id,
                    e.status,
                    (SELECT COUNT(*) FROM assignments WHERE enrollment_id = e.id) as submissions_count,
                    (SELECT AVG(faculty_rating) FROM assignments WHERE enrollment_id = e.id AND faculty_rating IS NOT NULL) as avg_rating
                FROM enrollments e
                JOIN users u ON e.student_id = u.id
                JOIN courses c ON e.course_id = c.id
                WHERE c.instructor_id = ?
                ORDER BY c.name, u.last_name, u.first_name
            ");
            $stmt->execute([$facultyId]);
        }
        
        $students = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'students' => $students
        ]);

    } elseif ($method === 'POST') {
        // Faculty evaluates student submission
        $assignmentId = $data['assignment_id'] ?? null;
        $facultyRating = (int)($data['faculty_rating'] ?? 0); // 1-5 scale
        $feedback = $data['feedback'] ?? '';

        if (!$assignmentId) {
            http_response_code(400);
            echo json_encode(['message' => 'assignment_id is required']);
            exit;
        }

        // Verify faculty can evaluate this assignment (owns the course)
        $verify = $pdo->prepare("
            SELECT a.id FROM assignments a
            JOIN enrollments e ON a.enrollment_id = e.id
            JOIN courses c ON e.course_id = c.id
            WHERE a.id = ? AND c.instructor_id = ?
        ");
        $verify->execute([$assignmentId, $facultyId]);
        
        if (!$verify->fetch()) {
            http_response_code(403);
            echo json_encode(['message' => 'Not authorized to evaluate this assignment']);
            exit;
        }

        // Update assignment with faculty evaluation
        $stmt = $pdo->prepare("
            UPDATE assignments 
            SET faculty_rating = ?, faculty_feedback = ?, evaluated_at = GETDATE()
            WHERE id = ?
        ");
        $stmt->execute([$facultyRating, $feedback, $assignmentId]);

        echo json_encode([
            'success' => true,
            'message' => 'Student evaluated successfully'
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}
?>
