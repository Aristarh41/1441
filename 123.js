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
  
document.getElementById('sortSelector').addEventListener('change', showNotes);
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
const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});
// function showNotes() {
//   if (!notes) return;
//   document.querySelectorAll(".note").forEach(li => li.remove());
  

//   let sortMode = document.getElementById('sortSelector')?.value || 'activeFirst';

//   let notesToShow = [];

//   if (sortMode === 'activeFirst') {
//     let activeNotes = notes.filter(n => !n.archived);
//     let archivedNotes = notes.filter(n => n.archived);
//     notesToShow = [...activeNotes, ...archivedNotes];
//   } else if (sortMode === 'archivedFirst') {
//     let activeNotes = notes.filter(n => !n.archived);
//     let archivedNotes = notes.filter(n => n.archived);
//     notesToShow = [...archivedNotes, ...activeNotes];
//   }};

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





