const AUTH_KEY = 'TaskUser';

export function checkAuth() {
    return localStorage.getItem(AUTH_KEY) !== null;
}

export function login(username, password) {
    const userData = { username, password };
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
}

export function logout() {
    localStorage.removeItem(AUTH_KEY);
}

export function renderAuthForm() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

export function hideAuthForm() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}

export function bindAuthEvents(onLogin, onLogout) {
    const form = document.getElementById('auth-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        if (username && password) {
            login(username, password);
            hideAuthForm();
            document.getElementById('auth-btn').innerText = 'Logout';
            if (typeof onLogin === 'function') onLogin();
        }
    });

    document.getElementById('auth-btn').addEventListener('click', () => {
        if (checkAuth()) {
            logout();
            renderAuthForm();
            document.getElementById('auth-btn').innerText = 'Login';
            if (typeof onLogout === 'function') onLogout();
        } else {
            renderAuthForm();
        }
    });
}
