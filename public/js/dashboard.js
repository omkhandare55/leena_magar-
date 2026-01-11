/**
 * Dashboard Handler
 * Main dashboard functionality for browsing, uploading, and managing notes
 */

let currentUser = null
let allNotes = []
let allMetadata = {}

// Check authentication on page load
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize seed data
  await initializeSeedData()

  // Check if user is logged in
  const authResponse = await fetch("/api/auth/me")
  if (!authResponse.ok) {
    window.location.href = "/login.html"
    return
  }

  const authData = await authResponse.json()
  currentUser = authData.user

  // Update UI based on user role
  updateUIForRole()



  // Load metadata and notes
  await loadMetadata()
  await loadNotes()

  // Setup event listeners
  setupEventListeners()
})

// Initialize seed data
async function initializeSeedData() {
  try {
    await fetch("/api/init-seed", { method: "POST" })
  } catch (error) {
    console.log("Seed data initialization completed or not needed")
  }
}

// Update UI based on user role
function updateUIForRole() {
  const userInfo = document.getElementById("userInfo")
  userInfo.textContent = `${currentUser.fullName} (${currentUser.role})`

  if (currentUser.role === "teacher") {
    document.getElementById("uploadMenuBtn").style.display = "block"
    document.getElementById("myNotesMenuBtn").style.display = "block"
  }

  if (currentUser.role === "admin" || currentUser.role === "teacher") {
    document.getElementById("approvalsMenuBtn").style.display = "block"
  }
}

// Load metadata (departments, years, subjects)
async function loadMetadata() {
  try {
    const response = await fetch("/api/metadata")
    const data = await response.json()
    allMetadata = data

    // Populate filter dropdowns
    populateSelectOptions("departmentFilter", data.departments)
    populateSelectOptions("yearFilter", data.years)
    populateSelectOptions("subjectFilter", data.subjects)
    populateSelectOptions("uploadDepartment", data.departments)
  } catch (error) {
    console.error("Error loading metadata:", error)
  }
}

// Populate select dropdown with options
function populateSelectOptions(elementId, options) {
  const select = document.getElementById(elementId)
  options.forEach((option) => {
    const optionElement = document.createElement("option")
    optionElement.value = option
    optionElement.textContent = option
    select.appendChild(optionElement)
  })
}

// Load all notes
async function loadNotes() {
  try {
    const response = await fetch("/api/notes")
    const data = await response.json()
    allNotes = data.notes
    displayNotes(allNotes)
  } catch (error) {
    console.error("Error loading notes:", error)
    showAlert("Error loading notes", "error")
  }
}

// Display notes in grid
function displayNotes(notes) {
  const notesGrid = document.getElementById("notesGrid")
  notesGrid.innerHTML = ""

  if (notes.length === 0) {
    notesGrid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">No notes found</p>'
    return
  }

  notes.forEach((note) => {
    const noteCard = createNoteCard(note)
    notesGrid.appendChild(noteCard)
  })
}

// Create note card element
function createNoteCard(note) {
  const card = document.createElement("div")
  card.className = "note-card"

  const uploadedDate = new Date(note.timestamp).toLocaleDateString()
  const isOwner = note.uploadedBy === currentUser.id
  const isLink = !!note.linkUrl

  let actionsHTML = `<button class="note-action-btn" onclick="viewNoteDetails('${note.id}')">👁️ View</button>`

  if (isOwner) {
    actionsHTML += `<button class="note-action-btn" onclick="editNote('${note.id}')">✏️ Edit</button>`
    actionsHTML += `<button class="note-action-btn delete" onclick="deleteNote('${note.id}')">🗑️ Delete</button>`
  } else if (!isLink) {
    actionsHTML += `<button class="note-action-btn" onclick="downloadNote('${note.id}', '${note.originalFileName}')">⬇️ Download</button>`
  } else {
    actionsHTML += `<button class="note-action-btn" onclick="openLink('${note.linkUrl}')">🔗 Open Link</button>`
  }

  const typeBadge = isLink ? '<span class="badge badge-link">🔗 Link</span>' : '<span class="badge badge-file">📁 File</span>'

  card.innerHTML = `
        <div class="note-card-header">
            <div>
                <div class="note-title">${escapeHtml(note.title)}</div>
                ${typeBadge}
            </div>
        </div>
        <div class="note-meta">
            <span class="badge">${note.department}</span>
            <span class="badge badge-secondary">${note.year}</span>
            <span class="badge">${note.subject}</span>
        </div>
        <div class="note-description">${escapeHtml(note.description)}</div>
        <div class="note-footer">
            <span>${uploadedDate}</span>
            <span>${isLink ? '🔗 Link' : `📥 ${note.downloads || 0}`}</span>
            <div class="note-actions">
                ${actionsHTML}
            </div>
        </div>
    `

  return card
}

