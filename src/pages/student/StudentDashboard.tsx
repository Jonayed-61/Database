import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  category: string;
  level: string;
  prerequisites?: string[];
}

type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

type ScheduleState = Record<DayKey, Course[]>;

const DAYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const STUDENT = {
  name: 'Aisha Karim',
  program: 'BSc Computer Science',
  photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
};

const QUICK_STATS = [
  { label: 'GPA', value: '3.72', change: '+0.08', trend: 'up' },
  { label: 'Credits', value: '96', change: '+12', trend: 'up' },
  { label: 'Attendance', value: '92%', change: '-1%', trend: 'down' },
];

const GPA_PROGRESS = [{ name: 'GPA', value: 3.72, fill: '#f59e0b' }];

const SEMESTER_COURSES = [
  { code: 'CS-401', title: 'Advanced Algorithms', instructor: 'Dr. Rana' },
  { code: 'CS-410', title: 'Machine Learning', instructor: 'Dr. Qureshi' },
  { code: 'CS-430', title: 'Distributed Systems', instructor: 'Prof. Samir' },
  { code: 'CS-440', title: 'Capstone Project', instructor: 'Prof. Ali' },
];

const DEADLINES = [
  { date: 'Feb 20', title: 'ML Assignment 2', type: 'Assignment' },
  { date: 'Feb 22', title: 'Algorithms Quiz', type: 'Quiz' },
  { date: 'Feb 27', title: 'Capstone Proposal', type: 'Project' },
  { date: 'Mar 03', title: 'Distributed Systems Lab', type: 'Lab' },
];

const RECENT_GRADES = [
  { subject: 'Algorithms', grade: 'A-', trend: 'up' },
  { subject: 'ML', grade: 'B+', trend: 'up' },
  { subject: 'Distributed Systems', grade: 'A', trend: 'steady' },
  { subject: 'Capstone', grade: 'B', trend: 'down' },
];

const ATTENDANCE_OVERVIEW = [
  { name: 'Mon', value: 90 },
  { name: 'Tue', value: 95 },
  { name: 'Wed', value: 88 },
  { name: 'Thu', value: 93 },
  { name: 'Fri', value: 92 },
];

const COURSE_CATALOG: Course[] = [
  {
    id: 'cs-451',
    code: 'CS-451',
    name: 'Cloud Computing',
    credits: 3,
    category: 'Core',
    level: '400',
    prerequisites: ['CS-330'],
  },
  {
    id: 'cs-455',
    code: 'CS-455',
    name: 'Cybersecurity',
    credits: 3,
    category: 'Core',
    level: '400',
    prerequisites: ['CS-210'],
  },
  {
    id: 'cs-460',
    code: 'CS-460',
    name: 'Data Visualization',
    credits: 2,
    category: 'Elective',
    level: '400',
  },
  {
    id: 'cs-470',
    code: 'CS-470',
    name: 'Mobile Development',
    credits: 3,
    category: 'Elective',
    level: '400',
    prerequisites: ['CS-220'],
  },
  {
    id: 'cs-480',
    code: 'CS-480',
    name: 'Natural Language Processing',
    credits: 3,
    category: 'Elective',
    level: '400',
    prerequisites: ['CS-310'],
  },
];

const INITIAL_SCHEDULE: ScheduleState = {
  Mon: [COURSE_CATALOG[0]],
  Tue: [COURSE_CATALOG[1]],
  Wed: [],
  Thu: [COURSE_CATALOG[2]],
  Fri: [],
};

const GRADE_SEMESTERS = [
  { term: 'Fall 2024', gpa: 3.68, credits: 15 },
  { term: 'Spring 2025', gpa: 3.75, credits: 16 },
  { term: 'Fall 2025', gpa: 3.72, credits: 15 },
];

const RADAR_DATA = [
  { subject: 'Algorithms', score: 92 },
  { subject: 'ML', score: 88 },
  { subject: 'Systems', score: 90 },
  { subject: 'Capstone', score: 84 },
  { subject: 'Electives', score: 86 },
];

const GPA_TREND = [
  { term: 'F24', value: 3.68 },
  { term: 'S25', value: 3.75 },
  { term: 'F25', value: 3.72 },
];

