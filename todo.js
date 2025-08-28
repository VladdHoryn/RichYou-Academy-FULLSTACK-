let draggedItem = null;
let currentBlueLine = null;

const addItemBtn = document.querySelector('#add-item');
const inputTitle = document.querySelector('#new-title');
const columns = document.querySelectorAll('.column');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = "all";

document.addEventListener('DOMContentLoaded', () => {
    ['design', 'personal', 'house'].forEach(columnName => {
        const savedTasks = JSON.parse(localStorage.getItem(columnName)) || [];
        savedTasks.forEach(taskData => addTaskToDOM(taskData.text, columnName, taskData.completed));
    });
});

addItemBtn.addEventListener('click', () => {
    const taskTitle = inputTitle.value.trim();
    if (!taskTitle) return;

    const columnName = 'design';
    addTaskToDOM(taskTitle, columnName);
    saveToLocalStorage({ text: taskTitle, completed: false }, columnName);

    inputTitle.value = '';
});

function saveToLocalStorage(taskObj, columnName) {
    let tasks = JSON.parse(localStorage.getItem(columnName)) || [];
    tasks.push(taskObj);
    localStorage.setItem(columnName, JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskText, columnName) {
    let tasks = JSON.parse(localStorage.getItem(columnName)) || [];
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem(columnName, JSON.stringify(tasks));
}

function toggleTaskInLocalStorage(taskText, columnName) {
    let tasks = JSON.parse(localStorage.getItem(columnName)) || [];
    tasks = tasks.map(t =>
        t.text === taskText ? { ...t, completed: !t.completed } : t
    );
    localStorage.setItem(columnName, JSON.stringify(tasks));
}

function editTaskInLocalStorage(oldText, newText, columnName) {
    let tasks = JSON.parse(localStorage.getItem(columnName)) || [];
    tasks = tasks.map(t =>
        t.text === oldText ? { ...t, text: newText } : t
    );
    localStorage.setItem(columnName, JSON.stringify(tasks));
}

function addTaskToDOM(taskText, columnName, completed = false) {
    const column = document.querySelector(`#${columnName}`);

    const newElement = document.createElement('li');
    newElement.classList.add('task');
    if (completed) newElement.classList.add('checked');
    newElement.draggable = true;

    const newInput = document.createElement('input');
    newInput.type = "checkbox";
    newInput.checked = completed;
    newInput.addEventListener('change', (event) => {
        const parent = event.target.parentElement;
        parent.classList.toggle('checked', event.target.checked);
        toggleTaskInLocalStorage(taskText, columnName);
        applyFilter();
    });

    const newP = document.createElement('p');
    newP.textContent = taskText;

    const editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => {
        const newText = prompt("Edit task:", newP.textContent);
        if (newText && newText.trim() !== "") {
            editTaskInLocalStorage(taskText, newText.trim(), columnName);
            newP.textContent = newText.trim();
            taskText = newText.trim();
        }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
        removeTaskFromLocalStorage(taskText, columnName);
        newElement.remove();
    });

    newElement.appendChild(newInput);
    newElement.appendChild(newP);
    newElement.appendChild(editBtn);
    newElement.appendChild(deleteBtn);
    column.appendChild(newElement);

    enableDrag(newElement);
    applyFilter();
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        applyFilter();
    });
});

function applyFilter() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        const isCompleted = task.querySelector('input[type="checkbox"]').checked;

        if (currentFilter === "all") {
            task.style.display = "flex";
        } else if (currentFilter === "completed" && !isCompleted) {
            task.style.display = "none";
        } else if (currentFilter === "pending" && isCompleted) {
            task.style.display = "none";
        } else {
            task.style.display = "flex";
        }
    });
}

function enableDrag(task) {
    task.addEventListener('dragstart', () => {
        draggedItem = task;
        task.classList.add('dragging');
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
        draggedItem = null;

        if (currentBlueLine) {
            currentBlueLine.classList.remove('blue-line-top');
            currentBlueLine = null;
        }
    });
}

columns.forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(column, e.clientY);

        if (currentBlueLine) {
            currentBlueLine.classList.remove('blue-line-top');
            currentBlueLine = null;
        }

        if (afterElement == null) {
            column.classList.add('blue-line-top');
            currentBlueLine = column;
        } else {
            afterElement.classList.add('blue-line-top');
            currentBlueLine = afterElement;
        }
    });

    column.addEventListener('drop', e => {
        e.preventDefault();
        const oldColumnId = draggedItem.parentElement.id;
        const afterElement = getDragAfterElement(column, e.clientY);

        if (afterElement == null) {
            column.appendChild(draggedItem);
        } else {
            column.insertBefore(draggedItem, afterElement);
        }

        if (currentBlueLine) {
            currentBlueLine.classList.remove('blue-line-top');
            currentBlueLine = null;
        }

        const taskText = draggedItem.querySelector('p').textContent;

        if (oldColumnId !== column.id) {
            removeTaskFromLocalStorage(taskText, oldColumnId);
            saveToLocalStorage({ text: taskText, completed: false }, column.id);
        }
    });
});

function getDragAfterElement(container, mouseY) {
    const tasks = container.querySelectorAll('.task:not(.dragging)');
    let closestElement = null;
    let closestOffset = -Infinity;

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const box = task.getBoundingClientRect();
        const offset = mouseY - box.top - box.height / 2;

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestElement = task;
        }
    }
    return closestElement;
}
