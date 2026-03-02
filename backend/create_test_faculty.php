<?php
require_once 'db_connect.php';

$testEmail = 'test.faculty@university.edu';
$testPassword = 'Test@654321';
$hashedPassword = password_hash($testPassword, PASSWORD_BCRYPT);

try {
    // Check if user already exists
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$testEmail]);
    
    if ($checkStmt->rowCount() > 0) {
        // Update existing user
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
        $stmt->execute([$hashedPassword, $testEmail]);
        echo json_encode([
            'success' => true,
            'action' => 'updated',
            'message' => 'Test faculty user password updated',
            'credentials' => [
                'email' => $testEmail,
                'password' => $testPassword,
                'role' => 'faculty'
            ]
        ], JSON_PRETTY_PRINT);
    } else {
        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (email, password, first_name, last_name, role, is_email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, GETDATE(), GETDATE())");
        $stmt->execute([$testEmail, $hashedPassword, 'Test', 'Faculty', 'faculty', 1]);
        
        echo json_encode([
            'success' => true,
            'action' => 'created',
            'message' => 'Test faculty user created successfully',
            'credentials' => [
                'email' => $testEmail,
                'password' => $testPassword,
                'role' => 'faculty'
            ]
        ], JSON_PRETTY_PRINT);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>
