import { useState, useEffect, useRef } from "react";
const MOCK_COURSES = [
  { id: 1, title: "Complete Python Bootcamp", description: "Go from zero to hero in Python. Learn variables, functions, OOP, file I/O, and build 5 real projects.", category: "Programming", level: "Beginner", lessonCount: 42, enrolledCount: 3241, instructorName: "Dr. Sarah Chen", emoji: "🐍", coverColor: "linear-gradient(135deg,#3b82f6,#1d4ed8)", rating: 4.9 },
  { id: 2, title: "UI/UX Design Masterclass", description: "Learn Figma from scratch, design systems, user research, and ship beautiful products people love.", category: "Design", level: "Intermediate", lessonCount: 38, enrolledCount: 2187, instructorName: "Marco Vitelli", emoji: "🎨", coverColor: "linear-gradient(135deg,#ec4899,#9333ea)", rating: 4.8 },
  { id: 3, title: "Data Science with Pandas", description: "Master data wrangling, visualization, and machine learning pipelines using Python's most powerful library.", category: "Data Science", level: "Intermediate", lessonCount: 55, enrolledCount: 1890, instructorName: "Prof. Aiko Tanaka", emoji: "📊", coverColor: "linear-gradient(135deg,#10b981,#059669)", rating: 4.7 },
  { id: 4, title: "React & Next.js Complete Guide", description: "Build full-stack web apps with React hooks, context, server components, and deploy to production.", category: "Programming", level: "Advanced", lessonCount: 61, enrolledCount: 4102, instructorName: "James O'Brien", emoji: "⚛️", coverColor: "linear-gradient(135deg,#06b6d4,#0284c7)", rating: 5.0 },
  { id: 5, title: "Digital Marketing Fundamentals", description: "SEO, social media strategy, paid ads, email funnels — everything you need to grow any business online.", category: "Marketing", level: "Beginner", lessonCount: 29, enrolledCount: 1560, instructorName: "Priya Nair", emoji: "📱", coverColor: "linear-gradient(135deg,#f59e0b,#d97706)", rating: 4.6 },
  { id: 6, title: "Music Theory for Producers", description: "Understand scales, chords, rhythm, and harmony so you can write and produce music that moves people.", category: "Music", level: "Beginner", lessonCount: 33, enrolledCount: 987, instructorName: "Leon Baptiste", emoji: "🎵", coverColor: "linear-gradient(135deg,#8b5cf6,#7c3aed)", rating: 4.8 },
];

const CATEGORIES = ["All", "Programming", "Design", "Business", "Marketing", "Data Science", "Music"];

const STATS = [
  { num: "48K+", label: "Active Students", icon: "👩‍🎓" },
  { num: "1.2K+", label: "Expert Instructors", icon: "🏫" },
  { num: "12K+", label: "Courses Available", icon: "📚" },
  { num: "94%", label: "Completion Rate", icon: "🏆" },
];

const TESTIMONIALS = [
  { name: "Aisha Patel", role: "Frontend Dev @ Stripe", text: "LearnHub completely changed my career. I went from marketing to frontend in 8 months using courses here.", avatar: "A", color: "#6C63FF" },
  { name: "Tom Eriksson", role: "Data Analyst @ Spotify", text: "The Data Science courses are genuinely world-class. Better than anything I found on other platforms.", avatar: "T", color: "#10b981" },
  { name: "Nina Okonkwo", role: "UX Lead @ Figma", text: "Marco's Design Masterclass is the reason I got my job. The projects in the course built my whole portfolio.", avatar: "N", color: "#ec4899" },
];

// ─── MOCK LESSONS (seed data per course) ─────────────────────────────────────
const SEED_LESSONS = {
  1: [
    { id: 101, title: "Introduction & Environment Setup", content: "In this lesson we install Python 3.12, set up VS Code with the Python extension, and run our first script. We'll cover the REPL, print statements, and basic variable assignment.", orderNumber: 1, duration: "12 min" },
    { id: 102, title: "Variables, Data Types & Operators", content: "Python's built-in types: int, float, str, bool, and None. Learn arithmetic, comparison, and logical operators. We'll also cover type conversion and f-strings for clean string formatting.", orderNumber: 2, duration: "18 min" },
    { id: 103, title: "Control Flow: if / elif / else", content: "Writing conditional logic in Python. Understand truthy/falsy values, nested conditions, and the ternary expression. Build a grade calculator as a hands-on project.", orderNumber: 3, duration: "15 min" },
    { id: 104, title: "Loops: for & while", content: "Iterating with for loops over lists, ranges, and strings. while loops with break and continue. We'll build a number-guessing game to practice iteration.", orderNumber: 4, duration: "20 min" },
    { id: 105, title: "Functions & Scope", content: "Defining reusable functions with def, positional vs keyword arguments, default values, *args and **kwargs. Understand local vs global scope and closures.", orderNumber: 5, duration: "22 min" },
  ],
  4: [
    { id: 401, title: "React Fundamentals Review", content: "A fast recap of JSX, components, props, and state. We'll refactor a class component to hooks and understand why the React team made the switch.", orderNumber: 1, duration: "16 min" },
    { id: 402, title: "useState & useEffect Deep Dive", content: "Understanding the rules of hooks. Dependency arrays, cleanup functions, and common pitfalls. We'll build a live search input with debounce to see it in action.", orderNumber: 2, duration: "24 min" },
    { id: 403, title: "Context API & useReducer", content: "Lifting state out of prop-drilling hell. Create a global theme and auth context. useReducer for complex state machines — we'll implement a shopping cart.", orderNumber: 3, duration: "28 min" },
    { id: 404, title: "Next.js 14 App Router", content: "File-based routing with the new App Router, Server vs Client Components, layouts, loading.tsx, and error.tsx. Deploy your first Next.js app to Vercel.", orderNumber: 4, duration: "32 min" },
  ],
};

// ─── MOCK AUTH ────────────────────────────────────────────────────────────────
const mockAuth = {
  getUser: () => { try { return JSON.parse(localStorage.getItem("lh_user")); } catch { return null; } },
  login: (email, password, role) => {
    const user = { id: 1, name: email.split("@")[0], email, role: role || "STUDENT" };
    localStorage.setItem("lh_user", JSON.stringify(user));
    localStorage.setItem("lh_token", "mock_jwt_token");
    return user;
  },
  register: (name, email, password, role) => {
    const user = { id: 1, name, email, role };
    localStorage.setItem("lh_user", JSON.stringify(user));
    localStorage.setItem("lh_token", "mock_jwt_token");
    return user;
  },
  logout: () => { localStorage.removeItem("lh_user"); localStorage.removeItem("lh_token"); },
  isAuth: () => !!localStorage.getItem("lh_token"),
};

