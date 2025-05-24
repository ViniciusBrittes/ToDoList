// Referência aos elementos HTML
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Carrega tarefas armazenadas ao iniciar a aplicação
function loadTasks() {
  // Recupera os dados do localStorage (ou lista vazia)
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Para cada tarefa, adiciona à interface
  tasks.forEach(task => addTaskToDOM(task.text, task.completed));
}

// Ativa/desativa dark mode
document.getElementById("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Permite adicionar a tarefa pressionando Enter
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Adiciona nova tarefa quando o botão é clicado
function addTask() {
  const text = taskInput.value.trim(); // Remove espaços em branco

  if (text === "") return; // Evita adicionar tarefas vazias

  addTaskToDOM(text);      // Adiciona visualmente
  saveTask(text);          // Salva no armazenamento local
  taskInput.value = "";    // Limpa o campo de entrada
}

// Cria visualmente um novo item na lista
function addTaskToDOM(text, completed = false) {
  const li = document.createElement("li");
  li.textContent = text;

  if (completed) li.classList.add("completed"); // Aplica estilo de concluído

  // Alterna entre tarefa concluída ou não ao clicar
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateLocalStorage();
  });

  // Botão de deletar tarefa
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";

  // Ao clicar no botão, remove o item
  deleteBtn.onclick = (e) => {
    e.stopPropagation(); // Evita marcar como concluída ao apagar
    li.remove();         // Remove da interface
    updateLocalStorage();
  };

  li.appendChild(deleteBtn);  // Adiciona botão ao item
  taskList.appendChild(li);   // Adiciona item à lista
}

// Salva nova tarefa no localStorage
function saveTask(text) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Atualiza o localStorage com o estado atual da lista
function updateLocalStorage() {
  const tasks = [];

  // Para cada item visual, extrai texto e status
  document.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.firstChild.textContent,
      completed: li.classList.contains("completed")
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Executa ao carregar a página
loadTasks();
