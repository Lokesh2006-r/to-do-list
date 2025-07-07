let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDate(dt) {
  return dt ? new Date(dt).toLocaleString() : "";
}

function renderTasks() {
  const pendingList = document.getElementById("pendingList");
  const completedList = document.getElementById("completedList");
  const search = document.getElementById("searchBox").value.toLowerCase();

  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  sortedTasks.forEach((task, index) => {
    if (!task.title.toLowerCase().includes(search)) return;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    if (task.done) li.classList.add("task-done");

    const left = document.createElement("div");
    const title = document.createElement("div");
    title.className = "task-title fw-bold";
    title.innerText = task.title;

    const time = document.createElement("div");
    time.className = "task-time";
    time.innerText = task.datetime ? `Due: ${formatDate(task.datetime)}` : "";

    left.appendChild(title);
    left.appendChild(time);

    const right = document.createElement("div");

    if (!task.done) {
      const doneBtn = document.createElement("button");
      doneBtn.className = "btn btn-success btn-sm me-2";
      doneBtn.innerText = "Mark as Completed";
      doneBtn.onclick = () => completeTask(index);
      right.appendChild(doneBtn);
    }

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-warning btn-sm me-2";
    editBtn.innerText = "Edit";
    editBtn.onclick = () => editTask(index);

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-danger btn-sm";
    delBtn.innerText = "Delete";
    delBtn.onclick = () => deleteTask(index);

    right.append(editBtn, delBtn);

    li.append(left, right);

    if (task.done) {
      completedList.appendChild(li);
    } else {
      pendingList.appendChild(li);
    }
  });
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskDt = document.getElementById("taskDt");

  const title = taskInput.value.trim();
  const datetime = taskDt.value;

  if (!title) return alert("Task cannot be empty.");

  tasks.push({ title, datetime, done: false });
  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskDt.value = "";
}

function completeTask(index) {
  tasks[index].done = true;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newTitle = prompt("Edit task:", tasks[index].title);
  if (newTitle !== null && newTitle.trim() !== "") {
    tasks[index].title = newTitle.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.done);
  saveTasks();
  renderTasks();
}

document.getElementById("searchBox").addEventListener("input", renderTasks);

document.addEventListener("DOMContentLoaded", renderTasks);
