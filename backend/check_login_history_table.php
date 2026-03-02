<?php
require_once 'db_connect.php';

try {
    // Check if login_history table exists
    $stmt = $pdo->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='login_history'");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (empty($columns)) {
        // Create login_history table
        $createTable = "
            CREATE TABLE login_history (
                id INT PRIMARY KEY IDENTITY(1,1),
                user_id INT NOT NULL,
                login_at DATETIME DEFAULT GETDATE(),
                logout_at DATETIME,
                ip_address NVARCHAR(45),
                user_agent NVARCHAR(MAX),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ";
        $pdo->exec($createTable);
        
        echo json_encode([
            'success' => true,
            'message' => 'login_history table created successfully',
            'columns' => ['id', 'user_id', 'login_at', 'logout_at', 'ip_address', 'user_agent']
        ], JSON_PRETTY_PRINT);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'login_history table already exists',
            'columns' => $columns
        ], JSON_PRETTY_PRINT);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>
