// ==================== SISTEMA DE AUTENTICACIÓN ====================

// Credenciales de demostración
const CREDENTIALS = {
    cliente: {
        'lokura': '123456',
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
    // Enviar formularios de login
    const clienteForm = document.getElementById('clienteForm');
    
    if (clienteForm) {
        clienteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(this);
        });
    }
    
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
    document.getElementById('clienteForm').classList.remove('active');
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
    const userType = 'cliente';
    const username = document.getElementById('clienteUsername').value.trim();
    const password = document.getElementById('clientePassword').value;
    
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
        accountItem.textContent = session.username;
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
            showProductsModal(categoryTitle);
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

// ==================== SISTEMA DE PRODUCTOS ====================

// Base de datos de productos por categoría
const PRODUCTS_DATABASE = {
    'Buloneria en General': [
        { id: 1, name: 'Tornillo M8x1.25', price: 0.50, description: 'Tornillo de cabeza hexagonal' },
        { id: 2, name: 'Tornillo M10x1.5', price: 0.75, description: 'Tornillo robusto de acero' },
        { id: 3, name: 'Tuerca M8', price: 0.30, description: 'Tuerca hexagonal de acero' },
        { id: 4, name: 'Tuerca M10', price: 0.45, description: 'Tuerca de alta resistencia' },
        { id: 5, name: 'Arandela plana M8', price: 0.15, description: 'Arandela estándar de acero' },
        { id: 6, name: 'Perno de anclaje', price: 3.50, description: 'Perno para fijación a concreto' },
        { id: 7, name: 'Pasador elástico', price: 0.25, description: 'Pasador de retención rápida' },
        { id: 8, name: 'Remache pop', price: 0.80, description: 'Remache de aluminio 3/16x1/2' }
    ],
    'Herramientas Manuales': [
        { id: 1, name: 'Destornillador Phillips #2', price: 5.99, description: 'Destornillador de precisión' },
        { id: 2, name: 'Destornillador Plano 6mm', price: 4.99, description: 'Mango ergonómico antideslizante' },
        { id: 3, name: 'Llave inglesa 10"', price: 12.50, description: 'Llave ajustable de acero cromado' },
        { id: 4, name: 'Alicate de corte', price: 8.75, description: 'Alicate de precisión 180mm' },
        { id: 5, name: 'Martillo de goma', price: 15.00, description: 'Martillo para trabajos delicados' },
        { id: 6, name: 'Juego de llaves hexagonales', price: 9.99, description: 'Conjunto de 9 piezas' },
        { id: 7, name: 'Destornillador de impacto', price: 25.00, description: 'Ideal para tornillos atascados' },
        { id: 8, name: 'Nivel de burbuja 60cm', price: 18.50, description: 'Nivel de construcción' }
    ],
    'Industria y Construcción': [
        { id: 1, name: 'Hormigonera portátil', price: 199.99, description: 'Capacidad 150 litros' },
        { id: 2, name: 'Andamio metálico', price: 450.00, description: 'Altura ajustable hasta 3 metros' },
        { id: 3, name: 'Cinta métrica de 30m', price: 22.50, description: 'Cinta de acero resistente' },
        { id: 4, name: 'Pala de construcción', price: 18.75, description: 'Pala cuadrada de acero' },
        { id: 5, name: 'Carretilla metálica', price: 89.99, description: 'Capacidad 100 litros' },
        { id: 6, name: 'Cortadora de disco', price: 320.00, description: 'Para corte de materiales' },
        { id: 7, name: 'Argolla de carga', price: 45.00, description: 'Capacidad 2 toneladas' },
        { id: 8, name: 'Clavos de construcción kg', price: 12.00, description: 'Clavos varios tamaños' }
    ],
    'Pinturas': [
        { id: 1, name: 'Pintura látex blanco', price: 45.00, description: 'Rendimiento 10m²/litro, 10 litros' },
        { id: 2, name: 'Pintura acrílica color', price: 55.00, description: 'Colores variados disponibles' },
        { id: 3, name: 'Pintura anticorrosiva', price: 75.00, description: 'Protección anti-óxido' },
        { id: 4, name: 'Esmalte sintético', price: 65.00, description: 'Acabado brillante y duradero' },
        { id: 5, name: 'Imprimante base agua', price: 40.00, description: 'Preparación de superficies' },
        { id: 6, name: 'Pintura epóxica piso', price: 120.00, description: 'Resistente al tráfico' },
        { id: 7, name: 'Disolvente universal', price: 28.50, description: 'Limpieza de herramientas' },
        { id: 8, name: 'Rodillo de pintura 9"', price: 8.99, description: 'Rodillo profesional' }
    ],
    'Seguridad e Indumentaria': [
        { id: 1, name: 'Casco de construcción', price: 35.00, description: 'Casco amarillo ajustable' },
        { id: 2, name: 'Gafas protectoras', price: 12.50, description: 'Protección contra impacto' },
        { id: 3, name: 'Guantes de nitrilo', price: 15.00, description: 'Caja x100 pares' },
        { id: 4, name: 'Chaleco reflectivo', price: 22.75, description: 'Visibilidad nocturna' },
        { id: 5, name: 'Botas de seguridad', price: 89.99, description: 'Punta de acero, talla variada' },
        { id: 6, name: 'Cinturón de seguridad', price: 45.00, description: 'Para trabajos en altura' },
        { id: 7, name: 'Tapones para oídos', price: 8.00, description: 'Protección auditiva pack 10' },
        { id: 8, name: 'Protector respiratorio', price: 25.00, description: 'Máscara N95 pack 50 unidades' }
    ],
    'Herramientas Eléctricas': [
        { id: 1, name: 'Taladro inalámbrico 20V', price: 180.00, description: 'Con batería y cargador' },
        { id: 2, name: 'Sierra circular 180mm', price: 120.00, description: 'Potencia 1200W' },
        { id: 3, name: 'Lijadora orbital', price: 95.50, description: 'Base 115x225mm' },
        { id: 4, name: 'Rotomartillo SDS Plus', price: 250.00, description: 'Perforación en concreto' },
        { id: 5, name: 'Amoladora angular 125mm', price: 85.00, description: 'Potencia 850W' },
        { id: 6, name: 'Destornillador inalámbrico', price: 65.00, description: 'Batería incluida' },
        { id: 7, name: 'Multiherramienta 350W', price: 140.00, description: 'Con accesorios diversos' },
        { id: 8, name: 'Bomba de agua sumergible', price: 175.00, description: 'Capacidad 1100W' }
    ]
};