const GRADE_DISTRIBUTION = [
  { grade: 'A', current: 5, previous: 4 },
  { grade: 'B', current: 3, previous: 4 },
  { grade: 'C', current: 1, previous: 2 },
  { grade: 'D', current: 0, previous: 1 },
];

const ATTENDANCE_CALENDAR = Array.from({ length: 28 }, (_, index) => {
  const status = index % 7 === 0 ? 'absent' : index % 5 === 0 ? 'late' : 'present';
  return { day: index + 1, status };
});

const ATTENDANCE_MONTHLY = [
  { month: 'Sep', value: 94 },
  { month: 'Oct', value: 91 },
  { month: 'Nov', value: 93 },
  { month: 'Dec', value: 89 },
  { month: 'Jan', value: 92 },
];

const FEE_STRUCTURE = [
  { label: 'Tuition', amount: 2800 },
  { label: 'Lab', amount: 350 },
  { label: 'Library', amount: 120 },
  { label: 'Technology', amount: 180 },
];

const PAYMENT_HISTORY = [
  { id: 'PMT-001', date: 'Jan 05', amount: 1200, method: 'Card', status: 'Paid' },
  { id: 'PMT-002', date: 'Feb 05', amount: 900, method: 'Bank', status: 'Paid' },
  { id: 'PMT-003', date: 'Mar 05', amount: 500, method: 'Card', status: 'Pending' },
];

const COURSE_COLORS = ['#2563eb', '#f59e0b', '#22c55e', '#ef4444', '#a855f7'];

const PolarAngleAxisTyped = PolarAngleAxis as unknown as React.FC<{ dataKey?: string }>;

