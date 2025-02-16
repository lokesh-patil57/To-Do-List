 // Load tasks from localStorage
 let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

 // Initialize the app
 document.addEventListener('DOMContentLoaded', () => {
     renderTasks();
     setupDragAndDrop();
 });

 // Add new task
 function addTask() {
     const input = document.getElementById('taskInput');
     const category = document.getElementById('taskCategory');
     const priority = document.getElementById('taskPriority');
     const dueDate = document.getElementById('taskDueDate');
     const text = input.value.trim();
     
     if (text) {
         tasks.push({
             id: Date.now(),
             text: text,
             completed: false,
             category: category.value,
             priority: priority.value,
             dueDate: dueDate.value
         });
         saveTasks();
         renderTasks();
         input.value = '';
         category.value = '';
         priority.value = '';
         dueDate.value = '';
         updateProgress();
     }
 }

 // Handle enter key
 document.getElementById('taskInput').addEventListener('keypress', (e) => {
     if (e.key === 'Enter') {
         addTask();
     }
 });

 // Delete task
 function deleteTask(id) {
     tasks = tasks.filter(task => task.id !== id);
     saveTasks();
     renderTasks();
 }

 // Toggle task completion
 function toggleTask(id) {
     tasks = tasks.map(task => 
         task.id === id ? {...task, completed: !task.completed} : task
     );
     saveTasks();
     renderTasks();
 }

 // Save tasks to localStorage
 function saveTasks() {
     localStorage.setItem('tasks', JSON.stringify(tasks));
 }

 // Filter tasks
 function filterTasks() {
     const statusFilter = document.getElementById('filterStatus').value;
     const categoryFilter = document.getElementById('filterCategory').value;
     const priorityFilter = document.getElementById('filterPriority').value;

     return tasks.filter(task => {
         const statusMatch = statusFilter === 'all' || 
             (statusFilter === 'completed' && task.completed) ||
             (statusFilter === 'active' && !task.completed);
         const categoryMatch = categoryFilter === 'all' || task.category === categoryFilter;
         const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
         
         return statusMatch && categoryMatch && priorityMatch;
     });
 }

 // Update progress bar
 function updateProgress() {
     const total = tasks.length;
     const completed = tasks.filter(task => task.completed).length;
     const progress = total === 0 ? 0 : (completed / total) * 100;
     document.getElementById('progressBar').style.width = `${progress}%`;
 }

 // Render tasks
 function renderTasks() {
     const taskList = document.getElementById('taskList');
     taskList.innerHTML = '';
     
     const filteredTasks = filterTasks();
     
     filteredTasks.forEach(task => {
         const li = document.createElement('li');
         li.className = `task-item ${task.completed ? 'completed' : ''} ${task.priority ? 'priority-' + task.priority : ''}`;
         li.draggable = true;
         li.dataset.id = task.id;
         
         const dueDate = task.dueDate ? new Date(task.dueDate) : null;
         const dueDateStr = dueDate ? `<span class="due-date">Due: ${dueDate.toLocaleString()}</span>` : '';
         
         li.innerHTML = `
             <input type="checkbox" class="task-checkbox" 
                 ${task.completed ? 'checked' : ''} 
                 onchange="toggleTask(${task.id})">
             <div class="task-details">
                 <span class="task-text">${task.text}</span>
                 ${task.category ? `<span class="category-tag">${task.category}</span>` : ''}
                 ${dueDateStr}
             </div>
             <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
         `;
         
         taskList.appendChild(li);
     });