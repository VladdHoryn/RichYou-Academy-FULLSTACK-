let draggedItem = null;
let currentBlueLine = null;

const addItemBtn = document.querySelector('#add-item');
const inputTitle = document.querySelector('#new-title');
const columns = document.querySelectorAll('.column');

document.addEventListener('DOMContentLoaded', () => {
    ['design', 'personal', 'house'].forEach(columnName => {
        const savedTasks = JSON.parse(localStorage.getItem(columnName)) || [];
        savedTasks.forEach(taskText => addTaskToDOM(taskText, columnName));
    });
});

addItemBtn.addEventListener('click', () => {
    const taskTitle = inputTitle.value.trim();
    if (!taskTitle) return;

    const columnName = 'design';
    addTaskToDOM(taskTitle, columnName);
    saveToLocalStorage(taskTitle, columnName);

    inputTitle.value = '';
});

function saveToLocalStorage(taskText, columnName) {
    let tasks = JSON.parse(localStorage.getItem(columnName)) || [];
    tasks.push(taskText);
    localStorage.setItem(columnName, JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskText, columnName) {
    let tasks = JSON.parse(localStorage.getItem(columnName)) || [];
    tasks = tasks.filter(t => t !== taskText);
    localStorage.setItem(columnName, JSON.stringify(tasks));
}

function addTaskToDOM(taskText, columnName) {
    const column = document.querySelector(`#${columnName}`);

    const newElement = document.createElement('li');
    newElement.classList.add('task');
    newElement.draggable = true;

    const newInput = document.createElement('input');
    newInput.type = "checkbox";

    newInput.addEventListener('change', (event) => {
        const parent = event.target.parentElement;
        parent.classList.toggle('checked', event.target.checked);
    });

    const newP = document.createElement('p');
    newP.textContent = taskText;

    newElement.appendChild(newInput);
    newElement.appendChild(newP);
    column.appendChild(newElement);

    enableDrag(newElement);
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
            saveToLocalStorage(taskText, column.id);
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