// View note details in modal
function viewNoteDetails(noteId) {
  const note = allNotes.find((n) => n.id === noteId)
  if (!note) return

  const modal = document.getElementById("noteModal")
  const modalBody = document.getElementById("modalBody")
  const uploadedDate = new Date(note.timestamp).toLocaleDateString()
  const isLink = !!note.linkUrl

  let actionButton = ""
  const isOwner = note.uploadedBy === currentUser.id

  if (isLink) {
    actionButton = `<button class="btn btn-secondary" onclick="openLink('${note.linkUrl}')">🔗 Open Link</button>`
  } else if (!isOwner) {
    actionButton = `<button class="btn btn-secondary" onclick="downloadNote('${note.id}', '${note.originalFileName}')">⬇️ Download</button>`
  }

  let metaItems = `
        <div class="modal-meta-item">
            <div class="modal-meta-label">Department</div>
            <div class="modal-meta-value">${note.department}</div>
        </div>
        <div class="modal-meta-item">
            <div class="modal-meta-label">Year</div>
            <div class="modal-meta-value">${note.year}</div>
        </div>
        <div class="modal-meta-item">
            <div class="modal-meta-label">Subject</div>
            <div class="modal-meta-value">${note.subject}</div>
        </div>
        <div class="modal-meta-item">
            <div class="modal-meta-label">Type</div>
            <div class="modal-meta-value">${isLink ? '🔗 Link' : '📁 File'}</div>
        </div>`

  if (isLink) {
    metaItems += `
        <div class="modal-meta-item">
            <div class="modal-meta-label">Platform</div>
            <div class="modal-meta-value">${note.linkPlatform || 'Other'}</div>
        </div>
        <div class="modal-meta-item">
            <div class="modal-meta-label">URL</div>
            <div class="modal-meta-value"><a href="${note.linkUrl}" target="_blank" rel="noopener noreferrer">${note.linkUrl}</a></div>
        </div>`
  } else {
    metaItems += `
        <div class="modal-meta-item">
            <div class="modal-meta-label">File Type</div>
            <div class="modal-meta-value">${note.fileType.toUpperCase()}</div>
        </div>
        <div class="modal-meta-item">
            <div class="modal-meta-label">File Size</div>
            <div class="modal-meta-value">${(note.fileSize / 1024 / 1024).toFixed(2)} MB</div>
        </div>`
  }

  metaItems += `
        <div class="modal-meta-item">
            <div class="modal-meta-label">Uploaded By</div>
            <div class="modal-meta-value">${note.uploadedByName}</div>
        </div>
        <div class="modal-meta-item">
            <div class="modal-meta-label">Date</div>
            <div class="modal-meta-value">${uploadedDate}</div>
        </div>
        <div class="modal-meta-item">
            <div class="modal-meta-label">${isLink ? 'Clicks' : 'Downloads'}</div>
            <div class="modal-meta-value">${note.downloads || 0}</div>
        </div>`

  modalBody.innerHTML = `
        <h2 class="modal-note-title">${escapeHtml(note.title)}</h2>
        <div class="modal-note-meta">
            ${metaItems}
        </div>
        <div class="modal-note-description">${escapeHtml(note.description)}</div>
        <div class="modal-buttons">
            ${actionButton}
        </div>
    `

  modal.classList.add("active")
}

// Download note
async function downloadNote(noteId, fileName) {
  try {
    // Record download
    await fetch(`/api/notes/${noteId}/download`, { method: "POST" })

    // Trigger download
    const link = document.createElement("a")
    link.href = `/uploads/${allNotes.find((n) => n.id === noteId).fileName}`
    link.download = fileName
    link.click()

    showAlert("Download started!", "success")

    // Reload notes to update download count
    await loadNotes()
  } catch (error) {
    showAlert("Error downloading file", "error")
  }
}

