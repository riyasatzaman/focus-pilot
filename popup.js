// popup.js

// Get references to all tab content divs
const tabs = {
    focus: document.getElementById("focus-tab"),
    countdown: document.getElementById("countdown-tab"),
    notes: document.getElementById("notes-tab"),
  };
  
  // Get references to the tab buttons
  const buttons = {
    focus: document.getElementById("tab-focus"),
    countdown: document.getElementById("tab-countdown"),
    notes: document.getElementById("tab-notes"),
  };
  
  // Function to show one tab and hide others
  function showTab(tabName) {
    // Hide all tabs
    Object.keys(tabs).forEach((name) => {
      tabs[name].classList.add("hidden");
      buttons[name].classList.remove("text-blue-600", "border-b-2", "border-blue-600");
    });
  
    // Show the selected tab
    tabs[tabName].classList.remove("hidden");
    buttons[tabName].classList.add("text-blue-600", "border-b-2", "border-blue-600");
  }
  
  // Set default tab on load
  showTab("focus");
  
  // Add click events to buttons
  buttons.focus.addEventListener("click", () => showTab("focus"));
  buttons.countdown.addEventListener("click", () => showTab("countdown"));
  buttons.notes.addEventListener("click", () => showTab("notes"));