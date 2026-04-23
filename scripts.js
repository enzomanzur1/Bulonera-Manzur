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
    initializeAdminPanel();
});

function initializeAdminPanel() {
    // Botón para abrir panel de admin
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', showAdminPanel);
    }
    
    // Botón para cerrar panel de admin
    const adminCloseBtn = document.getElementById('adminCloseBtn');
    if (adminCloseBtn) {
        adminCloseBtn.addEventListener('click', closeAdminPanel);
    }
    
    // Botón para filtrar
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', applyFilters);
    }
    
    // Cerrar modal al hacer clic fuera
    const adminModal = document.getElementById('adminModal');
    if (adminModal) {
        adminModal.addEventListener('click', function(e) {
            if (e.target === adminModal) {
                closeAdminPanel();
            }
        });
    }
    
    // Modal de edición de stock
    const editStockCloseBtn = document.getElementById('editStockCloseBtn');
    if (editStockCloseBtn) {
        editStockCloseBtn.addEventListener('click', closeEditStockModal);
    }
    
    const saveStockBtn = document.getElementById('saveStockBtn');
    if (saveStockBtn) {
        saveStockBtn.addEventListener('click', saveStockChanges);
    }
    
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditStockModal);
    }
    
    // Cerrar modal de edición al hacer clic fuera
    const editStockModal = document.getElementById('editStockModal');
    if (editStockModal) {
        editStockModal.addEventListener('click', function(e) {
            if (e.target === editStockModal) {
                closeEditStockModal();
            }
        });
    }
}

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
            showCart();
        });
    }
    
    // Cerrar modal del carrito
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', closeCart);
    }
    
    // Cerrar carrito al hacer clic fuera
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCart();
            }
        });
    }
    
    // Botón de checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Compra realizada por $${total.toFixed(2)}. Presupuesto generado. \n\nDetalles guardados. Gracias por su compra!`);
            // Aquí iría la lógica real de pago
            localStorage.removeItem('cart');
            closeCart();
            updateCartDisplay();
        });
    }
    
    // Botón de continuar comprando
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', closeCart);
    }
    
    // Actualizar carrito al cargar la página
    updateCartDisplay();
    
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

