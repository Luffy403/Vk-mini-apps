document.addEventListener('DOMContentLoaded', function() {
    const noteInput = document.getElementById('noteInput');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const notesList = document.getElementById('notesList');
    
    // Загрузка заметок из localStorage
    let notes = JSON.parse(localStorage.getItem('vk_notes')) || [];
    
    // Отображение заметок
    function renderNotes() {
        notesList.innerHTML = '';
        
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `
                <button class="delete-btn" data-index="${index}">×</button>
                <div class="note-text">${note.text}</div>
                <div class="note-date">${new Date(note.date).toLocaleString()}</div>
            `;
            notesList.appendChild(noteElement);
        });
        
        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteNote(index);
            });
        });
    }
    
    // Добавление новой заметки
    function addNote() {
        const text = noteInput.value.trim();
        if (text) {
            const newNote = {
                text: text,
                date: new Date().toISOString()
            };
            
            notes.unshift(newNote);
            localStorage.setItem('vk_notes', JSON.stringify(notes));
            noteInput.value = '';
            renderNotes();
            
            // Можно отправить событие в VK Bridge о создании заметки
            if (typeof vkBridge !== 'undefined') {
                vkBridge.send('VKWebAppNotification', {
                    message: 'Заметка добавлена!'
                });
            }
        }
    }
    
    // Удаление заметки
    function deleteNote(index) {
        notes.splice(index, 1);
        localStorage.setItem('vk_notes', JSON.stringify(notes));
        renderNotes();
    }
    
    // Обработчики событий
    addNoteBtn.addEventListener('click', addNote);
    noteInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addNote();
        }
    });
    
    // Первоначальная загрузка заметок
    renderNotes();
});
