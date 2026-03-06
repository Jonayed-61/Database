<?php
require_once __DIR__ . '/../core/db_connect.php';
require_once __DIR__ . '/auth_helper.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid data']);
    exit;
}

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Debug logging
file_put_contents('debug_login.log', "Login attempt: Email: $email | Password: $password\n", FILE_APPEND);

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['message' => 'Email and password are required']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $token = generateToken($user['id']);
        
        echo json_encode([
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'role' => $user['role'],
                'isEmailVerified' => (bool)$user['is_email_verified'],
                'createdAt' => $user['created_at'],
                'updatedAt' => $user['updated_at']
            ],
            'tokens' => [
                'accessToken' => $token,
                'refreshToken' => $token, // Simplified for now
                'expiresIn' => 3600
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid email or password']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Login failed: ' . $e->getMessage()]);
}
?>
