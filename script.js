let currentEditTask = null;
const tasks = [];
const completedTasks = [];

function toggleModal() {
    const modal = document.getElementById("taskModal");
    modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function closeModal() {
    document.getElementById("taskModal").style.display = "none";
    currentEditTask = null;
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDateTime").value = "";
    document.getElementById("taskPriority").value = "";
    document.getElementById("taskCategory").value = "";
}

function addTask() {
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const dateTime = new Date(document.getElementById("taskDateTime").value);
    const priority = document.getElementById("taskPriority").value;
    const category = document.getElementById("taskCategory").value;

    if (currentEditTask) {
        // Update existing task
        currentEditTask.title = title;
        currentEditTask.description = description;
        currentEditTask.dateTime = dateTime;
        currentEditTask.priority = priority;
        currentEditTask.category = category;
    } else {
        // Add new task
        const newTask = { title, description, dateTime, priority, category };
        tasks.push(newTask);
    }

    renderTasks();
    closeModal();
}

function renderTasks(filter = 'all') {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => task.category === filter);

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.priority + '-priority';
        li.innerHTML = ` 
                    <div class="task-text">
                        <strong class="task-title">${task.title}</strong>
                        <h3 class="task-description">${task.description}</h3>
                        <h4 class="due">Due: ${task.dateTime.toLocaleString()}</h4>
                    </div>
                    <div class="task-buttons">
                        <button class="edit" onclick="editTask(${index})">Edit</button>
                        <button class="complete" onclick="completeTask(${index})">Complete</button>
                        <button class="remove" onclick="removeTask(${index})">Remove</button>
                    </div>
                `;
        taskList.appendChild(li);
    });

    checkDeadlines();
}

function filterTasks(category) {
    renderTasks(category);
}

function editTask(index) {
    const task = tasks[index];
    currentEditTask = task;

    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDescription").value = task.description;
    document.getElementById("taskDateTime").value = task.dateTime.toISOString().slice(0, 16);
    document.getElementById("taskPriority").value = task.priority;
    document.getElementById("taskCategory").value = task.category;

    toggleModal();
}

function completeTask(index) {
    const completedTask = tasks.splice(index, 1)[0];
    completedTasks.push(completedTask);
    renderTasks();
}

function removeTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function viewCompletedTasks() {
    document.getElementById("taskContainer").style.display = "none";
    document.getElementById("completedTasks").style.display = "block";
    renderCompletedTasks();
}

function viewActiveTasks() {
    document.getElementById("completedTasks").style.display = "none";
    document.getElementById("taskContainer").style.display = "flex";
}

function renderCompletedTasks() {
    const completedTaskList = document.getElementById("completedTaskList");
    completedTaskList.innerHTML = "";

    completedTasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
                    <div>
                        <strong class="task-title">${task.title}</strong>
                        <h3 class="task-description">${task.description}</h3>
                        <h4>Completed</h4>
                    </div>
                `;
        completedTaskList.appendChild(li);
    });
}

function checkDeadlines() {
    const now = new Date();
    tasks.forEach((task, index) => {
        const timeDiff = task.dateTime - now;
        const taskElement = document.querySelectorAll("#taskList li")[index];

        if (timeDiff <= 5 * 60 * 1000 && timeDiff > 0) { // Less than or equal to 5 minutes
            taskElement.classList.add('overdue');
        } else {
            taskElement.classList.remove('overdue');
        }
    });
}

setInterval(checkDeadlines, 60000); // Check every minute