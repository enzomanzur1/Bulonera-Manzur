// ==================== SISTEMA DE AUTENTICACIÓN ====================

// Credenciales de demostración
const CREDENTIALS = {
    cliente: {
        'usuario1': 'pass123',
    },
    admin: {
        'admin': 'admin123',
    }
};

// Verificar si ya hay sesión al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const userSession = localStorage.getItem('userSession');
    const loginModal = document.getElementById('loginModal');
    
    if (userSession) {
        // Si hay sesión activa, ocultar el modal
        loginModal.classList.add('hidden');
        document.body.classList.remove('login-active');
        updateUserDisplay(userSession);
    } else {
        // Si no hay sesión, mostrar el modal
        loginModal.classList.remove('hidden');
        document.body.classList.add('login-active');
    }
    
    initializeLoginSystem();
    initializeRegisterSystem();
});

function initializeLoginSystem() {
    // Pestañas de login
    const tabButtons = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.login-form');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            
            // Remover activos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            forms.forEach(form => form.classList.remove('active'));
            
            // Activar seleccionado
            this.classList.add('active');
            document.getElementById(tabType + 'Form').classList.add('active');
            
            // Limpiar errores
            document.getElementById('loginError').classList.remove('show');
            document.getElementById('loginError').textContent = '';
        });
    });
    
    // Enviar formularios de login
    forms.forEach(form => {
        // Solo capturar cliente y admin, no registro
        if (form.id === 'clienteForm' || form.id === 'adminForm') {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                handleLogin(this);
            });
        }
    });
    
    // Botón para ir a crear cuenta
    const toggleRegisterBtn = document.querySelector('.btn-toggle-register');
    if (toggleRegisterBtn) {
        toggleRegisterBtn.addEventListener('click', function() {
            switchToRegister();
        });
    }
}

function initializeRegisterSystem() {
    const registerForm = document.getElementById('registerForm');
    const toggleLoginBtn = document.querySelector('.btn-toggle-login');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister(this);
        });
    }
    
    if (toggleLoginBtn) {
        toggleLoginBtn.addEventListener('click', function() {
            switchToLogin();
        });
    }
}

function switchToRegister() {
    // Ocultar login
    document.getElementById('loginTabs').style.display = 'none';
    document.getElementById('clienteForm').classList.remove('active');
    document.getElementById('adminForm').classList.remove('active');
    document.getElementById('loginActions').style.display = 'none';
    
    // Mostrar registro
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('registerActions').style.display = 'block';
    
    // Cambiar título
    document.getElementById('headerTitle').textContent = 'Crear Cuenta';
    
    // Limpiar errores
    document.getElementById('loginError').classList.remove('show');
    document.getElementById('loginError').textContent = '';
}

function switchToLogin() {
    // Mostrar login
    document.getElementById('loginTabs').style.display = 'flex';
    document.getElementById('clienteForm').classList.add('active');
    document.getElementById('loginActions').style.display = 'block';
    
    // Ocultar registro
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('registerActions').style.display = 'none';
    
    // Cambiar título
    document.getElementById('headerTitle').textContent = 'Iniciar Sesión';
    
    // Limpiar errores
    document.getElementById('loginError').classList.remove('show');
    document.getElementById('loginError').textContent = '';
}

function handleLogin(form) {
    const userType = form.getAttribute('data-type');
    let username, password;
    
    if (userType === 'cliente') {
        username = document.getElementById('clienteUsername').value.trim();
        password = document.getElementById('clientePassword').value;
    } else {
        username = document.getElementById('adminUsername').value.trim();
        password = document.getElementById('adminPassword').value;
    }
    
    const errorElement = document.getElementById('loginError');
    
    // Validar campos vacíos
    if (!username || !password) {
        errorElement.textContent = 'Por favor, complete todos los campos';
        errorElement.classList.add('show');
        return;
    }
    
    // Validar credenciales en demostración
    if (CREDENTIALS[userType][username] && CREDENTIALS[userType][username] === password) {
        // Login exitoso
        const sessionData = {
            type: userType,
            username: username,
            loginTime: new Date().getTime()
        };
        
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        
        // Ocultar modal y actualizar vista
        document.getElementById('loginModal').classList.add('hidden');
        document.body.classList.remove('login-active');
        updateUserDisplay(JSON.stringify(sessionData));
        
        // Limpiar formularios
        form.reset();
        errorElement.classList.remove('show');
    } else {
        // Validar si existe en cuentas registradas
        const allUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
        if (allUsers[username] && allUsers[username].password === password) {
            const sessionData = {
                type: 'cliente',
                username: username,
                email: allUsers[username].email,
                loginTime: new Date().getTime()
            };
            
            localStorage.setItem('userSession', JSON.stringify(sessionData));
            document.getElementById('loginModal').classList.add('hidden');
            document.body.classList.remove('login-active');
            updateUserDisplay(JSON.stringify(sessionData));
            form.reset();
            errorElement.classList.remove('show');
        } else {
            // Login fallido
            errorElement.textContent = 'Usuario o contraseña incorrectos';
            errorElement.classList.add('show');
        }
    }
}

