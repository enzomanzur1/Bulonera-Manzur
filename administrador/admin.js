// ==================== SISTEMA DE ADMINISTRACIÓN DE STOCK ====================

// ==================== VARIABLES GLOBALES ====================

let products = [];
let movements = [];
let currentEditingProductId = null;
let settings = {
    minStockDefault: 10,
    criticalStock: 5
};

const STORAGE_KEYS = {
    PRODUCTS: 'admin_products',
    MOVEMENTS: 'admin_movements',
    SETTINGS: 'admin_settings'
};

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
        window.location.href = '../index.html';
        return;
    }

    // Cargar datos
    loadData();
    updateUserDisplay(userSession);
    
    // Inicializar eventos
    initializeNavigation();
    initializeEventListeners();
    initializeModals();
    
    // Cargar vista inicial
    showView('dashboard');
    updateDashboard();
});

// ==================== FUNCIONES DE AUTENTICACIÓN ====================

function updateUserDisplay(userSession) {
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        const userObj = JSON.parse(userSession);
        userNameDisplay.textContent = userObj.nombre || 'Admin';
    }
}

// ==================== NAVEGACIÓN ====================

function initializeNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos
            menuItems.forEach(m => m.classList.remove('active'));
            
            // Agregar clase active al item clickeado
            this.classList.add('active');
            
            // Mostrar vista correspondiente
            const viewName = this.getAttribute('data-view');
            showView(viewName);
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Deseas cerrar sesión?')) {
                localStorage.removeItem('userSession');
                window.location.href = '../index.html';
            }
        });
    }
}

function showView(viewName) {
    // Ocultar todas las vistas
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Mostrar vista solicitada
    const viewElement = document.getElementById(viewName + 'View');
    if (viewElement) {
        viewElement.classList.add('active');
        
        // Actualizar datos según la vista
        switch(viewName) {
            case 'dashboard':
                updateDashboard();
                break;
            case 'stock':
                renderStockTable();
                break;
            case 'products':
                renderProductsGrid();
                break;
            case 'excel':
                renderExcelTable();
                break;
        }
    }
}

// ==================== CARGA Y ALMACENAMIENTO DE DATOS ====================

function loadData() {
    // Cargar productos
    const productsData = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (productsData) {
        products = JSON.parse(productsData);
    } else {
        // Datos de ejemplo
        initializeDefaultProducts();
    }
    
    // Cargar movimientos
    const movementsData = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
    if (movementsData) {
        movements = JSON.parse(movementsData);
    }
    
    // Cargar configuración
    const settingsData = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (settingsData) {
        settings = JSON.parse(settingsData);
    }
    
    // Actualizar inputs de configuración
    document.getElementById('minStockDefault').value = settings.minStockDefault;
    document.getElementById('criticalStock').value = settings.criticalStock;
}

function saveData() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

function initializeDefaultProducts() {
    products = [
        {
            id: 1,
            code: 'TORN001',
            name: 'Tornillo M6x20',
            category: 'tornillos',
            stock: 150,
            minStock: 50,
            price: 0.50,
            description: 'Tornillo métrico M6 de 20mm, acero galvanizado'
        },
        {
            id: 2,
            code: 'TORN002',
            name: 'Tornillo M8x30',
            category: 'tornillos',
            stock: 200,
            minStock: 50,
            price: 0.75,
            description: 'Tornillo métrico M8 de 30mm, acero galvanizado'
        },
        {
            id: 3,
            code: 'TUER001',
            name: 'Tuerca M6',
            category: 'tuercas',
            stock: 8,
            minStock: 50,
            price: 0.25,
            description: 'Tuerca hexagonal M6, acero galvanizado'
        },
        {
            id: 4,
            code: 'HERR001',
            name: 'Destornillador Phillips',
            category: 'herramientas',
            stock: 25,
            minStock: 10,
            price: 5.50,
            description: 'Destornillador Phillips profesional'
        },
        {
            id: 5,
            code: 'PINT001',
            name: 'Pintura Blanca 1L',
            category: 'pintura',
            stock: 3,
            minStock: 10,
            price: 15.00,
            description: 'Pintura látex blanca, 1 litro'
        }
    ];
    
    saveData();
}

