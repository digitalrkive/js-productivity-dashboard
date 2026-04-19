// clock
function updateClock() {
  const currentTime = new Date();
  const hours   = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

updateClock();
setInterval(updateClock, 1000);

// nav
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

navItems.forEach(function(item) {
  item.addEventListener('click', function() {
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    pages.forEach(function(page) {
      page.style.display = 'none';
    });
    const target = item.dataset.page;
    document.getElementById(target).style.display = 'block';
  });
});

// toast not
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}

// editing modal
let editingIndex = null;

function openEditModal(index) {
  editingIndex = index;
  document.getElementById('modal-input').value = tasks[index].text;
  document.getElementById('modal-overlay').style.display = 'flex';
}

document.getElementById('modal-cancel').addEventListener('click', function() {
  document.getElementById('modal-overlay').style.display = 'none';
});

document.getElementById('modal-save').addEventListener('click', function() {
  const newText = document.getElementById('modal-input').value.trim();
  if (newText !== '') {
    tasks[editingIndex].text = newText;
    saveTasks();
    renderTable();
  }
  document.getElementById('modal-overlay').style.display = 'none';
});

// todo tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTable() {
  const body = document.getElementById('todo-body');
  body.innerHTML = '';

  tasks.forEach(function(task, index) {
    const row = document.createElement('tr');

    const doneCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', function() {
      tasks[index].done = checkbox.checked;
      saveTasks();
      renderTable();
    });
    doneCell.appendChild(checkbox);

    const taskCell = document.createElement('td');
    taskCell.textContent = task.text;
    if (task.done) taskCell.style.textDecoration = 'line-through';

    const actionsCell = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', function() {
      openEditModal(index);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function() {
      tasks.splice(index, 1);
      saveTasks();
      renderTable();
    });

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);
    row.appendChild(doneCell);
    row.appendChild(taskCell);
    row.appendChild(actionsCell);
    body.appendChild(row);
  });
}

document.getElementById('todo-add').addEventListener('click', function() {
  const input = document.getElementById('todo-input');
  const value = input.value.trim();
  if (value === '') return;
  tasks.push({ text: value, done: false });
  saveTasks();
  renderTable();
  input.value = '';
  showToast('Task added! View in the To-Do tab.');
});

document.getElementById('todo-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('todo-add').click();
});

renderTable();