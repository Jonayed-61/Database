<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'MAHI\SQLEXPRESS'; // Updated from your screenshot
$db   = 'university_db';

// For Windows Authentication, we don't provide Uid/Pwd in the PDO constructor
// The driver will use the current Windows user (MAHI\User)
$dsn = "sqlsrv:Server=$host;Database=$db;Encrypt=true;TrustServerCertificate=true";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
     // Passing null for user and pass triggers Windows Authentication
     $pdo = new PDO($dsn, null, null, $options);
} catch (\PDOException $e) {
     http_response_code(500);
     echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
     exit;
}
?>