// ==================== DASHBOARD ====================

function updateDashboard() {
    // Actualizar estadísticas
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockProducts = products.filter(p => p.stock <= p.minStock);
    const lowStockCount = lowStockProducts.length;
    
    // Movimientos de hoy
    const today = new Date().toISOString().split('T')[0];
    const todayMovements = movements.filter(m => m.date === today).length;
    
    // Actualizar cards
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalStock').textContent = totalStock;
    document.getElementById('lowStockCount').textContent = lowStockCount;
    document.getElementById('todayMovements').textContent = todayMovements;
    
    // Tabla de bajo stock
    const lowStockTable = document.getElementById('lowStockTable');
    if (lowStockProducts.length > 0) {
        lowStockTable.innerHTML = lowStockProducts.map(p => `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td><span class="status-badge status-low">${p.stock}</span></td>
                <td>${p.minStock}</td>
            </tr>
        `).join('');
    } else {
        lowStockTable.innerHTML = '<tr><td colspan="3" class="empty-state">Todo el stock está en nivel normal</td></tr>';
    }
    
    // Últimos movimientos
    const recentMovements = movements.slice(-10).reverse();
    const movementsTable = document.getElementById('movementsTable');
    if (recentMovements.length > 0) {
        movementsTable.innerHTML = recentMovements.map(m => {
            const product = products.find(p => p.id === m.productId);
            return `
                <tr>
                    <td>${product ? product.name : 'Producto eliminado'}</td>
                    <td><strong>${m.type}</strong></td>
                    <td>${m.quantity}</td>
                    <td>${formatDate(m.date)}</td>
                </tr>
            `;
        }).join('');
    } else {
        movementsTable.innerHTML = '<tr><td colspan="4" class="empty-state">Sin movimientos registrados</td></tr>';
    }
}

// ==================== TABLA DE STOCK ====================