// Open link
function openLink(url) {
  // Record click for link
  const note = allNotes.find((n) => n.linkUrl === url)
  if (note) {
    fetch(`/api/notes/${note.id}/download`, { method: "POST" }).catch(() => {})
  }

  // Open link in new tab
  window.open(url, '_blank', 'noopener,noreferrer')

  showAlert("Link opened!", "success")

  // Reload notes to update click count
  setTimeout(() => loadNotes(), 1000)
}

// Delete note (teacher only)
async function deleteNote(noteId) {
  if (!confirm("Are you sure you want to delete this note?")) return

  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
    })

    if (response.ok) {
      showAlert("Note deleted successfully", "success")
      await loadNotes()
    } else {
      const data = await response.json()
      showAlert(data.error || "Error deleting note", "error")
    }
  } catch (error) {
    showAlert("Error deleting note", "error")
  }
}

// Edit note (teacher only)
function editNote(noteId) {
  showAlert("Edit functionality coming soon", "info")
}

// Setup event listeners
function setupEventListeners() {
  // Menu items
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const section = item.getAttribute("data-section")
      showSection(section)

      // Update active state
      document.querySelectorAll(".menu-item").forEach((m) => m.classList.remove("active"))
      item.classList.add("active")
    })
  })

  // Search and filter
  document.getElementById("searchInput").addEventListener("input", applyFilters)
  document.getElementById("departmentFilter").addEventListener("change", applyFilters)
  document.getElementById("yearFilter").addEventListener("change", applyFilters)
  document.getElementById("subjectFilter").addEventListener("change", applyFilters)
  document.getElementById("sortBy").addEventListener("change", applyFilters)

  // Upload form event listeners will be set up when upload section is shown

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", logout)

  // Modal close
  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("noteModal").classList.remove("active")
  })

  // Close modal on outside click
  document.getElementById("noteModal").addEventListener("click", (e) => {
    if (e.target.id === "noteModal") {
      document.getElementById("noteModal").classList.remove("active")
    }
  })
}

// Show/hide sections
function showSection(section) {
  console.log("Showing section:", section)
  document.querySelectorAll(".dashboard-section").forEach((s) => s.classList.remove("active"))

  if (section === "notes") {
    document.getElementById("notes-section").classList.add("active")
  } else if (section === "upload") {
    const uploadSection = document.getElementById("upload-section")
    uploadSection.classList.add("active")
    uploadSection.style.display = "block" // Ensure it's visible
    console.log("Upload section activated")
    displayUserUploadsInSidebar()
    setupUploadEventListeners()
  } else if (section === "my-notes") {
    document.getElementById("my-notes-section").classList.add("active")
    displayMyUploads()
  } else if (section === "approvals") {
    document.getElementById("approvals-section").classList.add("active")
    loadPendingApprovals()
  }
}

// Setup upload event listeners when upload section is shown
function setupUploadEventListeners() {
  // Upload form
  const uploadForm = document.getElementById("uploadForm")
  if (uploadForm && !uploadForm.hasAttribute("data-listener-attached")) {
    uploadForm.addEventListener("submit", handleUpload)
    uploadForm.setAttribute("data-listener-attached", "true")
  }

  // Upload type toggle buttons
  const fileUploadBtn = document.getElementById("fileUploadBtn")
  const linkUploadBtn = document.getElementById("linkUploadBtn")

  if (fileUploadBtn && !fileUploadBtn.hasAttribute("data-listener-attached")) {
    fileUploadBtn.addEventListener("click", () => toggleUploadType("file"))
    fileUploadBtn.setAttribute("data-listener-attached", "true")
  }

  if (linkUploadBtn && !linkUploadBtn.hasAttribute("data-listener-attached")) {
    linkUploadBtn.addEventListener("click", () => toggleUploadType("link"))
    linkUploadBtn.setAttribute("data-listener-attached", "true")
  }

  // Initialize toggle to file upload
  toggleUploadType("file")
}

