// Aplica dark mode logo ao carregar
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark");
}

// Referência aos elementos HTML
const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskListActive = document.getElementById("task-list-active");
const taskListCompleted = document.getElementById("task-list-completed");

// Dark mode toggle
document.getElementById("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
});

// Enter adiciona tarefa
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value;
  if (text === "") return;
  addTaskToDOM(text, false, date);
  saveTask(text, date);
  taskInput.value = "";
  taskDate.value = "";

  renderTasks();
}

function formatDateBR(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year.slice(2)}`;
}

document.getElementById("clear-completed").addEventListener("click", () => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => !task.completed);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
});

function addTaskToDOM(text, completed = false, date = "") {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;

  if (date) {
    const small = document.createElement("small");
    small.textContent = ` (📅 ${formatDateBR(date)})`;
    span.appendChild(small);
  }

  if (completed) li.classList.add("completed");

  li.appendChild(span);

  const actionBtn = document.createElement("button");

  if (completed) {
    actionBtn.textContent = "🗑️";
    actionBtn.title = "Excluir";
    actionBtn.onclick = (e) => {
      e.stopPropagation();
      li.remove();
      updateLocalStorage();
    };
  } else {
    actionBtn.textContent = "✅";
    actionBtn.title = "Concluir";
    actionBtn.onclick = (e) => {
      e.stopPropagation();
      li.classList.add("completed");
      updateLocalStorage();
      renderTasks(); // move tarefa
    };
  }

  li.appendChild(actionBtn);

  if (completed) {
    taskListCompleted.appendChild(li);
  } else {
    taskListActive.appendChild(li);
  }
}

function saveTask(text, date) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, completed: false, date });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateLocalStorage() {
  const tasks = [];
  document.querySelectorAll("li").forEach(li => {
    const span = li.querySelector("span");
    const dateText = span.querySelector("small")?.textContent || "";
    const dateMatch = dateText.match(/\d{2}\/\d{2}\/\d{2}/);
    const date = dateMatch ? formatDateISO(dateMatch[0]) : "";
    tasks.push({
      text: span.firstChild.textContent,
      completed: li.classList.contains("completed"),
      date
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDateISO(dateBR) {
  const [day, month, year] = dateBR.split("/");
  return `20${year}-${month}-${day}`;
}

function renderTasks() {
  taskListActive.innerHTML = "";
  taskListCompleted.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let countActive = 0;
  let countCompleted = 0;

  tasks.forEach(task => {
    addTaskToDOM(task.text, task.completed, task.date);
    task.completed ? countCompleted++ : countActive++;
  });

  // Atualiza contadores no DOM
  document.getElementById("count-active").textContent = countActive;
  document.getElementById("count-completed").textContent = countCompleted;

  // Exibe ou oculta botão "Limpar"
  document.getElementById("clear-completed").style.display =
    countCompleted > 0 ? "block" : "none";
}



// Executa ao carregar a página
renderTasks();

