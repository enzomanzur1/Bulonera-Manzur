# 📊 LISTADO EXCEL CON FÓRMULAS - GUÍA DE USO

## ✨ Funcionalidad Mejorada

El apartado **"Listado Excel"** ahora es completamente funcional con descarga en formato Excel nativo (.xlsx) que incluye **fórmulas automáticas** para cálculos.

---

## 🎯 Características Principales

### 1. **Tabla Visual Tipo Excel**

```
┌────┬────────┬──────────────┬───────────┬──────┬────┬──────┬──────┬────────┬──────────┐
│ ID │ Código │ Nombre       │ Categoría │Stock │Min │Precio│Total │ Estado │Descripción│
├────┼────────┼──────────────┼───────────┼──────┼────┼──────┼──────┼────────┼──────────┤
│ 1  │TORN001 │Tornillo M6   │Tornillos  │ 150  │ 50 │ 0.50 │ 75   │Normal  │Acero...│
│ 2  │TORN002 │Tornillo M8   │Tornillos  │ 200  │ 50 │ 0.75 │ 150  │Normal  │Acero...│
│ 3  │TUER001 │Tuerca M6     │Tuercas    │ 8    │ 50 │ 0.25 │ 2    │Bajo ⚠ │Acero...│
│ 4  │HERR001 │Destornillador│Herramientas│ 25  │ 10 │ 5.50 │137.5 │Normal  │Profes...│
│ 5  │PINT001 │Pintura 1L    │Pintura    │ 3    │ 10 │15.00 │ 45   │Bajo ⚠ │Látex...│
└────┴────────┴──────────────┴───────────┴──────┴────┴──────┴──────┴────────┴──────────┘
```

✅ **Encabezado fijo** (no se mueve al scroll)
✅ **Filas alternas coloreadas** (mejor lectura)
✅ **Hover visual** en cada fila
✅ **Búsqueda en tiempo real**

### 2. **Botones de Descarga**

#### 📊 **Descargar Excel** (PRINCIPAL)
- Descarga en formato `.xlsx` (Excel nativo)
- ✅ **Incluye FÓRMULAS automáticas**
- Formato profesional con:
  - Encabezado coloreado
  - Números formateados como moneda
  - Fórmulas para cálculos de totales
  - Resumen con SUM()

#### 📄 **Descargar CSV**
- Descarga en formato `.csv` (texto plano)
- Compatible con cualquier aplicación
- Datos sin fórmulas

#### 🖨️ **Imprimir**
- Abre diálogo de impresión
- Tabla optimizada para papel

### 3. **Fórmulas Automáticas**

Cuando descargas en Excel, incluye:

```excel
Valor Total = Stock Actual × Precio Unit.

Ejemplo: Celda H2 = E2*G2
         150 × 0.50 = 75.00

Stock Total = SUM(E2:E6)
            = 150 + 200 + 8 + 25 + 3
            = 386

Valor Total = SUM(H2:H6)
            = 75 + 150 + 2 + 137.5 + 45
            = $381.50
```

---

## 🚀 Cómo Usar

### Paso 1: Acceder al Listado

1. Abre `/administrador/index.html`
2. En el menú izquierdo, haz clic en **"Listado Excel"**

### Paso 2: Buscar Productos (Opcional)

1. Usa el campo **"Buscar en listado..."**
2. Escribe cualquier término:
   - Nombre: "Tornillo"
   - Código: "TORN"
   - Categoría: "Herramientas"
   - Precio: "5.50"
3. La tabla se filtra automáticamente

### Paso 3: Descargar Excel

#### Opción A: Con Fórmulas (Recomendado)
```
1. Haz clic en: "📊 Descargar Excel"
2. Se descarga: inventario_2026-05-03.xlsx
3. Abre en Excel
4. ¡Las fórmulas ya están hechas!
```

**Ventajas:**
- ✅ Edita precios o stock
- ✅ Las fórmulas se recalculan automáticamente
- ✅ Formato profesional
- ✅ Encabezado coloreado
- ✅ Números formateados

**Ejemplo:**
```
Si cambias Stock de 150 a 200:
→ Valor Total: 75 → 100 (automático)
```

#### Opción B: Solo Datos (CSV)
```
1. Haz clic en: "📄 Descargar CSV"
2. Se descarga: inventario_2026-05-03.csv
3. Abre en Excel o Google Sheets
```

**Ventajas:**
- Compatible con cualquier programa
- Archivo más pequeño
- Datos sin formato

---

## 📋 Qué Incluye el Archivo Excel

### Datos de Productos

| Columna | Contenido | Ejemplo |
|---------|-----------|---------|
| A | ID | 1, 2, 3... |
| B | Código | TORN001 |
| C | Nombre | Tornillo M6x20 |
| D | Categoría | Tornillos |
| E | Stock Actual | 150 |
| F | Stock Mínimo | 50 |
| G | Precio Unit. | 0.50 |
| H | Valor Total | **FÓRMULA**: E×G |
| I | Estado | Normal/Bajo/Agotado |
| J | Descripción | Tornillo métrico... |

### Resumen Final (con Fórmulas)

```
RESUMEN
Total Productos: 5
Stock Total: 386          (Fórmula: SUM de Stock)
Valor Total Inventario: $381.50  (Fórmula: SUM de Totales)
```

