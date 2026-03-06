<?php
/**
 * University Database Management System - API Router
 * 
 * This is the main entry point for the backend API.
 * It routes incoming requests to the appropriate handler based on the URL path.
 * 
 * Base URL: http://localhost:5000
 * All endpoints return JSON responses.
 */

// Enable CORS for all requests
header("Access-Control-Allow-Origin: *"); // Allow all origins for testing purposes
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the request URI and method
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove leading/trailing slashes and get the route
$route = strtolower(trim($requestUri, '/'));

// If route is empty (root request), handle separately
if (empty($route)) {
    $controller = '';
} else {
    // Split the route into segments
    $segments = explode('/', $route);
    $controller = $segments[0] ?? '';
    $action = $segments[1] ?? '';
    $id = $segments[2] ?? '';
}

// Route the request accordingly
try {
    // Authentication Routes
    if ($controller === 'auth') {
        if ($action === 'login' && $requestMethod === 'POST') {
            require_once 'auth/login.php';
        } elseif ($controller === 'auth' && $action === 'register' && $requestMethod === 'POST') {
            require_once __DIR__ . '/auth/register.php';
        }
    }
    // User Routes
    elseif ($controller === 'users') {
        if ($action === 'me' && $requestMethod === 'GET') {
            require_once 'users/me.php';
        } elseif ($action === 'all' && $requestMethod === 'GET') {
            require_once 'users/get_all_users.php';
        } elseif ($action === 'list' && $requestMethod === 'GET') {
            require_once 'users/list_users.php';
        } elseif ($action === 'get' && $requestMethod === 'GET') {
            require_once 'users/get_users.php';
        }
    }
    // Student Routes
    elseif ($controller === 'student') {
        if ($action === 'courses' && $requestMethod === 'GET') {
            require_once 'student/get_student_courses.php';
        } elseif ($action === 'grades' && $requestMethod === 'GET') {
            require_once 'student/get_student_grades.php';
        } elseif ($action === 'attendance' && $requestMethod === 'GET') {
            require_once 'student/get_student_attendance.php';
        } elseif ($action === 'fees' && $requestMethod === 'GET') {
            require_once 'student/get_student_fees.php';
        } elseif ($action === 'deadlines' && $requestMethod === 'GET') {
            require_once 'student/get_student_deadlines.php';
        } elseif ($action === 'progress' && in_array($requestMethod, ['GET', 'POST'])) {
            require_once 'student/student_progress.php';
        } elseif ($action === 'overview' && $requestMethod === 'GET') {
            require_once 'student/get_student_overview.php';
        } elseif ($action === 'stats' && $requestMethod === 'GET') {
            require_once 'student/student_stats.php';
        }
    }
    // Faculty Routes
    elseif ($controller === 'faculty') {
        if ($action === 'students' && in_array($requestMethod, ['GET', 'POST'])) {
            require_once 'faculty/faculty_students.php';
        } elseif ($action === 'stats' && $requestMethod === 'GET') {
            require_once 'faculty/faculty_stats.php';
        } elseif ($action === 'login-activity' && $requestMethod === 'GET') {
            require_once 'faculty/faculty_login_activity.php';
        } elseif ($action === 'courses-students' && $requestMethod === 'GET') {
            require_once 'faculty/students_by_faculty.php';
        }
    }
    // Grades Routes
    elseif ($controller === 'grades') {
        if ($action === 'add' && $requestMethod === 'POST') {
            require_once 'grades/add_grade.php';
        } elseif ($action === 'login-record' && $requestMethod === 'POST') {
            require_once 'grades/record_login.php';
        }
    }
    // Records Routes
    elseif ($controller === 'records') {
        if ($action === 'all' && $requestMethod === 'GET') {
            require_once 'records/records.php';
        }
    }
    // Health Check Route
    elseif ($controller === 'health' && $requestMethod === 'GET') {
        http_response_code(200);
        echo json_encode([
            'status' => 'ok',
            'message' => 'API is running',
            'timestamp' => date('c'),
            'version' => '1.0.0'
        ]);
    }
    // Root Route
    elseif (empty($controller)) {
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'University Database Management System API',
            'version' => '1.0.0',
            'docs' => 'See BACKEND_API.md for documentation',
            'baseUrl' => 'http://localhost:5000',
            'endpoints' => [
                'Auth' => [
                    'POST /auth/login',
                    'POST /auth/register'
                ],
                'Users' => [
                    'GET /users/me',
                    'GET /users/all',
                    'GET /users/list',
                    'GET /users/get',
                    'POST /users/add-demo'
                ],
                'Student' => [
                    'GET /student/courses',
                    'GET /student/grades',
                    'GET /student/attendance',
                    'GET /student/fees',
                    'GET /student/deadlines',
                    'GET /student/progress',
                    'POST /student/progress',
                    'GET /student/overview'
                ],
                'Faculty' => [
                    'GET /faculty/students',
                    'POST /faculty/students',
                    'GET /faculty/stats',
                    'GET /faculty/login-activity'
                ],
                'Grades' => [
                    'POST /grades/add',
                    'POST /grades/login-record'
                ],
                'Records' => [
                    'GET /records/all'
                ]
            ]
        ]);
    } else {
        // Route not found
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Route not found',
            'path' => $route,
            'method' => $requestMethod
        ]);
    }
} catch (Exception $e) {
    // Handle any unexpected errors
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
