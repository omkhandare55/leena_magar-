/**
 * Authentication Handler
 * Handles login and registration forms
 */

const loginForm = document.getElementById("loginForm")
const registerForm = document.getElementById("registerForm")

// Login Handler
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        showAlert("Login successful!", "success")
        setTimeout(() => {
          window.location.href = "/dashboard.html"
        }, 1000)
      } else {
        showAlert(data.error || "Login failed", "error")
      }
    } catch (error) {
      showAlert("Error connecting to server", "error")
    }
  })
}

// Registration Handler
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const fullName = document.getElementById("fullName").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const role = document.getElementById("role").value

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role }),
      })

      const data = await response.json()

      if (response.ok) {
        showAlert("Registration successful! Redirecting to login...", "success")
        setTimeout(() => {
          window.location.href = "/login.html"
        }, 1500)
      } else {
        showAlert(data.error || "Registration failed", "error")
      }
    } catch (error) {
      showAlert("Error connecting to server", "error")
    }
  })
}

// Alert Display
function showAlert(message, type = "info") {
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type}`
  alertDiv.innerHTML = `
        <span>${message}</span>
        <button class="alert-close">&times;</button>
    `

  document.body.insertBefore(alertDiv, document.body.firstChild)

  alertDiv.querySelector(".alert-close").addEventListener("click", () => {
    alertDiv.remove()
  })

  setTimeout(() => alertDiv.remove(), 5000)
}
