const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');
const alertBox = document.getElementById('alertBox');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const submitButton = document.getElementById('submitButton');
const loadingIcon = document.getElementById('loadingIcon');
const buttonText = document.getElementById('buttonText');

function setError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

function clearErrors() {
    emailError.classList.add('hidden');
    passwordError.classList.add('hidden');
    emailInput.classList.remove('border-rose-400', 'focus:border-rose-400', 'focus:ring-rose-500/20');
    passwordInput.classList.remove('border-rose-400', 'focus:border-rose-400', 'focus:ring-rose-500/20');
}

function showAlert(type, message) {
    const isSuccess = type === 'success';
    alertBox.textContent = message;
    alertBox.className = `mb-6 rounded-2xl border px-4 py-3 text-sm transition-all ${isSuccess ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200' : 'border-rose-400/30 bg-rose-500/10 text-rose-200'}`;
}

function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    loadingIcon.classList.toggle('hidden', !isLoading);
    buttonText.textContent = isLoading ? 'Entrando...' : 'Entrar';
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateForm(email, password) {
    let isValid = true;
    clearErrors();

    if (!email) {
        setError(emailError, 'Informe seu email.');
        emailInput.classList.add('border-rose-400', 'focus:border-rose-400', 'focus:ring-rose-500/20');
        isValid = false;
    } else if (!isValidEmail(email)) {
        setError(emailError, 'Informe um email válido.');
        emailInput.classList.add('border-rose-400', 'focus:border-rose-400', 'focus:ring-rose-500/20');
        isValid = false;
    }

    if (!password) {
        setError(passwordError, 'Informe sua senha.');
        passwordInput.classList.add('border-rose-400', 'focus:border-rose-400', 'focus:ring-rose-500/20');
        isValid = false;
    } else if (password.length < 6) {
        setError(passwordError, 'A senha deve ter no mínimo 6 caracteres.');
        passwordInput.classList.add('border-rose-400', 'focus:border-rose-400', 'focus:ring-rose-500/20');
        isValid = false;
    }

    return isValid;
}

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    const result = await response.json().catch(() => ({
        success: false,
        message: 'Resposta inválida do servidor.'
    }));

    if (!response.ok || !result.success) {
        throw new Error(result.message || 'Erro na comunicação com o servidor.');
    }

    return result;
}

togglePassword.addEventListener('click', () => {
    const shouldShow = passwordInput.type === 'password';
    passwordInput.type = shouldShow ? 'text' : 'password';
    togglePassword.setAttribute('aria-label', shouldShow ? 'Ocultar senha' : 'Mostrar senha');
    eyeIcon.innerHTML = shouldShow
        ? '<path d="M3 3L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10.6 10.6C10.25 10.95 10.05 11.45 10.05 12C10.05 13.08 10.92 13.95 12 13.95C12.55 13.95 13.05 13.75 13.4 13.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7.35 7.6C5.35 8.5 3.73 9.97 2.5 12C4.5 16.2 7.7 18.3 12 18.3C13.22 18.3 14.35 18.13 15.38 17.78" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18.08 15.62C19.47 14.72 20.6 13.52 21.5 12C19.5 7.8 16.3 5.7 12 5.7C11.38 5.7 10.78 5.74 10.2 5.83" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
        : '<path d="M2.5 12C4.5 7.8 7.7 5.7 12 5.7C16.3 5.7 19.5 7.8 21.5 12C19.5 16.2 16.3 18.3 12 18.3C7.7 18.3 4.5 16.2 2.5 12Z" stroke="currentColor" stroke-width="1.8"/><path d="M12 14.8C13.5464 14.8 14.8 13.5464 14.8 12C14.8 10.4536 13.5464 9.2 12 9.2C10.4536 9.2 9.2 10.4536 9.2 12C9.2 13.5464 10.4536 14.8 12 14.8Z" stroke="currentColor" stroke-width="1.8"/>';
});

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!validateForm(email, password)) {
        showAlert('error', 'Corrija os campos destacados para continuar.');
        return;
    }

    setLoading(true);
    alertBox.classList.add('hidden');

    try {
        const result = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        localStorage.setItem('b7AuthToken', result.data.token);
        localStorage.setItem('b7Authenticated', 'true');
        localStorage.setItem('b7User', JSON.stringify(result.data.user));
        showAlert('success', result.message || 'Login realizado com sucesso. Redirecionando...');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    } catch (error) {
        setLoading(false);
        showAlert('error', error.message || 'Credenciais inválidas. Verifique seu email e senha.');
    }
});