// Base de datos de productos por empresa
const COMPANIES_PRODUCTS = {
    'Black+Decker': [
        { id: 1, name: 'Taladro inalámbrico Black+Decker 18V', price: 145.00, description: 'Taladro compacto con batería incluida' },
        { id: 2, name: 'Sierra circular Black+Decker 150mm', price: 95.00, description: 'Potencia 1100W, cortes precisos' },
        { id: 3, name: 'Juego de brocas Black+Decker 100 piezas', price: 35.00, description: 'Brocas para metal, madera y concreto' },
        { id: 4, name: 'Destornillador de impacto Black+Decker', price: 65.00, description: 'Ideal para tornillos difíciles' },
        { id: 5, name: 'Amoladora angular Black+Decker 115mm', price: 85.00, description: 'Potencia 750W' },
        { id: 6, name: 'Soldadora Black+Decker 130A', price: 250.00, description: 'Para soldadura en acero' },
        { id: 7, name: 'Lijadora Black+Decker 230W', price: 55.00, description: 'Acción orbital, vibración baja' },
        { id: 8, name: 'Compresor de aire Black+Decker 50L', price: 320.00, description: 'Presión máxima 8 bar' }
    ],
    'Stanley': [
        { id: 1, name: 'Juego de herramientas Stanley 108 piezas', price: 199.99, description: 'Juego completo de herramientas manuales' },
        { id: 2, name: 'Nivel Stanley magnético 600mm', price: 42.50, description: 'Nivel de precisión profesional' },
        { id: 3, name: 'Caja de herramientas Stanley metal', price: 65.00, description: 'Organizador de herramientas resistente' },
        { id: 4, name: 'Juego de llaves Stanley 24 piezas', price: 89.99, description: 'Llaves fijas de 6-32mm' },
        { id: 5, name: 'Martillo de fibra Stanley 570g', price: 28.50, description: 'Mango de fibra resistente' },
        { id: 6, name: 'Destornilladores Stanley 6 piezas', price: 19.99, description: 'Juego de precisión' },
        { id: 7, name: 'Linterna led Stanley 180 lm', price: 24.99, description: 'Resistente al agua' },
        { id: 8, name: 'Cinta métrica Stanley 10m', price: 15.99, description: 'Con bloqueo automático' }
    ],
    'DeWalt': [
        { id: 1, name: 'Taladro percutor DeWalt 20V', price: 280.00, description: 'Taladro profesional con batería' },
        { id: 2, name: 'Sierra caladora DeWalt 500W', price: 165.00, description: 'Corte en madera y metal' },
        { id: 3, name: 'Multiherramienta DeWalt 300W', price: 155.00, description: 'Con accesorios variados' },
        { id: 4, name: 'Rotomartillo DeWalt SDS Plus', price: 420.00, description: 'Para perforación en concreto' },
        { id: 5, name: 'Batería DeWalt XR 20V', price: 85.00, description: 'Compatible con herramientas 20V' },
        { id: 6, name: 'Cargador DeWalt rápido', price: 65.00, description: 'Carga completa en 30 minutos' },
        { id: 7, name: 'Maletín DeWalt profesional', price: 95.00, description: 'Organizador de herramientas' },
        { id: 8, name: 'Sierra circular DeWalt 190mm', price: 215.00, description: 'Potencia 1600W' }
    ],
    'Pumpkin': [
        { id: 1, name: 'Bomba de agua Pumpkin 1100W', price: 125.00, description: 'Bomba sumergible para piscinas' },
        { id: 2, name: 'Motobomba Pumpkin 3 HP', price: 350.00, description: 'Para riego agrícola' },
        { id: 3, name: 'Bomba de presión Pumpkin 800W', price: 95.00, description: 'Para sistemas de riego' },
        { id: 4, name: 'Aireador Pumpkin 1500W', price: 180.00, description: 'Para piscinas y estanques' },
        { id: 5, name: 'Electrobomba Pumpkin 1 HP', price: 200.00, description: 'Monofásica de precisión' },
        { id: 6, name: 'Bomba de achique Pumpkin 400W', price: 75.00, description: 'Para drenaje de agua' },
        { id: 7, name: 'Filtro bomba Pumpkin 400L/h', price: 60.00, description: 'Sistema de filtración' },
        { id: 8, name: 'Manguera para bomba 50m', price: 45.00, description: 'Manguera reforzada 1 pulgada' }
    ],
    'Facsa': [
        { id: 1, name: 'Cisterna Facsa 1000L', price: 850.00, description: 'Tanque de polietileno' },
        { id: 2, name: 'Boiler Facsa 50L', price: 450.00, description: 'Calentador de agua eléctrico' },
        { id: 3, name: 'Accesorios para cisterna Facsa', price: 120.00, description: 'Kit completo de instalación' },
        { id: 4, name: 'Flotador Facsa 1 pulgada', price: 25.00, description: 'Válvula de nivel de agua' },
        { id: 5, name: 'Reducción Facsa para tubo', price: 15.00, description: 'Adaptador de 1 a 1/2 pulgada' },
        { id: 6, name: 'Llave de paso Facsa 1 pulgada', price: 35.00, description: 'Esfera de latón' },
        { id: 7, name: 'Tubo PVC Facsa 4 pulgadas', price: 80.00, description: 'Por metro' },
        { id: 8, name: 'Kit de herramientas Facsa para instalación', price: 95.00, description: 'Herramientas especializadas' }
    ]
};

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

// ==================== SISTEMA DE CONTROL DE STOCK ====================

