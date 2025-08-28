import { checkAuth, hideAuthForm, renderAuthForm, bindAuthEvents } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('auth-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const sidebarItems = document.querySelectorAll('.sidebar li');
    const sections = document.querySelectorAll('.section');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (checkAuth()) {
        hideAuthForm();
        authBtn.innerText = 'Logout';
    } else {
        renderAuthForm();
        authBtn.innerText = 'Login';
    }

    bindAuthEvents(() => {
        authBtn.innerText = 'Logout';
    }, () => {
        authBtn.innerText = 'Login';
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));

            item.classList.add('active');
            document.getElementById(item.dataset.section).classList.add('active');

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                overlay.classList.add('hidden');
            }
        });
    });

    menuToggle.addEventListener('click', () => {
        if(checkAuth())
            sidebar.classList.toggle('active');
            overlay.classList.toggle('hidden');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.add('hidden');
    });
});
