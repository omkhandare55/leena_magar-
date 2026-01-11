/**
 * Notes Organizer - Backend Server
 * Express.js server with session-based authentication
 * Handles all API routes for notes management
 */

const express = require("express")
const session = require("express-session")
const multer = require("multer")
const fs = require("fs")
const path = require("path")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

// Session Configuration
app.use(
  session({
    secret: "notes-organizer-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
)

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    // Allow specific file types
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/quicktime",
    ]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("File type not supported"))
    }
  },
})

// Data Storage Paths
const dataDir = path.join(__dirname, "data")
const usersFile = path.join(dataDir, "users.json")
const notesFile = path.join(dataDir, "notes.json")

// Helper: Initialize data files if they don't exist
function initializeDataFiles() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]))
  }

  if (!fs.existsSync(notesFile)) {
    fs.writeFileSync(notesFile, JSON.stringify([]))
  }
}

// Helper: Read users from JSON
function getUsers() {
  try {
    return JSON.parse(fs.readFileSync(usersFile, "utf-8"))
  } catch (error) {
    return []
  }
}

// Helper: Write users to JSON
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
}

// Helper: Read notes from JSON
function getNotes() {
  try {
    return JSON.parse(fs.readFileSync(notesFile, "utf-8"))
  } catch (error) {
    return []
  }
}

// Helper: Write notes to JSON
function saveNotes(notes) {
  fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2))
}

// Helper: Authentication middleware
function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  next()
}

// Helper: Teacher authorization middleware
function checkTeacher(req, res, next) {
  if (!req.session.user || req.session.user.role !== "teacher") {
    return res.status(403).json({ error: "Teacher access required" })
  }
  next()
}

// ============ API ROUTES ============

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

// Initialize seed data endpoint
app.post("/api/init-seed", (req, res) => {
  const seedData = require("./data/seedData.json")
  saveUsers(seedData.users)
  saveNotes(seedData.notes)
  res.json({ message: "Database initialized with seed data" })
})

// AUTH ROUTES

// Register
app.post("/api/auth/register", (req, res) => {
  const { email, password, fullName, role } = req.body

  if (!email || !password || !fullName || !role) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  const users = getUsers()
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Email already registered" })
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password, // In production, this should be hashed with bcrypt
    fullName,
    role: role.toLowerCase(),
    approved: false, // New users need approval
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  res.json({
    message: "Registration successful. Please wait for approval from your teacher or admin.",
  })
})

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" })
  }

  const users = getUsers()
  const user = users.find((u) => u.email === email.trim() && u.password === password.trim())

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  if (!user.approved) {
    return res.status(403).json({ error: "Your account is pending approval. Please contact your administrator." })
  }

  req.session.user = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  }

  res.json({
    message: "Login successful",
    user: req.session.user,
  })
})

// Get Current User
app.get("/api/auth/me", checkAuth, (req, res) => {
  res.json({ user: req.session.user })
})

// Logout
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy()
  res.json({ message: "Logged out successfully" })
})

// APPROVAL ROUTES

// Get pending approvals (Admin gets pending teachers, Teachers get pending students)
app.get("/api/approvals/pending", checkAuth, (req, res) => {
  const users = getUsers()
  let pendingUsers = []

  if (req.session.user.role === "admin") {
    // Admin sees pending teachers
    pendingUsers = users.filter(u => u.role === "teacher" && !u.approved)
  } else if (req.session.user.role === "teacher") {
    // Teachers see pending students
    pendingUsers = users.filter(u => u.role === "student" && !u.approved)
  } else {
    return res.status(403).json({ error: "Access denied" })
  }

  res.json({ pendingUsers })
})

// Approve user (Admin approves teachers, Teachers approve students)
app.post("/api/approvals/approve/:userId", checkAuth, (req, res) => {
  const { userId } = req.params
  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === userId)

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" })
  }

  const targetUser = users[userIndex]

  // Check permissions
  if (req.session.user.role === "admin" && targetUser.role !== "teacher") {
    return res.status(403).json({ error: "Admin can only approve teachers" })
  }

  if (req.session.user.role === "teacher" && targetUser.role !== "student") {
    return res.status(403).json({ error: "Teachers can only approve students" })
  }

  if (req.session.user.role === "student") {
    return res.status(403).json({ error: "Students cannot approve users" })
  }

  // Approve the user
  users[userIndex].approved = true
  saveUsers(users)

  res.json({ message: `${targetUser.fullName} has been approved successfully` })
})

// NOTES ROUTES

// Get All Notes with optional filtering
app.get("/api/notes", checkAuth, (req, res) => {
  const { department, year, subject, search, sortBy } = req.query
  let notes = getNotes()

  // Apply filters
  if (department) {
    notes = notes.filter((n) => n.department === department)
  }
  if (year) {
    notes = notes.filter((n) => n.year === year)
  }
  if (subject) {
    notes = notes.filter((n) => n.subject === subject)
  }
  if (search) {
    const searchLower = search.toLowerCase()
    notes = notes.filter(
      (n) => n.title.toLowerCase().includes(searchLower) || n.description.toLowerCase().includes(searchLower),
    )
  }

  // Apply sorting
  if (sortBy === "newest") {
    notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  } else if (sortBy === "oldest") {
    notes.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  } else if (sortBy === "title") {
    notes.sort((a, b) => a.title.localeCompare(b.title))
  }

  res.json({ notes })
})

