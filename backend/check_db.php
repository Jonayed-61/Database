<?php
header("Content-Type: application/json");
require_once 'db_connect.php';

try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    $tableExists = $stmt->rowCount() > 0;
    
    $userCount = 0;
    if ($tableExists) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM users");
        $userCount = $stmt->fetchColumn();
    }
    
    echo json_encode([
        'status' => 'success',
        'database' => $db,
        'table_exists' => $tableExists,
        'user_count' => $userCount,
        'php_version' => phpversion()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
