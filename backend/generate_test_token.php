<?php
require_once 'db_connect.php';
require_once 'auth_helper.php';

try {
    // Generate test token for faculty user
    $facultyId = 7; // test.faculty@university.edu
    $token = generateToken($facultyId);
    
    echo json_encode([
        'success' => true,
        'message' => 'Test token generated for faculty',
        'user_id' => $facultyId,
        'token' => $token
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
