<?php
require_once 'db_connect.php';

try {
    // Get recent login history
    $stmt = $pdo->prepare("
        SELECT TOP 10 
            lh.id,
            lh.user_id,
            u.email,
            u.first_name,
            u.last_name,
            u.role,
            lh.login_at,
            lh.ip_address
        FROM login_history lh
        JOIN users u ON lh.user_id = u.id
        ORDER BY lh.login_at DESC
    ");
    $stmt->execute();
    $logins = $stmt->fetchAll();

    // Get count
    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM login_history");
    $countStmt->execute();
    $count = $countStmt->fetch();

    echo json_encode([
        'success' => true,
        'total_logins' => $count['total'],
        'recent_logins' => $logins
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
