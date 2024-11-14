document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    
    // Resetear errores
    username.classList.remove('error');
    password.classList.remove('error');
    usernameError.classList.remove('visible');
    passwordError.classList.remove('visible');
    
    let hasError = false;

    // Validar usuario
    if (username.value.trim() === '') {
        username.classList.add('error');
        usernameError.textContent = 'El usuario es requerido';
        usernameError.classList.add('visible');
        hasError = true;
    }

    // Validar contraseña
    if (password.value.trim() === '') {
        password.classList.add('error');
        passwordError.textContent = 'La contraseña es requerida';
        passwordError.classList.add('visible');
        hasError = true;
    } else if (password.value.length < 5) {
        password.classList.add('error');
        passwordError.textContent = 'La contraseña debe tener al menos 5 caracteres';
        passwordError.classList.add('visible');
        hasError = true;
    }

    if (!hasError) {
        this.submit();
    }
});