// Display user's uploads (all users)
function displayMyUploads() {
  const myUploads = allNotes.filter((n) => n.uploadedBy === currentUser.id)
  const myUploadsGrid = document.getElementById("myUploadsGrid")

  if (myUploads.length === 0) {
    myUploadsGrid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">No uploads yet</p>'
    return
  }

  myUploadsGrid.innerHTML = ""
  myUploads.forEach((upload) => {
    const uploadCard = createNoteCard(upload)
    myUploadsGrid.appendChild(uploadCard)
  })
}

// Display user's uploads in the sidebar
function displayUserUploadsInSidebar() {
  const myUploads = allNotes.filter((n) => n.uploadedBy === currentUser.id)
  const uploadsList = document.getElementById("userUploadsList")

  if (myUploads.length === 0) {
    uploadsList.innerHTML = '<p class="no-uploads">No uploads yet</p>'
    return
  }

  uploadsList.innerHTML = ""
  myUploads.slice(0, 10).forEach((upload) => { // Show last 10 uploads
    const uploadItem = document.createElement("div")
    uploadItem.className = "user-upload-item"
    uploadItem.onclick = () => viewNoteDetails(upload.id)

    const uploadType = upload.linkUrl ? "Link" : "File"
    const displayText = upload.linkUrl ? upload.linkUrl.substring(0, 30) + "..." : upload.title

    uploadItem.innerHTML = `
      <h4>${escapeHtml(upload.title)}</h4>
      <p>${escapeHtml(displayText)}</p>
      <span class="upload-type">${uploadType}</span>
    `

    uploadsList.appendChild(uploadItem)
  })
}

// Apply filters
async function applyFilters() {
  const search = document.getElementById("searchInput").value
  const department = document.getElementById("departmentFilter").value
  const year = document.getElementById("yearFilter").value
  const subject = document.getElementById("subjectFilter").value
  const sortBy = document.getElementById("sortBy").value

  const params = new URLSearchParams()
  if (search) params.append("search", search)
  if (department) params.append("department", department)
  if (year) params.append("year", year)
  if (subject) params.append("subject", subject)
  params.append("sortBy", sortBy)

  try {
    const response = await fetch(`/api/notes?${params}`)
    const data = await response.json()
    displayNotes(data.notes)
  } catch (error) {
    console.error("Error applying filters:", error)
  }
}

// Toggle upload type (file/link)
function toggleUploadType(type) {
  const fileBtn = document.getElementById("fileUploadBtn")
  const linkBtn = document.getElementById("linkUploadBtn")
  const fileFields = document.getElementById("fileUploadFields")
  const linkFields = document.getElementById("linkUploadFields")
  const fileInput = document.getElementById("uploadFile")
  const linkInput = document.getElementById("uploadLink")

  if (type === "file") {
    fileBtn.classList.add("active")
    linkBtn.classList.remove("active")
    fileFields.style.display = "block"
    linkFields.style.display = "none"
    fileInput.required = true
    linkInput.required = false
  } else {
    linkBtn.classList.add("active")
    fileBtn.classList.remove("active")
    linkFields.style.display = "block"
    fileFields.style.display = "none"
    linkInput.required = true
    fileInput.required = false
  }
}

// Handle upload (file or link)
async function handleUpload(e) {
  e.preventDefault()

  const isFileUpload = document.getElementById("fileUploadBtn").classList.contains("active")

  if (isFileUpload) {
    await handleFileUpload()
  } else {
    await handleLinkUpload()
  }
}

// Handle file upload
async function handleFileUpload() {
  const formData = new FormData()
  formData.append("title", document.getElementById("uploadTitle").value)
  formData.append("department", document.getElementById("uploadDepartment").value)
  formData.append("year", document.getElementById("uploadYear").value)
  formData.append("subject", document.getElementById("uploadSubject").value)
  formData.append("description", document.getElementById("uploadDescription").value)
  formData.append("file", document.getElementById("uploadFile").files[0])

  try {
    const response = await fetch("/api/notes/upload", {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      showAlert("File uploaded successfully!", "success")
      document.getElementById("uploadForm").reset()
      toggleUploadType("file") // Reset to file upload
      await loadNotes()
      await loadMetadata()
      displayUserUploadsInSidebar()
    } else {
      const data = await response.json()
      showAlert(data.error || "Upload failed", "error")
    }
  } catch (error) {
    showAlert("Error uploading file", "error")
  }
}

// Handle link upload
async function handleLinkUpload() {
  const linkData = {
    title: document.getElementById("uploadTitle").value,
    department: document.getElementById("uploadDepartment").value,
    year: document.getElementById("uploadYear").value,
    subject: document.getElementById("uploadSubject").value,
    description: document.getElementById("uploadDescription").value,
    linkUrl: document.getElementById("uploadLink").value,
    linkPlatform: document.getElementById("linkPlatform").value,
  }

  try {
    const response = await fetch("/api/notes/upload-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(linkData),
    })

    if (response.ok) {
      showAlert("Link uploaded successfully!", "success")
      document.getElementById("uploadForm").reset()
      toggleUploadType("file") // Reset to file upload
      await loadNotes()
      await loadMetadata()
      displayUserUploadsInSidebar()
    } else {
      const data = await response.json()
      showAlert(data.error || "Upload failed", "error")
    }
  } catch (error) {
    showAlert("Error uploading link", "error")
  }
}

