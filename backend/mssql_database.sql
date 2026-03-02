-- Database: university_db
-- Use this script in SQL Server Management Studio (SSMS)

-- 1. Users Table
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
    profile_picture VARCHAR(255) DEFAULT NULL,
    is_email_verified BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- 2. Courses Table
CREATE TABLE courses (
    id INT IDENTITY(1,1) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    credits INT NOT NULL,
    category VARCHAR(100),
    level VARCHAR(20),
    instructor_id INT,
    CONSTRAINT FK_Courses_Users FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Enrollments Table
CREATE TABLE enrollments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    semester VARCHAR(50) NOT NULL,
    enrolled_at DATETIME2 DEFAULT GETDATE(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    CONSTRAINT FK_Enrollments_Students FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT FK_Enrollments_Courses FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT UC_Student_Course_Semester UNIQUE(student_id, course_id, semester)
);

-- 4. Grades Table
CREATE TABLE grades (
    id INT IDENTITY(1,1) PRIMARY KEY,
    enrollment_id INT NOT NULL,
    grade VARCHAR(5),
    grade_point DECIMAL(3, 2),
    assessment_type VARCHAR(50), 
    recorded_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Grades_Enrollments FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
);

-- 5. Attendance Table
CREATE TABLE attendance (
    id INT IDENTITY(1,1) PRIMARY KEY,
    enrollment_id INT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
    CONSTRAINT FK_Attendance_Enrollments FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    CONSTRAINT UC_Enrollment_Date UNIQUE(enrollment_id, date)
);

-- 6. Fees Table
CREATE TABLE fees (
    id INT IDENTITY(1,1) PRIMARY KEY,
    student_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
    CONSTRAINT FK_Fees_Users FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Payments Table
CREATE TABLE payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fee_id INT NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME2 DEFAULT GETDATE(),
    payment_method VARCHAR(50),
    CONSTRAINT FK_Payments_Fees FOREIGN KEY (fee_id) REFERENCES fees(id) ON DELETE CASCADE
);
