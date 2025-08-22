let draggedItem = null;
let currentBlueLine = null;

const addItemBtn = document.querySelector('#add-item');
const inputTitle = document.querySelector('#new-title');
const columns = document.querySelectorAll('.column');

document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
        const target = event.target;
        const parent = target.parentElement;

        if (target.checked) {
            parent.classList.add('checked');
        } else {
            parent.classList.remove('checked');
        }
    });
});

document.querySelectorAll('.task').forEach(task => {
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
});

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
        const oldColumnId = draggedItem.parentElement.id; // save before moving
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

addItemBtn.addEventListener('click', e => {
    const taskTitle = document.querySelector('#new-title').value.trim();

    if (!taskTitle) return;

    const columnName = 'design';
    addTaskToDOM(taskTitle, columnName);
    saveToLocalStorage(taskTitle, columnName);

    inputTitle.value = '';
})

function saveToLocalStorage(taskText, columnName){
    let tasks = JSON.parse(localStorage.getItem(columnName)) || [];
    tasks.push(taskText);
    localStorage.setItem(columnName, JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskText, columnName) {
    let tasks = JSON.parse(localStorage.getItem(columnName)) || [];
    tasks = tasks.filter(t => t !== taskText);
    localStorage.setItem(columnName, JSON.stringify(tasks));
}

function clearLocalStorage(){
    localStorage.setItem('design', JSON.stringify(''));
    localStorage.setItem('personal', JSON.stringify(''));
    localStorage.setItem('house', JSON.stringify(''));
}

function addTaskToDOM(taskText, columnName) {
    const column = document.querySelector(`#${columnName}`);

    const newElement = document.createElement('li');
    newElement.classList.add('task');
    newElement.draggable = true;

    const newInput = document.createElement('input');
    newInput.type = "checkbox";

    newInput.addEventListener('change', (event) => {
        const target = event.target;
        const parent = target.parentElement;

        if (target.checked) {
            parent.classList.add('checked');
        } else {
            parent.classList.remove('checked');
        }
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
    });
}

document.addEventListener('DOMContentLoaded', () => {
    clearLocalStorage();

    document.querySelectorAll('#design .task').forEach(task => {
        let taskText = task.querySelector('p').textContent;
        saveToLocalStorage(taskText, 'design');
    })
    document.querySelectorAll('#personal .task').forEach(task => {
        let taskText = task.querySelector('p').textContent;
        saveToLocalStorage(taskText, 'personal');
    })
    document.querySelectorAll('#house .task').forEach(task => {
        let taskText = task.querySelector('p').textContent;
        saveToLocalStorage(taskText, 'house');
    })
});