// Base de datos de stock por empresa y producto
let STOCK_DATABASE = localStorage.getItem('stockDatabase') ? JSON.parse(localStorage.getItem('stockDatabase')) : {
    'Black+Decker': [
        { name: 'Taladro inalámbrico Black+Decker 18V', actual: 25, minimo: 5 },
        { name: 'Sierra circular Black+Decker 150mm', actual: 15, minimo: 3 },
        { name: 'Juego de brocas Black+Decker 100 piezas', actual: 8, minimo: 5 },
        { name: 'Destornillador de impacto Black+Decker', actual: 2, minimo: 5 },
        { name: 'Amoladora angular Black+Decker 115mm', actual: 12, minimo: 3 },
        { name: 'Soldadora Black+Decker 130A', actual: 5, minimo: 2 },
        { name: 'Lijadora Black+Decker 230W', actual: 10, minimo: 3 },
        { name: 'Compresor de aire Black+Decker 50L', actual: 3, minimo: 1 }
    ],
    'Stanley': [
        { name: 'Juego de herramientas Stanley 108 piezas', actual: 20, minimo: 5 },
        { name: 'Nivel Stanley magnético 600mm', actual: 45, minimo: 10 },
        { name: 'Caja de herramientas Stanley metal', actual: 35, minimo: 10 },
        { name: 'Juego de llaves Stanley 24 piezas', actual: 28, minimo: 8 },
        { name: 'Martillo de fibra Stanley 570g', actual: 50, minimo: 15 },
        { name: 'Destornilladores Stanley 6 piezas', actual: 60, minimo: 20 },
        { name: 'Linterna led Stanley 180 lm', actual: 40, minimo: 15 },
        { name: 'Cinta métrica Stanley 10m', actual: 55, minimo: 20 }
    ],
    'DeWalt': [
        { name: 'Taladro percutor DeWalt 20V', actual: 18, minimo: 3 },
        { name: 'Sierra caladora DeWalt 500W', actual: 12, minimo: 2 },
        { name: 'Multiherramienta DeWalt 300W', actual: 16, minimo: 3 },
        { name: 'Rotomartillo DeWalt SDS Plus', actual: 4, minimo: 1 },
        { name: 'Batería DeWalt XR 20V', actual: 22, minimo: 8 },
        { name: 'Cargador DeWalt rápido', actual: 25, minimo: 5 },
        { name: 'Maletín DeWalt profesional', actual: 8, minimo: 2 },
        { name: 'Sierra circular DeWalt 190mm', actual: 14, minimo: 3 }
    ],
    'Pumpkin': [
        { name: 'Bomba de agua Pumpkin 1100W', actual: 30, minimo: 8 },
        { name: 'Motobomba Pumpkin 3 HP', actual: 6, minimo: 2 },
        { name: 'Bomba de presión Pumpkin 800W', actual: 18, minimo: 5 },
        { name: 'Aireador Pumpkin 1500W', actual: 9, minimo: 3 },
        { name: 'Electrobomba Pumpkin 1 HP', actual: 12, minimo: 3 },
        { name: 'Bomba de achique Pumpkin 400W', actual: 24, minimo: 5 },
        { name: 'Filtro bomba Pumpkin 400L/h', actual: 35, minimo: 10 },
        { name: 'Manguera para bomba 50m', actual: 40, minimo: 15 }
    ],
    'Facsa': [
        { name: 'Cisterna Facsa 1000L', actual: 7, minimo: 2 },
        { name: 'Boiler Facsa 50L', actual: 11, minimo: 3 },
        { name: 'Accesorios para cisterna Facsa', actual: 19, minimo: 5 },
        { name: 'Flotador Facsa 1 pulgada', actual: 80, minimo: 20 },
        { name: 'Reducción Facsa para tubo', actual: 100, minimo: 30 },
        { name: 'Llave de paso Facsa 1 pulgada', actual: 45, minimo: 10 },
        { name: 'Tubo PVC Facsa 4 pulgadas', actual: 25, minimo: 5 },
        { name: 'Kit de herramientas Facsa para instalación', actual: 13, minimo: 3 }
    ]
};

// Guardar stock en localStorage cuando se modifique
function saveStockToLocalStorage() {
    localStorage.setItem('stockDatabase', JSON.stringify(STOCK_DATABASE));
}

// Función para obtener estado del stock
function getStockStatus(actual, minimo) {
    if (actual <= 0) return 'critico';
    if (actual <= minimo) return 'bajo';
    return 'ok';
}

// Función para mostrar el panel de administrador
function showAdminPanel() {
    const modal = document.getElementById('adminModal');
    modal.classList.add('active');
    renderStockTable();
    updateAlertsSummary();
}