function handleRegister(form) {
    const nombre = document.getElementById('registerNombre').value.trim();
    const apellido = document.getElementById('registerApellido').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const telefono = document.getElementById('registerTelefono').value.trim();
    const fecha = document.getElementById('registerFecha').value;
    const password = document.getElementById('registerPassword').value;
    
    const errorElement = document.getElementById('loginError');
    
    // Validar campos vacíos
    if (!nombre || !apellido || !email || !telefono || !fecha || !password) {
        errorElement.textContent = 'Por favor, complete todos los campos';
        errorElement.classList.add('show');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        errorElement.textContent = 'Por favor, ingrese un correo Gmail válido';
        errorElement.classList.add('show');
        return;
    }
    
    // Validar teléfono (números y guiones)
    const phoneRegex = /^[0-9\-\+\s\(\)]+$/;
    if (!phoneRegex.test(telefono) || telefono.length < 7) {
        errorElement.textContent = 'Por favor, ingrese un número de teléfono válido';
        errorElement.classList.add('show');
        return;
    }
    
    // Validar password (mínimo 6 caracteres)
    if (password.length < 6) {
        errorElement.textContent = 'La contraseña debe tener al menos 6 caracteres';
        errorElement.classList.add('show');
        return;
    }
    
    // Crear nombre de usuario
    const username = nombre.toLowerCase();
    
    // Verificar si el usuario ya existe
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    if (allUsers[username]) {
        errorElement.textContent = 'Este usuario ya existe';
        errorElement.classList.add('show');
        return;
    }
    
    // Guardar nuevo usuario
    allUsers[username] = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        telefono: telefono,
        fecha: fecha,
        password: password,
        fechaRegistro: new Date().toISOString()
    };
    
    localStorage.setItem('registeredUsers', JSON.stringify(allUsers));
    
    // Éxito
    errorElement.textContent = '';
    errorElement.classList.remove('show');
    
    // Mostrar mensaje de éxito
    alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
    
    // Volver a login
    switchToLogin();
    form.reset();
}

function updateUserDisplay(sessionData) {
    const session = JSON.parse(sessionData);
    const accountItem = document.querySelector('.account-item span:last-child');
    
    if (accountItem) {
        if (session.type === 'admin') {
            accountItem.textContent = `${session.username} (Admin)`;
        } else {
            accountItem.textContent = session.username;
        }
    }
}

// Cerrar Sesión
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const logoutItem = document.querySelector('.logout-item');
        if (logoutItem) {
            logoutItem.addEventListener('click', function() {
                handleLogout();
            });
        }
    }, 500);
});

function handleLogout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('userSession');
        document.getElementById('loginModal').classList.remove('hidden');
        document.body.classList.add('login-active');
        
        // Limpiar campos
        document.getElementById('clienteUsername').value = '';
        document.getElementById('clientePassword').value = '';
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
        document.getElementById('registerForm').reset();
        
        // Limpiar errores
        document.getElementById('loginError').classList.remove('show');
        document.getElementById('loginError').textContent = '';
        
        // Resetear a pestaña cliente/login
        document.getElementById('loginTabs').style.display = 'flex';
        document.getElementById('clienteForm').classList.add('active');
        document.getElementById('adminForm').classList.remove('active');
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('loginActions').style.display = 'block';
        document.getElementById('registerActions').style.display = 'none';
        document.getElementById('headerTitle').textContent = 'Iniciar Sesión';
        
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.tab-btn[data-tab="cliente"]').classList.add('active');
    }
}

// ==================== FUNCIONALIDADES ORIGINALES ====================

// Funcionalidad de búsqueda
document.addEventListener('DOMContentLoaded', function() {
    // Búsqueda principal
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value;
            const category = document.querySelector('.category-select').value;
            
            if (searchTerm.trim() === '') {
                alert('Por favor, ingrese un término de búsqueda');
                return;
            }
            
            console.log('Buscando:', searchTerm, 'en categoría:', category);
            // Aquí irá la lógica de búsqueda cuando se conecte a la base de datos
        });
    }
    
    // Buscar al presionar Enter
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
    
    // Mi Cuenta
    const accountItem = document.querySelector('.account-item');
    if (accountItem) {
        accountItem.addEventListener('click', function() {
            console.log('Ir a Mi Cuenta');
        });
    }
    
    // Carrito
    const cartItem = document.querySelector('.cart-item');
    if (cartItem) {
        cartItem.addEventListener('click', function() {
            console.log('Ver carrito');
        });
    }
    
    // Sucursales
    const contactItem = document.querySelector('.contact-item');
    if (contactItem) {
        contactItem.addEventListener('click', function() {
            console.log('Ver sucursales');
        });
    }
    
    // Mayoristas
    const infoItem = document.querySelector('.info-item');
    if (infoItem) {
        infoItem.addEventListener('click', function() {
            console.log('Ir a mayoristas');
        });
    }
    
    // Menú
    document.querySelectorAll('.menu-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href');
            console.log('Navigating to:', sectionId);
        });
    });
    
    // Botones de categoría
    document.querySelectorAll('.btn-category').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const categoryCard = this.closest('.category-card');
            const categoryTitle = categoryCard.querySelector('h3').textContent;
            console.log('Viendo productos de:', categoryTitle);
            alert(`Cargando productos de: ${categoryTitle}`);
        });
    });
    
    // Tarjetas de categoría
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const categoryTitle = this.querySelector('h3').textContent;
            console.log('Categoria clickeada:', categoryTitle);
        });
    });
    
    console.log('Página de Bulonería Manzur cargada correctamente');
});

