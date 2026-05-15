let topics            = JSON.parse(localStorage.getItem('flashcardTopics')) || [];
let currentTopicId    = null;
let currentStudyIndex = 0;

function saveTopics() {
  localStorage.setItem('flashcardTopics', JSON.stringify(topics));
}

function getTopicById(id) {
  return topics.find(t => t.id === id);
}

function showView(viewId) {
  document.getElementById('fc-topics-view').style.display = 'none';
  document.getElementById('fc-cards-view').style.display  = 'none';
  document.getElementById('fc-study-view').style.display  = 'none';
  document.getElementById(viewId).style.display           = 'block';
}

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

  document.getElementById('fc-front-text').textContent     = card.front;
  document.getElementById('fc-back-text').textContent      = card.back;
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