// Logout
async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/index.html"
  } catch (error) {
    showAlert("Error logging out", "error")
  }
}

// Show alert
function showAlert(message, type = "info") {
  const container = document.getElementById("alertContainer")
  const alertItem = document.createElement("div")
  alertItem.className = `alert-item ${type}`
  alertItem.textContent = message

  container.appendChild(alertItem)

  setTimeout(() => alertItem.remove(), 5000)
}

// Helper: Escape HTML
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
async function loadPendingStudents() {
    const response = await fetch('/api/admin/pending-students');
    const students = await response.json();
    const container = document.getElementById('pending-list');
    
    container.innerHTML = ''; // Clear current list

    if (students.length === 0) {
        container.innerHTML = '<p>No pending approvals.</p>';
        return;
    }

    students.forEach(student => {
        const div = document.createElement('div');
        div.className = 'student-approval-item';
        div.innerHTML = `
            <span>${student.email}</span>
            <button onclick="approveStudent('${student.email}')" class="btn-approve">
                Approve Login
            </button>
        `;
        container.appendChild(div);
    });
}

async function approveStudent(email) {
    const response = await fetch('/api/admin/approve-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });

    const result = await response.json();
    if (result.success) {
        alert(email + " can now log in!");
        loadPendingStudents(); // Refresh the list
    }
}

// Load pending approvals
async function loadPendingApprovals() {
  try {
    const response = await fetch("/api/approvals/pending")
    const data = await response.json()
    displayPendingApprovals(data.pendingUsers)
  } catch (error) {
    console.error("Error loading pending approvals:", error)
    showAlert("Error loading pending approvals", "error")
  }
}

// Display pending approvals
function displayPendingApprovals(pendingUsers) {
  const container = document.getElementById("pendingApprovalsList")
  container.innerHTML = ""

  if (pendingUsers.length === 0) {
    container.innerHTML = '<p class="no-pending">No pending approvals</p>'
    return
  }

  pendingUsers.forEach((user) => {
    const approvalItem = document.createElement("div")
    approvalItem.className = "approval-item"

    const roleText = user.role.charAt(0).toUpperCase() + user.role.slice(1)
    const registeredDate = new Date(user.createdAt).toLocaleDateString()

    approvalItem.innerHTML = `
      <div class="approval-info">
        <h4>${escapeHtml(user.fullName)}</h4>
        <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
        <p><strong>Role:</strong> ${roleText}</p>
        <p><strong>Registered:</strong> ${registeredDate}</p>
      </div>
      <div class="approval-actions">
        <button class="btn btn-primary btn-small" onclick="approveUser('${user.id}', '${user.fullName}')">
          ✅ Approve
        </button>
      </div>
    `

    container.appendChild(approvalItem)
  })
}

// Approve user
async function approveUser(userId, userName) {
  try {
    const response = await fetch(`/api/approvals/approve/${userId}`, {
      method: "POST",
    })

    if (response.ok) {
      showAlert(`${userName} has been approved successfully!`, "success")
      loadPendingApprovals() // Refresh the list
    } else {
      const data = await response.json()
      showAlert(data.error || "Error approving user", "error")
    }
  } catch (error) {
    showAlert("Error approving user", "error")
  }
}

// Call this function when the Teacher dashboard loads
if (userRole === 'teacher') {
    loadPendingStudents();
}