---

## 💡 Ejemplos de Uso

### Caso 1: Analista de Inventario

```
1. Descarga Excel
2. Abre en Excel
3. Edita precio de Tornillo M6: 0.50 → 0.60
4. Automáticamente:
   - Valor Total del Tornillo: 75 → 90
   - Valor Total del Inventario: 381.50 → 386.50
5. Guarda el archivo
```

### Caso 2: Reporte para Gerente

```
1. Busca productos con "Bajo Stock"
2. Descarga Excel
3. Imprime desde Excel
4. Lleva a la reunión de gerencia
```

### Caso 3: Auditoría

```
1. Descarga Excel
2. Compara con registros físicos
3. Si hay diferencias, edita en Excel
4. Guarda como "inventario_auditado.xlsx"
5. Archiva para registros
```

### Caso 4: Integración con Contabilidad

```
1. Descarga Excel
2. Copiar columna H (Valor Total)
3. Pegar en hoja de balance
4. Las fórmulas se mantienen funcionales
```

---

## 🎨 Formato del Archivo Excel

### Encabezado (Fila 1)
- Fondo: Gris oscuro (#34495E)
- Texto: Blanco, negrita
- Alineación: Centrado

### Datos (Filas 2-N)
- Números: Formateados como moneda ($)
- Stock: Números enteros
- Descripción: Ajuste de texto

### Ejemplo de Encabezado
```
┌─────┬────────┬──────────────────┬──────────┐
│ ID  │ Código │ Nombre Producto  │  Precio  │
│ :  │ :      │ :                │ :        │
│(blanco en gris oscuro)              │
└─────┴────────┴──────────────────┴──────────┘
```

---

## 📊 Fórmulas Disponibles

### En la Celda H (Valor Total)

```excel
=E2*G2  (para fila 2)
=E3*G3  (para fila 3)
... etc
```

**Significado:**
- E = Columna Stock Actual
- G = Columna Precio Unit.
- × = Multiplicación

### En el Resumen

```excel
Stock Total = =SUM(E2:E6)
Valor Total = =SUM(H2:H6)
```

---

## 🔧 Editar en Excel

### Cambiar Stock

1. Abre el Excel descargado
2. Modifica la columna E (Stock Actual)
3. La fórmula en H se recalcula automáticamente
4. Guarda (Ctrl+S)

### Cambiar Precio

1. Modifica la columna G (Precio Unit.)
2. La fórmula en H se recalcula automáticamente
3. El Valor Total del Inventario se actualiza
4. Guarda

### Agregar Fila Nueva

1. Copia una fila existente
2. Modifica los datos
3. La fórmula en H se aplica automáticamente
4. Guarda

---

## ⚠️ Limitaciones y Notas

- Las fórmulas solo funcionan en Excel si lo abres en Excel o Google Sheets
- Si abres en programas simples (Notepad), verás el código de la fórmula
- Las búsquedas en la tabla HTML no se exportan (es solo filtrado visual)
- El resumen se calcula una sola vez al descargar
- Si editas en Excel y luego descargas de nuevo, se sobrescribe

---

## 📥 Dónde se Descarga

El archivo se descarga en tu carpeta **"Descargas"** con el nombre:

```
inventario_2026-05-03.xlsx   (formato Excel con fórmulas)
inventario_2026-05-03.csv    (formato texto)
```

**Notas:**
- La fecha es automática (del día de descarga)
- Si descargas dos veces el mismo día, se sobrescribe
- Puedes renombrar el archivo según necesites

---

## ✅ Verificación Rápida

Para verificar que todo funciona:

1. **Abre Listado Excel** ✅
2. **Verifica tabla con 5 productos** ✅
3. **Haz clic "Descargar Excel"** ✅
4. **Se descarga inventario_FECHA.xlsx** ✅
5. **Abre en Excel** ✅
6. **Celda H2 muestra fórmula =E2*G2** ✅
7. **Edita Stock Actual (E2) y Total se recalcula** ✅

---

## 🎓 Atajos en Excel

Una vez abierto el archivo:

| Acción | Atajo |
|--------|-------|
| Guardar | Ctrl+S |
| Deshacer | Ctrl+Z |
| Rehacer | Ctrl+Y |
| Actualizar fórmulas | F9 |
| Formato moneda | Ctrl+Shift+4 |

---

## 📞 Solución de Problemas

### Problema: No se descarga el archivo
**Solución:** Verifica que tengas productos registrados en el panel

### Problema: Las fórmulas no se ven
**Solución:** Abre el Excel en Excel o Google Sheets (no en Notepad)

### Problema: Los totales no se actualizan
**Solución:** En Excel, haz clic en la celda y presiona F2 + Enter

### Problema: No puedo editar
**Solución:** Verifica que el archivo no esté protegido (Archivo → Información)

---

## 🚀 Próximas Mejoras

- [ ] Filtros automáticos en encabezado
- [ ] Gráficos estadísticos en el Excel
- [ ] Múltiples hojas por categoría
- [ ] Historial de cambios
- [ ] Comparación de períodos

---

**Módulo: Listado Excel con Fórmulas**  
**Versión**: 1.2.0  
**Status**: ✅ 100% Funcional  
**Último Update**: Mayo 2026

