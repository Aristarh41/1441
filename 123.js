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

  function createNote(title, description) {
    const note = document.createElement("li");
    note.className = "note";
    note.innerHTML = `
      <div class="main_info">
        <h1>${title}</h1>
        <p>${description}</p>
      </div>
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

settingsIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  document.querySelectorAll(".settings").forEach(m => m.classList.remove("show"));
  menu.classList.toggle("show");
});




