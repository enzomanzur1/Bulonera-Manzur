# Panel de Administrador - Gestión de Stock

## 📋 Descripción
Panel administrativo profesional para la gestión completa de inventario y stock de productos. Interfaz moderna y ordenada con todas las funcionalidades necesarias para administrar el catálogo de Bulonería Manzur.

## 🚀 Características

### Dashboard
- **Estadísticas en tiempo real** de productos y stock
- **Resumen visual** con tarjetas de datos clave:
  - Total de productos
  - Stock disponible total
  - Productos con bajo stock
  - Movimientos del día
- **Tabla de productos con bajo stock** para alertas rápidas
- **Historial de últimos movimientos** registrados

### Gestión de Stock
- **Tabla completa** de inventario con todos los detalles
- **Sistema de búsqueda** en tiempo real por nombre o código
- **Filtros avanzados**:
  - Por categoría
  - Por estado de stock (bajo, agotado, normal)
- **Indicadores visuales** del estado del stock
- **Acciones rápidas** desde la tabla:
  - Editar producto
  - Ajustar stock
  - Eliminar producto

### Productos
- **Vista en cuadrícula** de productos
- **Información completa** de cada producto
- **Barra de progreso visual** del stock
- **Estadísticas por producto**:
  - Stock actual
  - Stock mínimo
  - Precio unitario
- **Botones de acción** rápida

### Reportes
- **Generador de reportes** por rango de fechas
- **Análisis de movimientos** en períodos específicos
- **Exportación de datos** (preparado para PDF)
- **Historial completo** de movimientos registrados

### Configuración
- **Ajuste de parámetros** del sistema
- **Stock mínimo por defecto**
- **Stock crítico/nivel de alerta**
- **Guardado persistente** de configuración

## 🎯 Cómo Usar

### Acceso al Panel
1. Inicia sesión en la aplicación principal
2. Accede a `/administrador/index.html` o desde el menú de administrador
3. El sistema verifica automáticamente tu sesión

### Gestionar Productos

#### Crear Nuevo Producto
1. Ve a la pestaña "Gestión de Stock"
2. Haz clic en "+ Nuevo Producto"
3. Completa los campos obligatorios:
   - Nombre del Producto
   - Categoría
   - Stock Actual
   - Stock Mínimo
   - Precio Unitario
4. Opcional: Añade código y descripción
5. Haz clic en "Guardar Producto"

#### Editar Producto
1. En la tabla de stock, haz clic en el botón de edición (✏️)
2. Modifica los datos necesarios
3. Haz clic en "Guardar Producto"

#### Eliminar Producto
1. En la tabla de stock, haz clic en el botón de eliminar (🗑️)
2. Confirma la acción

### Ajustar Stock

#### Registrar Movimiento
1. Haz clic en el botón de ajuste (±) en la tabla o tarjeta
2. Selecciona el tipo de movimiento:
   - **Entrada**: Recepción de mercadería
   - **Salida**: Venta o retirada de stock
   - **Ajuste**: Corrección de inventario
3. Ingresa la cantidad
4. Opcional: Añade el motivo del movimiento
5. Haz clic en "Aplicar Cambio"

### Filtrar y Buscar

#### Por Nombre o Código
- Usa el campo de búsqueda "Buscar producto..."
- Los resultados se actualizan en tiempo real

#### Por Categoría
- Usa el dropdown "Todas las categorías"
- Opciones: Tornillos, Herramientas, Tuercas, Pintura

#### Por Estado de Stock
- Usa el dropdown "Todos"
- Opciones: Bajo stock, Agotado, Normal

### Generar Reportes
1. Ve a la pestaña "Reportes"
2. Selecciona el rango de fechas
3. Haz clic en "Generar Reporte"
4. Visualiza los movimientos en el período

## 📊 Estados del Stock

### Visual
- **🟢 Normal**: Stock superior al mínimo (verde)
- **🟡 Bajo Stock**: Stock igual o inferior al mínimo (naranja)
- **🔴 Agotado**: Sin stock disponible (rojo)

## 🔒 Seguridad y Datos

### Almacenamiento
- Los datos se guardan en **localStorage del navegador**
- Información persistente entre sesiones
- Requiere autenticación previa

### Sesión
- Verifica automáticamente si hay sesión activa
- Si no hay sesión, redirige a login
- Botón de logout en la esquina superior derecha

## 💾 Datos de Ejemplo

El sistema viene con 5 productos de ejemplo:
1. **Tornillo M6x20** - Tornillos - 150 unidades
2. **Tornillo M8x30** - Tornillos - 200 unidades
3. **Tuerca M6** - Tuercas - 8 unidades (Bajo stock)
4. **Destornillador Phillips** - Herramientas - 25 unidades
5. **Pintura Blanca 1L** - Pintura - 3 unidades (Bajo stock)

## 🎨 Características de Diseño

### Interfaz
- Sidebar de navegación intuitivo
- Navbar superior con información del usuario
- Notificaciones toast (emergen desde abajo a la derecha)
- Modales para operaciones críticas
- Diseño responsive (funciona en móvil)

### Colores
- **Azul**: Acciones primarias y navegación
- **Verde**: Éxito e items normales
- **Naranja**: Advertencias y bajo stock
- **Rojo**: Errores y acciones peligrosas

### Animaciones
- Transiciones suaves entre vistas
- Efectos hover en elementos interactivos
- Notificaciones con animación de deslizamiento

## 📱 Responsive

El panel se adapta a:
- Desktop (1200px+)
- Tablets (768px - 1200px)
- Móviles (hasta 768px)

## ⌨️ Atajos

- **ESC**: Cierra modales
- **Enter**: Envía formularios
- **Tab**: Navega entre campos

## 🐛 Resolución de Problemas

### Los datos no se guardan
- Verifica que localStorage esté habilitado en el navegador
- Intenta limpiar el caché del navegador

### Sesión cerrada al recargar
- Verifica que el localStorage de la página principal esté intacto
- Inicia sesión nuevamente

### Modales pegadas
- Haz clic fuera del modal o en el botón de cerrar
- Presiona ESC

## 📈 Próximas Mejoras Planeadas

- [ ] Exportación a PDF/Excel
- [ ] Gráficos estadísticos avanzados
- [ ] Predicción de stock basada en movimientos
- [ ] Importación de productos en lote
- [ ] Historial detallado de cambios por usuario
- [ ] Notificaciones por email de bajo stock
- [ ] Integración con proveedores
- [ ] Códigos de barras QR

## 👤 Usuario Demo

- **Usuario**: lokura
- **Contraseña**: 123456

## 📞 Soporte

Para reportar problemas o sugerir mejoras, contacta al equipo de desarrollo.

---

**Versión**: 1.0.0
**Última actualización**: 2026
**Estado**: Activo y funcional