// Get single note
app.get("/api/notes/:id", checkAuth, (req, res) => {
  const notes = getNotes()
  const note = notes.find((n) => n.id === req.params.id)

  if (!note) {
    return res.status(404).json({ error: "Note not found" })
  }

  res.json({ note })
})

// Upload Note (Teachers only)
app.post("/api/notes/upload", checkAuth, checkTeacher, upload.single("file"), (req, res) => {
  const { title, description, department, year, subject } = req.body

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" })
  }

  if (!title || !description || !department || !year || !subject) {
    // Delete uploaded file if validation fails
    fs.unlinkSync(req.file.path)
    return res.status(400).json({ error: "Missing required fields" })
  }

  const newNote = {
    id: Date.now().toString(),
    title,
    description,
    department,
    year,
    subject,
    fileType: path.extname(req.file.originalname).substring(1),
    fileName: req.file.filename,
    originalFileName: req.file.originalname,
    fileSize: req.file.size,
    uploadedBy: req.session.user.id,
    uploadedByName: req.session.user.fullName,
    timestamp: new Date().toISOString(),
    downloads: 0,
  }

  const notes = getNotes()
  notes.push(newNote)
  saveNotes(notes)

  res.json({
    message: "File uploaded successfully",
    note: newNote,
  })
})

// Upload Link (Teachers only)
app.post("/api/notes/upload-link", checkAuth, checkTeacher, (req, res) => {
  const { title, description, department, year, subject, linkUrl, linkPlatform } = req.body

  if (!title || !description || !department || !year || !subject || !linkUrl) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  // Basic URL validation
  try {
    new URL(linkUrl)
  } catch (error) {
    return res.status(400).json({ error: "Invalid URL format" })
  }

  const newNote = {
    id: Date.now().toString(),
    title,
    description,
    department,
    year,
    subject,
    linkUrl,
    linkPlatform: linkPlatform || "other",
    uploadedBy: req.session.user.id,
    uploadedByName: req.session.user.fullName,
    timestamp: new Date().toISOString(),
    downloads: 0,
  }

  const notes = getNotes()
  notes.push(newNote)
  saveNotes(notes)

  res.json({
    message: "Link uploaded successfully",
    note: newNote,
  })
})

// Update Note (Teachers only)
app.put("/api/notes/:id", checkAuth, checkTeacher, (req, res) => {
  const { title, description, department, year, subject } = req.body
  const notes = getNotes()
  const noteIndex = notes.findIndex((n) => n.id === req.params.id)

  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" })
  }

  // Only the uploader can edit
  if (notes[noteIndex].uploadedBy !== req.session.user.id) {
    return res.status(403).json({ error: "Only the uploader can edit this note" })
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    title: title || notes[noteIndex].title,
    description: description || notes[noteIndex].description,
    department: department || notes[noteIndex].department,
    year: year || notes[noteIndex].year,
    subject: subject || notes[noteIndex].subject,
    updatedAt: new Date().toISOString(),
  }

  saveNotes(notes)
  res.json({ message: "Note updated successfully", note: notes[noteIndex] })
})

// Delete Note (Teachers only)
app.delete("/api/notes/:id", checkAuth, checkTeacher, (req, res) => {
  const notes = getNotes()
  const noteIndex = notes.findIndex((n) => n.id === req.params.id)

  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" })
  }

  // Only the uploader can delete
  if (notes[noteIndex].uploadedBy !== req.session.user.id) {
    return res.status(403).json({ error: "Only the uploader can delete this note" })
  }

  const note = notes[noteIndex]
  const filePath = path.join(__dirname, "uploads", note.fileName)

  // Delete file from server
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }

  notes.splice(noteIndex, 1)
  saveNotes(notes)

  res.json({ message: "Note deleted successfully" })
})

// Download Note (increment counter)
app.post("/api/notes/:id/download", checkAuth, (req, res) => {
  const notes = getNotes()
  const note = notes.find((n) => n.id === req.params.id)

  if (!note) {
    return res.status(404).json({ error: "Note not found" })
  }

  note.downloads = (note.downloads || 0) + 1
  saveNotes(notes)

  res.json({ message: "Download recorded" })
})

// Get Metadata (departments, years, subjects)
app.get("/api/metadata", (req, res) => {
  const notes = getNotes()

  const departments = [...new Set(notes.map((n) => n.department))].sort()
  const years = [...new Set(notes.map((n) => n.year))].sort()
  const subjects = [...new Set(notes.map((n) => n.subject))].sort()

  res.json({ departments, years, subjects })
})

// Initialize data and start server
initializeDataFiles()

app.listen(PORT, () => {
  console.log(`\n================================================`)
  console.log(`Notes Organizer Server Running`)
  console.log(`http://localhost:${PORT}`)
  console.log(`================================================\n`)
})
