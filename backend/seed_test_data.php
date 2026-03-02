<?php
require_once 'db_connect.php';

$studentUserId = 6; // Your test.student@university.edu

try {
    // Create sample course
    $stmt = $pdo->prepare("INSERT INTO courses (code, name, credits, category, level, instructor_id) 
                          SELECT 'CS101', 'Data Structures', 3, 'Core', 'Upper', 1
                          WHERE NOT EXISTS (SELECT 1 FROM courses WHERE code = 'CS101')");
    $stmt->execute();

    // Create enrollment
    $stmt = $pdo->prepare("INSERT INTO enrollments (student_id, course_id, status, semester)
                          SELECT ?, (SELECT id FROM courses WHERE code = 'CS101'), 'active', 'Spring 2026'
                          WHERE NOT EXISTS (SELECT 1 FROM enrollments WHERE student_id = ? AND course_id = (SELECT id FROM courses WHERE code = 'CS101'))");
    $stmt->execute([$studentUserId, $studentUserId]);

    // Get the enrollment ID
    $stmt = $pdo->prepare("SELECT id FROM enrollments WHERE student_id = ? AND course_id = (SELECT id FROM courses WHERE code = 'CS101')");
    $stmt->execute([$studentUserId]);
    $enrollment = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$enrollment) {
        throw new PDOException("Could not create enrollment");
    }
    
    $enrollmentId = $enrollment['id'];

    // Add grades
    $stmt = $pdo->prepare("INSERT INTO grades (enrollment_id, grade, grade_point, recorded_at)
                          SELECT ?, 'A', 4.0, GETDATE()
                          WHERE NOT EXISTS (SELECT 1 FROM grades WHERE enrollment_id = ?)");
    $stmt->execute([$enrollmentId, $enrollmentId]);

    // Add attendance records (last few days)
    for ($i = 5; $i >= 0; $i--) {
        $date = date('Y-m-d', strtotime("-$i days"));
        $status = $i % 2 == 0 ? 'present' : 'absent';
        
        $stmt = $pdo->prepare("INSERT INTO attendance (enrollment_id, date, status)
                              SELECT ?, CAST(? AS DATE), ?
                              WHERE NOT EXISTS (SELECT 1 FROM attendance WHERE enrollment_id = ? AND CAST(date AS DATE) = CAST(? AS DATE))");
        $stmt->execute([$enrollmentId, $date, $status, $enrollmentId, $date]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Sample data created for student',
        'student_id' => $studentUserId,
        'enrollment_id' => $enrollmentId,
        'details' => [
            'course' => 'Data Structures (CS101)',
            'status' => 'active',
            'grades_added' => true,
            'attendance_records' => 6
        ]
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>