// ─── ROUTER (hash-based) ──────────────────────────────────────────────────────
function useRoute() {
  const [path, setPath] = useState(window.location.hash.slice(1) || "/");
  useEffect(() => {
    const handler = () => setPath(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = (to) => { window.location.hash = to; };
  return { path, navigate };
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const { path, navigate } = useRoute();
  const [user, setUser] = useState(mockAuth.getUser());
  const [enrolledIds, setEnrolledIds] = useState([1, 4]);
  const [enrollProgress, setEnrollProgress] = useState({ 1: "IN_PROGRESS", 4: "NOT_STARTED" });
  // courseLessons: { [courseId]: Lesson[] }
  const [courseLessons, setCourseLessons] = useState(SEED_LESSONS);

  const login = (email, password, role) => { const u = mockAuth.login(email, password, role); setUser(u); };
  const register = (name, email, password, role) => { const u = mockAuth.register(name, email, password, role); setUser(u); };
  const logout = () => { mockAuth.logout(); setUser(null); navigate("/"); };

  const enroll = (id) => {
    setEnrolledIds(prev => prev.includes(id) ? prev : [...prev, id]);
    setEnrollProgress(prev => ({ ...prev, [id]: "NOT_STARTED" }));
  };
  const updateProgress = (id, status) => setEnrollProgress(prev => ({ ...prev, [id]: status }));

  const addLesson = (courseId, lesson) => {
    setCourseLessons(prev => {
      const existing = prev[courseId] || [];
      const newLesson = { ...lesson, id: Date.now(), orderNumber: existing.length + 1 };
      return { ...prev, [courseId]: [...existing, newLesson].sort((a, b) => a.orderNumber - b.orderNumber) };
    });
  };

  const courseId = path.startsWith("/enroll/") ? Number(path.split("/")[2]) : null;
  const lessonCourseId = path.startsWith("/instructor/course/") ? Number(path.split("/")[3]) : null;
  const viewCourseId = path.startsWith("/learn/") ? Number(path.split("/")[2]) : null;

  const enrolledCourses = MOCK_COURSES.filter(c => enrolledIds.includes(c.id)).map(c => ({
    ...c, progressStatus: enrollProgress[c.id] || "NOT_STARTED",
    lessons: courseLessons[c.id] || [],
  }));

  return (
    <div style={{ fontFamily: "'Sora', 'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#f8f9fe" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; }
        a { text-decoration: none; }
        input, textarea, select, button { font-family: inherit; }
        input:focus, textarea:focus, select:focus { border-color: #6C63FF !important; box-shadow: 0 0 0 3px rgba(108,99,255,0.12) !important; outline: none; }
        .hover-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(108,99,255,0.14) !important; }
        .hover-lift:hover { transform: translateY(-2px); }
        .nav-link:hover { color: #6C63FF !important; }
        .btn-primary:hover { opacity: 0.92; transform: translateY(-1px); }
        .btn-outline:hover { background: #f0efff !important; color: #6C63FF !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.6; } }
        @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .float { animation: float 4s ease-in-out infinite; }
        .shimmer { background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f5f9; } ::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 3px; }
      `}</style>

      <Navbar user={user} onLogout={logout} navigate={navigate} path={path} />

      <main>
        {path === "/" && <HomePage navigate={navigate} />}
        {path === "/courses" && <CourseListPage navigate={navigate} enrolledIds={enrolledIds} />}
        {path === "/about" && <AboutPage navigate={navigate} />}
        {path === "/pricing" && <PricingPage navigate={navigate} />}
        {path === "/login" && <LoginPage onLogin={login} navigate={navigate} user={user} />}
        {path === "/register" && <RegisterPage onRegister={register} navigate={navigate} user={user} />}
        {path === "/my-courses" && <MyCoursesPage user={user} courses={enrolledCourses} onUpdateProgress={updateProgress} navigate={navigate} />}
        {path === "/instructor/dashboard" && <InstructorDashboard user={user} courses={MOCK_COURSES.slice(0,3)} courseLessons={courseLessons} navigate={navigate} />}
        {path === "/instructor/create-course" && <CreateCoursePage navigate={navigate} />}
        {path === "/admin/courses" && <AdminCoursesPage courses={MOCK_COURSES} navigate={navigate} />}
        {courseId && <EnrollmentPage courseId={courseId} user={user} onEnroll={enroll} enrolled={enrolledIds.includes(courseId)} navigate={navigate} />}
        {lessonCourseId && <AddLessonPage courseId={lessonCourseId} lessons={courseLessons[lessonCourseId] || []} onAddLesson={addLesson} navigate={navigate} />}
        {viewCourseId && <LessonViewerPage courseId={viewCourseId} course={enrolledCourses.find(c => c.id === viewCourseId)} navigate={navigate} onUpdateProgress={updateProgress} />}
      </main>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ user, onLogout, navigate, path }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isHome = path === "/";
  const navBg = scrolled || !isHome ? "#fff" : "transparent";
  const navBorder = scrolled || !isHome ? "1px solid #e8ecf4" : "1px solid transparent";
  const textColor = !scrolled && isHome ? "#fff" : "#1a1a2e";
  const logoColor = !scrolled && isHome ? "#fff" : "#1a1a2e";

  const go = (p) => { navigate(p); setMenuOpen(false); setDropOpen(false); };

  const roleRoute = user?.role === "INSTRUCTOR" ? "/instructor/dashboard"
    : user?.role === "ADMIN" ? "/admin/courses"
    : "/my-courses";

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999, background: navBg, borderBottom: navBorder, backdropFilter: scrolled || !isHome ? "blur(12px)" : "none", transition: "all 0.3s ease" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", height: 68, display: "flex", alignItems: "center", gap: 0 }}>
        {/* Logo */}
        <button onClick={() => go("/")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6C63FF,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 16L10 4L16 16H4Z" fill="white" opacity="0.9" />
              <circle cx="10" cy="11" r="3" fill="#FFD166" />
            </svg>
          </div>
          <span style={{ fontSize: 19, fontWeight: 800, color: logoColor, letterSpacing: "-0.5px", transition: "color 0.3s" }}>LearnHub</span>
        </button>

        {/* Center nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 40, flex: 1 }}>
          {[["Courses", "/courses"], ["About", "/about"], ["Pricing", "/pricing"]].map(([label, href]) => (
            <button key={label} onClick={() => go(href)} className="nav-link"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: path === href ? "#6C63FF" : textColor, transition: "color 0.2s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!user ? (
            <>
              <button onClick={() => go("/login")} className="btn-outline"
                style={{ padding: "9px 20px", borderRadius: 9, border: `1.5px solid ${!scrolled && isHome ? "rgba(255,255,255,0.4)" : "#e2e8f0"}`, background: "transparent", color: textColor, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                Sign In
              </button>
              <button onClick={() => go("/register")} className="btn-primary"
                style={{ padding: "9px 20px", borderRadius: 9, background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(108,99,255,0.3)" }}>
                Get Started
              </button>
            </>
          ) : (
            <div style={{ position: "relative" }}>
              <button onClick={() => setDropOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: `1.5px solid ${!scrolled && isHome ? "rgba(255,255,255,0.3)" : "#e2e8f0"}`, borderRadius: 40, padding: "6px 14px 6px 6px", cursor: "pointer" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: textColor }}>{user.name}</span>
                <span style={{ color: textColor, fontSize: 11 }}>▾</span>
              </button>
              {dropOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid #e8ecf4", borderRadius: 14, padding: "8px", minWidth: 200, boxShadow: "0 16px 40px rgba(0,0,0,0.12)", zIndex: 100 }}>
                  <div style={{ padding: "10px 14px 12px", borderBottom: "1px solid #f0f4f8", marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: "#a0aec0" }}>{user.role}</div>
                  </div>
                  {[["📊 Dashboard", roleRoute], ["📚 My Courses", "/my-courses"], ["⚙️ Settings", "#"]].map(([label, href]) => (
                    <button key={label} onClick={() => go(href)}
                      style={{ display: "block", width: "100%", padding: "10px 14px", background: "none", border: "none", textAlign: "left", fontSize: 14, color: "#4a5568", cursor: "pointer", borderRadius: 8, fontWeight: 500 }}
                      onMouseEnter={e => e.target.style.background = "#f7f8fc"}
                      onMouseLeave={e => e.target.style.background = "none"}>
                      {label}
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid #f0f4f8", marginTop: 4, paddingTop: 4 }}>
                    <button onClick={() => { onLogout(); setDropOpen(false); }}
                      style={{ display: "block", width: "100%", padding: "10px 14px", background: "none", border: "none", textAlign: "left", fontSize: 14, color: "#e53e3e", cursor: "pointer", borderRadius: 8, fontWeight: 600 }}
                      onMouseEnter={e => e.target.style.background = "#fff5f5"}
                      onMouseLeave={e => e.target.style.background = "none"}>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ navigate }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? MOCK_COURSES : MOCK_COURSES.filter(c => c.category === activeCategory);

  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0f0c29 0%,#1a1048 40%,#24243e 100%)", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 68 }}>
        {/* BG blobs */}
        <div style={{ position: "absolute", top: "10%", right: "8%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(108,99,255,0.25) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "5%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,209,102,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />
        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <div key={i} style={{ position: "absolute", width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, borderRadius: "50%", background: "rgba(255,255,255,0.4)", top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `pulse ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`, pointerEvents: "none" }} />
        ))}

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 28px", width: "100%", display: "flex", alignItems: "center", gap: 60 }}>
          <div style={{ flex: 1, maxWidth: 640 }} className="fade-up">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(108,99,255,0.2)", border: "1px solid rgba(108,99,255,0.4)", borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6C63FF", display: "inline-block" }} />
              <span style={{ color: "#a5b4fc", fontSize: 13, fontWeight: 600 }}>Trusted by 48,000+ learners worldwide</span>
            </div>
            <h1 style={{ fontSize: "clamp(40px,5vw,68px)", fontWeight: 800, color: "#fff", lineHeight: 1.12, marginBottom: 24, letterSpacing: "-2px" }}>
              Learn Without<br />
              <span style={{ background: "linear-gradient(135deg,#6C63FF,#a78bfa,#FFD166)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Limits.</span>
            </h1>
            <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.8, marginBottom: 40, maxWidth: 520 }}>
              World-class courses taught by industry experts. Learn at your own pace, build real skills, and launch your next career chapter.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={() => navigate("/courses")} className="btn-primary"
                style={{ padding: "16px 36px", borderRadius: 12, background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(108,99,255,0.4)", transition: "all 0.2s" }}>
                Explore Courses →
              </button>
              <button onClick={() => navigate("/register")}
                style={{ padding: "16px 36px", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)", fontSize: 16, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.2s" }}>
                Start Free Today
              </button>
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 48, flexWrap: "wrap" }}>
              {[["48K+", "Students"], ["12K+", "Courses"], ["4.9★", "Average Rating"]].map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{val}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual — Life-change journey */}
          <div style={{ flex: "0 0 440px", display: "flex", flexDirection: "column", gap: 0 }}>

            {/* Section label */}
            <div style={{ color: "#475569", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>Real people. Real results.</div>

            {/* Story 1 */}
            <div style={{ display: "flex", gap: 0, alignItems: "stretch", marginBottom: 0 }}>
              {/* Timeline line + dot */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 36, flexShrink: 0 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#6C63FF", border: "3px solid rgba(108,99,255,0.3)", boxShadow: "0 0 0 4px rgba(108,99,255,0.12)", flexShrink: 0, marginTop: 4 }} />
                <div style={{ width: 2, flex: 1, background: "linear-gradient(to bottom,#6C63FF44,#10b98144)", marginTop: 4 }} />
              </div>
              <div style={{ flex: 1, paddingBottom: 28, paddingLeft: 4 }}>
                <div style={{ fontSize: 11, color: "#6C63FF", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Before LearnHub</div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#334155,#1e293b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>😓</div>
                  <div>
                    <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>Aisha, 27 — Marketing exec</div>
                    <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>"Stuck in a job I didn't love. No idea how to break into tech."</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Story 2 — During */}
            <div style={{ display: "flex", gap: 0, alignItems: "stretch", marginBottom: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 36, flexShrink: 0 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#f59e0b", border: "3px solid rgba(245,158,11,0.3)", boxShadow: "0 0 0 4px rgba(245,158,11,0.12)", flexShrink: 0, marginTop: 4 }} />
                <div style={{ width: 2, flex: 1, background: "linear-gradient(to bottom,#10b98144,#22c55e44)", marginTop: 4 }} />
              </div>
              <div style={{ flex: 1, paddingBottom: 28, paddingLeft: 4 }}>
                <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>8 months of learning</div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#78350f,#451a03)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📚</div>
                  <div>
                    <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>30 min a day, every day</div>
                    <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>React, JavaScript, CSS. Built 4 real projects. Shipped her first PR.</div>
                    {/* Mini progress */}
                    <div style={{ marginTop: 10, display: "flex", gap: 4 }}>
                      {[100,100,100,100,100,100,100,78].map((w,i) => (
                        <div key={i} style={{ height: 4, flex: 1, borderRadius: 100, background: w === 100 ? "#6C63FF" : "#6C63FF55" }} />
                      ))}
                    </div>
                    <div style={{ color: "#6C63FF", fontSize: 11, marginTop: 4, fontWeight: 600 }}>7 of 8 courses completed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Story 3 — After */}
            <div style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 36, flexShrink: 0 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#10b981)", border: "3px solid rgba(34,197,94,0.3)", boxShadow: "0 0 0 6px rgba(34,197,94,0.1)", flexShrink: 0, marginTop: 4 }} />
              </div>
              <div style={{ flex: 1, paddingLeft: 4 }}>
                <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Today ✦</div>
                <div style={{ background: "linear-gradient(135deg,rgba(34,197,94,0.08),rgba(16,185,129,0.05))", border: "1.5px solid rgba(34,197,94,0.2)", borderRadius: 18, padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#22c55e,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🚀</div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Frontend Dev @ Stripe</div>
                    <div style={{ color: "#86efac", fontSize: 13, lineHeight: 1.6 }}>"LearnHub didn't just teach me to code — it changed the entire direction of my life."</div>
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6C63FF,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 12 }}>A</div>
                      <span style={{ color: "#64748b", fontSize: 12 }}>Aisha Patel · joined 2024</span>
                      <span style={{ marginLeft: "auto", color: "#FFD166", fontSize: 13 }}>★★★★★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Others like her */}
            <div style={{ marginTop: 24, paddingLeft: 40 }}>
              <div style={{ color: "#475569", fontSize: 12, marginBottom: 12 }}>Others who made the switch →</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { init: "T", color: "#10b981", name: "Tom", from: "Barista", to: "Data Analyst" },
                  { init: "N", color: "#ec4899", name: "Nina", from: "Teacher", to: "UX Lead" },
                  { init: "J", color: "#f59e0b", name: "James", from: "Accountant", to: "iOS Dev" },
                ].map(p => (
                  <div key={p.init} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: p.color, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>{p.init}</div>
                    <div style={{ color: "#94a3b8", fontSize: 10, lineHeight: 1.4 }}>
                      <span style={{ textDecoration: "line-through", opacity: 0.5 }}>{p.from}</span><br />
                      <span style={{ color: p.color, fontWeight: 700 }}>{p.to}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: "#fff", borderBottom: "1px solid #e8ecf4", padding: "0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", display: "flex", flexWrap: "wrap" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ flex: "1 1 200px", padding: "36px 24px", display: "flex", alignItems: "center", gap: 16, borderRight: i < STATS.length - 1 ? "1px solid #f0f4f8" : "none" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#f0efff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.5px" }}>{s.num}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section style={{ padding: "100px 28px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 100, background: "#f0efff", color: "#6C63FF", fontSize: 13, fontWeight: 700, marginBottom: 16, letterSpacing: 0.5 }}>FEATURED COURSES</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16 }}>Top picks for you</h2>
          <p style={{ color: "#94a3b8", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>Hand-picked courses from our most-loved instructors, updated for 2026.</p>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ padding: "9px 22px", borderRadius: 100, border: `1.5px solid ${activeCategory === cat ? "#6C63FF" : "#e2e8f0"}`, background: activeCategory === cat ? "#6C63FF" : "#fff", color: activeCategory === cat ? "#fff" : "#718096", fontSize: 14, fontWeight: activeCategory === cat ? 700 : 500, cursor: "pointer", transition: "all 0.2s" }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 24 }}>
          {filtered.map(course => <HomeCourseCard key={course.id} course={course} navigate={navigate} />)}
        </div>

        <div style={{ textAlign: "center", marginTop: 52 }}>
          <button onClick={() => navigate("/courses")} className="btn-outline"
            style={{ padding: "14px 40px", borderRadius: 12, border: "2px solid #e2e8f0", background: "#fff", color: "#1a1a2e", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
            View All 12,000+ Courses →
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "linear-gradient(160deg,#0f0c29,#1a1048)", padding: "100px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 100, background: "rgba(108,99,255,0.2)", color: "#a5b4fc", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>Three steps to mastery</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {[
              { step: "01", icon: "🔍", title: "Find Your Course", desc: "Browse thousands of expert-led courses. Filter by topic, level, or instructor to find your perfect match." },
              { step: "02", icon: "🎯", title: "Learn at Your Pace", desc: "Watch lessons anytime, anywhere. Track your progress and pick up exactly where you left off." },
              { step: "03", icon: "🏆", title: "Earn & Grow", desc: "Complete courses, earn certificates, and unlock new career opportunities with verified credentials." },
            ].map((item) => (
              <div key={item.step} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 32px" }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>{item.icon}</div>
                <div style={{ fontSize: 12, color: "#6C63FF", fontWeight: 800, letterSpacing: 2, marginBottom: 10 }}>STEP {item.step}</div>
                <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 14 }}>{item.title}</h3>
                <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 28px", background: "#f8f9fe" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 100, background: "#f0efff", color: "#6C63FF", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>TESTIMONIALS</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-1px" }}>Loved by thousands</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #f0f4f8" }}>
                <div style={{ fontSize: 28, color: "#e2e8f0", marginBottom: 16, fontFamily: "Georgia", lineHeight: 1 }}>"</div>
                <p style={{ fontSize: 15, color: "#4a5568", lineHeight: 1.8, marginBottom: 24 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: "#94a3b8", fontSize: 13 }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft: "auto", color: "#FFD166", fontSize: 14 }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: "linear-gradient(135deg,#6C63FF 0%,#4f46e5 50%,#3730a3 100%)", padding: "80px 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#fff", marginBottom: 20, letterSpacing: "-1px" }}>Ready to start learning?</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, marginBottom: 40, lineHeight: 1.7 }}>Join 48,000+ students already leveling up their skills. Your first course is completely free.</p>
          <button onClick={() => navigate("/register")}
            style={{ padding: "18px 48px", borderRadius: 14, background: "#fff", color: "#4f46e5", border: "none", fontSize: 17, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", transition: "all 0.2s" }}>
            Create Free Account →
          </button>
        </div>
      </section>

      <PageFooter navigate={navigate} />
    </div>
  );
}

function HomeCourseCard({ course, navigate }) {
  return (
    <div className="hover-card" onClick={() => navigate(`/enroll/${course.id}`)}
      style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", transition: "all 0.25s", border: "1px solid #f0f4f8" }}>
      <div style={{ height: 160, background: course.coverColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54 }}>
        {course.emoji}
      </div>
      <div style={{ padding: "20px 22px 22px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <span style={{ padding: "3px 10px", borderRadius: 100, background: "#f0efff", color: "#6C63FF", fontSize: 11, fontWeight: 700 }}>{course.category}</span>
          <span style={{ padding: "3px 10px", borderRadius: 100, background: "#f0fdf4", color: "#15803d", fontSize: 11, fontWeight: 700 }}>{course.level}</span>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 8, lineHeight: 1.4 }}>{course.title}</h3>
        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{course.description}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #f0f4f8" }}>
          <div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>by {course.instructorName}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>📖 {course.lessonCount} lessons · 👥 {course.enrolledCount.toLocaleString()}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#FFD166", fontSize: 14 }}>★</span>
            <span style={{ fontWeight: 700, color: "#1a1a2e", fontSize: 14 }}>{course.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage({ navigate }) {
  const team = [
    { name: "Dr. Sarah Chen", role: "Co-founder & CEO", bio: "Former Stanford CS professor with 15 years in edtech. Believes every person deserves world-class education.", emoji: "👩‍💻", color: "linear-gradient(135deg,#6C63FF,#4f46e5)" },
    { name: "Marco Vitelli", role: "Co-founder & CPO", bio: "Ex-Figma design lead. Built products used by 10M+ people. Obsessed with making learning feel effortless.", emoji: "🎨", color: "linear-gradient(135deg,#ec4899,#9333ea)" },
    { name: "James O'Brien", role: "CTO", bio: "Previously at Google Brain. Built the recommendation engine that matches 48K students to their perfect courses.", emoji: "⚛️", color: "linear-gradient(135deg,#06b6d4,#0284c7)" },
    { name: "Priya Nair", role: "Head of Content", bio: "Curriculum designer who spent 8 years at Coursera. Personally reviews every course before it goes live.", emoji: "📚", color: "linear-gradient(135deg,#f59e0b,#d97706)" },
  ];

  const milestones = [
    { year: "2019", title: "LearnHub founded", desc: "Started with 12 courses and a dream to democratize quality education." },
    { year: "2020", title: "10,000 students", desc: "Reached our first major milestone during a global shift to remote learning." },
    { year: "2022", title: "Series A — $18M", desc: "Raised funding to expand our instructor network and build mobile apps." },
    { year: "2023", title: "1,000 instructors", desc: "Our expert community crossed 1,000 verified instructors across 40 countries." },
    { year: "2024", title: "48,000+ students", desc: "Now serving learners in 120+ countries with 12,000+ courses." },
    { year: "2026", title: "What's next", desc: "AI-powered learning paths, live cohort courses, and enterprise plans launching soon." },
  ];

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#0f0c29,#1a1048)", padding: "90px 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(108,99,255,0.2) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,209,102,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 100, background: "rgba(108,99,255,0.2)", color: "#a5b4fc", fontSize: 13, fontWeight: 700, marginBottom: 24 }}>OUR STORY</div>
          <h1 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 800, color: "#fff", letterSpacing: "-2px", lineHeight: 1.15, marginBottom: 24 }}>
            We exist to make great<br />
            <span style={{ background: "linear-gradient(135deg,#6C63FF,#a78bfa,#FFD166)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>learning accessible.</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 40px" }}>
            LearnHub was built on one belief: the quality of your education shouldn't depend on where you were born or how much money you have.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/courses")} style={{ padding: "14px 32px", borderRadius: 12, background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(108,99,255,0.4)" }}>Browse Courses</button>
            <button onClick={() => navigate("/register")} style={{ padding: "14px 32px", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Join Free</button>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: "90px 28px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {[
            { icon: "🎯", title: "Our Mission", text: "To break down the barriers between ambitious learners and the skills they need to build the life they want. Every course on LearnHub is hand-reviewed for quality." },
            { icon: "🌍", title: "Global Reach", text: "Our 48,000+ students come from 120+ countries. We offer scholarships and reduced pricing for learners in developing regions through our Access Program." },
            { icon: "🏆", title: "Quality First", text: "Less than 30% of instructor applications are accepted. Every course goes through a 12-point review checklist before it reaches students." },
          ].map(item => (
            <div key={item.title} style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #f0f4f8" }}>
              <div style={{ fontSize: 40, marginBottom: 20 }}>{item.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 14 }}>{item.title}</h3>
              <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "linear-gradient(135deg,#6C63FF,#4f46e5)", padding: "70px 28px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 0 }}>
          {[["48K+","Students worldwide"],["120+","Countries"],["12K+","Courses"],["1.2K+","Instructors"],["94%","Completion rate"]].map(([num, lbl], i, arr) => (
            <div key={lbl} style={{ textAlign: "center", padding: "32px 20px", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>{num}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 6, fontWeight: 500 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "90px 28px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 100, background: "#f0efff", color: "#6C63FF", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>THE TEAM</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-1px" }}>The people behind LearnHub</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
          {team.map(p => (
            <div key={p.name} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #f0f4f8", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(108,99,255,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)"; }}>
              <div style={{ height: 120, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>{p.emoji}</div>
              <div style={{ padding: "24px" }}>
                <div style={{ fontWeight: 800, color: "#1a1a2e", fontSize: 17, marginBottom: 4 }}>{p.name}</div>
                <div style={{ color: "#6C63FF", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{p.role}</div>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{p.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: "#f8f9fe", padding: "90px 28px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 100, background: "#f0efff", color: "#6C63FF", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>OUR JOURNEY</div>
            <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-1px" }}>How we got here</h2>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 71, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,#6C63FF,#e2e8f0)", zIndex: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {milestones.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 28, alignItems: "flex-start", paddingBottom: i < milestones.length - 1 ? 36 : 0, position: "relative" }}>
                  <div style={{ width: 144, textAlign: "right", paddingTop: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#6C63FF", background: "#f0efff", padding: "4px 12px", borderRadius: 100 }}>{m.year}</span>
                  </div>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: i === milestones.length - 1 ? "#FFD166" : "#6C63FF", border: "3px solid #fff", boxShadow: "0 0 0 3px rgba(108,99,255,0.2)", flexShrink: 0, marginTop: 4, position: "relative", zIndex: 1 }} />
                  <div style={{ flex: 1, paddingBottom: 8 }}>
                    <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: 16, marginBottom: 6 }}>{m.title}</div>
                    <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg,#0f0c29,#1a1048)", padding: "80px 28px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-1px" }}>Ready to be part of the story?</h2>
          <p style={{ color: "#64748b", fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>Join 48,000+ learners already building skills that matter.</p>
          <button onClick={() => navigate("/register")} style={{ padding: "16px 44px", borderRadius: 12, background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(108,99,255,0.4)" }}>Get Started Free →</button>
        </div>
      </section>

      <PageFooter navigate={navigate} />
    </div>
  );
}

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────
function PricingPage({ navigate }) {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Free", price: 0, annualPrice: 0, color: "#64748b", highlight: false,
      desc: "Great for exploring and getting started.",
      features: ["Access to 200+ free courses", "Progress tracking", "Mobile app access", "Community forums", "Completion badges"],
      missing: ["Certificates", "Offline downloads", "Priority support", "Live sessions"],
      cta: "Start Free",
    },
    {
      name: "Pro", price: 29, annualPrice: 19, color: "#6C63FF", highlight: true,
      badge: "Most Popular",
      desc: "Everything you need to learn fast and earn certificates.",
      features: ["Everything in Free", "All 12,000+ courses", "Official certificates", "Offline downloads", "Priority support", "Early access to new courses", "1-on-1 mentor sessions (2/mo)"],
      missing: ["Team dashboard", "Custom learning paths"],
      cta: "Start Pro Trial",
    },
    {
      name: "Teams", price: 49, annualPrice: 35, color: "#10b981", highlight: false,
      desc: "For companies investing in their team's growth.",
      features: ["Everything in Pro", "Up to 50 seats", "Team dashboard & analytics", "Custom learning paths", "SSO & SCIM", "Dedicated account manager", "Unlimited mentor sessions"],
      missing: [],
      cta: "Contact Sales",
    },
  ];

  const faqs = [
    { q: "Can I cancel anytime?", a: "Yes. Cancel anytime from your account settings. You'll keep access until the end of your billing period with no questions asked." },
    { q: "Is there a free trial for Pro?", a: "Absolutely — Pro comes with a 14-day free trial. No credit card required to start." },
    { q: "Do certificates expire?", a: "No. Once you earn a certificate it's yours forever, accessible from your profile and shareable to LinkedIn." },
    { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, PayPal, and UPI (for India). All payments are secured by Stripe." },
    { q: "Can I switch plans?", a: "Yes, you can upgrade or downgrade at any time. We'll prorate the difference on your next billing cycle." },
    { q: "Do you offer student discounts?", a: "Yes! Students with a valid .edu email get 50% off Pro. Apply at checkout." },
  ];

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#0f0c29,#1a1048)", padding: "80px 28px 100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(108,99,255,0.2) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 100, background: "rgba(108,99,255,0.2)", color: "#a5b4fc", fontSize: 13, fontWeight: 700, marginBottom: 20 }}>PRICING</div>
          <h1 style={{ fontSize: "clamp(34px,5vw,58px)", fontWeight: 800, color: "#fff", letterSpacing: "-2px", lineHeight: 1.15, marginBottom: 20 }}>
            Simple, transparent<br />
            <span style={{ background: "linear-gradient(135deg,#6C63FF,#FFD166)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>pricing.</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 17, lineHeight: 1.7, marginBottom: 36 }}>No hidden fees. No surprise charges. Start free, upgrade when you're ready.</p>
          {/* Toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "6px 8px 6px 20px" }}>
            <span style={{ color: !annual ? "#fff" : "#64748b", fontSize: 14, fontWeight: 600, transition: "color 0.2s" }}>Monthly</span>
            <button onClick={() => setAnnual(a => !a)} style={{ width: 48, height: 26, borderRadius: 100, background: annual ? "#6C63FF" : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
              <span style={{ position: "absolute", top: 3, left: annual ? 24 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.25s", display: "block" }} />
            </button>
            <span style={{ color: annual ? "#fff" : "#64748b", fontSize: 14, fontWeight: 600, transition: "color 0.2s" }}>Annual</span>
            <span style={{ background: "#FFD166", color: "#1a1a2e", fontSize: 12, fontWeight: 800, padding: "3px 10px", borderRadius: 100 }}>Save 35%</span>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section style={{ maxWidth: 1100, margin: "-48px auto 0", padding: "0 28px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, position: "relative", zIndex: 10 }}>
        {plans.map(plan => (
          <div key={plan.name} style={{ background: plan.highlight ? "linear-gradient(160deg,#0f0c29,#1a1048)" : "#fff", borderRadius: 24, padding: "36px 32px", boxShadow: plan.highlight ? "0 24px 60px rgba(108,99,255,0.3)" : "0 4px 24px rgba(0,0,0,0.08)", border: plan.highlight ? "2px solid rgba(108,99,255,0.4)" : "2px solid #f0f4f8", position: "relative", overflow: "hidden" }}>
            {plan.highlight && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#6C63FF,#a78bfa,#FFD166)" }} />}
            {plan.badge && (
              <div style={{ position: "absolute", top: 20, right: 20, background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 100 }}>{plan.badge}</div>
            )}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: plan.highlight ? "#a5b4fc" : plan.color, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 52, fontWeight: 800, color: plan.highlight ? "#fff" : "#1a1a2e", letterSpacing: "-2px" }}>
                  ${annual ? plan.annualPrice : plan.price}
                </span>
                {plan.price > 0 && <span style={{ color: plan.highlight ? "#64748b" : "#94a3b8", fontSize: 15 }}>/mo</span>}
              </div>
              {plan.price > 0 && annual && <div style={{ fontSize: 13, color: plan.highlight ? "#64748b" : "#94a3b8" }}>billed ${(annual ? plan.annualPrice : plan.price) * 12}/year</div>}
              <p style={{ color: plan.highlight ? "#94a3b8" : "#64748b", fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>{plan.desc}</p>
            </div>
            <button onClick={() => navigate("/register")}
              style={{ width: "100%", padding: "14px", borderRadius: 12, background: plan.highlight ? "linear-gradient(135deg,#6C63FF,#4f46e5)" : plan.name === "Teams" ? "linear-gradient(135deg,#10b981,#059669)" : "#f8f9fe", color: plan.highlight || plan.name === "Teams" ? "#fff" : "#1a1a2e", border: plan.highlight ? "none" : "2px solid #e2e8f0", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 28, boxShadow: plan.highlight ? "0 4px 16px rgba(108,99,255,0.35)" : "none", transition: "all 0.2s" }}>
              {plan.cta} →
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: plan.highlight ? "#a78bfa" : plan.color, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>✓</span>
                  <span style={{ color: plan.highlight ? "#cbd5e0" : "#4a5568", fontSize: 14 }}>{f}</span>
                </div>
              ))}
              {plan.missing.map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", opacity: 0.4 }}>
                  <span style={{ color: "#94a3b8", fontSize: 14, flexShrink: 0 }}>✕</span>
                  <span style={{ color: "#94a3b8", fontSize: 14 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Comparison table */}
      <section style={{ background: "#fff", padding: "80px 28px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-1px" }}>Compare plans</h2>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #e8ecf4", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: "#f8f9fe", padding: "16px 24px", borderBottom: "1px solid #e8ecf4" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Feature</span>
              {["Free","Pro","Teams"].map(p => <span key={p} style={{ fontSize: 14, fontWeight: 700, color: p === "Pro" ? "#6C63FF" : "#1a1a2e", textAlign: "center" }}>{p}</span>)}
            </div>
            {[
              ["Course library", "200+", "12,000+", "12,000+"],
              ["Completion certificates", "✕", "✓", "✓"],
              ["Offline downloads", "✕", "✓", "✓"],
              ["Mobile app", "✓", "✓", "✓"],
              ["Mentor sessions", "✕", "2/month", "Unlimited"],
              ["Team dashboard", "✕", "✕", "✓"],
              ["Priority support", "✕", "✓", "Dedicated"],
              ["Custom learning paths", "✕", "✕", "✓"],
              ["SSO / SCIM", "✕", "✕", "✓"],
            ].map(([feat, ...vals], i) => (
              <div key={feat} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px 24px", borderBottom: i < 8 ? "1px solid #f0f4f8" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "#4a5568", fontWeight: 500 }}>{feat}</span>
                {vals.map((v, vi) => (
                  <span key={vi} style={{ textAlign: "center", fontSize: 14, fontWeight: v === "✓" ? 700 : 500, color: v === "✓" ? "#6C63FF" : v === "✕" ? "#cbd5e0" : "#1a1a2e" }}>{v}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#f8f9fe", padding: "80px 28px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 100, background: "#f0efff", color: "#6C63FF", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-1px" }}>Common questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg,#6C63FF,#4f46e5)", padding: "80px 28px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-1px" }}>Start learning today.</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>Free forever on the basics. Upgrade when you need more. Cancel anytime.</p>
          <button onClick={() => navigate("/register")} style={{ padding: "16px 44px", borderRadius: 12, background: "#fff", color: "#4f46e5", border: "none", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>Get Started Free →</button>
        </div>
      </section>

      <PageFooter navigate={navigate} />
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf4", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", padding: "20px 24px", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{q}</span>
        <span style={{ fontSize: 18, color: "#6C63FF", transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: 12 }}>+</span>
      </button>
      {open && <div style={{ padding: "0 24px 20px", fontSize: 14, color: "#64748b", lineHeight: 1.8, borderTop: "1px solid #f0f4f8" }}>{a}</div>}
    </div>
  );
}

// ─── SHARED PAGE FOOTER ───────────────────────────────────────────────────────
function PageFooter({ navigate }) {
  return (
    <footer style={{ background: "#0f0c29", color: "#64748b", padding: "60px 28px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer" }} onClick={() => navigate("/")}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#6C63FF,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 16L10 4L16 16H4Z" fill="white" opacity="0.9"/><circle cx="10" cy="11" r="3" fill="#FFD166"/></svg>
              </div>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>LearnHub</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, maxWidth: 280 }}>Empowering lifelong learners worldwide with expert-led, affordable courses.</p>
          </div>
          {[
            ["Learn", [["Browse Courses","/courses"],["About Us","/about"],["Pricing","/pricing"]]],
            ["Account", [["Sign In","/login"],["Register","/register"],["My Courses","/my-courses"]]],
            ["Company", [["About","/about"],["Blog","#"],["Careers","#"],["Contact","#"]]],
          ].map(([title, links]) => (
            <div key={title}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 18, letterSpacing: 0.5 }}>{title}</div>
              {links.map(([l, href]) => (
                <div key={l} style={{ fontSize: 14, marginBottom: 10, cursor: "pointer", transition: "color 0.15s" }}
                  onClick={() => navigate(href)}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "#64748b"}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13 }}>© 2026 LearnHub. All rights reserved.</div>
          <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
            {["Privacy","Terms","Cookies"].map(l => <span key={l} style={{ cursor: "pointer" }}>{l}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── COURSE LIST PAGE ─────────────────────────────────────────────────────────
function CourseListPage({ navigate, enrolledIds }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = MOCK_COURSES.filter(c =>
    (category === "All" || c.category === category) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ background: "linear-gradient(160deg,#0f0c29,#1a1048)", padding: "60px 28px 80px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16, letterSpacing: "-1px" }}>Explore All Courses</h1>
        <p style={{ color: "#64748b", fontSize: 17, marginBottom: 36 }}>Find the perfect course for your goals.</p>
        <div style={{ maxWidth: 560, margin: "0 auto", background: "#fff", borderRadius: 14, display: "flex", alignItems: "center", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
          <span style={{ padding: "0 16px", fontSize: 18 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses, topics…" style={{ flex: 1, border: "none", outline: "none", padding: "16px 0", fontSize: 15, color: "#1a1a2e", background: "transparent" }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", padding: "0 16px", color: "#94a3b8", cursor: "pointer", fontSize: 16 }}>✕</button>}
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "-28px auto 0", padding: "0 28px", display: "flex", gap: 10, flexWrap: "wrap", position: "relative", zIndex: 10 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{ padding: "9px 22px", borderRadius: 100, border: `1.5px solid ${category === cat ? "#6C63FF" : "#e2e8f0"}`, background: category === cat ? "#6C63FF" : "#fff", color: category === cat ? "#fff" : "#718096", fontSize: 14, fontWeight: category === cat ? 700 : 500, cursor: "pointer", transition: "all 0.2s" }}>
            {cat}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 28px 80px" }}>
        <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24 }}>{filtered.length} course{filtered.length !== 1 ? "s" : ""} found</div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ color: "#94a3b8", fontSize: 16 }}>No courses match your search.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 24 }}>
            {filtered.map(c => <HomeCourseCard key={c.id} course={c} navigate={navigate} />)}
          </div>
        )}
      </div>
      <PageFooter navigate={navigate} />
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin, navigate, user }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate("/"); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      onLogin(email, password, role);
      navigate(role === "INSTRUCTOR" ? "/instructor/dashboard" : role === "ADMIN" ? "/admin/courses" : "/my-courses");
    } catch { setError("Invalid credentials."); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 68, display: "flex", background: "#f8f9fe" }}>
      <div style={{ flex: 1, background: "linear-gradient(145deg,#0f0c29,#1a1048)", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 50px" }}>
        <div style={{ maxWidth: 400 }}>
          <h2 style={{ color: "#fff", fontSize: 36, fontWeight: 800, marginBottom: 12, letterSpacing: "-1px" }}>Welcome<br />back.</h2>
          <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>Continue your learning journey and pick up right where you left off.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {TESTIMONIALS.slice(0, 2).map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>{t.avatar}</div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flex: "0 0 520px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e", marginBottom: 6, letterSpacing: "-0.5px" }}>Sign in</h2>
          <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 32 }}>Don't have an account? <button onClick={() => navigate("/register")} style={{ background: "none", border: "none", color: "#6C63FF", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Create one</button></p>

          {error && <div style={{ background: "#fff5f5", border: "1px solid #feb2b2", color: "#c53030", borderRadius: 10, padding: "12px 16px", fontSize: 14, marginBottom: 24 }}>{error}</div>}

          {/* Role quick-select */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28, background: "#f1f5f9", borderRadius: 12, padding: "4px" }}>
            {["STUDENT", "INSTRUCTOR", "ADMIN"].map(r => (
              <button key={r} onClick={() => setRole(r)}
                style={{ flex: 1, padding: "9px", borderRadius: 9, border: "none", background: role === r ? "#fff" : "transparent", color: role === r ? "#1a1a2e" : "#94a3b8", fontWeight: role === r ? 700 : 500, fontSize: 13, cursor: "pointer", boxShadow: role === r ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s" }}>
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 8 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 15, color: "#1a1a2e", background: "#fafafa", transition: "all 0.2s" }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 8 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 15, color: "#1a1a2e", background: "#fafafa", transition: "all 0.2s" }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ padding: "15px", background: loading ? "#c4c4f0" : "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: 4, boxShadow: loading ? "none" : "0 4px 16px rgba(108,99,255,0.3)", transition: "all 0.2s" }}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
function RegisterPage({ onRegister, navigate, user }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "STUDENT" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate("/"); }, [user]);

  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("All fields required."); return; }
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    onRegister(form.name, form.email, form.password, form.role);
    navigate(form.role === "INSTRUCTOR" ? "/instructor/dashboard" : form.role === "ADMIN" ? "/admin/courses" : "/my-courses");
    setLoading(false);
  };

  const ROLE_CARDS = [
    { value: "STUDENT", emoji: "🎓", title: "Student", desc: "Browse & enroll in courses" },
    { value: "INSTRUCTOR", emoji: "🏫", title: "Instructor", desc: "Create & teach courses" },
    { value: "ADMIN", emoji: "🛡️", title: "Admin", desc: "Manage & approve courses" },
  ];

  return (
    <div style={{ minHeight: "100vh", paddingTop: 68, background: "linear-gradient(160deg,#f0f0ff 0%,#f8f9fe 60%,#fff9f0 100%)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-1px", marginBottom: 10 }}>Create your account</h1>
          <p style={{ color: "#94a3b8", fontSize: 15 }}>Already have one? <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "#6C63FF", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Sign in</button></p>
        </div>

        <div style={{ background: "#fff", borderRadius: 24, padding: "48px 44px", boxShadow: "0 20px 60px rgba(108,99,255,0.08)" }}>
          {error && <div style={{ background: "#fff5f5", border: "1px solid #feb2b2", color: "#c53030", borderRadius: 10, padding: "12px 16px", fontSize: 14, marginBottom: 24 }}>{error}</div>}

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#4a5568", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>I am a…</div>
            <div style={{ display: "flex", gap: 14 }}>
              {ROLE_CARDS.map(r => (
                <button key={r.value} onClick={() => setForm(p => ({ ...p, role: r.value }))}
                  style={{ flex: 1, padding: "18px 12px", borderRadius: 14, border: `2px solid ${form.role === r.value ? "#6C63FF" : "#e2e8f0"}`, background: form.role === r.value ? "#f0efff" : "#fafafa", cursor: "pointer", textAlign: "center", transition: "all 0.2s", boxShadow: form.role === r.value ? "0 0 0 4px rgba(108,99,255,0.1)" : "none", position: "relative" }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{r.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.desc}</div>
                  {form.role === r.value && <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: "50%", background: "#6C63FF", color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✓</div>}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", gap: 18 }}>
              <FormField label="Full Name" type="text" value={form.name} onChange={update("name")} placeholder="Jane Smith" />
              <FormField label="Email" type="email" value={form.email} onChange={update("email")} placeholder="jane@email.com" />
            </div>
            <div style={{ display: "flex", gap: 18 }}>
              <FormField label="Password" type="password" value={form.password} onChange={update("password")} placeholder="Min. 6 chars" />
              <FormField label="Confirm Password" type="password" value={form.confirm} onChange={update("confirm")} placeholder="Repeat password" />
            </div>
            <button type="submit" disabled={loading}
              style={{ padding: "15px", background: loading ? "#c4c4f0" : "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: 4, boxShadow: loading ? "none" : "0 4px 16px rgba(108,99,255,0.3)" }}>
              {loading ? "Creating account…" : `Create ${form.role.charAt(0) + form.role.slice(1).toLowerCase()} Account →`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, type, value, onChange, placeholder }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#4a5568" }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ padding: "13px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 15, color: "#1a1a2e", background: "#fafafa", width: "100%", transition: "all 0.2s" }} />
    </div>
  );
}

// ─── ENROLLMENT PAGE ──────────────────────────────────────────────────────────
function EnrollmentPage({ courseId, user, onEnroll, enrolled, navigate }) {
  const course = MOCK_COURSES.find(c => c.id === courseId);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(enrolled);

  if (!course) return <div style={{ paddingTop: 140, textAlign: "center" }}><p style={{ color: "#94a3b8" }}>Course not found.</p><button onClick={() => navigate("/courses")} style={{ marginTop: 16, color: "#6C63FF", background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700 }}>← Browse Courses</button></div>;

  const handleEnroll = async () => {
    if (!user) { navigate("/login"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    onEnroll(courseId);
    setDone(true);
    setLoading(false);
  };

  const mockLessons = Array.from({ length: course.lessonCount > 6 ? 6 : course.lessonCount }, (_, i) => ({ id: i + 1, title: `Lesson ${i + 1}: ${["Introduction & Setup", "Core Fundamentals", "Building Projects", "Advanced Patterns", "Testing & Debugging", "Deployment & Beyond"][i]}`, orderNumber: i + 1 }));

  return (
    <div style={{ paddingTop: 68, minHeight: "100vh", background: "#f8f9fe" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf4", padding: "16px 28px" }}>
        <button onClick={() => navigate("/courses")} style={{ background: "none", border: "none", color: "#6C63FF", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>← Back to Courses</button>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 28px", display: "flex", gap: 44, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ height: 260, borderRadius: 24, background: course.coverColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 84, marginBottom: 32 }}>{course.emoji}</div>
          <span style={{ padding: "5px 14px", borderRadius: 100, background: "#f0efff", color: "#6C63FF", fontSize: 12, fontWeight: 700 }}>{course.category}</span>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#1a1a2e", marginTop: 16, marginBottom: 16, lineHeight: 1.3, letterSpacing: "-0.5px" }}>{course.title}</h1>
          <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.8, marginBottom: 32 }}>{course.description}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 36 }}>
            {[["👨‍🏫", "Instructor", course.instructorName], ["📖", "Lessons", `${course.lessonCount} lessons`], ["👥", "Students", `${course.enrolledCount.toLocaleString()} enrolled`], ["⭐", "Rating", `${course.rating} / 5.0`]].map(([icon, label, val]) => (
              <div key={label} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginTop: 2 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: 18, padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 16 }}>Course Curriculum</h3>
            {mockLessons.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 0", borderBottom: i < mockLessons.length - 1 ? "1px solid #f0f4f8" : "none" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#f0efff", color: "#6C63FF", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{l.orderNumber}</div>
                <span style={{ fontSize: 14, color: "#4a5568" }}>{l.title}</span>
              </div>
            ))}
            {course.lessonCount > 6 && <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 14 }}>+ {course.lessonCount - 6} more lessons after enrolling</p>}
          </div>
        </div>

        <div style={{ width: 340, position: "sticky", top: 90 }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "36px 30px", boxShadow: "0 16px 48px rgba(108,99,255,0.12)", border: "1px solid #f0f4f8" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: "#1a1a2e" }}>Free</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>No credit card needed</div>
            </div>
            {done ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>You're enrolled!</div>
                <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Head to your dashboard to start learning.</p>
                <button onClick={() => navigate("/my-courses")} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Go to My Courses →</button>
              </div>
            ) : (
              <button onClick={handleEnroll} disabled={loading}
                style={{ width: "100%", padding: "16px", background: loading ? "#c4c4f0" : "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", marginBottom: 16, boxShadow: loading ? "none" : "0 4px 16px rgba(108,99,255,0.3)", transition: "all 0.2s" }}>
                {loading ? "Enrolling…" : "Enroll Now — Free"}
              </button>
            )}
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid #f0f4f8", paddingTop: 20, marginTop: 8 }}>
              {["Full course access", "Progress tracking", "Completion certificate", "Lifetime access"].map(p => (
                <li key={p} style={{ display: "flex", gap: 10, fontSize: 14, color: "#4a5568" }}>
                  <span style={{ color: "#6C63FF", fontWeight: 700 }}>✓</span> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MY COURSES PAGE ──────────────────────────────────────────────────────────
function MyCoursesPage({ user, courses, onUpdateProgress, navigate }) {
  const [filter, setFilter] = useState("ALL");
  const [updating, setUpdating] = useState(null);

  if (!user) { navigate("/login"); return null; }

  const filtered = filter === "ALL" ? courses : courses.filter(c => c.progressStatus === filter);
  const STATUS = {
    NOT_STARTED: { bg: "#f1f5f9", text: "#64748b", dot: "#94a3b8", label: "Not Started" },
    IN_PROGRESS:  { bg: "#fffbeb", text: "#b45309", dot: "#f59e0b", label: "In Progress" },
    COMPLETED:    { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e", label: "Completed" },
  };

  const handleUpdate = async (id, status) => {
    setUpdating(id + status);
    await new Promise(r => setTimeout(r, 350));
    onUpdateProgress(id, status);
    setUpdating(null);
  };

  const progressPct = (status) =>
    status === "COMPLETED" ? 100 : status === "IN_PROGRESS" ? 48 : 0;

  return (
    <div style={{ display: "flex", minHeight: "100vh", paddingTop: 68 }}>
      <SideBar user={user} active="/my-courses" navigate={navigate} />
      <div style={{ flex: 1, padding: "40px 40px", background: "#f8f9fe" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", marginBottom: 6, letterSpacing: "-0.5px" }}>My Learning</h1>
            <p style={{ color: "#94a3b8", fontSize: 15 }}>Pick up where you left off and keep the momentum going.</p>
          </div>
          <button onClick={() => navigate("/courses")} style={{ padding: "12px 22px", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(108,99,255,0.3)" }}>
            + Browse Courses
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          {[
            ["📚", courses.length, "Enrolled", "#6C63FF"],
            ["🔥", courses.filter(c => c.progressStatus === "IN_PROGRESS").length, "In Progress", "#f59e0b"],
            ["🏆", courses.filter(c => c.progressStatus === "COMPLETED").length, "Completed", "#22c55e"],
          ].map(([icon, num, lbl, color]) => (
            <div key={lbl} style={{ flex: "1 1 160px", background: "#fff", borderRadius: 16, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color }}>{num}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{lbl}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          {["ALL", "NOT_STARTED", "IN_PROGRESS", "COMPLETED"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "8px 18px", borderRadius: 100, border: `1.5px solid ${filter === f ? "#6C63FF" : "#e2e8f0"}`, background: filter === f ? "#6C63FF" : "#fff", color: filter === f ? "#fff" : "#718096", fontSize: 13, fontWeight: filter === f ? 700 : 500, cursor: "pointer", transition: "all 0.2s" }}>
              {f === "ALL" ? "All Courses" : STATUS[f].label}
            </button>
          ))}
        </div>

        {/* Course list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎒</div>
            <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 20 }}>
              {courses.length === 0 ? "No courses yet! Start browsing." : "No courses match this filter."}
            </p>
            {courses.length === 0 && (
              <button onClick={() => navigate("/courses")} style={{ padding: "12px 28px", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
                Browse Courses →
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {filtered.map(enrollment => {
              const cfg = STATUS[enrollment.progressStatus] || STATUS.NOT_STARTED;
              const pct = progressPct(enrollment.progressStatus);
              const lessonCount = enrollment.lessons?.length || 0;
              return (
                <div key={enrollment.id} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #f0f4f8" }}>
                  <div style={{ display: "flex" }}>
                    {/* Thumbnail */}
                    <div style={{ width: 120, background: enrollment.coverColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, flexShrink: 0 }}>
                      {enrollment.emoji}
                    </div>

                    {/* Body */}
                    <div style={{ flex: 1, padding: "22px 26px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ flex: 1, paddingRight: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <span style={{ padding: "3px 10px", borderRadius: 100, background: "#f0efff", color: "#6C63FF", fontSize: 11, fontWeight: 700 }}>{enrollment.category}</span>
                            <span style={{ padding: "3px 10px", borderRadius: 100, background: "#f8f9fe", color: "#94a3b8", fontSize: 11 }}>
                              {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 4, lineHeight: 1.3 }}>{enrollment.title}</h3>
                          <p style={{ fontSize: 13, color: "#94a3b8" }}>by {enrollment.instructorName}</p>
                        </div>
                        {/* Status badge */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, background: cfg.bg, color: cfg.text, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
                          {cfg.label}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>Progress</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? "#15803d" : "#6C63FF" }}>{pct}%</span>
                        </div>
                        <div style={{ height: 7, borderRadius: 100, background: "#f0f4f8", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "linear-gradient(90deg,#22c55e,#16a34a)" : "linear-gradient(90deg,#6C63FF,#a78bfa)", borderRadius: 100, transition: "width 0.6s ease" }} />
                        </div>
                      </div>

                      {/* Actions row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        {/* Continue / Start button */}
                        <button onClick={() => navigate(`/learn/${enrollment.id}`)}
                          style={{ padding: "9px 20px", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(108,99,255,0.3)" }}>
                          {enrollment.progressStatus === "NOT_STARTED" ? "▶ Start Learning" : enrollment.progressStatus === "COMPLETED" ? "📖 Review Course" : "▶ Continue Learning"}
                        </button>

                        {/* Progress update buttons */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>Mark as:</span>
                          {["NOT_STARTED", "IN_PROGRESS", "COMPLETED"].map(opt => (
                            <button key={opt} onClick={() => handleUpdate(enrollment.id, opt)}
                              disabled={!!updating || enrollment.progressStatus === opt}
                              style={{ padding: "6px 12px", border: `1.5px solid ${enrollment.progressStatus === opt ? cfg.dot : "#e2e8f0"}`, borderRadius: 7, background: enrollment.progressStatus === opt ? cfg.bg : "#f7f8fc", color: enrollment.progressStatus === opt ? cfg.text : "#718096", fontSize: 12, cursor: enrollment.progressStatus === opt ? "default" : "pointer", fontWeight: enrollment.progressStatus === opt ? 700 : 500, transition: "all 0.15s", opacity: updating === enrollment.id + opt ? 0.5 : 1 }}>
                              {updating === enrollment.id + opt ? "…" : STATUS[opt].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INSTRUCTOR DASHBOARD ─────────────────────────────────────────────────────
function InstructorDashboard({ user, courses, courseLessons, navigate }) {
  if (!user || user.role !== "INSTRUCTOR") { navigate("/login"); return null; }
  const [expanded, setExpanded] = useState(null);
  const STATUS = {
    PENDING:  { bg: "#fffbeb", text: "#b45309", label: "Pending Review" },
    APPROVED: { bg: "#f0fdf4", text: "#15803d", label: "Approved" },
    REJECTED: { bg: "#fef2f2", text: "#b91c1c", label: "Rejected" },
  };
  const mockStudents = [
    { id: 1, name: "Alice Johnson",  email: "alice@email.com",  progressStatus: "IN_PROGRESS" },
    { id: 2, name: "Bob Chen",       email: "bob@email.com",    progressStatus: "COMPLETED" },
    { id: 3, name: "Carol White",    email: "carol@email.com",  progressStatus: "NOT_STARTED" },
    { id: 4, name: "David Osei",     email: "david@email.com",  progressStatus: "IN_PROGRESS" },
  ];
  const mockCourses = courses.map((c, i) => ({
    ...c,
    status: ["APPROVED", "PENDING", "APPROVED"][i] || "PENDING",
    lessons: courseLessons[c.id] || [],
  }));

  const totalStudents = mockCourses.reduce((s, c) => s + (c.enrolledCount || 0), 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", paddingTop: 68 }}>
      <SideBar user={user} active="/instructor/dashboard" navigate={navigate} />
      <div style={{ flex: 1, padding: "40px 40px", background: "#f8f9fe" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", marginBottom: 6, letterSpacing: "-0.5px" }}>Instructor Dashboard</h1>
            <p style={{ color: "#94a3b8", fontSize: 15 }}>Manage your courses and track student enrollments.</p>
          </div>
          <button onClick={() => navigate("/instructor/create-course")} style={{ padding: "12px 22px", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(108,99,255,0.3)" }}>
            + Create Course
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
          {[
            ["📚", mockCourses.length, "My Courses", "#6C63FF"],
            ["✅", mockCourses.filter(c => c.status === "APPROVED").length, "Live", "#22c55e"],
            ["⏳", mockCourses.filter(c => c.status === "PENDING").length, "Pending", "#f59e0b"],
            ["👥", mockCourses.reduce((s, c) => s + (c.lessons?.length || 0), 0), "Total Lessons", "#06b6d4"],
          ].map(([icon, num, lbl, color]) => (
            <div key={lbl} style={{ flex: "1 1 140px", background: "#fff", borderRadius: 16, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color }}>{num}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Course cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mockCourses.map(course => {
            const cfg = STATUS[course.status] || STATUS.PENDING;
            const isExp = expanded === course.id;
            const lessons = course.lessons || [];
            return (
              <div key={course.id} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.06)", border: "1px solid #f0f4f8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 26px" }}>
                  {/* Left info */}
                  <div style={{ display: "flex", alignItems: "center", gap: 18, flex: 1 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 15, background: course.coverColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{course.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{course.title}</h3>
                        <span style={{ padding: "3px 10px", borderRadius: 100, background: cfg.bg, color: cfg.text, fontSize: 11, fontWeight: 700 }}>{cfg.label}</span>
                      </div>
                      <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#94a3b8", flexWrap: "wrap" }}>
                        <span>🏷️ {course.category}</span>
                        <span>📖 <strong style={{ color: "#1a1a2e" }}>{lessons.length}</strong> lessons</span>
                        <span>👥 {course.enrolledCount?.toLocaleString()} students</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                    <button onClick={() => navigate(`/instructor/course/${course.id}`)}
                      style={{ padding: "9px 18px", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(108,99,255,0.25)" }}>
                      + Add Lesson
                    </button>
                    <button onClick={() => setExpanded(isExp ? null : course.id)}
                      style={{ padding: "9px 18px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#718096", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      {isExp ? "▲ Hide" : "▼ Students"}
                    </button>
                  </div>
                </div>

                {/* Lessons mini-list */}
                {lessons.length > 0 && (
                  <div style={{ padding: "0 26px 16px", borderTop: "1px solid #f8f9fe" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10, marginTop: 14 }}>Course Lessons</div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {lessons.map((l, i) => (
                        <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8f9fe", borderRadius: 8, padding: "7px 12px", border: "1px solid #f0f4f8" }}>
                          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#6C63FF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{l.orderNumber}</span>
                          <span style={{ fontSize: 13, color: "#4a5568", fontWeight: 500 }}>{l.title}</span>
                          {l.duration && <span style={{ fontSize: 11, color: "#94a3b8" }}>· {l.duration}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Students panel */}
                {isExp && (
                  <div style={{ padding: "0 26px 22px", borderTop: "1px solid #f0f4f8" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, margin: "18px 0 14px" }}>Enrolled Students</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {mockStudents.map(s => (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "#fafafa", borderRadius: 12, border: "1px solid #f0f4f8" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6C63FF22,#4f46e522)", color: "#6C63FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                            {s.name[0]}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{s.name}</div>
                            <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.email}</div>
                          </div>
                          <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, background: s.progressStatus === "COMPLETED" ? "#f0fdf4" : s.progressStatus === "IN_PROGRESS" ? "#fffbeb" : "#f1f5f9", color: s.progressStatus === "COMPLETED" ? "#15803d" : s.progressStatus === "IN_PROGRESS" ? "#b45309" : "#64748b" }}>
                            {s.progressStatus.replace("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CREATE COURSE PAGE ───────────────────────────────────────────────────────
function CreateCoursePage({ navigate }) {
  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const CATS = ["Programming", "Design", "Business", "Marketing", "Data Science", "Music"];
  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) { setError("All fields required."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setSuccess(true); setLoading(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", paddingTop: 68 }}>
      <SideBar user={{ role: "INSTRUCTOR", name: "Instructor" }} active="/instructor/create-course" navigate={navigate} />
      <div style={{ flex: 1, padding: "40px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 14 }}>
          <button onClick={() => navigate("/instructor/dashboard")} style={{ background: "none", border: "none", color: "#6C63FF", cursor: "pointer", fontWeight: 600 }}>Dashboard</button>
          <span style={{ color: "#cbd5e0" }}>/</span>
          <span style={{ color: "#94a3b8" }}>Create Course</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", marginBottom: 8, letterSpacing: "-0.5px" }}>Create a New Course</h1>
        <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 40 }}>Fill in the details. Your course will go through admin review before going live.</p>

        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          <div style={{ flex: 1, background: "#fff", borderRadius: 20, padding: "36px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {success && (
              <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 14, padding: "20px", marginBottom: 28, display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ fontSize: 28 }}>🎉</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#15803d", fontSize: 16, marginBottom: 4 }}>Course submitted for review!</div>
                  <button onClick={() => navigate("/instructor/dashboard")} style={{ background: "none", border: "none", color: "#15803d", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>← Back to Dashboard</button>
                </div>
              </div>
            )}
            {error && <div style={{ background: "#fff5f5", border: "1px solid #feb2b2", color: "#c53030", borderRadius: 10, padding: "12px 16px", fontSize: 14, marginBottom: 24 }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 8 }}>Course Title *</label>
                <input value={form.title} onChange={update("title")} placeholder="e.g. Complete Python Bootcamp for Beginners" maxLength={120}
                  style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 15, color: "#1a1a2e", background: "#fafafa", transition: "all 0.2s" }} />
                <div style={{ textAlign: "right", fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{form.title.length}/120</div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 8 }}>Category *</label>
                <select value={form.category} onChange={update("category")} style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 15, color: form.category ? "#1a1a2e" : "#94a3b8", background: "#fafafa", appearance: "none", cursor: "pointer" }}>
                  <option value="">— Select a category —</option>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 8 }}>Description *</label>
                <textarea value={form.description} onChange={update("description")} rows={7} maxLength={1000} placeholder="Describe what students will learn, prerequisites, and what makes this course unique…"
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 15, color: "#1a1a2e", background: "#fafafa", resize: "vertical", fontFamily: "inherit", lineHeight: 1.7, transition: "all 0.2s" }} />
                <div style={{ textAlign: "right", fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{form.description.length}/1000</div>
              </div>
              <button type="submit" disabled={loading} style={{ padding: "15px", background: loading ? "#c4c4f0" : "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 16px rgba(108,99,255,0.3)", transition: "all 0.2s" }}>
                {loading ? "Creating…" : "Create Course"}
              </button>
            </form>
          </div>

          <div style={{ width: 280, background: "#fff", borderRadius: 20, padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 20 }}>📝 Tips</h3>
            {[["Clear title", "Use keywords students search for."], ["Rich description", "Cover what they'll learn and who it's for."], ["Right category", "Helps students find your course."], ["Admin review", "All courses need approval before going live."]].map(([t, b]) => (
              <div key={t} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid #f0f4f8" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#4a5568", marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
function AdminCoursesPage({ courses, navigate }) {
  const [statuses, setStatuses] = useState(() => Object.fromEntries(courses.map((c, i) => [c.id, ["PENDING", "APPROVED", "PENDING", "REJECTED", "PENDING", "APPROVED"][i] || "PENDING"])));
  const [filter, setFilter] = useState("PENDING");
  const [acting, setActing] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleAction = async (id, action) => {
    setActing(id + action);
    await new Promise(r => setTimeout(r, 700));
    setStatuses(p => ({ ...p, [id]: action === "approve" ? "APPROVED" : "REJECTED" }));
    showToast(`Course ${action === "approve" ? "approved ✓" : "rejected"}`, action === "approve" ? "success" : "error");
    setActing(null);
  };

  const enriched = courses.map(c => ({ ...c, status: statuses[c.id] }));
  const filtered = filter === "ALL" ? enriched : enriched.filter(c => c.status === filter);
  const counts = { ALL: enriched.length, PENDING: enriched.filter(c => c.status === "PENDING").length, APPROVED: enriched.filter(c => c.status === "APPROVED").length, REJECTED: enriched.filter(c => c.status === "REJECTED").length };
  const STATUS = { PENDING: { bg: "#fffbeb", text: "#b45309", dot: "#f59e0b", label: "Pending" }, APPROVED: { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e", label: "Approved" }, REJECTED: { bg: "#fef2f2", text: "#b91c1c", dot: "#ef4444", label: "Rejected" } };

  return (
    <div style={{ display: "flex", minHeight: "100vh", paddingTop: 68, position: "relative" }}>
      {toast && <div style={{ position: "fixed", top: 20, right: 20, background: toast.type === "error" ? "#c53030" : "#15803d", color: "#fff", padding: "14px 22px", borderRadius: 12, fontWeight: 600, fontSize: 14, zIndex: 1000, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>{toast.msg}</div>}
      <SideBar user={{ role: "ADMIN", name: "Admin" }} active="/admin/courses" navigate={navigate} />
      <div style={{ flex: 1, padding: "40px 40px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", marginBottom: 6, letterSpacing: "-0.5px" }}>Course Approval Panel</h1>
        <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 32 }}>Review instructor submissions and approve or reject.</p>

        <div style={{ display: "flex", gap: 14, marginBottom: 32, flexWrap: "wrap" }}>
          {["PENDING", "APPROVED", "REJECTED", "ALL"].map(f => {
            const colors = { PENDING: "#f59e0b", APPROVED: "#22c55e", REJECTED: "#ef4444", ALL: "#6C63FF" };
            return (
              <button key={f} onClick={() => setFilter(f)}
                style={{ flex: "1 1 120px", padding: "18px 20px", borderRadius: 14, cursor: "pointer", border: `2px solid ${filter === f ? colors[f] : "#e2e8f0"}`, background: filter === f ? colors[f] + "12" : "#fff", transition: "all 0.15s", textAlign: "left" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: colors[f] }}>{counts[f]}</div>
                <div style={{ fontSize: 12, color: "#718096", marginTop: 4 }}>{f === "ALL" ? "All Courses" : STATUS[f].label}</div>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {["PENDING", "APPROVED", "REJECTED", "ALL"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "8px 18px", borderRadius: 100, border: `1.5px solid ${filter === f ? "#6C63FF" : "#e2e8f0"}`, background: filter === f ? "#6C63FF" : "#fff", color: filter === f ? "#fff" : "#718096", fontSize: 13, fontWeight: filter === f ? 700 : 500, cursor: "pointer", transition: "all 0.2s" }}>
              {f === "ALL" ? "All" : STATUS[f].label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map(course => {
            const cfg = STATUS[course.status];
            const isPending = course.status === "PENDING";
            return (
              <div key={course.id} style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", gap: 18 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: course.coverColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{course.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{course.title}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: cfg.bg, color: cfg.text, fontSize: 12, fontWeight: 600 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
                        {cfg.label}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>
                      <span>🏷️ {course.category}</span><span>👨‍🏫 {course.instructorName}</span><span>📖 {course.lessonCount} lessons</span>
                    </div>
                    <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{course.description.substring(0, 120)}…</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
                    {isPending ? (
                      <>
                        <button onClick={() => handleAction(course.id, "approve")} disabled={!!acting}
                          style={{ padding: "10px 22px", background: acting === course.id + "approve" ? "#e2e8f0" : "#f0fdf4", color: acting === course.id + "approve" ? "#94a3b8" : "#15803d", border: `1.5px solid ${acting === course.id + "approve" ? "#e2e8f0" : "#bbf7d0"}`, borderRadius: 10, fontWeight: 700, cursor: acting ? "not-allowed" : "pointer", fontSize: 14, transition: "all 0.2s" }}>
                          {acting === course.id + "approve" ? "…" : "✓ Approve"}
                        </button>
                        <button onClick={() => handleAction(course.id, "reject")} disabled={!!acting}
                          style={{ padding: "10px 22px", background: acting === course.id + "reject" ? "#e2e8f0" : "#fff5f5", color: acting === course.id + "reject" ? "#94a3b8" : "#c53030", border: `1.5px solid ${acting === course.id + "reject" ? "#e2e8f0" : "#feb2b2"}`, borderRadius: 10, fontWeight: 700, cursor: acting ? "not-allowed" : "pointer", fontSize: 14, transition: "all 0.2s" }}>
                          {acting === course.id + "reject" ? "…" : "✕ Reject"}
                        </button>
                      </>
                    ) : (
                      <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{course.status === "APPROVED" ? "✅ Live" : "❌ Rejected"}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ADD LESSON PAGE ──────────────────────────────────────────────────────────
function AddLessonPage({ courseId, lessons, onAddLesson, navigate }) {
  const course = MOCK_COURSES.find(c => c.id === courseId);
  const [form, setForm] = useState({ title: "", content: "", duration: "", orderNumber: "" });
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState("");
  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  // Keep orderNumber in sync with lesson count
  useEffect(() => {
    setForm(p => ({ ...p, orderNumber: String(lessons.length + 1) }));
  }, [lessons.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.content.trim()) { setError("Title and content are required."); return; }
    if (!form.orderNumber || Number(form.orderNumber) < 1) { setError("Order number must be at least 1."); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    onAddLesson(courseId, {
      title: form.title.trim(),
      content: form.content.trim(),
      duration: form.duration.trim() || null,
      orderNumber: Number(form.orderNumber),
    });
    setLastSaved(form.title.trim());
    setForm({ title: "", content: "", duration: "", orderNumber: String(lessons.length + 2) });
    setSaving(false);
  };

  if (!course) return <div style={{ padding: "120px 28px", textAlign: "center", color: "#94a3b8" }}>Course not found.</div>;

  return (
    <div style={{ paddingTop: 68, minHeight: "100vh", background: "#f8f9fe", fontFamily: "'Sora',sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf4", padding: "16px 36px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => navigate("/instructor/dashboard")} style={{ background: "none", border: "none", color: "#6C63FF", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>← Dashboard</button>
        <span style={{ color: "#cbd5e0" }}>|</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: course.coverColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{course.emoji}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{course.title}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{lessons.length} lesson{lessons.length !== 1 ? "s" : ""} added</div>
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span style={{ fontSize: 13, background: "#f0efff", color: "#6C63FF", padding: "5px 14px", borderRadius: 100, fontWeight: 600 }}>Adding Lessons</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px", display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Form */}
        <div style={{ flex: 1 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #f0f4f8" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 6, letterSpacing: "-0.3px" }}>Add New Lesson</h2>
            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 28 }}>Fill in the lesson details. It will appear instantly in the course outline.</p>

            {lastSaved && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
                <span style={{ fontSize: 18 }}>✅</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#15803d", fontSize: 14 }}>"{lastSaved}" added!</div>
                  <div style={{ color: "#4ade80", fontSize: 12 }}>Lesson {lessons.length} is live in the course outline →</div>
                </div>
              </div>
            )}

            {error && <div style={{ background: "#fff5f5", border: "1px solid #feb2b2", color: "#c53030", borderRadius: 10, padding: "11px 16px", fontSize: 14, marginBottom: 20 }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {/* Title + Order row */}
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568" }}>Lesson Title <span style={{ color: "#f56565" }}>*</span></label>
                  <input value={form.title} onChange={update("title")} placeholder="e.g. Introduction to Variables" maxLength={120}
                    style={{ padding: "13px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 15, color: "#1a1a2e", background: "#fafafa", transition: "all 0.2s" }} />
                </div>
                <div style={{ width: 130, display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568" }}>Order #</label>
                  <input type="number" value={form.orderNumber} onChange={update("orderNumber")} min="1"
                    style={{ padding: "13px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 15, color: "#1a1a2e", background: "#fafafa" }} />
                </div>
                <div style={{ width: 130, display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568" }}>Duration</label>
                  <input value={form.duration} onChange={update("duration")} placeholder="e.g. 15 min"
                    style={{ padding: "13px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 15, color: "#1a1a2e", background: "#fafafa" }} />
                </div>
              </div>

              {/* Content */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568" }}>Lesson Content <span style={{ color: "#f56565" }}>*</span></label>
                <textarea value={form.content} onChange={update("content")} rows={10} maxLength={5000}
                  placeholder="Write the full lesson content here. Include explanations, code examples, step-by-step instructions, key takeaways…"
                  style={{ padding: "14px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 15, color: "#1a1a2e", background: "#fafafa", resize: "vertical", fontFamily: "inherit", lineHeight: 1.7, transition: "all 0.2s" }} />
                <div style={{ textAlign: "right", fontSize: 12, color: "#94a3b8" }}>{form.content.length}/5000</div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" disabled={saving}
                  style={{ flex: 1, padding: "15px", background: saving ? "#c4c4f0" : "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", boxShadow: saving ? "none" : "0 4px 14px rgba(108,99,255,0.3)", transition: "all 0.2s" }}>
                  {saving ? "Saving…" : `+ Add Lesson ${lessons.length + 1}`}
                </button>
                <button type="button" onClick={() => navigate("/instructor/dashboard")}
                  style={{ padding: "15px 24px", background: "#f8f9fe", color: "#718096", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Outline sidebar */}
        <div style={{ width: 340, position: "sticky", top: 100 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #f0f4f8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e" }}>Course Outline</h3>
              <span style={{ background: "#f0efff", color: "#6C63FF", fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>{lessons.length}</span>
            </div>

            {lessons.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
                <p style={{ color: "#94a3b8", fontSize: 14 }}>No lessons yet.<br />Add your first one!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0, maxHeight: 420, overflowY: "auto" }}>
                {[...lessons].sort((a, b) => a.orderNumber - b.orderNumber).map((l, i) => (
                  <div key={l.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0", borderBottom: i < lessons.length - 1 ? "1px solid #f0f4f8" : "none" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#6C63FF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{l.orderNumber}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>
                        {l.duration && `⏱ ${l.duration} · `}
                        {l.content.length > 40 ? l.content.substring(0, 40) + "…" : l.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lessons.length > 0 && (
              <button onClick={() => navigate("/instructor/dashboard")}
                style={{ display: "block", width: "100%", textAlign: "center", marginTop: 18, padding: "12px", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                ✓ Finish & Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LESSON VIEWER PAGE ───────────────────────────────────────────────────────
function LessonViewerPage({ courseId, course, navigate, onUpdateProgress }) {
  const [activeLesson, setActiveLesson] = useState(0);
  const [completed, setCompleted] = useState({});

  if (!course) {
    return (
      <div style={{ paddingTop: 120, textAlign: "center", fontFamily: "'Sora',sans-serif" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 20 }}>Please enroll in this course first.</p>
        <button onClick={() => navigate("/courses")} style={{ padding: "12px 28px", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Browse Courses</button>
      </div>
    );
  }

  const lessons = course.lessons || [];

  if (lessons.length === 0) {
    return (
      <div style={{ paddingTop: 120, textAlign: "center", fontFamily: "'Sora',sans-serif" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
        <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 8 }}>No lessons have been added yet.</p>
        <p style={{ color: "#cbd5e0", fontSize: 14, marginBottom: 24 }}>Check back soon — the instructor is still building this course.</p>
        <button onClick={() => navigate("/my-courses")} style={{ padding: "12px 28px", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>← My Courses</button>
      </div>
    );
  }

  const lesson = lessons[activeLesson];
  const completedCount = Object.values(completed).filter(Boolean).length;
  const allDone = completedCount === lessons.length;

  const markComplete = (idx) => {
    const newCompleted = { ...completed, [idx]: true };
    setCompleted(newCompleted);
    const allFinished = Object.values(newCompleted).filter(Boolean).length === lessons.length;
    if (allFinished) onUpdateProgress(courseId, "COMPLETED");
    else onUpdateProgress(courseId, "IN_PROGRESS");
  };

  const goNext = () => {
    markComplete(activeLesson);
    if (activeLesson < lessons.length - 1) setActiveLesson(activeLesson + 1);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", paddingTop: 68, fontFamily: "'Sora',sans-serif", background: "#f8f9fe" }}>
      {/* Left sidebar — lesson list */}
      <div style={{ width: 300, background: "#fff", borderRight: "1px solid #e8ecf4", display: "flex", flexDirection: "column", position: "sticky", top: 68, height: "calc(100vh - 68px)", overflowY: "auto", flexShrink: 0 }}>
        {/* Course header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f0f4f8" }}>
          <button onClick={() => navigate("/my-courses")} style={{ background: "none", border: "none", color: "#6C63FF", fontWeight: 600, fontSize: 13, cursor: "pointer", marginBottom: 12, padding: 0 }}>← My Courses</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: course.coverColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{course.emoji}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.3 }}>{course.title}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{completedCount}/{lessons.length} completed</div>
            </div>
          </div>
          {/* Overall progress */}
          <div style={{ marginTop: 12 }}>
            <div style={{ height: 5, borderRadius: 100, background: "#f0f4f8", overflow: "hidden" }}>
              <div style={{ width: `${(completedCount / lessons.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,#6C63FF,#a78bfa)", borderRadius: 100, transition: "width 0.4s" }} />
            </div>
          </div>
        </div>

        {/* Lesson list */}
        <div style={{ flex: 1, padding: "12px 12px" }}>
          {lessons.map((l, i) => {
            const isActive = i === activeLesson;
            const isDone = completed[i];
            return (
              <button key={l.id} onClick={() => setActiveLesson(i)}
                style={{ display: "flex", alignItems: "flex-start", gap: 12, width: "100%", padding: "12px 12px", borderRadius: 12, border: "none", background: isActive ? "#f0efff" : "transparent", cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "background 0.15s" }}>
                {/* Status dot */}
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: isDone ? "#22c55e" : isActive ? "#6C63FF" : "#e2e8f0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                  {isDone ? "✓" : l.orderNumber}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#6C63FF" : isDone ? "#15803d" : "#4a5568", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</div>
                  {l.duration && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>⏱ {l.duration}</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 40px 80px" }}>
          {/* Lesson header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ background: "#f0efff", color: "#6C63FF", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>Lesson {lesson.orderNumber}</span>
              {lesson.duration && <span style={{ background: "#f8f9fe", color: "#94a3b8", fontSize: 12, padding: "4px 12px", borderRadius: 100, border: "1px solid #e2e8f0" }}>⏱ {lesson.duration}</span>}
              {completed[activeLesson] && <span style={{ background: "#f0fdf4", color: "#15803d", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>✓ Completed</span>}
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.5px", lineHeight: 1.3, marginBottom: 0 }}>{lesson.title}</h1>
          </div>

          {/* Content card */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px 40px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #f0f4f8", marginBottom: 28 }}>
            <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{lesson.content}</div>
          </div>

          {/* Key Takeaways box */}
          <div style={{ background: "linear-gradient(135deg,#f0efff,#e8e6ff)", border: "1px solid #c4b5fd", borderRadius: 16, padding: "22px 28px", marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#6C63FF", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>📌 Key Takeaways</div>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {["Understand the core concept introduced in this lesson", "Practice the examples shown with your own variations", "Complete the exercise before moving to the next lesson"].map((t, i) => (
                <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "#4a5568" }}>
                  <span style={{ color: "#6C63FF", fontWeight: 700 }}>→</span> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <button onClick={() => { if (activeLesson > 0) setActiveLesson(activeLesson - 1); }}
              disabled={activeLesson === 0}
              style={{ padding: "13px 24px", border: "1.5px solid #e2e8f0", borderRadius: 12, background: "#fff", color: activeLesson === 0 ? "#cbd5e0" : "#4a5568", fontSize: 14, fontWeight: 600, cursor: activeLesson === 0 ? "not-allowed" : "pointer" }}>
              ← Previous
            </button>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>{activeLesson + 1} of {lessons.length}</div>
            </div>

            {activeLesson < lessons.length - 1 ? (
              <button onClick={goNext}
                style={{ padding: "13px 28px", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(108,99,255,0.3)" }}>
                {completed[activeLesson] ? "Next Lesson →" : "Complete & Continue →"}
              </button>
            ) : (
              <button onClick={() => { markComplete(activeLesson); }}
                style={{ padding: "13px 28px", background: allDone ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(108,99,255,0.3)" }}>
                {allDone ? "🏆 Course Complete!" : "✓ Finish Course"}
              </button>
            )}
          </div>

          {/* Completion celebration */}
          {allDone && (
            <div style={{ marginTop: 36, background: "linear-gradient(135deg,#0f0c29,#1a1048)", borderRadius: 20, padding: "36px 36px", textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🏆</div>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Congratulations!</h2>
              <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 24 }}>You've completed <strong style={{ color: "#a78bfa" }}>{course.title}</strong>. Your certificate is ready.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button onClick={() => navigate("/my-courses")} style={{ padding: "12px 28px", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>View Certificate</button>
                <button onClick={() => navigate("/courses")} style={{ padding: "12px 28px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Browse More Courses</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SHARED SIDEBAR ───────────────────────────────────────────────────────────
function SideBar({ user, active, navigate }) {
  const links = user?.role === "ADMIN"
    ? [["🛡️ Approvals", "/admin/courses"]]
    : user?.role === "INSTRUCTOR"
    ? [["📊 Dashboard", "/instructor/dashboard"], ["➕ New Course", "/instructor/create-course"]]
    : [["🏠 Browse", "/courses"], ["📚 My Learning", "/my-courses"]];

  return (
    <div style={{ width: 220, background: "#fff", borderRight: "1px solid #e2e8f0", padding: "28px 20px", display: "flex", flexDirection: "column", gap: 28, position: "sticky", top: 68, height: "calc(100vh - 68px)", flexShrink: 0 }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {links.map(([label, href]) => (
          <button key={href} onClick={() => navigate(href)}
            style={{ padding: "10px 14px", borderRadius: 10, background: active === href ? "#f0efff" : "transparent", color: active === href ? "#6C63FF" : "#718096", border: "none", textAlign: "left", fontSize: 14, fontWeight: active === href ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
            {label}
          </button>
        ))}
      </nav>
      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6C63FF,#4f46e5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
