<?php
require_once 'db_connect.php';

try {
    $stmt = $pdo->query("SELECT @@VERSION as version");
    $row = $stmt->fetch();
    echo json_encode([
        'status' => 'success',
        'message' => 'Connected to MS SQL Server successfully!',
        'version' => $row['version']
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Connection failed: ' . $e->getMessage()
    ]);
}
?>
