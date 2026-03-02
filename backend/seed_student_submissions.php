<?php
require_once 'db_connect.php';

$studentId = 6; // test.student@university.edu

try {
    // Get their enrollment
    $stmt = $pdo->prepare("SELECT TOP 1 id FROM enrollments WHERE student_id = ?");
    $stmt->execute([$studentId]);
    $enrollment = $stmt->fetch();
    $enrollmentId = $enrollment['id'];

    // Add sample submissions
    $submissions = [
        [
            'title' => 'Lab 1: Arrays and Lists',
            'text' => 'Completed all exercises. Implemented sorting algorithms and debugged insertion logic.',
            'self_rating' => 4
        ],
        [
            'title' => 'Assignment 1: Problem Solving',
            'text' => 'Solved 8 out of 10 problems. Had difficulty with dynamic programming but learned a lot.',
            'self_rating' => 3
        ],
        [
            'title' => 'Midterm Review Submission',
            'text' => 'Reviewed all course materials and completed practice problems. Ready for exam.',
            'self_rating' => 5
        ]
    ];

    foreach ($submissions as $sub) {
        $stmt = $pdo->prepare("
            INSERT INTO assignments (enrollment_id, title, submission_text, self_rating, submitted_at)
            VALUES (?, ?, ?, ?, GETDATE())
        ");
        $stmt->execute([$enrollmentId, $sub['title'], $sub['text'], $sub['self_rating']]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Sample submissions created',
        'enrollment_id' => $enrollmentId,
        'submissions_count' => count($submissions)
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>