// Función para mostrar el modal de productos
function showProductsModal(categoryTitle) {
    const modal = document.getElementById('productsModal');
    const modalTitle = document.getElementById('modalProductTitle');
    const productsList = document.getElementById('productsList');
    
    // Obtener productos de la categoría
    const products = PRODUCTS_DATABASE[categoryTitle] || [];
    
    // Actualizar título
    modalTitle.textContent = categoryTitle;
    
    // Limpiar lista anterior
    productsList.innerHTML = '';
    
    // Agregar productos
    if (products.length === 0) {
        productsList.innerHTML = '<div class="empty-products">No hay productos disponibles en esta categoría</div>';
    } else {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-item';
            productElement.innerHTML = `
                <div class="product-item-name">${product.name}</div>
                <div class="product-item-price">$${product.price.toFixed(2)}</div>
                <div class="product-item-description">${product.description}</div>
                <button class="product-item-btn" onclick="addToCart('${product.name}', ${product.price})">
                    <i class="fas fa-shopping-cart"></i> Agregar al carrito
                </button>
            `;
            productsList.appendChild(productElement);
        });
    }
    
    // Mostrar modal
    modal.classList.add('active');
}

// Función para cerrar modal de productos
function closeProductsModal() {
    const modal = document.getElementById('productsModal');
    modal.classList.remove('active');
}

// Agregar evento a botón de cerrar modal
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProductsModal);
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    const modal = document.getElementById('productsModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProductsModal();
            }
        });
    }
});

// Función para agregar al carrito
function addToCart(productName, price) {
    alert(`${productName} agregado al carrito - Precio: $${price.toFixed(2)}`);
    // Aquí iría la lógica real de agregar al carrito
}

