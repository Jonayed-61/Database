<?php
require_once 'backend/db_connect.php';

$email = 'ashfaqahsan40@gmail.com';
$stmt = $pdo->prepare("SELECT id, email, role, first_name, last_name FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo "USER NOT FOUND: $email\n";
    exit;
}

echo "USER FOUND: ID=" . $user['id'] . "\n";

$userId = $user['id'];

// Check enrollments
$stmt = $pdo->prepare("
    SELECT e.id, c.code, c.name, e.status
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = ?
");
$stmt->execute([$userId]);
$enrollments = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "ENROLLMENTS COUNT: " . count($enrollments) . "\n";

// Check grades
$stmt = $pdo->prepare("
    SELECT g.id, c.code, g.grade, g.grade_point, g.assessment_type
    FROM grades g
    JOIN enrollments e ON g.enrollment_id = e.id
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = ?
");
$stmt->execute([$userId]);
$grades = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "GRADES COUNT: " . count($grades) . "\n";
if (!empty($grades)) {
    echo "Latest Grade: " . $grades[0]['grade'] . " (" . $grades[0]['grade_point'] . ") for " . $grades[0]['code'] . "\n";
}

// Attendance
$stmt = $pdo->prepare("
    SELECT COUNT(*) as total
    FROM attendance a
    JOIN enrollments e ON a.enrollment_id = e.id
    WHERE e.student_id = ?
");
$stmt->execute([$userId]);
echo "ATTENDANCE RECORDS: " . $stmt->fetchColumn() . "\n";

?>
