// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  setupDragAndDrop();
});

// Add new task
function addTask() {
  const input = document.getElementById("taskInput");
  const category = document.getElementById("taskCategory");
  const priority = document.getElementById("taskPriority");
  const dueDate = document.getElementById("taskDueDate");
  const text = input.value.trim();

  if (text) {
    tasks.push({
      id: Date.now(),
      text: text,
      completed: false,
      category: category.value,
      priority: priority.value,
      dueDate: dueDate.value,
    });
    saveTasks();
    renderTasks();
    input.value = "";
    category.value = "";
    priority.value = "";
    dueDate.value = "";
    updateProgress();
  }
}

// Handle enter key
document.getElementById("taskInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Delete task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// Toggle task completion
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter tasks
function filterTasks() {
  const statusFilter = document.getElementById("filterStatus").value;
  const categoryFilter = document.getElementById("filterCategory").value;
  const priorityFilter = document.getElementById("filterPriority").value;

  return tasks.filter((task) => {
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "active" && !task.completed);
    const categoryMatch =
      categoryFilter === "all" || task.category === categoryFilter;
    const priorityMatch =
      priorityFilter === "all" || task.priority === priorityFilter;

    return statusMatch && categoryMatch && priorityMatch;
  });
}

// Update progress bar
function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const progress = total === 0 ? 0 : (completed / total) * 100;
  document.getElementById("progressBar").style.width = `${progress}%`;
}

// Render tasks
function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const filteredTasks = filterTasks();

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""} ${
      task.priority ? "priority-" + task.priority : ""
    }`;
    li.draggable = true;
    li.dataset.id = task.id;

    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const dueDateStr = dueDate
      ? `<span class="due-date">Due: ${dueDate.toLocaleString()}</span>`
      : "";

    li.innerHTML = `
             <input type="checkbox" class="task-checkbox" 
                 ${task.completed ? "checked" : ""} 
                 onchange="toggleTask(${task.id})">
             <div class="task-details">
                 <span class="task-text">${task.text}</span>
                 ${
                   task.category
                     ? `<span class="category-tag">${task.category}</span>`
                     : ""
                 }
                 ${dueDateStr}
             </div>
             <button class="delete-btn" onclick="deleteTask(${
               task.id
             })">Delete</button>
         `;

    taskList.appendChild(li);
  });
  setupDragAndDrop();
  updateProgress();
}

// Setup drag and drop
function setupDragAndDrop() {
  const taskItems = document.querySelectorAll(".task-item");
  const taskList = document.getElementById("taskList");

  taskItems.forEach((item) => {
    item.addEventListener("dragstart", () => {
      item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
    });
  });

  taskList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskList, e.clientY);
    const draggable = document.querySelector(".dragging");

    if (afterElement == null) {
      taskList.appendChild(draggable);
    } else {
      taskList.insertBefore(draggable, afterElement);
    }
  });

  taskList.addEventListener("drop", () => {
    updateTasksOrder();
  });
}

// Helper function for drag and drop
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".task-item:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Update tasks array after drag and drop
function updateTasksOrder() {
  const taskElements = document.querySelectorAll(".task-item");
  const newTasks = [];

  taskElements.forEach((element) => {
    const taskId = parseInt(element.dataset.id);
    const task = tasks.find((t) => t.id === taskId);
    if (task) newTasks.push(task);
  });

  tasks = newTasks;
  saveTasks();
}

// Add dark mode toggle
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const button = document.querySelector(".theme-toggle");
  const isDarkMode = document.body.classList.contains("dark-mode");
  button.textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("darkMode", isDarkMode);
}

// Initialize dark mode from localStorage
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true") {
    toggleTheme();
  }
  renderTasks();
  setupDragAndDrop();
});

// Add event listeners for filters
document
  .querySelectorAll("#filterStatus, #filterCategory, #filterPriority")
  .forEach((filter) => {
    filter.addEventListener("change", renderTasks);
  });
