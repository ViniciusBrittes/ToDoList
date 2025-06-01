// Referência aos elementos HTML
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskDate = document.getElementById("task-date");



// Carrega tarefas armazenadas ao iniciar a aplicação
function loadTasks() {
  // Recupera os dados do localStorage (ou lista vazia)
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // Recupera o darkmode pelo localStorage
  if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark");
}
  // Para cada tarefa, adiciona à interface
  tasks.forEach(task => addTaskToDOM(task.text, task.completed, task.date));

}

// Ativa/desativa dark mode
document.getElementById("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // Salva preferência no localStorage
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
});

// Permite adicionar a tarefa pressionando Enter
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Adiciona nova tarefa quando o botão é clicado
function addTask() {
  const text = taskInput.value.trim();
  
  const date = taskDate.value; // Formato YYYY-MM-DD

  if (text === "") return;

  addTaskToDOM(text, false, date);
  saveTask(text, date);
  taskInput.value = "";
  taskDate.value = "";
}

function formatDateBR(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year.slice(2)}`;
}

// Cria visualmente um novo item na lista
function addTaskToDOM(text, completed = false, date = "") {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;

  // Exibe a data, se houver
  if (date && date !== "") {
    const small = document.createElement("small");
    small.textContent = ` (📅 ${formatDateBR(date)})`;
    span.appendChild(small);
  }

  if (completed) li.classList.add("completed");

  li.appendChild(span);

  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateLocalStorage();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    li.remove();
    updateLocalStorage();
  };

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}


// Salva nova tarefa no localStorage
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
    const date = dateText.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "";

    tasks.push({
      text: span.firstChild.textContent,
      completed: li.classList.contains("completed"),
      date
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Executa ao carregar a página
loadTasks();
