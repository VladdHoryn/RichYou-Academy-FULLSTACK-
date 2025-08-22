let draggedItem = null;
let currentBlueLine = null;

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

document.querySelectorAll('.column').forEach(column => {
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
