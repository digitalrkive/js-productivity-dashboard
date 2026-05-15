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
    checkbox.type    = 'checkbox';
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