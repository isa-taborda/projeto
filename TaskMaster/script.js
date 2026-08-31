const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');

let tasks = JSON.parse(localStorage.getItem('taskmaster_tasks')) || [];


function render() {

  taskList.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.classList.add('show');
  } else {
    emptyState.classList.remove('show');
  }

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <div class="task-checkbox ${task.done ? 'checked' : ''}" data-index="${index}"></div>
      <span class="task-text ${task.done ? 'done' : ''}" data-index="${index}">${escapeHtml(task.text)}</span>
      <button class="delete-btn" data-index="${index}" title="Excluir tarefa">🗑</button>
    `;
    taskList.appendChild(li);
  });

  updateStats();

  saveToStorage();
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === '') {
    shakeInput();
    return;
  }

  const newTask = {
    text: text,
    done: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);

  taskInput.value = '';
  taskInput.focus();

  render();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  render();
}

function deleteTask(index) {

  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    tasks.splice(index, 1);
    render();
  }
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;

  totalTasksEl.textContent = `${total} ${total === 1 ? 'tarefa' : 'tarefas'}`;
  completedTasksEl.textContent = `${completed} ${completed === 1 ? 'concluída' : 'concluídas'}`;
}

function saveToStorage() {
  localStorage.setItem('taskmaster_tasks', JSON.stringify(tasks));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function shakeInput() {
  taskInput.style.animation = 'none';
  taskInput.offsetHeight;
  taskInput.style.animation = 'shake 0.4s ease';

  setTimeout(() => {
    taskInput.style.animation = '';
  }, 400);
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

taskList.addEventListener('click', (e) => {
  const target = e.target;
  const index = parseInt(target.dataset.index);

  if (isNaN(index)) return;

  if (target.classList.contains('task-checkbox') || target.classList.contains('task-text')) {
    toggleTask(index);
  }

  if (target.classList.contains('delete-btn')) {
    deleteTask(index);
  }
});

const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(style);

render();

console.log('📝 TaskMaster carregado com sucesso!');
console.log(`📊 ${tasks.length} tarefas carregadas do LocalStorage`);
