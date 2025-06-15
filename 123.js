document.addEventListener("DOMContentLoaded", () => {
  const addBox = document.querySelector(".add-box");
  const popupBox = document.querySelector(".popup-box");
  const addNoteBtn = document.getElementById("add-note-btn");
  const noteTitle = document.getElementById("note-title");
  const noteDesc = document.getElementById("note-description");
  const wrapper = document.querySelector(".wrapper");

  let editingNote = null;

  addBox.addEventListener("click", () => {
    editingNote = null;
    addNoteBtn.textContent = "Add";
    noteTitle.value = "";
    noteDesc.value = "";
    popupBox.classList.remove("hidden");
  });

  // Close popup when clicking outside
  popupBox.addEventListener("click", (e) => {
    if (e.target === popupBox) popupBox.classList.add("hidden");
  });
  
// document.getElementById('sortSelector').addEventListener('change', showNotes);
  
function createNote(title, description, date = null) {
  const note = document.createElement("li");
  note.className = "note";
  const currentDate = date || new Date();
  const formattedDate = `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  note.innerHTML = `
    <div class="main_info">
      <h1>${title}</h1>
      <p>${description}</p>
    </div>
    <div class="note-footer">${formattedDate}</div>
    <div class="bottom-content">
      <div class="settings">
        <i class="uil uil-ellipsis-h"></i>
        <ul class="menu">
          <li class="archive"><i class="uil uil-eye-slash"></i><p>Archive</p></li>
          <li class="edit"><i class="uil uil-pen"></i><p>Edit</p></li>
          <li class="delete"><i class="uil uil-trash"></i><p>Delete</p></li>
        </ul>
      </div>
    </div>
  `;

    addNoteEventListeners(note);
    wrapper.appendChild(note);
  }

  function addNoteEventListeners(note) {
    const settingsIcon = note.querySelector(".uil-ellipsis-h");
    const menu = note.querySelector(".settings");

    settingsIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".settings").forEach(m => m.classList.remove("show"));
      menu.classList.toggle("show");
    });

    note.querySelector(".archive").addEventListener("click", () => {
      note.classList.toggle("archived");
      const text = note.classList.contains("archived") ? "Unarchive" : "Archive";
      note.querySelector(".archive p").textContent = text;
    });

    note.querySelector(".delete").addEventListener("click", () => {
      if (confirm("Delete this note?")) note.remove();
    });

    note.querySelector(".edit").addEventListener("click", () => {
      editingNote = note;
      noteTitle.value = note.querySelector("h1").textContent;
      noteDesc.value = note.querySelector("p").textContent;
      addNoteBtn.textContent = "Save";
      popupBox.classList.remove("hidden");
    });
  }

  // Global click to hide menu
  document.addEventListener("click", () => {
    document.querySelectorAll(".settings").forEach(m => m.classList.remove("show"));
  });

  addNoteBtn.addEventListener("click", () => {
    const title = noteTitle.value.trim();
    const desc = noteDesc.value.trim();
    if (!title || !desc) {
      alert("Fill out both fields!");
      return;
    }

    if (editingNote) {
      editingNote.querySelector("h1").textContent = title;
      editingNote.querySelector("p").textContent = desc;
      editingNote = null;
      addNoteBtn.textContent = "Add";
    } else {
      createNote(title, desc);
    }

    noteTitle.value = "";
    noteDesc.value = "";
    popupBox.classList.add("hidden");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const addBox = document.querySelector(".add-box");
  const popupBox = document.querySelector(".popup-box");
  const addNoteBtn = document.getElementById("add-note-btn");
  const noteTitle = document.getElementById("note-title");
  const noteDesc = document.getElementById("note-description");
  const wrapper = document.querySelector(".wrapper");

  const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

  let notes = JSON.parse(localStorage.getItem("notes") || "[]");
  let editingIndex = null;

  // Функція збереження notes у localStorage
  function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  // Функція створення елемента нотатки у DOM
  function createNoteElement(noteObj, index) {
    const note = document.createElement("li");
    note.className = "note";
    if (noteObj.archived) note.classList.add("archived");

    const noteDate = new Date(noteObj.date);
    const formattedDate = `${months[noteDate.getMonth()]} ${noteDate.getDate()}, ${noteDate.getFullYear()}`;

    note.innerHTML = `
      <div class="main_info">
        <h1>${noteObj.title}</h1>
        <p>${noteObj.description}</p>
      </div>
      <div class="note-footer">${formattedDate}</div>
      <div class="bottom-content">
        <div class="settings">
          <i class="uil uil-ellipsis-h"></i>
          <ul class="menu">
            <li class="archive"><i class="uil uil-eye-slash"></i><p>${noteObj.archived ? "Unarchive" : "Archive"}</p></li>
            <li class="edit"><i class="uil uil-pen"></i><p>Edit</p></li>
            <li class="delete"><i class="uil uil-trash"></i><p>Delete</p></li>
          </ul>
        </div>
      </div>
    `;

    // Події для меню налаштувань
    const settingsIcon = note.querySelector(".uil-ellipsis-h");
    const menu = note.querySelector(".settings");

    settingsIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".settings").forEach(m => m.classList.remove("show"));
      menu.classList.toggle("show");
    });

    // Архівування
    note.querySelector(".archive").addEventListener("click", () => {
      notes[index].archived = !notes[index].archived;
      saveNotes();
      renderNotes();
    });

    // Видалення
    note.querySelector(".delete").addEventListener("click", () => {
      if (confirm("Delete this note?")) {
        notes.splice(index, 1);
        saveNotes();
        renderNotes();
      }
    });

    // Редагування
    note.querySelector(".edit").addEventListener("click", () => {
      editingIndex = index;
      noteTitle.value = notes[index].title;
      noteDesc.value = notes[index].description;
      addNoteBtn.textContent = "Save";
      popupBox.classList.remove("hidden");
    });

    return note;
  }

  // Функція рендерингу нотаток
  function renderNotes() {
    // Видаляємо всі існуючі нотатки
    document.querySelectorAll(".note").forEach(n => n.remove());

    notes.forEach((noteObj, idx) => {
      const noteElem = createNoteElement(noteObj, idx);
      wrapper.appendChild(noteElem);
    });
  }

  // Клік по кнопці додавання нотатки
  addNoteBtn.addEventListener("click", () => {
    const title = noteTitle.value.trim();
    const desc = noteDesc.value.trim();

    if (!title || !desc) {
      alert("Fill out both fields!");
      return;
    }

    const currentDate = new Date().toISOString();

    if (editingIndex !== null) {
      // Зберігаємо зміни
      notes[editingIndex].title = title;
      notes[editingIndex].description = desc;
      notes[editingIndex].date = currentDate;
      editingIndex = null;
      addNoteBtn.textContent = "Add";
    } else {
      // Додаємо нову нотатку
      notes.push({
        title,
        description: desc,
        date: currentDate,
        archived: false
      });
    }

    saveNotes();
    renderNotes();

    noteTitle.value = "";
    noteDesc.value = "";
    popupBox.classList.add("hidden");
  });

  // Відкриваємо попап додавання нотатки
  addBox.addEventListener("click", () => {
    editingIndex = null;
    addNoteBtn.textContent = "Add";
    noteTitle.value = "";
    noteDesc.value = "";
    popupBox.classList.remove("hidden");
  });

  // Закриття попапу при кліку поза ним
  popupBox.addEventListener("click", (e) => {
    if (e.target === popupBox) popupBox.classList.add("hidden");
  });

  // Закриваємо меню, якщо клік поза ним
  document.addEventListener("click", () => {
    document.querySelectorAll(".settings").forEach(m => m.classList.remove("show"));
  });

  // Перший рендер нотаток з localStorage
  renderNotes();
});


function showNotes() {
  document.querySelectorAll(".note").forEach(li => li.remove());

  let sortMode = document.getElementById('sortSelector')?.value || 'activeFirst';
  let notesToShow = [];

  if (sortMode === 'activeFirst') {
    let activeNotes = notes.filter(n => !n.archived);
    let archivedNotes = notes.filter(n => n.archived);
    notesToShow = [...activeNotes, ...archivedNotes];
  } else if (sortMode === 'archivedFirst') {
    let activeNotes = notes.filter(n => !n.archived);
    let archivedNotes = notes.filter(n => n.archived);
    notesToShow = [...archivedNotes, ...activeNotes];
  } else {
    notesToShow = [...notes];
  }

  notesToShow.forEach(noteObj => {
    const noteDate = new Date(noteObj.date || new Date());
    createNote(noteObj.title, noteObj.description, noteDate, noteObj.archived);
  });
}
function showNotes() {
  document.querySelectorAll(".note").forEach(li => li.remove());

  notes.forEach(noteObj => {
    const noteDate = new Date(noteObj.date || new Date());
    createNote(noteObj.title, noteObj.description, noteDate, noteObj.archived);
  });
}



settingsIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  document.querySelectorAll(".settings").forEach(m => m.classList.remove("show"));
  menu.classList.toggle("show");
});
showNotes();
// notesToShow.forEach((noteObj, index) => {
//   const noteDate = new Date(noteObj.date || new Date());
//   createNote(noteObj.title, noteObj.description, noteDate);
// });
function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll('<br/>', '\r\n');
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", e => {
  e.preventDefault();
  let title = titleTag.value.trim(),
    description = descTag.value.trim();
  if (title || description) {
    let currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();
    let noteInfo = { title, description, date: `${month} ${day}, ${year}` }
    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});
function toggleArchive(noteId) {
  // Перемикаємо архівований стан
  notes[noteId].archived = !notes[noteId].archived;

  // Вирізаємо запис з масиву
  let movedNote = notes.splice(noteId, 1)[0];

  let newIndex;

  if (movedNote.archived) {
    notes.unshift(movedNote);
    newIndex = 0; 
  } else {
    notes.push(movedNote);
    newIndex = notes.length - 1; 
  }

  showNotes();
  localStorage.setItem("notes", JSON.stringify(notes));

  console.log("Новий індекс запису:", newIndex);
  console.log(notes);

  return newIndex; 
}