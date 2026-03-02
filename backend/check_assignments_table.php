<?php
require_once 'db_connect.php';

try {
    // Check if assignments table exists
    $stmt = $pdo->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='assignments'");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (empty($columns)) {
        // Create assignments table
        $createTable = "
            CREATE TABLE assignments (
                id INT PRIMARY KEY IDENTITY(1,1),
                enrollment_id INT NOT NULL,
                title NVARCHAR(255) NOT NULL,
                submission_text NVARCHAR(MAX),
                self_rating INT,
                faculty_rating INT,
                faculty_feedback NVARCHAR(MAX),
                submitted_at DATETIME DEFAULT GETDATE(),
                evaluated_at DATETIME,
                FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
            )
        ";
        $pdo->exec($createTable);
        echo json_encode([
            'success' => true,
            'message' => 'assignments table created',
            'columns' => ['id', 'enrollment_id', 'title', 'submission_text', 'self_rating', 'faculty_rating', 'faculty_feedback', 'submitted_at', 'evaluated_at']
        ], JSON_PRETTY_PRINT);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'assignments table exists',
            'columns' => $columns
        ], JSON_PRETTY_PRINT);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>