// Función para cerrar el panel de administrador
function closeAdminPanel() {
    const modal = document.getElementById('adminModal');
    modal.classList.remove('active');
}

// Función para renderizar la tabla de stock
function renderStockTable(filterCompany = '', filterProduct = '') {
    const tbody = document.getElementById('stockTableBody');
    tbody.innerHTML = '';
    
    const companyColors = {
        'Black+Decker': '#FFA500',
        'Stanley': '#0066CC',
        'DeWalt': '#FFCC00',
        'Pumpkin': '#FF6600',
        'Facsa': '#0099CC'
    };
    
    for (const [company, products] of Object.entries(STOCK_DATABASE)) {
        // Aplicar filtro de empresa
        if (filterCompany && company !== filterCompany) continue;
        
        // Filtrar productos primero
        const filteredProducts = filterProduct 
            ? products.filter(p => p.name.toLowerCase().includes(filterProduct.toLowerCase()))
            : products;
        
        if (filteredProducts.length === 0) continue;
        
        // Agregar header de empresa
        const headerRow = document.createElement('tr');
        headerRow.className = 'company-header-row';
        headerRow.style.borderLeft = `8px solid ${companyColors[company]}`;
        headerRow.innerHTML = `
            <td colspan="7">
                <div class="company-header">
                    <i class="fas fa-building"></i>
                    <strong>${company}</strong>
                    <span class="product-count">${filteredProducts.length} productos</span>
                </div>
            </td>
        `;
        tbody.appendChild(headerRow);
        
        // Agregar filas de productos
        filteredProducts.forEach((product, index) => {
            const status = getStockStatus(product.actual, product.minimo);
            const statusLabel = status === 'critico' ? 'CRÍTICO' : status === 'bajo' ? 'BAJO' : 'OK';
            const statusIcon = status === 'critico' ? '🔴' : status === 'bajo' ? '🟡' : '🟢';
            
            const row = document.createElement('tr');
            row.className = `stock-row status-${status}`;
            row.innerHTML = `
                <td class="company-cell" style="border-left: 4px solid ${companyColors[company]}; color: ${companyColors[company]}; font-weight: 600;">●</td>
                <td>${product.name}</td>
                <td class="stock-actual">${product.actual}</td>
                <td class="stock-minimo">${product.minimo}</td>
                <td class="stock-available">${Math.max(0, product.actual - product.minimo)}</td>
                <td class="status-cell"><span class="status-badge ${status}">${statusIcon} ${statusLabel}</span></td>
                <td>
                    <button class="btn-edit-stock" onclick="openEditStockModal('${company}', ${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Función para actualizar el resumen de alertas
function updateAlertsSummary() {
    let critical = 0, warning = 0, ok = 0;
    
    for (const company of Object.values(STOCK_DATABASE)) {
        company.forEach(product => {
            const status = getStockStatus(product.actual, product.minimo);
            if (status === 'critico') critical++;
            else if (status === 'bajo') warning++;
            else ok++;
        });
    }
    
    document.getElementById('criticalCount').textContent = critical;
    document.getElementById('warningCount').textContent = warning;
    document.getElementById('okCount').textContent = ok;
}

// Función para abrir modal de edición de stock
function openEditStockModal(company, index) {
    const product = STOCK_DATABASE[company][index];
    document.getElementById('editProductName').value = `${company} - ${product.name}`;
    document.getElementById('editStockActual').value = product.actual;
    document.getElementById('editStockMinimo').value = product.minimo;
    
    // Guardar referencia para guardar después
    window.currentEditingStock = { company, index };
    
    const modal = document.getElementById('editStockModal');
    modal.classList.add('active');
}

// Función para cerrar modal de edición
function closeEditStockModal() {
    const modal = document.getElementById('editStockModal');
    modal.classList.remove('active');
    window.currentEditingStock = null;
}

// Función para guardar cambios de stock
function saveStockChanges() {
    if (!window.currentEditingStock) return;
    
    const { company, index } = window.currentEditingStock;
    const newActual = parseInt(document.getElementById('editStockActual').value);
    const newMinimo = parseInt(document.getElementById('editStockMinimo').value);
    
    if (isNaN(newActual) || isNaN(newMinimo) || newActual < 0 || newMinimo < 0) {
        alert('Por favor ingrese valores válidos');
        return;
    }
    
    STOCK_DATABASE[company][index].actual = newActual;
    STOCK_DATABASE[company][index].minimo = newMinimo;
    
    // Guardar en localStorage
    saveStockToLocalStorage();
    
    // Cerrar modal y actualizar tabla
    closeEditStockModal();
    renderStockTable();
    updateAlertsSummary();
    
    showNotification('Stock actualizado correctamente');
}

// Función para aplicar filtros
function applyFilters() {
    const company = document.getElementById('companyFilter').value;
    const product = document.getElementById('productSearch').value;
    renderStockTable(company, product);
}

// Función para mostrar productos de una empresa específica
function showProductsByCompany(companyName) {
    const modal = document.getElementById('productsModal');
    const modalTitle = document.getElementById('modalProductTitle');
    const productsList = document.getElementById('productsList');
    
    // Obtener productos de la empresa
    const products = COMPANIES_PRODUCTS[companyName] || [];
    
    // Actualizar título
    modalTitle.textContent = `Productos ${companyName}`;
    
    // Limpiar lista anterior
    productsList.innerHTML = '';
    
    // Agregar productos
    if (products.length === 0) {
        productsList.innerHTML = '<div class="empty-products">No hay productos disponibles de esta empresa</div>';
    } else {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-item';
            productElement.innerHTML = `
                <div class="product-item-name">${product.name}</div>
                <div class="product-item-price">$${product.price.toFixed(2)}</div>
                <div class="product-item-description">${product.description}</div>
                <button class="product-item-btn" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price})">
                    <i class="fas fa-shopping-cart"></i> Agregar al carrito
                </button>
            `;
            productsList.appendChild(productElement);
        });
    }
    
    // Mostrar modal
    modal.classList.add('active');
}

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
    
    // Agregar evento a las tarjetas de empresas
    const companyCards = document.querySelectorAll('.company-card');
    companyCards.forEach(card => {
        card.addEventListener('click', function() {
            const empresa = this.getAttribute('data-empresa');
            showProductsByCompany(empresa);
        });
    });
});

// Función para agregar al carrito
function addToCart(productName, price) {
    // Cargar carrito actual
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Buscar si el producto ya existe en el carrito
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        // Si existe, aumentar cantidad
        existingItem.quantity++;
    } else {
        // Si no existe, agregar nuevo producto
        cart.push({
            id: Date.now(),
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    // Guardar carrito actualizado
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar visualización del carrito
    updateCartDisplay();
    
    // Mostrar notificación
    showNotification(`${productName} agregado al carrito`);
}

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Actualizar contador en navbar
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartCount.textContent = `${totalItems} / $${totalPrice.toFixed(2)}`;
    }
    
    // Actualizar modal del carrito
    if (document.getElementById('cartModal').classList.contains('active')) {
        renderCartItems();
    }
}

// Función para renderizar los artículos del carrito
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartEmpty = document.getElementById('cartEmpty');
    
    if (cart.length === 0) {
        cartItemsList.style.display = 'none';
        cartEmpty.style.display = 'block';
        updateCartSummary(cart);
        document.getElementById('checkoutBtn').disabled = true;
        return;
    }
    
    cartItemsList.style.display = 'flex';
    cartEmpty.style.display = 'none';
    document.getElementById('checkoutBtn').disabled = false;
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item-row" data-item-id="${item.id}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">Precio unitario: $${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, -1)">−</button>
                <input type="number" class="quantity-input" value="${item.quantity}" readonly>
                <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    updateCartSummary(cart);
}

// Función para actualizar cantidad de artículos
function updateItemQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(p => p.id === itemId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            item.quantity = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartDisplay();
    }
}

// Función para eliminar un artículo del carrito
function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartDisplay();
}

// Función para actualizar el resumen del carrito
function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartCount').textContent = totalItems;
    document.getElementById('cartTotal').textContent = `$${subtotal.toFixed(2)}`;
}

// Función para mostrar/cerrar carrito
function showCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.add('active');
    renderCartItems();
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('active');
}

// Función para notificaciones
function showNotification(message) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--color-primary);
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

