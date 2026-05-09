// Clock 

function updateClock() {
  const currentTime = new Date();
  const hours   = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

updateClock();
setInterval(updateClock, 1000);


// Nav

const navItems = document.querySelectorAll('.nav-item');
const pages    = document.querySelectorAll('.page');

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


// Toast 

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}

// Shared Modal

let editingIndex = null; // for task editing
let fcModalMode  = null; // 'topic' | 'card' | null
let fcEditIndex  = null; // index of card being edited

function openEditModal(index) {
  editingIndex = index;
  fcModalMode  = null;
  fcEditIndex  = null;

  document.getElementById('modal-title').textContent       = 'Edit Task';
  document.getElementById('modal-input').value             = tasks[index].text;
  document.getElementById('modal-input').placeholder       = 'Edit your task...';
  document.getElementById('modal-input-2').style.display   = 'none';
  document.getElementById('modal-input-2').value           = '';
  document.getElementById('modal-overlay').style.display   = 'flex';
}

function openFlashcardModal(mode, topicId, cardIndex) {
  fcModalMode  = mode;
  fcEditIndex  = cardIndex;
  editingIndex = null;

  const modal2 = document.getElementById('modal-input-2');

  if (mode === 'topic') {
    document.getElementById('modal-title').textContent     = cardIndex !== null ? 'Edit Subject' : 'New Subject';
    document.getElementById('modal-input').value           = '';
    document.getElementById('modal-input').placeholder     = 'Subject name...';
    modal2.style.display = 'none';
    modal2.value = '';
  }

  if (mode === 'card') {
    const existing = cardIndex !== null ? getTopicById(topicId).cards[cardIndex] : null;
    document.getElementById('modal-title').textContent     = cardIndex !== null ? 'Edit Card' : 'New Card';
    document.getElementById('modal-input').placeholder     = 'Front of card...';
    document.getElementById('modal-input').value           = existing ? existing.front : '';
    modal2.placeholder   = 'Back of card...';
    modal2.style.display = 'block';
    modal2.value         = existing ? existing.back : '';
  }

  document.getElementById('modal-overlay').style.display = 'flex';
}

document.getElementById('modal-save').addEventListener('click', function() {
  const input1 = document.getElementById('modal-input').value.trim();

  // Flashcard: new/edit topic
  if (fcModalMode === 'topic') {
    if (!input1) return;
    topics.push({ id: Date.now(), name: input1, cards: [] });
    saveTopics();
    renderTopics();
    closeModal();
    return;
  }

  // Flashcard: new/edit card 
  if (fcModalMode === 'card') {
    const input2 = document.getElementById('modal-input-2').value.trim();
    if (!input1 || !input2) return;
    const topic = getTopicById(currentTopicId);
    if (fcEditIndex !== null) {
      topic.cards[fcEditIndex] = { front: input1, back: input2 };
    } else {
      topic.cards.push({ id: Date.now(), front: input1, back: input2 });
    }
    saveTopics();
    renderCards();
    closeModal();
    return;
  }

  // Task: edit existing 
  if (editingIndex !== null && input1 !== '') {
    tasks[editingIndex].text = input1;
    saveTasks();
    renderTable();
  }
  closeModal();
});

document.getElementById('modal-cancel').addEventListener('click', closeModal);

function closeModal() {
  fcModalMode  = null;
  fcEditIndex  = null;
  editingIndex = null;
  document.getElementById('modal-overlay').style.display = 'none';
}


// Tasks

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


//  Flashcards 
let topics           = JSON.parse(localStorage.getItem('flashcardTopics')) || [];
let currentTopicId   = null;
let currentStudyIndex = 0;

function saveTopics() {
  localStorage.setItem('flashcardTopics', JSON.stringify(topics));
}

function getTopicById(id) {
  return topics.find(t => t.id === id);
}

// View switching
function showView(viewId) {
  document.getElementById('fc-topics-view').style.display = 'none';
  document.getElementById('fc-cards-view').style.display  = 'none';
  document.getElementById('fc-study-view').style.display  = 'none';
  document.getElementById(viewId).style.display           = 'block';
}