function renderStockTable() {
    const tbody = document.getElementById('stockTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><i class="fas fa-inbox"></i><p>No hay productos registrados</p></td></tr>';
        return;
    }
    
    let filteredProducts = [...products];
    
    // Aplicar filtro de búsqueda
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    if (searchInput) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchInput) || 
            p.code.toLowerCase().includes(searchInput)
        );
    }
    
    // Aplicar filtro de categoría
    const categoryFilter = document.getElementById('categoryFilter').value;
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
    
    // Aplicar filtro de stock
    const stockFilter = document.getElementById('stockFilter').value;
    if (stockFilter) {
        filteredProducts = filteredProducts.filter(p => {
            if (stockFilter === 'low') return p.stock <= p.minStock;
            if (stockFilter === 'out') return p.stock === 0;
            if (stockFilter === 'normal') return p.stock > p.minStock;
            return true;
        });
    }
    
    if (filteredProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No hay productos que coincidan con los filtros</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredProducts.map(product => {
        const stockStatus = product.stock === 0 ? 'critical' : 
                          product.stock <= product.minStock ? 'low' : 'normal';
        const statusText = stockStatus === 'critical' ? 'Agotado' : 
                          stockStatus === 'low' ? 'Bajo Stock' : 'Normal';
        
        return `
            <tr>
                <td><strong>${product.id}</strong></td>
                <td>
                    <div>
                        <strong>${product.name}</strong><br>
                        <small class="secondary">${product.code}</small>
                    </div>
                </td>
                <td>${capitalize(product.category)}</td>
                <td>
                    <strong>${product.stock}</strong> unidades
                </td>
                <td>${product.minStock}</td>
                <td><span class="status-badge status-${stockStatus}">${statusText}</span></td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action edit-btn" onclick="editProduct(${product.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action adjust-btn" onclick="openAdjustStockModal(${product.id})" title="Ajustar Stock">
                            <i class="fas fa-plus-minus"></i>
                        </button>
                        <button class="btn-action delete-btn" onclick="deleteProduct(${product.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderProductsGrid() {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No hay productos registrados</p></div>';
        return;
    }
    
    grid.innerHTML = products.map(product => {
        const stockPercentage = Math.min((product.stock / (product.minStock * 2)) * 100, 100);
        const stockStatus = product.stock === 0 ? 'critical' : 
                          product.stock <= product.minStock ? 'low' : 'normal';
        const statusText = stockStatus === 'critical' ? 'Agotado' : 
                          stockStatus === 'low' ? 'Bajo Stock' : 'Normal';
        
        return `
            <div class="product-card">
                <div class="product-header">
                    <h3>${product.name}</h3>
                    <span class="status-badge status-${stockStatus}">
                        ${statusText}
                    </span>
                </div>
                <div class="product-body">
                    <p class="product-code"><strong>Código:</strong> ${product.code}</p>
                    <p class="product-category"><strong>Categoría:</strong> ${capitalize(product.category)}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="stock-bar">
                        <div class="stock-progress" style="width: ${stockPercentage}%"></div>
                    </div>
                    <div class="product-stats">
                        <div class="stat">
                            <span class="label">Stock</span>
                            <span class="value">${product.stock}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Mínimo</span>
                            <span class="value">${product.minStock}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Precio</span>
                            <span class="value">$${product.price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div class="product-footer">
                    <button class="btn-primary" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== GESTIÓN DE PRODUCTOS ====================

function initializeEventListeners() {
    // Botón agregar producto
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', openProductModal);
    }
    
    // Búsqueda y filtros
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const stockFilter = document.getElementById('stockFilter');
    
    [searchInput, categoryFilter, stockFilter].forEach(element => {
        if (element) {
            element.addEventListener('change', renderStockTable);
        }
    });
    
    // Formulario de producto
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
    
    // Formulario de ajuste de stock
    const adjustForm = document.getElementById('adjustStockForm');
    if (adjustForm) {
        adjustForm.addEventListener('submit', handleAdjustStockSubmit);
    }
    
    // Guardar configuración
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    // Generar reporte
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
    
    // Generar reporte de bajo stock
    const generateLowStockReportBtn = document.getElementById('generateLowStockReportBtn');
    if (generateLowStockReportBtn) {
        generateLowStockReportBtn.addEventListener('click', generateLowStockReport);
    }
    
    // Filtro de categoría para reporte de bajo stock
    const categoryFilterReport = document.getElementById('categoryFilterReport');
    if (categoryFilterReport) {
        categoryFilterReport.addEventListener('change', generateLowStockReport);
    }
    
    // Exportar bajo stock a Excel
    const exportLowStockBtn = document.getElementById('exportLowStockBtn');
    if (exportLowStockBtn) {
        exportLowStockBtn.addEventListener('click', exportLowStockToExcel);
    }
}

function openProductModal(e) {
    e.preventDefault();
    currentEditingProductId = null;
    document.getElementById('productModalTitle').textContent = 'Nuevo Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productForm').dataset.editId = '';
    document.getElementById('productModal').classList.add('active');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentEditingProductId = productId;
    document.getElementById('productModalTitle').textContent = 'Editar Producto';
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productMinStock').value = product.minStock;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCode').value = product.code;
    document.getElementById('productDescription').value = product.description;
    
    document.getElementById('productModal').classList.add('active');
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value),
        minStock: parseInt(document.getElementById('productMinStock').value),
        price: parseFloat(document.getElementById('productPrice').value),
        code: document.getElementById('productCode').value,
        description: document.getElementById('productDescription').value
    };
    
    if (currentEditingProductId) {
        // Editar producto existente
        const product = products.find(p => p.id === currentEditingProductId);
        if (product) {
            Object.assign(product, formData);
            showToast('Producto actualizado correctamente', 'success');
        }
    } else {
        // Crear nuevo producto
        const newProduct = {
            id: Math.max(...products.map(p => p.id), 0) + 1,
            ...formData
        };
        products.push(newProduct);
        showToast('Producto creado correctamente', 'success');
    }
    
    saveData();
    closeProductModal();
    renderStockTable();
    updateDashboard();
}

function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    const index = products.findIndex(p => p.id === productId);
    if (index > -1) {
        products.splice(index, 1);
        saveData();
        showToast('Producto eliminado correctamente', 'success');
        renderStockTable();
        updateDashboard();
    }
}

// ==================== AJUSTE DE STOCK ====================

function openAdjustStockModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('adjustProductName').value = product.name;
    document.getElementById('adjustProductId').value = productId;
    document.getElementById('currentStock').value = product.stock;
    document.getElementById('adjustQuantity').value = '';
    document.getElementById('adjustType').value = '';
    document.getElementById('adjustReason').value = '';
    
    document.getElementById('adjustStockModal').classList.add('active');
}

function handleAdjustStockSubmit(e) {
    e.preventDefault();
    
    const productId = parseInt(document.getElementById('adjustProductId').value);
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quantity = parseInt(document.getElementById('adjustQuantity').value);
    const type = document.getElementById('adjustType').value;
    const reason = document.getElementById('adjustReason').value;
    
    // Aplicar el cambio
    if (type === 'entrada') {
        product.stock += quantity;
    } else if (type === 'salida') {
        if (product.stock < quantity) {
            showToast('No hay suficiente stock para esta operación', 'error');
            return;
        }
        product.stock -= quantity;
    } else if (type === 'ajuste') {
        product.stock = quantity;
    }
    
    // Registrar movimiento
    movements.push({
        id: movements.length + 1,
        productId: productId,
        type: type,
        quantity: quantity,
        reason: reason,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
    });
    
    saveData();
    closeAdjustStockModal();
    showToast(`Stock ajustado correctamente`, 'success');
    renderStockTable();
    updateDashboard();
}

// ==================== CONFIGURACIÓN ====================

function saveSettings() {
    settings.minStockDefault = parseInt(document.getElementById('minStockDefault').value);
    settings.criticalStock = parseInt(document.getElementById('criticalStock').value);
    
    saveData();
    showToast('Configuración guardada correctamente', 'success');
}

// ==================== REPORTES ====================

function switchReportTab(tab) {
    // Cambiar tabs activos
    const movementsTab = document.getElementById('movementsReportTab');
    const lowstockTab = document.getElementById('lowStockReportTab');
    const movementsContent = document.getElementById('movementsReportContent');
    const lowstockContent = document.getElementById('lowstockReportContent');
    
    if (tab === 'movements') {
        movementsTab.classList.add('active');
        lowstockTab.classList.remove('active');
        movementsContent.style.display = 'block';
        lowstockContent.style.display = 'none';
    } else if (tab === 'lowstock') {
        movementsTab.classList.remove('active');
        lowstockTab.classList.add('active');
        movementsContent.style.display = 'none';
        lowstockContent.style.display = 'block';
        generateLowStockReport(); // Generar automáticamente
    }
}

function generateReport() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    if (!dateFrom || !dateTo) {
        showToast('Selecciona ambas fechas', 'warning');
        return;
    }
    
    let filteredMovements = movements.filter(m => {
        return m.date >= dateFrom && m.date <= dateTo;
    });
    
    const reportsTableBody = document.getElementById('reportsTableBody');
    
    if (filteredMovements.length === 0) {
        reportsTableBody.innerHTML = '<tr><td colspan="4" class="empty-state">No hay movimientos en este rango de fechas</td></tr>';
        return;
    }
    
    reportsTableBody.innerHTML = filteredMovements.map(m => {
        const product = products.find(p => p.id === m.productId);
        return `
            <tr>
                <td>${product ? product.name : 'Producto'}</td>
                <td><strong>${m.type}</strong></td>
                <td>${m.quantity}</td>
                <td>${formatDate(m.date)}</td>
            </tr>
        `;
    }).join('');
    
    // Opción para descargar como PDF (simulado)
    showToast(`Reporte generado: ${filteredMovements.length} movimientos encontrados`, 'success');
}

