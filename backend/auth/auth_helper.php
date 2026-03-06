<?php
require_once __DIR__ . '/../core/db_connect.php';

// JWT-like token simulation (Head.Payload.Sig)
function generateToken($userId) {
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode([
        'sub' => $userId,
        'user_id' => $userId,
        'iat' => time(),
        'exp' => time() + 3600
    ]));
    $signature = base64_encode('mock_signature');
    return "$header.$payload.$signature";
}

function verifyToken($token) {
    $parts = explode('.', $token);
    if (count($parts) < 2) return false;
    
    $payload = json_decode(base64_decode($parts[1]), true);
    if ($payload && isset($payload['exp']) && $payload['exp'] > time()) {
        return $payload['user_id'];
    }
    return false;
}
?>
