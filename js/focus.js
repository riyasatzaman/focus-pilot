// Elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

const taskView = document.getElementById("task-view");
const timerView = document.getElementById("timer-view");
const activeTaskName = document.getElementById("active-task-name");
const backBtn = document.getElementById("back-btn");

const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

// Timer state
let timer = null;
let timeLeft = 25 * 60;
let isRunning = false;

let tasks = [];

// Load tasks from chrome.storage on startup
chrome.storage.local.get(["tasks"], (result) => {
  tasks = result.tasks || [];
  renderTasks();
});

// Save tasks
function saveTasks() {
  chrome.storage.local.set({ tasks });
}

// Handle form submit
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const newTask = {
      id: Date.now(),
      text: taskText,
      selected: false,
    };
    tasks.push(newTask);
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
});

// Render task list
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className =
      "bg-white border border-gray-300 p-2 rounded flex justify-between items-center hover:bg-blue-50 relative";

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.className = "cursor-pointer flex-1";
    if (task.selected) {
      li.classList.add("border-blue-600", "bg-blue-100");
    }

    taskText.addEventListener("click", () => {
      tasks.forEach((t) => (t.selected = false));
      task.selected = true;
      saveTasks();
      renderTasks();
      showTimerForTask(task);
    });

    const menuButton = document.createElement("button");
    menuButton.innerHTML = "⋮";
    menuButton.className = "text-gray-500 hover:text-gray-800 px-2";
    menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown(li);
    });

    const dropdown = document.createElement("div");
    dropdown.className =
      "task-dropdown absolute right-2 top-8 bg-white shadow-md rounded border border-gray-200 text-sm hidden z-10";

    const editOption = document.createElement("div");
    editOption.textContent = "Edit";
    editOption.className = "px-4 py-2 hover:bg-gray-100 cursor-pointer";
    editOption.addEventListener("click", () => {
      const newText = prompt("Edit task", task.text);
      if (newText && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    });

    const deleteOption = document.createElement("div");
    deleteOption.textContent = "Delete";
    deleteOption.className = "px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer";
    deleteOption.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    dropdown.appendChild(editOption);
    dropdown.appendChild(deleteOption);
    li.appendChild(taskText);
    li.appendChild(menuButton);
    li.appendChild(dropdown);
    taskList.appendChild(li);
  });
}

// Format MM:SS
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Update Timer UI
function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
}

// Show Timer View for Selected Task
function showTimerForTask(task) {
  taskView.classList.add("hidden");
  timerView.classList.remove("hidden");

  activeTaskName.textContent = task.text;
  timeLeft = 25 * 60;
  updateDisplay();

  clearInterval(timer);
  isRunning = false;
  startBtn.classList.remove("hidden");
  pauseBtn.classList.add("hidden");
}

// Back to Task List View
backBtn.addEventListener("click", () => {
  clearInterval(timer);
  isRunning = false;
  taskView.classList.remove("hidden");
  timerView.classList.add("hidden");
});

// Timer Controls
startBtn.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    startBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden");

    timer = setInterval(() => {
      timeLeft--;
      updateDisplay();

      if (timeLeft <= 0) {
        clearInterval(timer);
        alert("Time's up!");
        isRunning = false;
        startBtn.classList.remove("hidden");
        pauseBtn.classList.add("hidden");
        timeLeft = 25 * 60;
        updateDisplay();
      }
    }, 1000);
  }
});

pauseBtn.addEventListener("click", () => {
  clearInterval(timer);
  isRunning = false;
  startBtn.classList.remove("hidden");
  pauseBtn.classList.add("hidden");
});

resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25 * 60;
  updateDisplay();
  startBtn.classList.remove("hidden");
  pauseBtn.classList.add("hidden");
});

// Dropdown logic
function toggleDropdown(container) {
  document.querySelectorAll(".task-dropdown").forEach((d) => {
    d.classList.add("hidden");
  });
  const dropdown = container.querySelector("div:not(:first-child):not(:nth-child(2))");
  if (dropdown) dropdown.classList.toggle("hidden");
}

document.addEventListener("click", (e) => {
  if (!e.target.closest("li")) {
    document.querySelectorAll(".task-dropdown").forEach((d) => {
      d.classList.add("hidden");
    });
  }
});