function generateLowStockReport() {
    const categoryFilter = document.getElementById('categoryFilterReport').value;
    
    // Filtrar productos con bajo stock
    let lowStockProducts = products.filter(p => {
        const isBelowMinimum = p.stock <= p.minStock;
        const matchesCategory = !categoryFilter || p.category === categoryFilter;
        return isBelowMinimum && matchesCategory;
    });
    
    // Ordenar por stock (los más críticos primero)
    lowStockProducts.sort((a, b) => a.stock - b.stock);
    
    const lowstockTableBody = document.getElementById('lowstockTableBody');
    
    if (lowStockProducts.length === 0) {
        lowstockTableBody.innerHTML = '<tr><td colspan="6" class="empty-state">No hay productos con bajo stock en esta categoría</td></tr>';
        document.getElementById('lowstockCount').textContent = '0';
        document.getElementById('outofstockCount').textContent = '0';
        return;
    }
    
    lowstockTableBody.innerHTML = lowStockProducts.map(product => {
        const difference = product.minStock - product.stock;
        const statusClass = product.stock === 0 ? 'critical' : 'low';
        const statusText = product.stock === 0 ? 'Agotado' : 'Bajo Stock';
        
        return `
            <tr>
                <td><strong>${product.name}</strong></td>
                <td>${capitalize(product.category)}</td>
                <td>${product.stock}</td>
                <td>${product.minStock}</td>
                <td><span class="status-badge status-${statusClass}">-${difference}</span></td>
                <td><span class="status-badge status-${statusClass}">${statusText}</span></td>
            </tr>
        `;
    }).join('');
    
    // Actualizar resumen
    const outOfStock = lowStockProducts.filter(p => p.stock === 0).length;
    document.getElementById('lowstockCount').textContent = lowStockProducts.length;
    document.getElementById('outofstockCount').textContent = outOfStock;
    
    showToast(`Reporte generado: ${lowStockProducts.length} productos con bajo stock`, 'success');
}

