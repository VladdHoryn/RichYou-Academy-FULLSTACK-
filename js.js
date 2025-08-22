let draggedItem = null;

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