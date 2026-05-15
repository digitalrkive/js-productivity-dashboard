let editingIndex = null;
let fcModalMode  = null;
let fcEditIndex  = null;

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

  if (fcModalMode === 'topic') {
    if (!input1) return;
    topics.push({ id: Date.now(), name: input1, cards: [] });
    saveTopics();
    renderTopics();
    closeModal();
    return;
  }

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