//  Topics view
function renderTopics() {
  const grid = document.getElementById('fc-topics-grid');
  grid.innerHTML = '';

  if (topics.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);font-size:0.875rem;margin-top:16px;">No subjects yet. Add one to get started.</p>';
    return;
  }

  topics.forEach(function(topic) {
    const card = document.createElement('div');
    card.className = 'fc-topic-card';
    card.innerHTML = `
      <h3>${topic.name}</h3>
      <span>${topic.cards.length} card${topic.cards.length !== 1 ? 's' : ''}</span>
      <div class="fc-topic-actions">
        <button class="fc-open-btn">Open</button>
        <button class="fc-delete-topic-btn">Delete</button>
      </div>
    `;

    card.querySelector('.fc-open-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      openTopic(topic.id);
    });

    card.querySelector('.fc-delete-topic-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      deleteTopic(topic.id);
    });

    grid.appendChild(card);
  });
}

function deleteTopic(id) {
  topics = topics.filter(t => t.id !== id);
  saveTopics();
  renderTopics();
}

document.getElementById('fc-add-topic-btn').addEventListener('click', function() {
  openFlashcardModal('topic', null, null);
});

// Cards view 

function openTopic(id) {
  currentTopicId = id;
  const topic = getTopicById(id);
  document.getElementById('fc-topic-title').textContent = topic.name;
  renderCards();
  showView('fc-cards-view');
}

function renderCards() {
  const topic = getTopicById(currentTopicId);
  const grid  = document.getElementById('fc-cards-grid');

  document.getElementById('fc-card-count').textContent =
    `${topic.cards.length} card${topic.cards.length !== 1 ? 's' : ''}`;

  grid.innerHTML = '';

  if (topic.cards.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);font-size:0.875rem;margin-top:16px;">No cards yet. Add one!</p>';
    return;
  }

  topic.cards.forEach(function(card, index) {
    const tile = document.createElement('div');
    tile.className = 'fc-card-tile';
    tile.innerHTML = `
      <div class="fc-card-front">${card.front}</div>
      <div class="fc-card-back">${card.back}</div>
      <div class="fc-card-tile-actions">
        <button class="fc-edit-card-btn">Edit</button>
        <button class="fc-delete-card-btn">Delete</button>
      </div>
    `;

    tile.querySelector('.fc-edit-card-btn').addEventListener('click', function() {
      openFlashcardModal('card', currentTopicId, index);
    });

    tile.querySelector('.fc-delete-card-btn').addEventListener('click', function() {
      deleteCard(index);
    });

    grid.appendChild(tile);
  });
}

function deleteCard(index) {
  const topic = getTopicById(currentTopicId);
  topic.cards.splice(index, 1);
  saveTopics();
  renderCards();
}

document.getElementById('fc-back-btn').addEventListener('click', function() {
  currentTopicId = null;
  renderTopics();
  showView('fc-topics-view');
});

document.getElementById('fc-add-card-btn').addEventListener('click', function() {
  openFlashcardModal('card', currentTopicId, null);
});

// Study view 

document.getElementById('fc-study-btn').addEventListener('click', function() {
  const topic = getTopicById(currentTopicId);
  if (topic.cards.length === 0) {
    showToast('Add some cards first!');
    return;
  }
  currentStudyIndex = 0;
  renderStudyCard();
  showView('fc-study-view');
});

document.getElementById('fc-study-back-btn').addEventListener('click', function() {
  showView('fc-cards-view');
});

function renderStudyCard() {
  const topic = getTopicById(currentTopicId);
  const card  = topic.cards[currentStudyIndex];

  document.getElementById('fc-front-text').textContent    = card.front;
  document.getElementById('fc-back-text').textContent     = card.back;
  document.getElementById('fc-study-progress').textContent =
    `Card ${currentStudyIndex + 1} of ${topic.cards.length}`;

  document.getElementById('fc-flashcard').classList.remove('flipped');
}

document.getElementById('fc-flashcard').addEventListener('click', function() {
  this.classList.toggle('flipped');
});

document.getElementById('fc-prev-btn').addEventListener('click', function() {
  if (currentStudyIndex > 0) {
    currentStudyIndex--;
    renderStudyCard();
  }
});

document.getElementById('fc-next-btn').addEventListener('click', function() {
  const topic = getTopicById(currentTopicId);
  if (currentStudyIndex < topic.cards.length - 1) {
    currentStudyIndex++;
    renderStudyCard();
  }
});

renderTopics();