function exportLowStockToExcel() {
    const categoryFilter = document.getElementById('categoryFilterReport').value;
    
    // Filtrar productos con bajo stock
    let lowStockProducts = products.filter(p => {
        const isBelowMinimum = p.stock <= p.minStock;
        const matchesCategory = !categoryFilter || p.category === categoryFilter;
        return isBelowMinimum && matchesCategory;
    });
    
    lowStockProducts.sort((a, b) => a.stock - b.stock);
    
    if (lowStockProducts.length === 0) {
        showToast('No hay productos para exportar', 'warning');
        return;
    }
    
    // Crear datos para Excel
    const data = lowStockProducts.map(p => ({
        'Producto': p.name,
        'Código': p.code,
        'Categoría': capitalize(p.category),
        'Stock Actual': p.stock,
        'Stock Mínimo': p.minStock,
        'Faltante': p.minStock - p.stock,
        'Precio': `$${p.price.toFixed(2)}`,
        'Estado': p.stock === 0 ? 'Agotado' : 'Bajo Stock'
    }));
    
    // Crear libro de Excel
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bajo Stock');
    
    // Descargar
    const fileName = `Reporte_Bajo_Stock_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    showToast('Reporte exportado correctamente', 'success');
}

// ==================== MODALES ====================

function initializeModals() {
    // Cerrar modal de producto
    const closeProductModal = document.getElementById('closeProductModal');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    
    [closeProductModal, cancelProductBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', closeProductModal);
        }
    });
    
    // Cerrar modal de ajuste de stock
    const closeAdjustModal = document.getElementById('closeAdjustModal');
    const cancelAdjustBtn = document.getElementById('cancelAdjustBtn');
    
    [closeAdjustModal, cancelAdjustBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', closeAdjustStockModal);
        }
    });
    
    // Cerrar modales al hacer clic fuera
    document.addEventListener('click', function(e) {
        const productModal = document.getElementById('productModal');
        const adjustModal = document.getElementById('adjustStockModal');
        
        if (e.target === productModal) {
            productModal.classList.remove('active');
        }
        if (e.target === adjustModal) {
            adjustModal.classList.remove('active');
        }
    });
}

function closeProductModal(e) {
    if (e) e.preventDefault();
    document.getElementById('productModal').classList.remove('active');
}

function closeAdjustStockModal(e) {
    if (e) e.preventDefault();
    document.getElementById('adjustStockModal').classList.remove('active');
}

// ==================== NOTIFICACIONES ====================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${iconMap[type]}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==================== UTILIDADES ====================

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ==================== ESTILOS DINÁMICOS ====================

// Agregar estilos CSS para los botones de acción y producto card
const style = document.createElement('style');
style.textContent = `
    .action-buttons {
        display: flex;
        gap: 0.5rem;
    }
    
    .btn-action {
        background: none;
        border: 1px solid #bdc3c7;
        padding: 0.4rem 0.6rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
    }
    
    .btn-action:hover {
        background: #ecf0f1;
    }
    
    .edit-btn:hover {
        color: #3498db;
        border-color: #3498db;
    }
    
    .adjust-btn:hover {
        color: #f39c12;
        border-color: #f39c12;
    }
    
    .delete-btn:hover {
        color: #e74c3c;
        border-color: #e74c3c;
    }
    
    .product-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
    }
    
    .product-card:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }
    
    .product-card-list {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
        margin-bottom: 1rem;
    }
    
    .product-card-list:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }
    
    .product-info {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 2rem;
    }
    
    .product-main {
        flex: 1;
    }
    
    .product-main h3 {
        margin: 0 0 1rem 0;
        font-size: 1.3rem;
        color: #2c3e50;
    }
    
    .product-details {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
    
    .detail {
        font-size: 0.95rem;
        color: #555;
    }
    
    .detail strong {
        color: #2c3e50;
    }
    
    .product-status {
        display: flex;
        align-items: center;
    }
    
    .product-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .product-actions button {
        padding: 0.8rem 1.5rem;
        font-size: 0.95rem;
    }
    
    .product-card {
        background: white;
        border-radius: 8px;
        padding: 2.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
    }
    
    .product-card:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }
    
    .product-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 1.5rem;
        gap: 1.5rem;
    }
    
    .product-header h3 {
        margin: 0;
        font-size: 1.4rem;
        font-weight: 600;
    }
    
    .product-body {
        flex: 1;
        margin-bottom: 1.5rem;
    }
    
    .product-code, .product-category, .product-description {
        margin: 0.8rem 0;
        font-size: 1rem;
    }
    
    .product-code {
        color: #7f8c8d;
    }
    
    .stock-bar {
        width: 100%;
        height: 12px;
        background: #ecf0f1;
        border-radius: 6px;
        overflow: hidden;
        margin: 1.5rem 0;
    }
    
    .stock-progress {
        height: 100%;
        background: linear-gradient(90deg, #2ecc71, #f39c12);
        transition: width 0.3s ease;
    }
    
    .product-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        text-align: center;
        padding-top: 1.5rem;
        border-top: 2px solid #ecf0f1;
    }
    
    .stat {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .stat .label {
        font-size: 0.9rem;
        color: #7f8c8d;
        text-transform: uppercase;
        font-weight: 500;
    }
    
    .stat .value {
        font-size: 1.6rem;
        font-weight: bold;
        color: #2c3e50;
    }
    
    .product-footer {
        display: flex;
        gap: 0.8rem;
    }
    
    .product-footer button {
        flex: 1;
        padding: 0.9rem 1.5rem;
        font-size: 1rem;
    }
    
    #productsGrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 2rem;
    }
    
    .stock-bar {
        width: 100%;
        height: 8px;
        background: #ecf0f1;
        border-radius: 4px;
        overflow: hidden;
        margin: 1rem 0;
    }
    
    .stock-progress {
        height: 100%;
        background: linear-gradient(90deg, #2ecc71, #f39c12);
        transition: width 0.3s ease;
    }
    
    .product-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        text-align: center;
        padding-top: 1rem;
        border-top: 1px solid #ecf0f1;
    }
    
    .secondary {
        color: #7f8c8d;
    }
    
    @media (max-width: 768px) {
        .product-card {
            padding: 1.5rem;
        }
        
        #productsGrid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .product-header {
            margin-bottom: 1rem;
        }
        
        .product-stats {
            gap: 1rem;
            padding-top: 1rem;
        }
        
        .product-footer {
            gap: 0.5rem;
        }
        
        .product-footer button {
            padding: 0.7rem 1rem;
            font-size: 0.9rem;
        }
    }
    
    @keyframes slideOutRight {
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    /* ==================== ESTILOS DE REPORTES ====================*/
    
    .reports-tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid #ecf0f1;
    }
    
    .report-tab {
        background: transparent;
        border: none;
        padding: 1rem 1.5rem;
        cursor: pointer;
        color: #7f8c8d;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.3s ease;
        border-bottom: 3px solid transparent;
        margin-bottom: -2px;
    }
    
    .report-tab:hover {
        color: #3498db;
    }
    
    .report-tab.active {
        color: #3498db;
        border-bottom-color: #3498db;
    }
    
    .report-filters {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .report-filters select {
        padding: 0.7rem 1rem;
        border: 1px solid #bdc3c7;
        border-radius: 4px;
        background: white;
        cursor: pointer;
    }
    
    .report-summary {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        margin-top: 2rem;
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .summary-item .label {
        font-weight: 600;
        color: #2c3e50;
    }
    
    .summary-item .value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #3498db;
    }
    
    .date-range {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    
    .date-input {
        padding: 0.7rem 1rem;
        border: 1px solid #bdc3c7;
        border-radius: 4px;
        font-size: 0.95rem;
    }
    
    .date-range span {
        color: #7f8c8d;
        font-weight: 500;
    }
`;

document.head.appendChild(style);

// ==================== VISTA EXCEL ====================

function renderExcelTable() {
    const tbody = document.getElementById('excelTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty-state"><i class="fas fa-inbox"></i><p>No hay productos registrados</p></td></tr>';
        updateExcelFooter();
        return;
    }
    
    // Crear filas de la tabla
    tbody.innerHTML = products.map((product, index) => {
        const stockStatus = product.stock === 0 ? 'critical' : 
                          product.stock <= product.minStock ? 'low' : 'normal';
        const statusText = stockStatus === 'critical' ? 'Agotado' : 
                          stockStatus === 'low' ? 'Bajo Stock' : 'Normal';
        const totalValue = product.stock * product.price;
        
        return `
            <tr>
                <td class="cell-id">${product.id}</td>
                <td class="cell-code">${product.code || '-'}</td>
                <td class="cell-name">${product.name}</td>
                <td class="cell-category">${capitalize(product.category)}</td>
                <td class="cell-stock">${product.stock}</td>
                <td class="cell-min">${product.minStock}</td>
                <td class="cell-price">$${product.price.toFixed(2)}</td>
                <td class="cell-total">$${totalValue.toFixed(2)}</td>
                <td class="cell-status"><span class="status-badge status-${stockStatus}">${statusText}</span></td>
                <td class="cell-description">${product.description || '-'}</td>
            </tr>
        `;
    }).join('');
    
    // Actualizar pie de página
    updateExcelFooter();
    
    // Inicializar búsqueda
    initializeExcelSearch();
}

function updateExcelFooter() {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    
    document.getElementById('excelTotalProducts').textContent = totalProducts;
    document.getElementById('excelTotalStock').textContent = totalStock;
    document.getElementById('excelTotalValue').textContent = '$' + totalValue.toFixed(2);
}

function initializeExcelSearch() {
    const searchInput = document.getElementById('excelSearchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('keyup', function() {
        filterExcelTable(this.value.toLowerCase());
    });
}

function filterExcelTable(searchTerm) {
    const rows = document.querySelectorAll('#excelTableBody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    if (visibleCount === 0 && products.length > 0) {
        const tbody = document.getElementById('excelTableBody');
        if (!tbody.querySelector('.no-results')) {
            tbody.innerHTML = '<tr class="no-results"><td colspan="10" class="empty-state">No se encontraron resultados</td></tr>';
        }
    }
}

function exportToCSV() {
    if (products.length === 0) {
        showToast('No hay productos para exportar', 'warning');
        return;
    }
    
    // Crear encabezados
    const headers = ['ID', 'Código', 'Nombre', 'Categoría', 'Stock Actual', 'Stock Mínimo', 'Precio Unit.', 'Valor Total', 'Estado', 'Descripción'];
    
    // Crear filas de datos
    const rows = products.map(p => {
        const totalValue = p.stock * p.price;
        const status = p.stock === 0 ? 'Agotado' : 
                      p.stock <= p.minStock ? 'Bajo Stock' : 'Normal';
        return [
            p.id,
            p.code || '-',
            p.name,
            p.category,
            p.stock,
            p.minStock,
            p.price.toFixed(2),
            totalValue.toFixed(2),
            status,
            p.description || '-'
        ];
    });
    
    // Crear contenido CSV
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => {
            // Escapar comillas y saltos de línea
            if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
                return '"' + cell.replace(/"/g, '""') + '"';
            }
            return cell;
        }).join(',') + '\n';
    });
    
    // Agregar resumen
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    csv += '\n';
    csv += 'RESUMEN\n';
    csv += 'Total Productos,' + products.length + '\n';
    csv += 'Stock Total,' + totalStock + '\n';
    csv += 'Valor Total,' + totalValue.toFixed(2) + '\n';
    
    // Descargar archivo
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    showToast('Archivo CSV exportado correctamente', 'success');
}

function exportToExcel() {
    if (products.length === 0) {
        showToast('No hay productos para exportar', 'warning');
        return;
    }
    
    // Crear datos para Excel
    const excelData = [];
    
    // Encabezados
    excelData.push([
        'ID',
        'Código',
        'Nombre Producto',
        'Categoría',
        'Stock Actual',
        'Stock Mínimo',
        'Precio Unit.',
        'Valor Total',
        'Estado',
        'Descripción'
    ]);
    
    // Datos de productos
    products.forEach((p, index) => {
        const rowIndex = index + 2; // +2 porque comienza en fila 2 (fila 1 es encabezado)
        excelData.push([
            p.id,
            p.code || '-',
            p.name,
            p.category,
            p.stock,
            p.minStock,
            p.price,
            // Fórmula: Celda de Stock (E) × Celda de Precio (G)
            { f: `E${rowIndex}*G${rowIndex}`, v: p.stock * p.price },
            p.stock === 0 ? 'Agotado' : p.stock <= p.minStock ? 'Bajo Stock' : 'Normal',
            p.description || '-'
        ]);
    });
    
    // Agregar filas vacías para resumen
    excelData.push([]);
    const summaryRow = excelData.length + 1;
    
    excelData.push(['RESUMEN']);
    excelData.push(['Total Productos:', products.length]);
    excelData.push(['Stock Total:', { f: `SUM(E2:E${products.length + 1})`, v: products.reduce((sum, p) => sum + p.stock, 0) }]);
    excelData.push(['Valor Total Inventario:', { f: `SUM(H2:H${products.length + 1})`, v: products.reduce((sum, p) => sum + (p.stock * p.price), 0) }]);
    
    // Crear libro de trabajo
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // Aplicar estilos y formato
    const colWidths = [8, 12, 25, 15, 15, 15, 15, 15, 15, 30];
    ws['!cols'] = colWidths.map(w => ({ wch: w }));
    
    // Aplicar formato a encabezados
    const headerStyle = {
        fill: { fgColor: { rgb: 'FF34495E' } },
        font: { color: { rgb: 'FFFFFFFF' }, bold: true },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
    };
    
    // Aplicar estilos a la fila de encabezado
    for (let i = 0; i < 10; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
        ws[cellRef].fill = headerStyle.fill;
        ws[cellRef].font = headerStyle.font;
        ws[cellRef].alignment = headerStyle.alignment;
    }
    
    // Aplicar formato a números (precios y totales)
    const numberStyle = {
        numFmt: '$#,##0.00'
    };
    
    for (let i = 1; i <= products.length; i++) {
        // Precio (columna G)
        const priceCell = XLSX.utils.encode_cell({ r: i, c: 6 });
        ws[priceCell].numFmt = '$#,##0.00';
        
        // Valor Total (columna H)
        const totalCell = XLSX.utils.encode_cell({ r: i, c: 7 });
        ws[totalCell].numFmt = '$#,##0.00';
    }
    
    // Crear workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    
    // Descargar archivo
    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `inventario_${fecha}.xlsx`);
    
    showToast('Archivo Excel exportado correctamente con fórmulas', 'success');
}

function printExcelTable() {
    window.print();
}

// Agregar eventos a botones Excel
document.addEventListener('DOMContentLoaded', function() {
    const exportCSVBtn = document.getElementById('exportCSVBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const printBtn = document.getElementById('printBtn');
    
    if (exportCSVBtn) {
        exportCSVBtn.addEventListener('click', exportToCSV);
    }
    
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportToExcel);
    }
    
    if (printBtn) {
        printBtn.addEventListener('click', printExcelTable);
    }
}, { once: false });
