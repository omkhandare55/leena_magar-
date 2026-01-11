/**
 * Theme Toggle - Light/Dark Mode
 * Persists theme preference to localStorage
 */

const themeToggle = document.getElementById("themeToggle")
const htmlElement = document.documentElement

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem("theme") || "light"
htmlElement.setAttribute("data-theme", currentTheme)
updateThemeIcon(currentTheme)

// Theme toggle event listener
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const theme = htmlElement.getAttribute("data-theme")
    const newTheme = theme === "light" ? "dark" : "light"

    htmlElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    updateThemeIcon(newTheme)
  })
}

function updateThemeIcon(theme) {
  if (themeToggle) {
    themeToggle.textContent = theme === "light" ? "🌙" : "☀️"
  }
}
