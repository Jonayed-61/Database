<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/db_connect.php';

echo "Connecting to database: " . $db . " on " . $host . "\n";
echo "Current directory: " . getcwd() . "\n";
echo "Script directory: " . __DIR__ . "\n";

try {
    // 1. Ensure Prof. Elahi Mahi exists
    $faculty_email = 'mahi@university.edu';
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$faculty_email]);
    $faculty = $stmt->fetch();

    if (!$faculty) {
        $password = password_hash('password123', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO users (email, password, first_name, last_name, role, is_email_verified) VALUES (?, ?, ?, ?, 'faculty', 1)");
        $stmt->execute([$faculty_email, $password, 'Mu Fazle Elahi', 'Mahi']);
        $facultyId = $pdo->lastInsertId();
        echo "Created Faculty: Mu Fazle Elahi Mahi (ID: $facultyId)\n";
    } else {
        $facultyId = $faculty['id'];
        echo "Faculty already exists (ID: $facultyId)\n";
    }

    // 2. Create sample students
    $students = [
        ['email' => 'student1@example.com', 'first' => 'Aisha', 'last' => 'Karim'],
        ['email' => 'student2@example.com', 'first' => 'John', 'last' => 'Doe'],
        ['email' => 'student3@example.com', 'first' => 'Sarah', 'last' => 'J.'],
        ['email' => 'student4@example.com', 'first' => 'Rahim', 'last' => 'Uddin'],
        ['email' => 'student5@example.com', 'first' => 'Fatima', 'last' => 'Zara'],
        ['email' => 'student6@example.com', 'first' => 'Kevin', 'last' => 'Smith'],
        ['email' => 'student7@example.com', 'first' => 'Elena', 'last' => 'Gilbert'],
        ['email' => 'student8@example.com', 'first' => 'Tanvir', 'last' => 'Ahmed'],
        ['email' => 'ashfaqahsan40@gmail.com', 'first' => 'Ashfaq', 'last' => 'Ahsan'],
    ];

    $studentIds = [];
    foreach ($students as $s) {
        $stmt_check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt_check->execute([$s['email']]);
        $existing = $stmt_check->fetch();
        
        if ($existing) {
            $studentIds[] = $existing['id'];
        } else {
            $password = password_hash('password123', PASSWORD_BCRYPT);
            $stmt_insert = $pdo->prepare("INSERT INTO users (email, password, first_name, last_name, role, is_email_verified) VALUES (?, ?, ?, ?, 'student', 1)");
            $stmt_insert->execute([$s['email'], $password, $s['first'], $s['last']]);
            $studentIds[] = $pdo->lastInsertId();
        }
    }
    echo "Ensured " . count($studentIds) . " students exist.\n";

    // 3. Create courses for the professor
    $courses = [
        ['code' => 'CS-410', 'name' => 'Machine Learning', 'credits' => 3, 'category' => 'Computer Science', 'level' => 'Advanced'],
        ['code' => 'CS-401', 'name' => 'Advanced Algorithms', 'credits' => 3, 'category' => 'Computer Science', 'level' => 'Advanced'],
        ['code' => 'CS-305', 'name' => 'Database Systems', 'credits' => 3, 'category' => 'Computer Science', 'level' => 'Intermediate'],
    ];

    $courseIds = [];
    foreach ($courses as $c) {
        $stmt = $pdo->prepare("SELECT id FROM courses WHERE code = ?");
        $stmt->execute([$c['code']]);
        $existing = $stmt->fetch();

        if (!$existing) {
            $stmt = $pdo->prepare("INSERT INTO courses (code, name, credits, category, level, instructor_id) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$c['code'], $c['name'], $c['credits'], $c['category'], $c['level'], $facultyId]);
            $courseIds[] = $pdo->lastInsertId();
        } else {
            // Update instructor if already exists
            $stmt = $pdo->prepare("UPDATE courses SET instructor_id = ? WHERE id = ?");
            $stmt->execute([$facultyId, $existing['id']]);
            $courseIds[] = $existing['id'];
        }
    }
    echo "Ensured " . count($courseIds) . " courses exist for the faculty.\n";

    // 4. Enroll students in courses
    $semesters = ['Spring 2026', 'Fall 2025'];
    foreach ($courseIds as $cId) {
        // Shuffle students and pick a few for each course
        shuffle($studentIds);
        $count = rand(3, count($studentIds));
        for ($i = 0; $i < $count; $i++) {
            $sId = $studentIds[$i];
            $stmt = $pdo->prepare("INSERT IGNORE INTO enrollments (student_id, course_id, semester, status) VALUES (?, ?, ?, 'active')");
            $stmt->execute([$sId, $cId, $semesters[0]]);
        }
    }
    echo "Random enrollments created.\n";

    // 5. Add some attendance and grades
    $stmt = $pdo->query("SELECT id, student_id FROM enrollments");
    $enrollments = $stmt->fetchAll();
    foreach ($enrollments as $e) {
        // Add attendance for last 5 days
        for ($d = 0; $d < 5; $d++) {
            $date = date('Y-m-d', strtotime("-$d days"));
            $status = (rand(0, 10) > 1) ? 'present' : 'absent';
            $stmt = $pdo->prepare("INSERT IGNORE INTO attendance (enrollment_id, date, status) VALUES (?, ?, ?)");
            $stmt->execute([$e['id'], $date, $status]);
        }
        
        // Add a grade
        $grades = ['A', 'A-', 'B+', 'B', 'C'];
        $gradePoints = [4.0, 3.7, 3.3, 3.0, 2.0];
        $idx = rand(0, 4);
        $stmt = $pdo->prepare("INSERT IGNORE INTO grades (enrollment_id, grade, grade_point, assessment_type) VALUES (?, ?, ?, ?)");
        $stmt->execute([$e['id'], $grades[$idx], $gradePoints[$idx], 'Quiz 1']);
    }

    // 6. Add Fees
    foreach($studentIds as $sId) {
        $fees = [
            ['desc' => 'Tuition Fee - Spring 2026', 'amount' => 2800],
            ['desc' => 'Library Fee', 'amount' => 150],
            ['desc' => 'Lab Fee', 'amount' => 300]
        ];
        foreach($fees as $f) {
            $stmt = $pdo->prepare("INSERT IGNORE INTO fees (student_id, description, amount, due_date, status) VALUES (?, ?, ?, ?, 'pending')");
            $stmt->execute([$sId, $f['desc'], $f['amount'], date('Y-m-d', strtotime('+30 days'))]);
        }
    }
    echo "Fees seeded.\n";
    echo "Attendance and Grades seeded.\n";

    echo "\nSUCCESS: Database seeded with realistic data for Faculty ID: $facultyId\n";
    echo "Email: $faculty_email\n";
    echo "Password: password123\n";

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>
