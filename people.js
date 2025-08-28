const peopleSection = document.getElementById("people");

async function loadPeople() {
    if (peopleSection.dataset.loaded) return;

    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await res.json();

        const container = document.createElement('div');
        container.classList.add('people-container');

        users.forEach(user => {
            const card = document.createElement('div');
            card.classList.add('person-card');
            card.innerHTML = `
                <h3>${user.name}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Company:</strong> ${user.company.name}</p>
            `;
            container.appendChild(card);
        });

        peopleSection.appendChild(container);
        peopleSection.dataset.loaded = true;
    } catch (err) {
        peopleSection.innerHTML = `<p style="color:red">Failed to load users.</p>`;
        console.error(err);
    }
}

document.querySelectorAll('.sidebar li[data-section="people"]').forEach(item => {
    item.addEventListener('click', () => {
        loadPeople();
    });
});