const StatCard: React.FC<{ label: string; value: string; change: string; trend: string }> = ({
  label,
  value,
  change,
  trend,
}) => (
  <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-lg">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <div className="mt-2 flex items-end justify-between">
      <span className="text-3xl font-bold text-navy-900 dark:text-white">{value}</span>
      <span
        className={`text-sm font-semibold ${
          trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
        }`}
      >
        {change}
      </span>
    </div>
  </div>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-navy-900 dark:text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const ScheduleCourseCard: React.FC<{ course: Course; colorIndex: number }> = ({
  course,
  colorIndex,
}) => (
  <div className="rounded-xl p-3 text-white" style={{ background: COURSE_COLORS[colorIndex % COURSE_COLORS.length] }}>
    <p className="text-sm font-semibold">{course.code}</p>
    <p className="text-xs opacity-90">{course.name}</p>
    <p className="text-xs opacity-80">{course.credits} credits</p>
  </div>
);

const DraggableCourse: React.FC<{ course: Course }> = ({ course }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: course.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`rounded-xl border border-gray-200 dark:border-navy-700 p-3 bg-gray-50 dark:bg-navy-700 cursor-grab ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-navy-900 dark:text-white">{course.code}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{course.name}</p>
        </div>
        <span className="text-xs font-semibold text-primary-600">{course.credits}cr</span>
      </div>
      <div className="mt-2 flex gap-2">
        <span className="text-[10px] px-2 py-1 rounded-full bg-primary-100 text-primary-700">
          {course.category}
        </span>
        <span className="text-[10px] px-2 py-1 rounded-full bg-gold-100 text-gold-700">
          {course.level}
        </span>
      </div>
    </div>
  );
};

const DroppableColumn: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({
  id,
  title,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border border-dashed p-3 min-h-[140px] ${
        isOver ? 'border-primary-500 bg-primary-50/40' : 'border-gray-200 dark:border-navy-700'
      }`}
    >
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [catalogCourses, setCatalogCourses] = useState<Course[]>(COURSE_CATALOG);
  const [schedule, setSchedule] = useState<ScheduleState>(INITIAL_SCHEDULE);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const filteredCatalog = useMemo(() => {
    return catalogCourses.filter((course) => {
      const matchesSearch = `${course.code} ${course.name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [catalogCourses, searchTerm, selectedCategory, selectedLevel]);

  const totalCredits = useMemo(() => {
    return Object.values(schedule)
      .flat()
      .reduce((sum, course) => sum + course.credits, 0);
  }, [schedule]);

  const findContainer = (courseId: string) => {
    if (catalogCourses.some((course) => course.id === courseId)) {
      return 'catalog';
    }

    const day = DAYS.find((dayKey) => schedule[dayKey].some((course) => course.id === courseId));
    return day || null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveCourseId(null);
      return;
    }

    const sourceContainer = findContainer(active.id as string);
    const targetContainer = over.id as string;

    if (!sourceContainer || sourceContainer === targetContainer) {
      setActiveCourseId(null);
      return;
    }

    const moveCourse = (courseId: string, from: string, to: string) => {
      let movedCourse: Course | null = null;

      if (from === 'catalog') {
        setCatalogCourses((prev) => {
          const next = prev.filter((course) => {
            if (course.id === courseId) {
              movedCourse = course;
              return false;
            }
            return true;
          });
          return next;
        });
      } else {
        setSchedule((prev) => {
          const updated = { ...prev };
          updated[from as DayKey] = prev[from as DayKey].filter((course) => {
            if (course.id === courseId) {
              movedCourse = course;
              return false;
            }
            return true;
          });
          return updated;
        });
      }

      if (!movedCourse) return;

      if (to === 'catalog') {
        setCatalogCourses((prev) => [movedCourse as Course, ...prev]);
      } else if (DAYS.includes(to as DayKey)) {
        setSchedule((prev) => ({
          ...prev,
          [to as DayKey]: [...prev[to as DayKey], movedCourse as Course],
        }));
      }
    };

    moveCourse(active.id as string, sourceContainer, targetContainer);
    setActiveCourseId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCourseId(event.active.id as string);
  };

  const activeCourse = useMemo(() => {
    return (
      catalogCourses.find((course) => course.id === activeCourseId) ||
      Object.values(schedule)
        .flat()
        .find((course) => course.id === activeCourseId) ||
      null
    );
  }, [activeCourseId, catalogCourses, schedule]);

  const missingPrereqs = useMemo(() => {
    const completed = ['CS-210', 'CS-220', 'CS-330'];
    return Object.values(schedule)
      .flat()
      .flatMap((course) => course.prerequisites || [])
      .filter((prereq, index, self) => self.indexOf(prereq) === index)
      .filter((prereq) => !completed.includes(prereq));
  }, [schedule]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-100 dark:bg-navy-900 text-navy-900 dark:text-white"
    >
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`bg-white dark:bg-navy-800 border-r border-gray-200 dark:border-navy-700 min-h-screen transition-all duration-300 ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              {!isSidebarCollapsed && (
                <span className="text-lg font-bold">Student Hub</span>
              )}
            </div>
            <button
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="text-gray-400 hover:text-primary-600"
            >
              {isSidebarCollapsed ? '»' : '«'}
            </button>
          </div>

          <nav className="px-4 space-y-2">
            {[
              'Overview',
              'Registration',
              'Grades',
              'Attendance',
              'Fees',
              'Support',
            ].map((item) => (
              <button
                key={item}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-primary-50 hover:text-primary-600"
              >
                <span className="text-lg">•</span>
                {!isSidebarCollapsed && item}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          {/* Header */}
          <header className="flex items-center justify-between px-8 py-6 bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
            <div className="flex items-center gap-4">
              <img
                src={STUDENT.photo}
                alt="Student"
                className="w-12 h-12 rounded-full border-2 border-primary-500"
              />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
                <h1 className="text-2xl font-bold">{STUDENT.name}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{STUDENT.program}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-3 rounded-xl bg-gray-100 dark:bg-navy-700">
                🔔
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-3 rounded-xl bg-gray-100 dark:bg-navy-700">⚙️</button>
            </div>
          </header>

          <main className="p-8 space-y-10">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {QUICK_STATS.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            {/* Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SectionCard title="GPA Progress">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="70%"
                      outerRadius="100%"
                      data={GPA_PROGRESS}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-3xl font-bold text-gold-500">3.72</p>
                <p className="text-center text-sm text-gray-500">Target: 4.0</p>
              </SectionCard>

              <SectionCard title="Current Semester Courses">
                <div className="space-y-3">
                  {SEMESTER_COURSES.map((course) => (
                    <div
                      key={course.code}
                      className="flex items-center justify-between bg-gray-50 dark:bg-navy-700 p-3 rounded-xl"
                    >
                      <div>
                        <p className="font-semibold text-sm">{course.title}</p>
                        <p className="text-xs text-gray-500">{course.code} • {course.instructor}</p>
                      </div>
                      <span className="text-xs font-semibold text-primary-600">Active</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Upcoming Deadlines">
                <div className="space-y-3">
                  {DEADLINES.map((deadline) => (
                    <div key={deadline.title} className="flex items-start gap-3">
                      <div className="text-sm font-semibold text-primary-600">{deadline.date}</div>
                      <div>
                        <p className="text-sm font-semibold">{deadline.title}</p>
                        <p className="text-xs text-gray-500">{deadline.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard title="Recent Grades">
                <div className="space-y-3">
                  {RECENT_GRADES.map((grade) => (
                    <div
                      key={grade.subject}
                      className="flex items-center justify-between bg-gray-50 dark:bg-navy-700 p-3 rounded-xl"
                    >
                      <div>
                        <p className="font-semibold text-sm">{grade.subject}</p>
                        <p className="text-xs text-gray-500">Recent assessment</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{grade.grade}</span>
                        <span
                          className={`text-xs ${
                            grade.trend === 'up'
                              ? 'text-green-500'
                              : grade.trend === 'down'
                              ? 'text-red-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {grade.trend === 'up' ? '▲' : grade.trend === 'down' ? '▼' : '•'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Attendance Summary">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ATTENDANCE_OVERVIEW}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>
            </div>

            {/* Course Registration */}
            <SectionCard title="Course Registration">
              <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.4fr] gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search courses"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-700"
                    />
                    <select
                      value={selectedCategory}
                      onChange={(event) => setSelectedCategory(event.target.value)}
                      className="px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-700"
                    >
                      <option>All</option>
                      <option>Core</option>
                      <option>Elective</option>
                    </select>
                    <select
                      value={selectedLevel}
                      onChange={(event) => setSelectedLevel(event.target.value)}
                      className="px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-700"
                    >
                      <option>All</option>
                      <option>400</option>
                      <option>300</option>
                    </select>
                  </div>

                  <DroppableColumn id="catalog" title="Course Catalog">
                    {filteredCatalog.map((course) => (
                      <DraggableCourse key={course.id} course={course} />
                    ))}
                  </DroppableColumn>

                  <div className="rounded-xl bg-gray-50 dark:bg-navy-700 p-4">
                    <p className="text-sm font-semibold">Credit Hour Calculator</p>
                    <p className="text-2xl font-bold mt-2">{totalCredits} credits</p>
                    <p className="text-xs text-gray-500">Recommended: 15 credits</p>
                  </div>

                  <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 p-4">
                    <p className="text-sm font-semibold text-yellow-700">Prerequisite Checker</p>
                    {missingPrereqs.length === 0 ? (
                      <p className="text-xs text-gray-600 mt-1">All prerequisites satisfied.</p>
                    ) : (
                      <ul className="text-xs text-yellow-700 mt-2 list-disc list-inside">
                        {missingPrereqs.map((item) => (
                          <li key={item}>{item} not completed</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {DAYS.map((dayKey, index) => (
                        <DroppableColumn key={dayKey} id={dayKey} title={dayKey}>
                          {schedule[dayKey].map((course) => (
                            <ScheduleCourseCard key={course.id} course={course} colorIndex={index} />
                          ))}
                        </DroppableColumn>
                      ))}
                    </div>

                    <DragOverlay>
                      {activeCourse ? (
                        <div className="rounded-xl p-3 bg-primary-600 text-white shadow-lg">
                          <p className="text-sm font-semibold">{activeCourse.code}</p>
                          <p className="text-xs opacity-90">{activeCourse.name}</p>
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>

                  <div className="rounded-xl bg-gray-50 dark:bg-navy-700 p-4">
                    <p className="text-sm font-semibold">Waitlist Management</p>
                    <div className="mt-2 space-y-2">
                      {['CS-495 AI Ethics', 'CS-499 Special Topics'].map((item, index) => (
                        <div key={item} className="flex items-center justify-between text-sm">
                          <span>{item}</span>
                          <span className="text-xs text-gray-500">#{index + 2}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setShowConfirmation(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold"
                  >
                    Confirm Registration
                  </motion.button>

                  {showConfirmation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-green-50 dark:bg-green-900/20 p-4 text-green-700"
                    >
                      🎉 Registration confirmed! Your schedule is updated.
                    </motion.div>
                  )}
                </div>
              </div>
            </SectionCard>

            {/* Grade Viewer */}
            <SectionCard title="Grade Viewer">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  {GRADE_SEMESTERS.map((term) => (
                    <div key={term.term} className="rounded-xl bg-gray-50 dark:bg-navy-700 p-4">
                      <p className="text-sm text-gray-500">{term.term}</p>
                      <p className="text-2xl font-bold">GPA {term.gpa}</p>
                      <p className="text-xs text-gray-500">{term.credits} credits</p>
                    </div>
                  ))}
                  <button className="w-full py-3 rounded-xl border border-primary-500 text-primary-600 font-semibold">
                    Download Transcript
                  </button>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid />
                      <PolarAngleAxisTyped dataKey="subject" />
                      <PolarRadiusAxis />
                      <Radar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={GPA_TREND}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="term" />
                      <YAxis domain={[3.0, 4.0]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={GRADE_DISTRIBUTION}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="current" fill="#2563eb" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="previous" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-xl bg-gray-50 dark:bg-navy-700 p-4">
                  <p className="text-sm font-semibold">Grade Calculation Breakdown</p>
                  <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Assignments</span>
                      <span>40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quizzes</span>
                      <span>20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Midterm</span>
                      <span>15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Final Exam</span>
                      <span>25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Attendance Tracker */}
            <SectionCard title="Attendance Tracker">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-semibold mb-3">Attendance Calendar</p>
                  <div className="grid grid-cols-7 gap-2">
                    {ATTENDANCE_CALENDAR.map((day) => (
                      <div
                        key={day.day}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold ${
                          day.status === 'present'
                            ? 'bg-green-100 text-green-700'
                            : day.status === 'late'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {day.day}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3">Subject-wise Attendance</p>
                  <div className="space-y-3">
                    {['Algorithms', 'ML', 'Systems', 'Capstone'].map((subject) => (
                      <div key={subject}>
                        <div className="flex justify-between text-xs">
                          <span>{subject}</span>
                          <span>90%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                          <div className="h-2 bg-primary-500 rounded-full" style={{ width: '90%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3">Monthly Attendance</p>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ATTENDANCE_MONTHLY}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4">
                  <p className="text-sm font-semibold text-red-700">Low Attendance Alerts</p>
                  <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                    <li>Capstone Project (78%)</li>
                    <li>Distributed Systems (82%)</li>
                  </ul>
                </div>

                <div className="rounded-xl bg-gray-50 dark:bg-navy-700 p-4">
                  <p className="text-sm font-semibold">Leave Application</p>
                  <div className="mt-3 space-y-3">
                    <input
                      placeholder="Reason"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800"
                    />
                    <input
                      type="date"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800"
                    />
                    <button className="w-full py-2 rounded-lg bg-primary-600 text-white font-semibold">
                      Submit Leave Request
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Fee Management */}
            <SectionCard title="Fee Management">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="rounded-xl bg-gray-50 dark:bg-navy-700 p-4">
                    <p className="text-sm font-semibold">Due Amount</p>
                    <p className="text-3xl font-bold mt-2">$1,200</p>
                    <p className="text-xs text-red-500">Due by Mar 10</p>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold">
                    Pay Now
                  </button>
                  <button className="w-full py-3 rounded-xl border border-primary-500 text-primary-600 font-semibold">
                    Download Receipt
                  </button>
                </div>

                <div className="rounded-xl bg-gray-50 dark:bg-navy-700 p-4">
                  <p className="text-sm font-semibold mb-3">Fee Structure</p>
                  <div className="space-y-2">
                    {FEE_STRUCTURE.map((item) => (
                      <div key={item.label} className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span>${item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 dark:bg-navy-700 p-4">
                  <p className="text-sm font-semibold mb-3">Installment Plan</p>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="installment" defaultChecked />
                      3-month plan
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="installment" />
                      6-month plan
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="installment" />
                      Custom plan
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2">Payment ID</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PAYMENT_HISTORY.map((payment) => (
                      <tr key={payment.id} className="border-t border-gray-200 dark:border-navy-700">
                        <td className="py-3">{payment.id}</td>
                        <td>{payment.date}</td>
                        <td>${payment.amount}</td>
                        <td>{payment.method}</td>
                        <td>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              payment.status === 'Paid'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </main>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
