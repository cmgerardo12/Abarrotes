// ==========================================
// 1. MODELO DE CLASES (POO - Diagrama UML)
// ==========================================
class Producto {
    constructor(id, codigo, nombre, tipo, categoria, costo, precio, stock, minimo, caducidad, mayoreo = 0, cantMayoreo = 6, imagen = '') {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.tipo = tipo;
        this.categoria = categoria;
        this.costo = parseFloat(costo);
        this.precio = parseFloat(precio);
        this.stock = parseFloat(stock);
        this.minimo = parseFloat(minimo);
        this.caducidad = caducidad || '2027-06-01';
        this.mayoreo = parseFloat(mayoreo) || 0;
        this.cantMayoreo = parseInt(cantMayoreo) || 6;
        this.imagen = imagen || '';
    }
}

class Combo {
    constructor(id, codigo, nombre, prod1Id, prod2Id, precio) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.prod1Id = parseInt(prod1Id);
        this.prod2Id = parseInt(prod2Id);
        this.precio = parseFloat(precio);
    }
}

class Cliente {
    constructor(id, nombre, telefono, limite, deuda = 0, historial = [], envases = {}) {
        this.id = id;
        this.nombre = nombre;
        this.telefono = telefono;
        this.limite = parseFloat(limite);
        this.deuda = parseFloat(deuda);
        this.historial = historial;
        this.envases = envases;
    }
}

class Proveedor {
    constructor(id, empresa, contacto, telefono, linea, diaVisita) {
        this.id = id;
        this.empresa = empresa;
        this.contacto = contacto;
        this.telefono = telefono || '5500000000';
        this.linea = linea || 'General';
        this.diaVisita = diaVisita;
    }
}

// ==========================================
// 2. ILUSTRACIONES SVG CON ACENTO POR CATEGORÍA
// ==========================================
function obtenerArteProducto(prod, esCombo = false) {
    if (!esCombo && prod.imagen && prod.imagen.trim() !== '') {
        return `<img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.style.display='none'">`;
    }

    const coloresCategoria = {
        'Bebidas': '#38bdf8',
        'Lácteos': '#fbbf24',
        'Salchichonería': '#fb7185',
        'Botanas': '#c084fc',
        'Panadería': '#f97316',
        'Frutas y Verduras': '#34d399',
        'Limpieza': '#22d3ee',
        'Higiene': '#818cf8',
        'Abarrotes': '#f59e0b'
    };

    const strokeColor = esCombo ? '#f59e0b' : (coloresCategoria[prod.categoria] || '#a1a1aa');
    const baseAttrs = `viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"`;

    if (esCombo) {
        return `<svg ${baseAttrs}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
    }
    if (prod.categoria === 'Bebidas') {
        return `<svg ${baseAttrs}><path d="M9 2h6v3l2 3v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8l2-3V2z"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>`;
    }
    if (prod.categoria === 'Lácteos') {
        return `<svg ${baseAttrs}><path d="M8 2h8l2 5v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7l2-5z"/><line x1="6" y1="7" x2="18" y2="7"/><circle cx="12" cy="14" r="2.5"/></svg>`;
    }
    if (prod.categoria === 'Salchichonería') {
        return `<svg ${baseAttrs}><ellipse cx="12" cy="12" rx="8" ry="5"/><path d="M7 12h10"/></svg>`;
    }
    if (prod.categoria === 'Botanas') {
        return `<svg ${baseAttrs}><path d="M5 4h14l-1 16H6L5 4z"/><path d="M9 9l6 6"/><path d="M15 9l-6 6"/></svg>`;
    }
    if (prod.categoria === 'Panadería') {
        return `<svg ${baseAttrs}><path d="M4 11a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7z"/><line x1="9" y1="7" x2="9" y2="11"/><line x1="15" y1="7" x2="15" y2="11"/></svg>`;
    }
    if (prod.categoria === 'Frutas y Verduras') {
        return `<svg ${baseAttrs}><circle cx="12" cy="13" r="7"/><path d="M12 6V3"/><path d="M12 6c2-2 4-1 4 0"/></svg>`;
    }
    if (prod.categoria === 'Limpieza' || prod.categoria === 'Higiene') {
        return `<svg ${baseAttrs}><path d="M10 3h4v3h3l1 4v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10l1-4h3V3z"/><path d="M14 3h3"/></svg>`;
    }
    return `<svg ${baseAttrs}><path d="M5 7l2-4h10l2 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z"/><line x1="5" y1="7" x2="19" y2="7"/><circle cx="12" cy="14" r="2.8"/></svg>`;
}

// ==========================================
// 3. CONTROLADOR TITANIUM ENTERPRISE v9.0
// ==========================================
class SistemaPOS {
    constructor() {
        this.productos = [];
        this.combos = [];
        this.clientes = [];
        this.proveedores = [];
        this.comprasProveedores = [];
        this.ventas = [];
        this.gastos = [];
        this.kardex = [];
        this.abonosTotales = 0;

        this.configTienda = {
            nombre: 'ABARROTES CORE',
            rfc: 'RFC: XAXX010101000',
            direccion: 'Ecatepec de Morelos, Edo. Méx.',
            pie: '¡GRACIAS POR SU PREFERENCIA!'
        };

        this.cuentasCarrito = [[], [], []];
        this.slotActivo = 0;

        this.categoriaActiva = 'Todas';
        this.filtroInventarioEstado = 'todos';
        this.vistaCompacta = false;
        this.productoGranelSeleccionado = null;
        this.clienteEstadoCuentaActual = null;
        this.ventaModalActual = null;
        this.streamCamara = null;
        this.intervaloEscaneo = null;

        this.sesion = {
            operador: 'Gerardo Caballero',
            rol: 'ADMIN',
            fondoInicial: 500,
            metaDiaria: 4500
        };

        this.cargarDatos();
        this.inicializarEventos();
        this.iniciarReloj();
        this.aplicarConfigTienda();
        this.renderizarTodo();
    }

    get carrito() { return this.cuentasCarrito[this.slotActivo]; }
    set carrito(val) { this.cuentasCarrito[this.slotActivo] = val; }

    beepEscanner(tipo = 'ok') {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = tipo === 'ok' ? 1200 : 250;
            gain.gain.value = 0.05;
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
    }

    iniciarReloj() {
        const actualizar = () => {
            document.getElementById('relojSistema').textContent = new Date().toLocaleTimeString('es-MX');
        };
        actualizar();
        setInterval(actualizar, 1000);
    }

    diasParaCaducar(fechaStr) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const cad = new Date(fechaStr + 'T00:00:00');
        return Math.ceil((cad - hoy) / (1000 * 60 * 60 * 24));
    }

    cargarDatos() {
        const datosGuardados = localStorage.getItem('pos_abarrotes_v9_db') || localStorage.getItem('pos_abarrotes_v8_db');
        if (datosGuardados) {
            const db = JSON.parse(datosGuardados);
            this.productos = db.productos || [];
            this.combos = db.combos || [];
            this.clientes = (db.clientes || []).map(c => ({ ...c, envases: c.envases || {} }));
            this.proveedores = db.proveedores || [];
            this.comprasProveedores = db.comprasProveedores || [];
            this.ventas = db.ventas || [];
            this.gastos = db.gastos || [];
            this.kardex = db.kardex || [];
            this.abonosTotales = db.abonosTotales || 0;
            if (db.configTienda) this.configTienda = db.configTienda;
        } else {
            this.cargarDatosIniciales();
        }
    }

    cargarDatosIniciales() {
        const d = (dias) => {
            const f = new Date();
            f.setDate(f.getDate() + dias);
            return f.toISOString().split('T')[0];
        };

        const catalogoBase = [
            ['750101', 'Coca-Cola 600ml', 'pieza', 'Bebidas', 13.5, 19, 36, 8, d(120), 17.5, 6],
            ['750102', 'Coca-Cola 2.5L Retornable', 'pieza', 'Bebidas', 26, 35, 18, 5, d(90), 32.5, 4],
            ['750103', 'Coca-Cola 3L No Retornable', 'pieza', 'Bebidas', 34, 44, 15, 4, d(95), 41, 4],
            ['750104', 'Coca-Cola Lata 355ml', 'pieza', 'Bebidas', 12, 18, 24, 6, d(180), 16, 6],
            ['750105', 'Pepsi 600ml', 'pieza', 'Bebidas', 11.5, 17, 24, 6, d(110), 15, 6],
            ['750106', 'Sprite 600ml', 'pieza', 'Bebidas', 12.5, 18, 18, 5, d(115), 16.5, 6],
            ['750107', 'Fanta Naranja 600ml', 'pieza', 'Bebidas', 12.5, 18, 18, 5, d(115), 16.5, 6],
            ['750108', 'Mundet Manzana 600ml', 'pieza', 'Bebidas', 12.5, 18, 16, 4, d(115), 16.5, 6],
            ['750109', 'Agua Ciel 1L', 'pieza', 'Bebidas', 8, 13, 30, 8, d(240), 11, 6],
            ['750110', 'Agua Bonafont 1.5L', 'pieza', 'Bebidas', 10, 16, 24, 6, d(240), 14, 6],
            ['750111', 'Garrafón Agua 20L (Llenado)', 'pieza', 'Bebidas', 14, 22, 15, 5, d(300), 20, 3],
            ['750112', 'Boing Mango 500ml', 'pieza', 'Bebidas', 11, 16, 24, 6, d(140), 14.5, 6],
            ['750113', 'Boing Guayaba 500ml', 'pieza', 'Bebidas', 11, 16, 20, 6, d(140), 14.5, 6],
            ['750114', 'Jumex Durazno Lata 335ml', 'pieza', 'Bebidas', 10.5, 16, 20, 5, d(160), 14, 6],
            ['750115', 'Electrolit Coco 625ml', 'pieza', 'Bebidas', 18, 25, 16, 4, d(200), 23, 4],
            ['750116', 'Gatorade Azul 600ml', 'pieza', 'Bebidas', 16, 23, 15, 4, d(190), 21, 4],
            ['750117', 'Vive 100 300ml', 'pieza', 'Bebidas', 10, 15, 24, 6, d(150), 13.5, 6],
            ['750118', 'Red Bull 250ml', 'pieza', 'Bebidas', 31, 42, 12, 3, d(220), 39, 4],

            ['750119', 'Leche Lala Entera 1L', 'pieza', 'Lácteos', 21.5, 28, 24, 6, d(14), 26, 6],
            ['750120', 'Leche Alpura Clásica 1L', 'pieza', 'Lácteos', 21.5, 28, 24, 6, d(14), 26, 6],
            ['750121', 'Leche Deslactosada 1L', 'pieza', 'Lácteos', 22.5, 29.5, 16, 4, d(15), 27.5, 6],
            ['750122', 'Leche Nutri 1L', 'pieza', 'Lácteos', 17.5, 23, 20, 5, d(18), 21.5, 6],
            ['750123', 'Yogurt Lala Fresa 220g', 'pieza', 'Lácteos', 9.5, 14, 18, 5, d(12), 12.5, 6],
            ['750124', 'Yakult Paquete 5 Pzas', 'pieza', 'Lácteos', 24, 32, 10, 3, d(10), 30, 3],
            ['750125', 'Crema Alpura 200ml', 'pieza', 'Lácteos', 14.5, 20, 15, 4, d(15), 18.5, 4],
            ['750126', 'Crema Lala 450ml', 'pieza', 'Lácteos', 28, 37, 10, 3, d(15), 34.5, 3],
            ['750127', 'Queso Panela (Kg)', 'granel', 'Lácteos', 85, 118, 5.5, 2, d(7), 110, 2],
            ['750128', 'Queso Oaxaca (Kg)', 'granel', 'Lácteos', 98, 136, 4.5, 2, d(7), 126, 2],
            ['750129', 'Queso Amarillo 10 Rebanadas', 'pieza', 'Lácteos', 16, 23, 14, 4, d(25), 21, 4],
            ['750130', 'Mantequilla Iberia 90g', 'pieza', 'Lácteos', 14, 20, 12, 3, d(45), 18, 4],

            ['750131', 'Huevo Blanco (Kg)', 'granel', 'Abarrotes', 34, 44, 25, 6, d(15), 41, 3],
            ['750132', 'Tortilla de Maíz (Kg)', 'granel', 'Abarrotes', 16, 22, 30, 8, d(2), 20, 4],
            ['750133', 'Frijol Flor de Mayo (Kg)', 'granel', 'Abarrotes', 28, 38, 20, 5, d(180), 35, 5],
            ['750134', 'Frijol Negro (Kg)', 'granel', 'Abarrotes', 26, 36, 18, 5, d(180), 33, 5],
            ['750135', 'Azúcar Estándar (Kg)', 'granel', 'Abarrotes', 22, 30, 22, 6, d(240), 27.5, 5],
            ['750136', 'Arroz Súper Extra (Kg)', 'granel', 'Abarrotes', 20, 28, 20, 5, d(210), 25.5, 5],
            ['750137', 'Aceite Nutrioli 850ml', 'pieza', 'Abarrotes', 36, 47, 16, 4, d(200), 44, 4],
            ['750138', 'Aceite 1-2-3 1L', 'pieza', 'Abarrotes', 34, 45, 18, 4, d(200), 42, 4],
            ['750139', 'Atún Tuny en Agua 140g', 'pieza', 'Abarrotes', 15.5, 22, 28, 6, d(300), 20, 6],
            ['750140', 'Atún Dolores en Aceite 140g', 'pieza', 'Abarrotes', 16, 22.5, 24, 6, d(300), 20.5, 6],
            ['750141', 'Sopa Maruchan Pollo 64g', 'pieza', 'Abarrotes', 11.5, 16.5, 36, 8, d(180), 15, 6],
            ['750142', 'Sopa La Moderna Fideo 200g', 'pieza', 'Abarrotes', 7.5, 11.5, 30, 8, d(240), 10, 6],
            ['750143', 'Sopa La Moderna Codito 200g', 'pieza', 'Abarrotes', 7.5, 11.5, 28, 8, d(240), 10, 6],
            ['750144', 'Puré de Tomate Del Fuerte 210g', 'pieza', 'Abarrotes', 7, 11, 24, 6, d(200), 9.5, 6],
            ['750145', 'Chiles Jalapeños La Costeña 220g', 'pieza', 'Abarrotes', 11, 16, 20, 5, d(250), 14.5, 6],
            ['750146', 'Frijoles Bayos Refritos 430g', 'pieza', 'Abarrotes', 13, 18.5, 18, 5, d(220), 17, 6],
            ['750147', 'Mayonesa McCormick 190g', 'pieza', 'Abarrotes', 21, 29, 14, 4, d(160), 26.5, 4],
            ['750148', 'Catsup Clemente Jacques 220g', 'pieza', 'Abarrotes', 12, 17.5, 15, 4, d(180), 16, 4],
            ['750149', 'Salsa Valentina Etiqueta Negra 370ml', 'pieza', 'Abarrotes', 13, 19, 18, 4, d(240), 17, 4],
            ['750150', 'Café Nescafé Clásico 42g', 'pieza', 'Abarrotes', 25, 34, 16, 4, d(300), 31.5, 4],
            ['750151', 'Café Legal Soluble 50g', 'pieza', 'Abarrotes', 19, 26, 14, 4, d(280), 24, 4],
            ['750152', 'Chocolate Abuelita 1 Tablilla', 'pieza', 'Abarrotes', 13, 18.5, 20, 5, d(200), 17, 6],
            ['750153', 'Sal La Fina 1Kg', 'pieza', 'Abarrotes', 11, 16.5, 16, 4, d(500), 15, 5],
            ['750154', 'Harina Maseca 1Kg', 'pieza', 'Abarrotes', 17, 23, 15, 4, d(150), 21, 5],
            ['750155', 'Avena Quaker 400g', 'pieza', 'Abarrotes', 16, 23, 12, 3, d(180), 21, 4],
            ['750156', 'Cereal Zucaritas 260g', 'pieza', 'Abarrotes', 32, 43, 10, 3, d(160), 40, 3],

            ['750157', 'Pan Blanco Bimbo Grande', 'pieza', 'Panadería', 36, 45, 12, 4, d(5), 42, 3],
            ['750158', 'Pan Integral Bimbo', 'pieza', 'Panadería', 38, 48, 8, 3, d(5), 45, 3],
            ['750159', 'Medias Noches Bimbo 8 Pzas', 'pieza', 'Panadería', 31, 40, 10, 3, d(6), 37, 3],
            ['750160', 'Bimbollos 8 Pzas', 'pieza', 'Panadería', 34, 44, 10, 3, d(6), 41, 3],
            ['750161', 'Mantecadas Bimbo 4 Pzas', 'pieza', 'Panadería', 21, 28, 14, 4, d(8), 26, 4],
            ['750162', 'Donas Azucaradas Bimbo', 'pieza', 'Panadería', 18, 24, 15, 4, d(7), 22, 4],
            ['750163', 'Gansito Marinela', 'pieza', 'Panadería', 13, 18, 24, 6, d(10), 16.5, 6],
            ['750164', 'Pingüinos Marinela 2 Pzas', 'pieza', 'Panadería', 16, 22, 18, 5, d(10), 20, 6],

            ['750165', 'Sabritas Original 45g', 'pieza', 'Botanas', 12.5, 18, 28, 6, d(75), 16.5, 5],
            ['750166', 'Ruffles Queso 50g', 'pieza', 'Botanas', 12.5, 18, 24, 6, d(75), 16.5, 5],
            ['750167', 'Doritos Nacho 58g', 'pieza', 'Botanas', 12.5, 18, 26, 6, d(75), 16.5, 5],
            ['750168', 'Cheetos Torciditos 52g', 'pieza', 'Botanas', 11.5, 16.5, 24, 6, d(75), 15, 5],
            ['750169', 'Takis Fuego 56g', 'pieza', 'Botanas', 12.5, 18, 25, 6, d(80), 16.5, 5],
            ['750170', 'Chips Jalapeño Barcel 46g', 'pieza', 'Botanas', 12.5, 18, 20, 5, d(80), 16.5, 5],
            ['750171', 'Cacahuates Japoneses Karate 60g', 'pieza', 'Botanas', 10, 15, 20, 5, d(120), 13.5, 6],
            ['750172', 'Galletas Marías Gamesa 170g', 'pieza', 'Botanas', 13, 19, 22, 5, d(150), 17.5, 5],
            ['750173', 'Galletas Emperador Chocolate 109g', 'pieza', 'Botanas', 13.5, 19.5, 20, 5, d(140), 18, 5],
            ['750174', 'Galletas Chokis 90g', 'pieza', 'Botanas', 14, 20, 18, 4, d(140), 18.5, 5],
            ['750175', 'Galletas Príncipe Marinela', 'pieza', 'Botanas', 14.5, 20.5, 18, 4, d(130), 19, 5],
            ['750176', 'Mazapán De la Rosa Gigante', 'pieza', 'Botanas', 6, 9.5, 35, 10, d(180), 8, 10],

            ['750177', 'Jamón de Pavo FUD (Kg)', 'granel', 'Salchichonería', 92, 128, 6.0, 2, d(10), 118, 2],
            ['750178', 'Jamón Virginia San Rafael (Kg)', 'granel', 'Salchichonería', 105, 145, 5.0, 2, d(10), 134, 2],
            ['750179', 'Salchicha Viena FUD (Kg)', 'granel', 'Salchichonería', 48, 68, 7.5, 2, d(12), 62, 2],
            ['750180', 'Tocino Ahumado 250g', 'pieza', 'Salchichonería', 34, 46, 10, 3, d(18), 43, 3],
            ['750181', 'Chorizo de Cerdo 200g', 'pieza', 'Salchichichonería', 19, 27, 12, 3, d(15), 25, 4],
            ['750182', 'Longaniza Casera (Kg)', 'granel', 'Salchichonería', 68, 94, 4.5, 2, d(8), 86, 2],

            ['750183', 'Jitomate Saladette (Kg)', 'granel', 'Frutas y Verduras', 18, 26, 12.0, 3, d(6), 23, 3],
            ['750184', 'Cebolla Blanca (Kg)', 'granel', 'Frutas y Verduras', 15, 22, 10.0, 3, d(14), 19.5, 3],
            ['750185', 'Papa Blanca (Kg)', 'granel', 'Frutas y Verduras', 21, 30, 10.0, 3, d(15), 27, 3],
            ['750186', 'Limón con Semilla (Kg)', 'granel', 'Frutas y Verduras', 24, 34, 8.0, 2, d(10), 30, 3],
            ['750187', 'Chile Serrano (Kg)', 'granel', 'Frutas y Verduras', 28, 40, 4.0, 1.5, d(7), 36, 2],
            ['750188', 'Plátano Tabasco (Kg)', 'granel', 'Frutas y Verduras', 14, 21, 9.0, 3, d(5), 18.5, 3],

            ['750189', 'Detergente Roma 1Kg', 'pieza', 'Limpieza', 28, 38, 16, 4, d(500), 35, 4],
            ['750190', 'Detergente Ace 900g', 'pieza', 'Limpieza', 31, 42, 14, 4, d(500), 39, 4],
            ['750191', 'Jabón Zote Rosa 400g', 'pieza', 'Limpieza', 17, 24, 20, 5, d(600), 22, 5],
            ['750192', 'Suavitel Primavera 850ml', 'pieza', 'Limpieza', 21, 29, 14, 4, d(365), 26.5, 4],
            ['750193', 'Cloralex El Rendidor 1L', 'pieza', 'Limpieza', 11.5, 17.5, 22, 6, d(365), 15.5, 6],
            ['750194', 'Fabuloso Lavanda 1L', 'pieza', 'Limpieza', 16, 23, 18, 5, d(365), 21, 5],
            ['750195', 'Axion Lavatrastes Líquido 750ml', 'pieza', 'Limpieza', 24, 33, 14, 4, d(365), 30.5, 4],

            ['750196', 'Papel Higiénico Pétalo 4 Rollos', 'pieza', 'Higiene', 23, 32, 20, 5, d(600), 29.5, 4],
            ['750197', 'Papel Higiénico Suavel 4 Rollos', 'pieza', 'Higiene', 19, 27, 22, 5, d(600), 24.5, 4],
            ['750198', 'Jabón Escudo Antibacterial 110g', 'pieza', 'Higiene', 13, 19, 20, 5, d(500), 17, 5],
            ['750199', 'Pasta Dental Colgate 75ml', 'pieza', 'Higiene', 18, 26, 16, 4, d(400), 23.5, 4],
            ['750200', 'Shampoo Head & Shoulders 375ml', 'pieza', 'Higiene', 48, 65, 10, 3, d(400), 60, 3]
        ];

        this.productos = catalogoBase.map((item, idx) => new Producto(
            idx + 1, item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10]
        ));

        this.combos = [
            new Combo(101, 'CMB-01', 'Combo Desayuno (Leche Lala + Pan Bimbo)', 19, 57, 68.00),
            new Combo(102, 'CMB-02', 'Combo Despensa (Aceite + Frijol)', 37, 33, 79.00),
            new Combo(103, 'CMB-03', 'Combo Antojo (Coca 600 + Sabritas)', 1, 65, 34.00),
            new Combo(104, 'CMB-04', 'Combo Comida (Tortilla + Queso Panela)', 32, 27, 132.00),
            new Combo(105, 'CMB-05', 'Combo Limpieza (Roma 1Kg + Cloralex)', 89, 93, 51.00)
        ];

        this.clientes = [
            new Cliente(1, 'Sra. Martha Hernández', '5523456789', 800, 145.50, [
                { fecha: new Date().toLocaleDateString('es-MX'), tipo: 'CARGO FIADO', monto: 145.50 }
            ], { 'Refresco 2.5L': 2 }),
            new Cliente(2, 'Don José Luis Pérez', '5598765432', 500, 0, [], { 'Garrafón 20L': 1 }),
            new Cliente(3, 'Familia Ramírez (Depto 4)', '5511223344', 1000, 320.00, [
                { fecha: new Date().toLocaleDateString('es-MX'), tipo: 'CARGO FIADO', monto: 320.00 }
            ], { 'Caguama': 4 })
        ];

        const listaProveedores = [
            ['Coca-Cola FEMSA', 'Carlos Mendoza', '5510012001', 'Refrescos y Agua Ciel', 'Martes'],
            ['PepsiCo / GEPP', 'Fernando Ríos', '5510012002', 'Pepsi, Gatorade y Epura', 'Miércoles'],
            ['Grupo Bimbo', 'Laura Gómez', '5510012003', 'Pan de Caja y Pan Dulce', 'Jueves'],
            ['Marinela México', 'Héctor Salgado', '5510012004', 'Pastelitos y Galletas', 'Jueves'],
            ['Sabritas', 'Miguel Torres', '5510012005', 'Frituras y Botanas', 'Miércoles'],
            ['Barcel', 'Paola Domínguez', '5510012006', 'Takis, Chips y Cacahuates', 'Viernes'],
            ['Grupo Lala', 'Ricardo Navarro', '5510012007', 'Leche, Yogurt y Crema', 'Lunes'],
            ['Alpura', 'Sofía Morales', '5510012008', 'Lácteos y Mantequilla', 'Martes'],
            ['Gamesa', 'Jorge Castañeda', '5510012009', 'Galletas y Cereales', 'Viernes'],
            ['Sigma Alimentos (FUD)', 'Arturo Vega', '5510012010', 'Jamón, Salchicha y Quesos', 'Lunes'],
            ['Abarrotera Central', 'Roberto Díaz', '5510012011', 'Semillas, Azúcar y Aceites', 'Lunes'],
            ['La Costeña', 'Gabriela Ortiz', '5510012012', 'Enlatados, Chiles y Puré', 'Martes'],
            ['Grupo Herdez', 'Luis Enrique Cruz', '5510012013', 'Atún, Mayonesa y Salsas', 'Miércoles'],
            ['Nestlé México', 'Valeria Pineda', '5510012014', 'Nescafé, Abuelita y Lácteos', 'Jueves'],
            ['Unilever', 'Daniela Reyes', '5510012015', 'Knorr y Cuidado Personal', 'Viernes'],
            ['Procter & Gamble (P&G)', 'Óscar Medina', '5510012016', 'Detergente Ace y Shampoo', 'Martes'],
            ['Colgate-Palmolive', 'Mónica Jiménez', '5510012017', 'Suavitel, Axion y Pastas', 'Jueves'],
            ['Kimberly-Clark', 'Raúl Cisneros', '5510012018', 'Papel Higiénico Pétalo/Suavel', 'Sábado'],
            ['Fábrica La Corona', 'Enrique Solís', '5510012019', 'Jabón Roma, Zote y Aceite 1-2-3', 'Sábado'],
            ['Central de Abasto Verduras', 'Don Ramiro', '5510012020', 'Jitomate, Cebolla, Papa y Limón', 'Lunes']
        ];

        this.proveedores = listaProveedores.map((p, i) => new Proveedor(i + 1, p[0], p[1], p[2], p[3], p[4]));
        this.comprasProveedores = [];
        this.ventas = [];
        this.gastos = [];
        this.kardex = [
            { hora: new Date().toLocaleTimeString('es-MX'), tipo: 'INICIAL', producto: 'Base de Datos Maestra', cantidad: '100 SKUs', operador: 'Sistema' }
        ];
        this.abonosTotales = 0;
        this.guardarDatos();
    }

    guardarDatos() {
        localStorage.setItem('pos_abarrotes_v9_db', JSON.stringify({
            productos: this.productos,
            combos: this.combos,
            clientes: this.clientes,
            proveedores: this.proveedores,
            comprasProveedores: this.comprasProveedores,
            ventas: this.ventas,
            gastos: this.gastos,
            kardex: this.kardex,
            abonosTotales: this.abonosTotales,
            configTienda: this.configTienda
        }));
    }

    aplicarConfigTienda() {
        document.getElementById('loginNombreTienda').innerHTML = `${this.configTienda.nombre}`;
        document.getElementById('sidebarNombreTienda').innerHTML = `${this.configTienda.nombre}`;
        document.getElementById('cfgNombre').value = this.configTienda.nombre;
        document.getElementById('cfgRfc').value = this.configTienda.rfc;
        document.getElementById('cfgDireccion').value = this.configTienda.direccion;
        document.getElementById('cfgPie').value = this.configTienda.pie;
    }

    registrarKardex(tipo, producto, cantidad) {
        this.kardex.unshift({
            hora: new Date().toLocaleTimeString('es-MX'),
            tipo,
            producto,
            cantidad,
            operador: this.sesion.operador
        });
        if (this.kardex.length > 100) this.kardex.pop();
    }

    mostrarNotificacion(mensaje) {
        const toast = document.getElementById('toast');
        toast.textContent = mensaje;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2800);
    }

    cambiarModulo(tabId) {
        const nombres = {
            pos: 'Terminal de Punto de Venta',
            inventario: 'Gestión de Inventario (100 SKUs), Lotes y Kardex',
            combos: 'Promociones y Paquetes Comerciales',
            fiado: 'Control de Créditos, Envases y Cobranza',
            proveedores: 'Directorio de Proveedores (20 Rutas) y Compras',
            reportes: 'Corte Z, Arqueo de Caja y Analítica',
            ajustes: 'Configuración de Tienda'
        };
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (btn) btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        document.getElementById('tituloModuloActual').textContent = nombres[tabId] || 'Terminal';
        if (tabId === 'pos') {
            setTimeout(() => document.getElementById('buscarProductoPOS').focus(), 50);
        }
        if (tabId === 'reportes') this.renderizarReportes();
    }

    aplicarPermisosRol() {
        const esAdmin = this.sesion.rol === 'ADMIN';
        document.getElementById('lblOperador').textContent = this.sesion.operador;
        document.getElementById('lblRol').textContent = this.sesion.rol;
        document.getElementById('indicadorFondo').textContent = `Fondo: $${this.sesion.fondoInicial.toFixed(2)}`;

        document.querySelectorAll('.admin-only-panel').forEach(el => el.classList.toggle('locked-role', !esAdmin));
        document.querySelectorAll('.admin-only-btn').forEach(el => el.classList.toggle('hidden', !esAdmin));
    }

    actualizarMetaDiaria() {
        const vendidoHoy = this.ventas.filter(v => !v.anulada).reduce((acc, v) => acc + v.total, 0);
        const porc = Math.min(100, Math.round((vendidoHoy / this.sesion.metaDiaria) * 100));
        document.getElementById('lblMetaProgreso').textContent = `Meta: $${vendidoHoy.toFixed(0)} / $${this.sesion.metaDiaria.toFixed(0)} (${porc}%)`;
        document.getElementById('metaFill').style.width = `${porc}%`;
    }

    // ==========================================
    // 4. ESCÁNER DE CÁMARA REAL (BarcodeDetector)
    // ==========================================
    async iniciarEscannerCamara() {
        const modal = document.getElementById('modalCamara');
        const video = document.getElementById('videoScanner');
        const status = document.getElementById('statusCamara');
        modal.classList.remove('hidden');

        try {
            this.streamCamara = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            video.srcObject = this.streamCamara;
            status.textContent = 'Cámara activa. Esperando código de barras...';

            if ('BarcodeDetector' in window) {
                const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128', 'qr_code'] });
                this.intervaloEscaneo = setInterval(async () => {
                    try {
                        const barcodes = await detector.detect(video);
                        if (barcodes.length > 0) {
                            const code = barcodes[0].rawValue;
                            const prod = this.productos.find(p => p.codigo === code);
                            if (prod) {
                                this.agregarAlCarrito(prod.id);
                                this.detenerEscannerCamara();
                                this.mostrarNotificacion(`Escaneado: ${prod.nombre}`);
                            } else {
                                status.textContent = `Código leído (${code}) no registrado.`;
                            }
                        }
                    } catch (e) {}
                }, 500);
            } else {
                status.textContent = 'Navegador sin BarcodeDetector nativo. Usa el buscador manual.';
            }
        } catch (err) {
            status.textContent = 'No se detectó cámara disponible o se denegó el permiso.';
        }
    }

    detenerEscannerCamara() {
        if (this.intervaloEscaneo) clearInterval(this.intervaloEscaneo);
        if (this.streamCamara) {
            this.streamCamara.getTracks().forEach(track => track.stop());
            this.streamCamara = null;
        }
        document.getElementById('modalCamara').classList.add('hidden');
    }

    // ==========================================
    // 5. MULTI-TICKET, COBRO MIXTO, MAYOREO Y CAJA
    // ==========================================
    cambiarSlotTicket(slotIdx) {
        this.slotActivo = slotIdx;
        document.querySelectorAll('.ticket-slot-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === slotIdx);
            btn.classList.toggle('has-items', this.cuentasCarrito[i].length > 0);
        });
        this.renderizarCarrito();
    }

    obtenerPrecioUnitarioEfectivo(item) {
        if (item.esCombo || item.esLibre) return { precio: item.producto.precio, esMayoreo: false };
        const p = item.producto;
        if (p.mayoreo > 0 && item.cantidad >= p.cantMayoreo) {
            return { precio: p.mayoreo, esMayoreo: true };
        }
        return { precio: p.precio, esMayoreo: false };
    }

    agregarArticuloLibre(nombre, precio, margenPorc = 0.25) {
        this.carrito.push({
            esLibre: true,
            esCombo: false,
            producto: {
                id: Date.now(),
                nombre,
                precio: parseFloat(precio),
                costo: parseFloat(precio) * (1 - margenPorc),
                tipo: 'pieza',
                categoria: 'Abarrotes',
                stock: 999
            },
            cantidad: 1
        });
        this.beepEscanner('ok');
        this.cambiarSlotTicket(this.slotActivo);
    }

    agregarComboAlCarrito(comboId) {
        const combo = this.combos.find(c => c.id === comboId);
        if (!combo) return;
        const p1 = this.productos.find(p => p.id === combo.prod1Id);
        const p2 = this.productos.find(p => p.id === combo.prod2Id);

        if (!p1 || !p2 || p1.stock < 1 || p2.stock < 1) {
            this.beepEscanner('err');
            this.mostrarNotificacion('Sin stock suficiente para armar el combo.');
            return;
        }

        const itemExistente = this.carrito.find(item => item.esCombo && item.combo.id === combo.id);
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            this.carrito.push({
                esCombo: true,
                esLibre: false,
                combo,
                producto: {
                    id: combo.id,
                    nombre: combo.nombre,
                    precio: combo.precio,
                    costo: p1.costo + p2.costo,
                    tipo: 'pieza',
                    categoria: 'Abarrotes',
                    stock: Math.min(p1.stock, p2.stock)
                },
                cantidad: 1
            });
        }
        this.beepEscanner('ok');
        this.cambiarSlotTicket(this.slotActivo);
    }

    agregarAlCarrito(productoId) {
        const prod = this.productos.find(p => p.id === productoId);
        if (!prod || prod.stock <= 0) {
            this.beepEscanner('err');
            this.mostrarNotificacion('Sin existencias disponibles.');
            return;
        }

        if (prod.tipo === 'granel') {
            this.productoGranelSeleccionado = prod;
            document.getElementById('modalGranelTitulo').textContent = prod.nombre;
            document.getElementById('modalGranelPrecio').textContent = `$${prod.precio.toFixed(2)} / kg • Stock: ${prod.stock} kg`;
            document.getElementById('inputPesoKg').value = '0.500';
            this.actualizarPreviewGranel();
            document.getElementById('modalGranel').classList.remove('hidden');
            return;
        }

        this.insertarItemCarrito(prod, 1);
    }

    actualizarPreviewGranel() {
        if (!this.productoGranelSeleccionado) return;
        const kg = parseFloat(document.getElementById('inputPesoKg').value) || 0;
        document.getElementById('granelSubtotalPreview').textContent = `$${(kg * this.productoGranelSeleccionado.precio).toFixed(2)}`;
    }

    insertarItemCarrito(prod, cantidad) {
        const itemExistente = this.carrito.find(item => !item.esCombo && !item.esLibre && item.producto.id === prod.id);
        const cantidadTotal = itemExistente ? itemExistente.cantidad + cantidad : cantidad;

        if (cantidadTotal > prod.stock) {
            this.beepEscanner('err');
            this.mostrarNotificacion(`Stock insuficiente (Máx: ${prod.stock}).`);
            return;
        }

        if (itemExistente) {
            itemExistente.cantidad = parseFloat((itemExistente.cantidad + cantidad).toFixed(3));
        } else {
            this.carrito.push({ esCombo: false, esLibre: false, producto: prod, cantidad: parseFloat(cantidad.toFixed(3)) });
        }

        this.beepEscanner('ok');
        this.cambiarSlotTicket(this.slotActivo);
    }

    modificarCantidad(index, delta) {
        const item = this.carrito[index];
        if (!item) return;
        const paso = item.producto.tipo === 'granel' ? 0.25 : 1;
        const nuevaCant = parseFloat((item.cantidad + delta * paso).toFixed(3));

        if (nuevaCant <= 0) {
            this.eliminarDelCarrito(index);
            return;
        }
        if (nuevaCant > item.producto.stock) {
            this.beepEscanner('err');
            this.mostrarNotificacion('Stock máximo alcanzado.');
            return;
        }
        item.cantidad = nuevaCant;
        this.renderizarCarrito();
    }

    eliminarDelCarrito(index) {
        this.carrito.splice(index, 1);
        this.cambiarSlotTicket(this.slotActivo);
    }

    calcularTotalesCarrito() {
        let subtotal = 0, costoTotal = 0, articulos = 0, ahorroMayoreo = 0;
        this.carrito.forEach(item => {
            const { precio, esMayoreo } = this.obtenerPrecioUnitarioEfectivo(item);
            subtotal += precio * item.cantidad;
            if (esMayoreo) {
                ahorroMayoreo += (item.producto.precio - precio) * item.cantidad;
            }
            costoTotal += item.producto.costo * item.cantidad;
            articulos += item.producto.tipo === 'pieza' ? item.cantidad : 1;
        });

        const descPorc = parseFloat(document.getElementById('inputDescuento').value) || 0;
        const montoDescuento = subtotal * (descPorc / 100);
        const total = subtotal - montoDescuento;
        const ganancia = total - costoTotal;
        return { subtotal, descPorc, montoDescuento, total, ganancia, articulos, ahorroMayoreo };
    }

    procesarCobro() {
        if (this.carrito.length === 0) {
            this.mostrarNotificacion('Agrega productos al ticket primero.');
            return;
        }

        const { total, ganancia, descPorc, montoDescuento } = this.calcularTotalesCarrito();
        const metodo = document.getElementById('metodoPago').value;
        let clienteNombre = 'Público General';
        let clienteIdRef = null;
        let recibido = total;
        let cambio = 0;
        let montoEfectivo = 0;
        let montoTarjeta = 0;

        if (metodo === 'efectivo') {
            recibido = parseFloat(document.getElementById('montoRecibido').value) || 0;
            if (recibido < total) {
                this.beepEscanner('err');
                this.mostrarNotificacion('Efectivo recibido insuficiente.');
                return;
            }
            montoEfectivo = total;
            cambio = recibido - total;
        } else if (metodo === 'transferencia') {
            montoTarjeta = total;
        } else if (metodo === 'mixto') {
            recibido = parseFloat(document.getElementById('montoRecibido').value) || 0;
            if (recibido < 0 || recibido > total) {
                this.beepEscanner('err');
                this.mostrarNotificacion('En cobro mixto, el efectivo debe estar entre $0 y el total.');
                return;
            }
            montoEfectivo = recibido;
            montoTarjeta = parseFloat((total - recibido).toFixed(2));
        } else if (metodo === 'fiado') {
            clienteIdRef = parseInt(document.getElementById('clienteFiadoSelect').value);
            const cliente = this.clientes.find(c => c.id === clienteIdRef);
            if (!cliente) return;
            if (cliente.deuda + total > cliente.limite) {
                this.beepEscanner('err');
                this.mostrarNotificacion(`Crédito excedido. Disponible: $${(cliente.limite - cliente.deuda).toFixed(2)}`);
                return;
            }
            cliente.deuda = parseFloat((cliente.deuda + total).toFixed(2));
            if (!cliente.historial) cliente.historial = [];
            cliente.historial.unshift({
                fecha: new Date().toLocaleString('es-MX'),
                tipo: 'COMPRA FIADA',
                monto: parseFloat(total.toFixed(2))
            });
            clienteNombre = cliente.nombre;
        }

        const totalesPorCat = {};
        const conteoProductos = {};
        const movimientosStock = [];

        this.carrito.forEach(item => {
            const { precio } = this.obtenerPrecioUnitarioEfectivo(item);
            if (item.esLibre) {
                totalesPorCat['Abarrotes'] = (totalesPorCat['Abarrotes'] || 0) + (precio * item.cantidad);
            } else if (item.esCombo) {
                const p1 = this.productos.find(p => p.id === item.combo.prod1Id);
                const p2 = this.productos.find(p => p.id === item.combo.prod2Id);
                [p1, p2].forEach(p => {
                    if (p) {
                        p.stock = parseFloat((p.stock - item.cantidad).toFixed(3));
                        movimientosStock.push({ id: p.id, cant: item.cantidad });
                        this.registrarKardex('VENTA COMBO', p.nombre, `-${item.cantidad}`);
                        conteoProductos[p.nombre] = (conteoProductos[p.nombre] || 0) + item.cantidad;
                    }
                });
                totalesPorCat['Abarrotes'] = (totalesPorCat['Abarrotes'] || 0) + (precio * item.cantidad);
            } else {
                const prod = this.productos.find(p => p.id === item.producto.id);
                if (prod) {
                    prod.stock = parseFloat((prod.stock - item.cantidad).toFixed(3));
                    movimientosStock.push({ id: prod.id, cant: item.cantidad });
                    totalesPorCat[prod.categoria] = (totalesPorCat[prod.categoria] || 0) + (precio * item.cantidad);
                    conteoProductos[prod.nombre] = (conteoProductos[prod.nombre] || 0) + item.cantidad;
                    this.registrarKardex('VENTA', prod.nombre, `-${item.cantidad}`);
                }
            }
        });

        const ahora = new Date();
        const nuevaVenta = {
            folio: 'V-' + String(this.ventas.length + 1).padStart(4, '0'),
            fecha: ahora.toLocaleString('es-MX'),
            horaNum: ahora.getHours(),
            operador: this.sesion.operador,
            metodo,
            montoEfectivo: parseFloat(montoEfectivo.toFixed(2)),
            montoTarjeta: parseFloat(montoTarjeta.toFixed(2)),
            cliente: clienteNombre,
            clienteId: clienteIdRef,
            anulada: false,
            movimientosStock,
            detalleItems: this.carrito.map(i => {
                const { precio, esMayoreo } = this.obtenerPrecioUnitarioEfectivo(i);
                return {
                    nombre: i.producto.nombre + (esMayoreo ? ' [MAY]' : ''),
                    cant: i.cantidad,
                    unidad: i.producto.tipo === 'granel' ? 'kg' : 'pza',
                    subtotal: (precio * i.cantidad).toFixed(2)
                };
            }),
            itemsTexto: this.carrito.map(i => `${i.cantidad}x ${i.producto.nombre}`).join(', '),
            descuento: descPorc > 0 ? `${descPorc}% (-$${montoDescuento.toFixed(2)})` : 'Sin descuento',
            total: parseFloat(total.toFixed(2)),
            ganancia: parseFloat(ganancia.toFixed(2)),
            recibido: parseFloat(recibido.toFixed(2)),
            cambio: parseFloat(cambio.toFixed(2)),
            categorias: totalesPorCat,
            conteoProductos
        };

        this.ventas.unshift(nuevaVenta);
        this.carrito = [];
        document.getElementById('montoRecibido').value = '';
        document.getElementById('inputDescuento').value = '0';
        document.getElementById('cambioVenta').textContent = '$0.00';

        this.guardarDatos();
        this.cambiarSlotTicket(this.slotActivo);
        this.renderizarTodo();
        this.abrirTicketModal(nuevaVenta);
    }

    anularVenta(idx) {
        const venta = this.ventas[idx];
        if (!venta || venta.anulada) return;

        venta.anulada = true;
        if (venta.movimientosStock) {
            venta.movimientosStock.forEach(m => {
                const p = this.productos.find(prod => prod.id === m.id);
                if (p) {
                    p.stock = parseFloat((p.stock + m.cant).toFixed(3));
                    this.registrarKardex('DEVOLUCIÓN', p.nombre, `+${m.cant}`);
                }
            });
        }
        if (venta.metodo === 'fiado' && venta.clienteId) {
            const c = this.clientes.find(cl => cl.id === venta.clienteId);
            if (c) {
                c.deuda = Math.max(0, parseFloat((c.deuda - venta.total).toFixed(2)));
                if (c.historial) c.historial.unshift({ fecha: new Date().toLocaleString('es-MX'), tipo: 'TICKET ANULADO', monto: -venta.total });
            }
        }

        this.guardarDatos();
        this.renderizarTodo();
        this.mostrarNotificacion(`Ticket ${venta.folio} anulado y stock reintegrado.`);
    }

    abrirTicketModal(venta) {
        this.ventaModalActual = venta;
        document.getElementById('tckTituloEmpresa').textContent = venta.anulada ? 'TICKET ANULADO' : this.configTienda.nombre;
        document.getElementById('tckRfcEmpresa').textContent = this.configTienda.rfc;
        document.getElementById('tckDirEmpresa').textContent = this.configTienda.direccion;
        document.getElementById('tckFolio').textContent = `FOLIO: ${venta.folio}`;
        document.getElementById('tckFecha').textContent = `FECHA: ${venta.fecha}`;
        document.getElementById('tckOperador').textContent = `CAJERO: ${venta.operador || 'Sistema'}`;
        document.getElementById('tckCliente').textContent = `CLIENTE: ${venta.cliente}`;

        document.getElementById('tckItems').innerHTML = venta.detalleItems.map(i =>
            `<p>${i.cant}${i.unidad} ${i.nombre} — $${i.subtotal}</p>`
        ).join('');

        document.getElementById('tckDescuento').textContent = `DESCUENTO: ${venta.descuento}`;
        document.getElementById('tckTotal').textContent = `TOTAL: $${venta.total.toFixed(2)}`;

        if (venta.metodo === 'efectivo') {
            document.getElementById('tckPago').textContent = `EFECTIVO: $${venta.recibido.toFixed(2)} | CAMBIO: $${venta.cambio.toFixed(2)}`;
        } else if (venta.metodo === 'mixto') {
            document.getElementById('tckPago').textContent = `MIXTO -> EFECTIVO: $${(venta.montoEfectivo || 0).toFixed(2)} | TRANSF./TARJ.: $${(venta.montoTarjeta || 0).toFixed(2)}`;
        } else {
            document.getElementById('tckPago').textContent = `MÉTODO: ${venta.metodo.toUpperCase()}`;
        }
        document.getElementById('tckPie').textContent = this.configTienda.pie;

        document.getElementById('modalTicket').classList.remove('hidden');
    }

    imprimirCorteZ() {
        let totalVentas = 0, ef = 0, tr = 0, fi = 0, gan = 0;
        this.ventas.filter(v => !v.anulada).forEach(v => {
            totalVentas += v.total;
            gan += v.ganancia;
            if (v.metodo === 'efectivo') ef += v.total;
            else if (v.metodo === 'mixto') {
                ef += (v.montoEfectivo || 0);
                tr += (v.montoTarjeta || 0);
            } else if (v.metodo === 'transferencia') tr += v.total;
            else if (v.metodo === 'fiado') fi += v.total;
        });
        const gastos = this.gastos.reduce((acc, g) => acc + g.monto, 0);
        const cajon = this.sesion.fondoInicial + ef + this.abonosTotales - gastos;

        document.getElementById('tckTituloEmpresa').textContent = `CORTE Z - ${this.configTienda.nombre}`;
        document.getElementById('tckRfcEmpresa').textContent = this.configTienda.rfc;
        document.getElementById('tckDirEmpresa').textContent = this.configTienda.direccion;
        document.getElementById('tckFolio').textContent = `TICKETS VÁLIDOS: ${this.ventas.filter(v => !v.anulada).length}`;
        document.getElementById('tckFecha').textContent = `FECHA: ${new Date().toLocaleString('es-MX')}`;
        document.getElementById('tckOperador').textContent = `SUPERVISOR: ${this.sesion.operador}`;
        document.getElementById('tckCliente').textContent = `FONDO INICIAL: $${this.sesion.fondoInicial.toFixed(2)}`;

        document.getElementById('tckItems').innerHTML = `
            <p>(+) Ventas Efectivo: $${ef.toFixed(2)}</p>
            <p>(+) Ventas Transf./Tarj.: $${tr.toFixed(2)}</p>
            <p>(+) Ventas Fiadas: $${fi.toFixed(2)}</p>
            <p>(+) Abonos Cobrados: $${this.abonosTotales.toFixed(2)}</p>
            <p>(-) Gastos y Mermas: $${gastos.toFixed(2)}</p>
        `;

        document.getElementById('tckDescuento').textContent = `UTILIDAD NETA: $${(gan - gastos).toFixed(2)}`;
        document.getElementById('tckTotal').textContent = `EFECTIVO EN CAJÓN: $${cajon.toFixed(2)}`;
        document.getElementById('tckPago').textContent = `VENTA NETA TOTAL: $${totalVentas.toFixed(2)}`;
        document.getElementById('tckPie').textContent = '--- ARQUEO CERTIFICADO TITANIUM v9 ---';

        document.getElementById('modalTicket').classList.remove('hidden');
    }

    // ==========================================
    // 6. RENDERIZADO DE VISTAS
    // ==========================================
    renderizarTodo() {
        document.getElementById('folioActual').textContent = 'V-' + String(this.ventas.length + 1).padStart(4, '0');
        document.getElementById('subtituloCatalogoPOS').textContent = `${this.productos.length} SKUs disponibles • Mayoreo automático`;
        this.renderizarAccesosRapidos();
        this.renderizarCatalogoPOS(document.getElementById('buscarProductoPOS').value);
        this.renderizarCarrito();
        this.renderizarInventario();
        this.renderizarCombos();
        this.renderizarClientes();
        this.renderizarProveedores();
        this.renderizarComprasProveedores();
        this.renderizarReportes();
        this.actualizarMetaDiaria();
    }

    renderizarAccesosRapidos() {
        const bar = document.getElementById('fastAccessBar');
        const skusRapidos = ['750101', '750131', '750132', '750119', '750157', '750111'];
        const favoritos = this.productos.filter(p => skusRapidos.includes(p.codigo));
        bar.innerHTML = `<span class="fast-label">⚡ RÁPIDOS:</span>` + favoritos.map(p =>
            `<button type="button" class="fast-chip" onclick="pos.agregarAlCarrito(${p.id})">+ ${p.nombre.split(' ')[0]}</button>`
        ).join('');
    }

    renderizarCatalogoPOS(filtro = '') {
        const contenedor = document.getElementById('listaProductosPOS');
        contenedor.classList.toggle('compact-mode', this.vistaCompacta);
        contenedor.innerHTML = '';

        if (this.categoriaActiva === 'Todas' || this.categoriaActiva === 'Combos') {
            this.combos.forEach(c => {
                if (c.nombre.toLowerCase().includes(filtro.toLowerCase()) || c.codigo.toLowerCase().includes(filtro.toLowerCase())) {
                    const div = document.createElement('div');
                    div.className = 'product-item combo-card';
                    div.innerHTML = `
                        <div class="product-art">
                            <span class="sku-chip mono">${c.codigo}</span>
                            ${obtenerArteProducto(c, true)}
                        </div>
                        <h4>${c.nombre}</h4>
                        <div class="product-footer-row">
                            <div class="price mono">$${c.precio.toFixed(2)}</div>
                            <div class="stock">Combo</div>
                        </div>
                    `;
                    div.onclick = () => this.agregarComboAlCarrito(c.id);
                    contenedor.appendChild(div);
                }
            });
        }

        if (this.categoriaActiva === 'Combos') return;

        const filtrados = this.productos.filter(p => {
            const coincideTexto = p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                                  p.codigo.toLowerCase().includes(filtro.toLowerCase());
            const coincideCat = this.categoriaActiva === 'Todas' || p.categoria === this.categoriaActiva;
            return coincideTexto && coincideCat;
        });

        filtrados.forEach(prod => {
            const div = document.createElement('div');
            div.className = `product-item ${prod.stock <= 0 ? 'sin-stock' : ''}`;
            const unidad = prod.tipo === 'granel' ? 'kg' : 'pzas';
            const badgeMayoreo = prod.mayoreo > 0 ? `<span class="wholesale-tag mono">${prod.cantMayoreo}+: $${prod.mayoreo}</span>` : '';

            div.innerHTML = `
                <div class="product-art">
                    <span class="sku-chip mono">${prod.codigo}</span>
                    ${badgeMayoreo}
                    ${obtenerArteProducto(prod, false)}
                </div>
                <h4>${prod.nombre}</h4>
                <div class="product-footer-row">
                    <div class="price mono">$${prod.precio.toFixed(2)}${prod.tipo === 'granel' ? '/kg' : ''}</div>
                    <div class="stock mono">${prod.stock} ${unidad}</div>
                </div>
            `;
            div.onclick = () => this.agregarAlCarrito(prod.id);
            contenedor.appendChild(div);
        });
    }

    renderizarCarrito() {
        const tbody = document.getElementById('cuerpoCarrito');
        tbody.innerHTML = '';

        this.carrito.forEach((item, idx) => {
            const { precio, esMayoreo } = this.obtenerPrecioUnitarioEfectivo(item);
            const subtotal = precio * item.cantidad;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    ${item.producto.nombre}
                    ${esMayoreo ? `<br><span class="badge badge-success">Mayoreo $${precio.toFixed(2)}</span>` : ''}
                </td>
                <td style="text-align:center;">
                    <div class="qty-control mono">
                        <button class="qty-btn" onclick="pos.modificarCantidad(${idx}, -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button class="qty-btn" onclick="pos.modificarCantidad(${idx}, 1)">+</button>
                    </div>
                </td>
                <td class="mono">$${subtotal.toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="pos.eliminarDelCarrito(${idx})">✕</button></td>
            `;
            tbody.appendChild(tr);
        });

        const { total, articulos, ahorroMayoreo } = this.calcularTotalesCarrito();
        document.getElementById('totalArticulos').textContent = ahorroMayoreo > 0
            ? `${articulos} (Ahorro: $${ahorroMayoreo.toFixed(2)})`
            : articulos;
        document.getElementById('totalVenta').textContent = `$${total.toFixed(2)}`;
        this.actualizarCambio();
    }

    actualizarCambio() {
        const { total } = this.calcularTotalesCarrito();
        const metodo = document.getElementById('metodoPago').value;
        const recibido = parseFloat(document.getElementById('montoRecibido').value) || 0;

        if (metodo === 'mixto') {
            const restanteTarjeta = Math.max(0, total - recibido);
            document.getElementById('montoMixtoTarjeta').textContent = `$${restanteTarjeta.toFixed(2)}`;
            document.getElementById('cambioVenta').textContent = '$0.00';
        } else {
            const cambio = recibido >= total ? recibido - total : 0;
            document.getElementById('cambioVenta').textContent = `$${cambio.toFixed(2)}`;
        }
    }

    obtenerUnidadesVendidasProducto(nombreProd) {
        let totalVendidas = 0;
        this.ventas.filter(v => !v.anulada).forEach(v => {
            if (v.conteoProductos && v.conteoProductos[nombreProd]) {
                totalVendidas += v.conteoProductos[nombreProd];
            }
        });
        return totalVendidas;
    }

    renderizarInventario() {
        const tbody = document.getElementById('tablaInventarioBody');
        const selectEntrada = document.getElementById('entradaProdSelect');
        const selectMerma = document.getElementById('mermaProdSelect');
        const selectCombo1 = document.getElementById('comboProd1');
        const selectCombo2 = document.getElementById('comboProd2');
        const selectCompraProd = document.getElementById('compraProdSelect');
        const filtroTexto = (document.getElementById('buscarInventario').value || '').toLowerCase();

        tbody.innerHTML = '';
        selectEntrada.innerHTML = '';
        selectMerma.innerHTML = '';
        selectCombo1.innerHTML = '';
        selectCombo2.innerHTML = '';
        if (selectCompraProd) selectCompraProd.innerHTML = '';

        let alertas = 0;

        this.productos.forEach(prod => {
            const bajoStock = prod.stock <= prod.minimo;
            const diasCad = this.diasParaCaducar(prod.caducidad);
            const proxCaducar = diasCad <= 7;
            const vendidas = this.obtenerUnidadesVendidasProducto(prod.nombre);
            const bajaRotacion = vendidas === 0 && this.ventas.length > 0;

            if (bajoStock || proxCaducar) alertas++;

            const opt = `<option value="${prod.id}">${prod.nombre} (Stock: ${prod.stock})</option>`;
            selectEntrada.innerHTML += opt;
            selectMerma.innerHTML += opt;
            selectCombo1.innerHTML += opt;
            selectCombo2.innerHTML += opt;
            if (selectCompraProd) selectCompraProd.innerHTML += opt;

            if (this.filtroInventarioEstado === 'bajo' && !bajoStock) return;
            if (this.filtroInventarioEstado === 'caducar' && !proxCaducar) return;
            if (this.filtroInventarioEstado === 'estancado' && !bajaRotacion) return;
            if (filtroTexto && !prod.nombre.toLowerCase().includes(filtroTexto) && !prod.codigo.toLowerCase().includes(filtroTexto)) return;

            const porcentaje = Math.min(100, Math.round((prod.stock / (prod.minimo * 3)) * 100));
            const colorBarra = bajoStock ? 'var(--danger)' : (porcentaje < 60 ? 'var(--accent)' : 'var(--success)');
            const txtMayoreo = prod.mayoreo > 0 ? `<br><small style="color:var(--success);">May (${prod.cantMayoreo}+): $${prod.mayoreo.toFixed(2)}</small>` : '';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="mono">${prod.codigo}</td>
                <td><strong>${prod.nombre}</strong><br><small class="subtitle">${prod.categoria} • Vendido: ${vendidas}</small></td>
                <td class="mono">$${prod.precio.toFixed(2)} ${txtMayoreo}</td>
                <td class="mono" style="min-width:110px;">
                    ${prod.stock} ${prod.tipo === 'granel' ? 'kg' : 'pzas'}
                    <div class="progress-track"><div class="progress-fill" style="width:${porcentaje}%; background:${colorBarra};"></div></div>
                </td>
                <td class="mono">
                    <span class="badge ${diasCad <= 3 ? 'badge-danger' : (proxCaducar ? 'badge-warning' : 'badge-success')}">
                        ${diasCad <= 0 ? 'CADUCADO' : diasCad + ' días'}
                    </span>
                </td>
                <td class="admin-only-btn">
                    <button class="btn btn-outline btn-sm" onclick="pos.editarProducto(${prod.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="pos.eliminarProducto(${prod.id})">✕</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('badgeAlertaStock').textContent = `${alertas} Alertas`;
        document.getElementById('navBadgeStock').textContent = alertas;

        document.getElementById('tablaKardexBody').innerHTML = this.kardex.map(k => `
            <tr>
                <td class="mono">${k.hora}</td>
                <td><span class="badge ${k.tipo.includes('ENTRADA') || k.tipo.includes('DEVOLUCIÓN') ? 'badge-success' : (k.tipo.includes('MERMA') ? 'badge-danger' : 'badge-warning')}">${k.tipo}</span></td>
                <td>${k.producto}</td>
                <td class="mono"><strong>${k.cantidad}</strong></td>
                <td>${k.operador}</td>
            </tr>
        `).join('');

        this.aplicarPermisosRol();
    }

    abrirModalPreciadores() {
        const filtrados = this.productos.filter(p => {
            if (this.categoriaActiva !== 'Todas' && this.categoriaActiva !== 'Combos' && p.categoria !== this.categoriaActiva) return false;
            return true;
        }).slice(0, 24);

        document.getElementById('gridPreciadores').innerHTML = filtrados.map(p => `
            <div class="etiqueta-anaquel">
                <div class="etq-nombre">${p.nombre}</div>
                <div class="etq-precio">$${p.precio.toFixed(2)}${p.tipo === 'granel' ? '/kg' : ''}</div>
                <div class="etq-sub">SKU ${p.codigo}${p.mayoreo > 0 ? ` • ${p.cantMayoreo}+: $${p.mayoreo.toFixed(2)}` : ''}</div>
                <div class="etq-barras"></div>
            </div>
        `).join('');
        document.getElementById('modalPreciadores').classList.remove('hidden');
    }

    exportarCSV() {
        let csv = 'SKU,Producto,Categoria,Tipo,Costo,PrecioMenudeo,PrecioMayoreo,Stock,StockMinimo,Caducidad\n';
        this.productos.forEach(p => {
            csv += `${p.codigo},"${p.nombre}",${p.categoria},${p.tipo},${p.costo},${p.precio},${p.mayoreo},${p.stock},${p.minimo},${p.caducidad}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventario_100_productos.csv';
        a.click();
        this.mostrarNotificacion('Archivo CSV descargado para Excel.');
    }

    renderizarCombos() {
        const tbody = document.getElementById('tablaCombosBody');
        tbody.innerHTML = '';
        this.combos.forEach(c => {
            const p1 = this.productos.find(p => p.id === c.prod1Id);
            const p2 = this.productos.find(p => p.id === c.prod2Id);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="mono">${c.codigo}</td>
                <td><strong>${c.nombre}</strong></td>
                <td>${p1 ? p1.nombre : '?'} + ${p2 ? p2.nombre : '?'}</td>
                <td class="mono accent-txt" style="font-weight:700;">$${c.precio.toFixed(2)}</td>
                <td class="admin-only-btn"><button class="btn btn-danger btn-sm" onclick="pos.eliminarCombo(${c.id})">Eliminar</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    eliminarCombo(id) {
        this.combos = this.combos.filter(c => c.id !== id);
        this.guardarDatos();
        this.renderizarTodo();
    }

    generarOrdenCompra() {
        const criticos = this.productos.filter(p => p.stock <= p.minimo);
        if (criticos.length === 0) {
            this.mostrarNotificacion('Todo el inventario está en niveles óptimos.');
            return;
        }

        let costoTotalOrden = 0;
        let texto = `📦 ORDEN DE REORDEN INTELIGENTE - ${this.configTienda.nombre}\nFecha: ${new Date().toLocaleDateString('es-MX')}\n----------------------------------------------\n`;
        criticos.forEach(p => {
            const vendidas = this.obtenerUnidadesVendidasProducto(p.nombre);
            const objetivo = Math.max(p.minimo * 2, p.minimo + Math.ceil(vendidas * 1.5));
            const pedir = Math.max(3, Math.ceil(objetivo - p.stock));
            const subCosto = pedir * p.costo;
            costoTotalOrden += subCosto;
            texto += `• ${p.nombre} [${p.codigo}]: Pedir ${pedir} ${p.tipo === 'granel' ? 'kg' : 'pzas'} (Vendidos: ${vendidas}) ~ $${subCosto.toFixed(2)}\n`;
        });
        texto += `----------------------------------------------\nINVERSIÓN ESTIMADA: $${costoTotalOrden.toFixed(2)}`;

        document.getElementById('textoOrdenCompra').value = texto;
        document.getElementById('modalOrdenCompra').classList.remove('hidden');
    }

    editarProducto(id) {
        const p = this.productos.find(prod => prod.id === id);
        if (!p) return;
        document.getElementById('prodId').value = p.id;
        document.getElementById('prodCodigo').value = p.codigo;
        document.getElementById('prodCaducidad').value = p.caducidad;
        document.getElementById('prodNombre').value = p.nombre;
        document.getElementById('prodImagen').value = p.imagen || '';
        document.getElementById('prodTipo').value = p.tipo;
        document.getElementById('prodCategoria').value = p.categoria;
        document.getElementById('prodCosto').value = p.costo;
        document.getElementById('prodPrecio').value = p.precio;
        document.getElementById('prodMayoreo').value = p.mayoreo || '';
        document.getElementById('prodCantMayoreo').value = p.cantMayoreo || 6;
        document.getElementById('prodStock').value = p.stock;
        document.getElementById('prodMinimo').value = p.minimo;
        this.actualizarPreviewMargen();
        this.mostrarNotificacion('Producto cargado para edición.');
    }

    actualizarPreviewMargen() {
        const costo = parseFloat(document.getElementById('prodCosto').value) || 0;
        const precio = parseFloat(document.getElementById('prodPrecio').value) || 0;
        const preview = document.getElementById('previewMargen');
        if (precio > 0) {
            const util = precio - costo;
            const margen = ((util / precio) * 100).toFixed(1);
            preview.textContent = `Margen estimado: ${margen}% ($${util.toFixed(2)} por unidad)`;
            preview.style.color = margen < 15 ? 'var(--danger)' : 'var(--success)';
        }
    }

    eliminarProducto(id) {
        this.productos = this.productos.filter(p => p.id !== id);
        this.guardarDatos();
        this.renderizarTodo();
    }

    formatearEnvasesCliente(envasesObj) {
        if (!envasesObj) return '<span class="subtitle">0 envases</span>';
        const entradas = Object.entries(envasesObj).filter(([, cant]) => cant > 0);
        if (entradas.length === 0) return '<span class="subtitle">0 envases</span>';
        return entradas.map(([tipo, cant]) => `<span class="badge badge-warning">${cant}x ${tipo}</span>`).join(' ');
    }

    renderizarClientes() {
        const tbody = document.getElementById('tablaClientesBody');
        const selectFiado = document.getElementById('clienteFiadoSelect');
        const selectAbono = document.getElementById('abonoClienteSelect');
        const selectEnvase = document.getElementById('envaseClienteSelect');

        tbody.innerHTML = '';
        selectFiado.innerHTML = '';
        selectAbono.innerHTML = '';
        if (selectEnvase) selectEnvase.innerHTML = '';

        this.clientes.forEach(c => {
            const disponible = c.limite - c.deuda;
            const usoPorc = Math.min(100, Math.round((c.deuda / c.limite) * 100));
            const colorUso = usoPorc > 80 ? 'var(--danger)' : (usoPorc > 40 ? 'var(--accent)' : 'var(--success)');

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${c.nombre}</strong><br><small class="mono subtitle">${c.telefono}</small></td>
                <td>${this.formatearEnvasesCliente(c.envases)}</td>
                <td class="mono" style="min-width:130px;">
                    <strong style="color: ${c.deuda > 0 ? 'var(--danger)' : 'var(--success)'}">$${c.deuda.toFixed(2)}</strong> / $${c.limite.toFixed(2)}
                    <div class="progress-track"><div class="progress-fill" style="width:${usoPorc}%; background:${colorUso};"></div></div>
                </td>
                <td class="mono">$${disponible.toFixed(2)}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="pos.abrirEstadoCuenta(${c.id})">Historial / WhatsApp</button>
                </td>
            `;
            tbody.appendChild(tr);

            selectFiado.innerHTML += `<option value="${c.id}">${c.nombre} (Disp: $${disponible.toFixed(2)})</option>`;
            if (selectEnvase) selectEnvase.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
            if (c.deuda > 0) {
                selectAbono.innerHTML += `<option value="${c.id}">${c.nombre} (Debe: $${c.deuda.toFixed(2)})</option>`;
            }
        });
    }

    movimientoEnvaseCliente(delta) {
        const clienteId = parseInt(document.getElementById('envaseClienteSelect').value);
        const tipoEnvase = document.getElementById('envaseTipo').value;
        const cant = parseInt(document.getElementById('envaseCant').value) || 0;
        const cliente = this.clientes.find(c => c.id === clienteId);
        if (!cliente || cant <= 0) return;

        if (!cliente.envases) cliente.envases = {};
        const actual = cliente.envases[tipoEnvase] || 0;
        const nuevo = Math.max(0, actual + (delta * cant));
        cliente.envases[tipoEnvase] = nuevo;

        if (!cliente.historial) cliente.historial = [];
        cliente.historial.unshift({
            fecha: new Date().toLocaleString('es-MX'),
            tipo: delta > 0 ? `PRÉSTAMO ENVASE (${cant}x ${tipoEnvase})` : `DEVOLUCIÓN ENVASE (${cant}x ${tipoEnvase})`,
            monto: 0
        });

        this.guardarDatos();
        this.renderizarClientes();
        this.mostrarNotificacion(delta > 0 ? `Prestados ${cant}x ${tipoEnvase} a ${cliente.nombre}.` : `Devueltos ${cant}x ${tipoEnvase} de ${cliente.nombre}.`);
    }

    abrirEstadoCuenta(clienteId) {
        const c = this.clientes.find(cl => cl.id === clienteId);
        if (!c) return;
        this.clienteEstadoCuentaActual = c;
        document.getElementById('ecTituloCliente').textContent = `Estado de Cuenta: ${c.nombre}`;
        document.getElementById('ecResumenSaldo').textContent = `Saldo Deudor: $${c.deuda.toFixed(2)} • Límite: $${c.limite.toFixed(2)}`;

        const tbody = document.getElementById('ecTablaMovimientos');
        if (!c.historial || c.historial.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="subtitle">Sin movimientos registrados aún.</td></tr>`;
        } else {
            tbody.innerHTML = c.historial.map(h => `
                <tr>
                    <td class="mono">${h.fecha}</td>
                    <td>${h.tipo}</td>
                    <td class="mono" style="color:${h.monto > 0 ? 'var(--danger)' : 'var(--success)'}">$${Math.abs(h.monto).toFixed(2)}</td>
                </tr>
            `).join('');
        }
        document.getElementById('modalEstadoCuenta').classList.remove('hidden');
    }

    renderizarProveedores() {
        const tbody = document.getElementById('tablaProveedoresBody');
        const diaFiltro = document.getElementById('filtroDiaProveedor').value;
        const selectCompraProv = document.getElementById('compraProvSelect');
        tbody.innerHTML = '';
        if (selectCompraProv) selectCompraProv.innerHTML = '';

        this.proveedores.forEach(p => {
            if (selectCompraProv) {
                selectCompraProv.innerHTML += `<option value="${p.id}">${p.empresa} (${p.diaVisita})</option>`;
            }
        });

        this.proveedores
            .filter(p => diaFiltro === 'Todos' || p.diaVisita === diaFiltro)
            .forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${p.empresa}</strong></td>
                    <td>${p.contacto}<br><small class="mono subtitle">${p.telefono || ''}</small></td>
                    <td><small>${p.linea || 'General'}</small></td>
                    <td><span class="badge badge-warning">${p.diaVisita}</span></td>
                    <td><button class="btn btn-danger btn-sm" onclick="pos.eliminarProveedor(${p.id})">✕</button></td>
                `;
                tbody.appendChild(tr);
            });
    }

    renderizarComprasProveedores() {
        const tbody = document.getElementById('tablaComprasProvBody');
        if (!tbody) return;
        if (this.comprasProveedores.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="subtitle">Sin compras registradas a proveedores aún.</td></tr>`;
            return;
        }
        tbody.innerHTML = this.comprasProveedores.map((cp, idx) => `
            <tr>
                <td class="mono">${cp.fecha}</td>
                <td><strong>${cp.proveedor}</strong></td>
                <td>${cp.cant}x ${cp.producto}</td>
                <td class="mono">$${cp.monto.toFixed(2)}</td>
                <td>
                    ${cp.pagada
                        ? `<span class="badge badge-success">PAGADA</span>`
                        : `<button class="btn btn-warning-outline btn-sm" onclick="pos.liquidarCompraProveedor(${idx})">Pagar $${cp.monto.toFixed(2)}</button>`
                    }
                </td>
            </tr>
        `).join('');
    }

    liquidarCompraProveedor(idx) {
        const cp = this.comprasProveedores[idx];
        if (!cp || cp.pagada) return;
        cp.pagada = true;
        this.gastos.unshift({ concepto: `Pago a ${cp.proveedor}: ${cp.producto}`, monto: cp.monto });
        this.guardarDatos();
        this.renderizarComprasProveedores();
        this.renderizarReportes();
        this.mostrarNotificacion(`Cuenta con ${cp.proveedor} liquidada y descontada de caja.`);
    }

    eliminarProveedor(id) {
        this.proveedores = this.proveedores.filter(p => p.id !== id);
        this.guardarDatos();
        this.renderizarProveedores();
    }

    renderizarReportes() {
        let totalVentas = 0, totalEfectivoVentas = 0, totalGanancia = 0;
        const sumCat = { Abarrotes: 0, Bebidas: 0, 'Lácteos': 0, Salchichonería: 0, Botanas: 0, Limpieza: 0 };
        const rankingGlobal = {};
        const ventasPorHora = {};

        const tbody = document.getElementById('tablaHistorialBody');
        tbody.innerHTML = '';

        this.ventas.forEach((v, idx) => {
            if (!v.anulada) {
                totalVentas += v.total;
                totalGanancia += v.ganancia;
                if (v.metodo === 'efectivo') totalEfectivoVentas += v.total;
                else if (v.metodo === 'mixto') totalEfectivoVentas += (v.montoEfectivo || 0);

                const horaClave = typeof v.horaNum === 'number' ? v.horaNum : new Date().getHours();
                ventasPorHora[horaClave] = (ventasPorHora[horaClave] || 0) + v.total;

                if (v.categorias) {
                    Object.keys(v.categorias).forEach(cat => {
                        sumCat[cat] = (sumCat[cat] || 0) + v.categorias[cat];
                    });
                }

                if (v.conteoProductos) {
                    Object.keys(v.conteoProductos).forEach(prodName => {
                        rankingGlobal[prodName] = (rankingGlobal[prodName] || 0) + v.conteoProductos[prodName];
                    });
                }
            }

            const tr = document.createElement('tr');
            tr.style.opacity = v.anulada ? '0.45' : '1';
            tr.innerHTML = `
                <td class="mono"><strong>${v.folio}</strong></td>
                <td class="mono">${v.fecha}</td>
                <td>${v.metodo.toUpperCase()} (${v.cliente})</td>
                <td>${v.itemsTexto}</td>
                <td class="mono"><strong>$${v.total.toFixed(2)}</strong></td>
                <td><span class="badge ${v.anulada ? 'badge-danger' : 'badge-success'}">${v.anulada ? 'ANULADA' : 'VÁLIDA'}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="pos.reimprimirTicket(${idx})">Ver</button>
                    ${!v.anulada ? `<button class="btn btn-danger btn-sm admin-only-btn" onclick="pos.anularVenta(${idx})">Anular</button>` : ''}
                </td>
            `;
            tbody.appendChild(tr);
        });

        const totalGastos = this.gastos.reduce((acc, g) => acc + g.monto, 0);
        const efectivoEnCajon = this.sesion.fondoInicial + totalEfectivoVentas + this.abonosTotales - totalGastos;

        document.getElementById('kpiVentasTotales').textContent = `$${totalVentas.toFixed(2)}`;
        document.getElementById('kpiEfectivoCajon').textContent = `$${efectivoEnCajon.toFixed(2)}`;
        document.getElementById('kpiGastos').textContent = `$${totalGastos.toFixed(2)}`;
        document.getElementById('kpiGanancia').textContent = `$${(totalGanancia - totalGastos).toFixed(2)}`;

        document.getElementById('listaGastos').innerHTML = this.gastos.map(g =>
            `<li><span>${g.concepto}</span><strong class="mono" style="color:var(--danger);">-$${g.monto.toFixed(2)}</strong></li>`
        ).join('');

        const topSorted = Object.entries(rankingGlobal).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topContainer = document.getElementById('topProductosList');
        if (topSorted.length === 0) {
            topContainer.innerHTML = '<p class="subtitle">Realiza ventas para generar el podio automático.</p>';
        } else {
            topContainer.innerHTML = topSorted.map(([nombre, cant], i) => `
                <div class="top-item">
                    <div><span class="rank-badge">#${i + 1}</span><strong>${nombre}</strong></div>
                    <span class="mono accent-txt">${cant} unid.</span>
                </div>
            `).join('');
        }

        this.dibujarGraficaCanvas('graficaCategorias', sumCat, 28);
        this.dibujarGraficaHorarios(ventasPorHora);
        this.aplicarPermisosRol();
    }

    dibujarGraficaCanvas(canvasId, datosObj, padding = 28) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#f59e0b';

        ctx.clearRect(0, 0, W, H);
        const etiquetas = Object.keys(datosObj);
        const valores = Object.values(datosObj);
        const maxVal = Math.max(...valores, 100);

        const anchoBarra = 38;
        const espacio = (W - padding * 2) / etiquetas.length;

        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        for (let i = 0; i <= 3; i++) {
            const y = padding + ((H - padding * 2) / 3) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(W - padding, y);
            ctx.stroke();
        }

        etiquetas.forEach((cat, i) => {
            const val = valores[i];
            const altura = ((val / maxVal) * (H - padding * 2));
            const x = padding + i * espacio + (espacio - anchoBarra) / 2;
            const y = H - padding - altura;

            ctx.fillStyle = val > 0 ? accentColor : 'rgba(255,255,255,0.12)';
            ctx.fillRect(x, y, anchoBarra, Math.max(altura, 4));

            ctx.fillStyle = '#f4f4f6';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`$${val.toFixed(0)}`, x + anchoBarra / 2, y - 5);

            ctx.fillStyle = '#9898a3';
            ctx.font = '10px sans-serif';
            ctx.fillText(cat.slice(0, 8), x + anchoBarra / 2, H - 10);
        });
    }

    dibujarGraficaHorarios(ventasPorHora) {
        const horasActivas = {};
        for (let h = 8; h <= 21; h++) {
            horasActivas[`${String(h).padStart(2, '0')}h`] = ventasPorHora[h] || 0;
        }
        this.dibujarGraficaCanvas('graficaHorarios', horasActivas, 24);
    }

    reimprimirTicket(idx) {
        if (this.ventas[idx]) this.abrirTicketModal(this.ventas[idx]);
    }

    // ==========================================
    // 7. PALETA DE COMANDOS Y EVENTOS
    // ==========================================
    abrirCommandPalette() {
        const modal = document.getElementById('modalCmd');
        const input = document.getElementById('inputCmdSearch');
        modal.classList.remove('hidden');
        input.value = '';
        input.focus();
        this.filtrarComandos('');
    }

    filtrarComandos(q) {
        const acciones = [
            { nombre: '⚡ Ir a Punto de Venta (Caja)', fn: () => this.cambiarModulo('pos') },
            { nombre: '📱 Cobrar Recarga Telefónica', fn: () => document.getElementById('modalRecargas').classList.remove('hidden') },
            { nombre: '🍾 Cobrar Importe de Envase ($10)', fn: () => this.agregarArticuloLibre('Importe Envase Retornable', 10, 0) },
            { nombre: '➕ Agregar Artículo Varios / Suelto', fn: () => document.getElementById('modalVentaLibre').classList.remove('hidden') },
            { nombre: '🏷️ Imprimir Etiquetas / Preciadores', fn: () => this.abrirModalPreciadores() },
            { nombre: '📦 Ir a Inventario (100 Productos)', fn: () => this.cambiarModulo('inventario') },
            { nombre: '🔥 Ir a Combos y Promociones', fn: () => this.cambiarModulo('combos') },
            { nombre: '💳 Ir a Créditos y Fiado', fn: () => this.cambiarModulo('fiado') },
            { nombre: '🚚 Ir a Proveedores (20 Rutas)', fn: () => this.cambiarModulo('proveedores') },
            { nombre: '📊 Ir a Corte Z y Arqueo', fn: () => this.cambiarModulo('reportes') },
            { nombre: '🧮 Abrir Arqueo de Billetes y Monedas', fn: () => document.getElementById('modalArqueo').classList.remove('hidden') },
            { nombre: '🧾 Imprimir Corte Z del Turno', fn: () => this.imprimirCorteZ() },
            { nombre: '📋 Generar Orden de Reorden Inteligente', fn: () => this.generarOrdenCompra() },
            { nombre: '📥 Exportar Inventario a Excel (CSV)', fn: () => this.exportarCSV() }
        ];

        const filtradas = acciones.filter(a => a.nombre.toLowerCase().includes(q.toLowerCase()));
        const lista = document.getElementById('listaComandos');
        lista.innerHTML = '';
        filtradas.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cmd-item';
            div.innerHTML = `<span>${item.nombre}</span><span class="mono subtitle">Enter ↵</span>`;
            div.onclick = () => {
                document.getElementById('modalCmd').classList.add('hidden');
                item.fn();
            };
            lista.appendChild(div);
        });
    }

    inicializarEventos() {
        document.getElementById('formLogin').addEventListener('submit', (e) => {
            e.preventDefault();
            const pin = document.getElementById('loginPin').value;
            if (pin !== '1234' && pin !== '0000') {
                this.beepEscanner('err');
                this.mostrarNotificacion('PIN incorrecto. Usa 1234 (Admin) o 0000 (Cajero).');
                return;
            }
            this.sesion.operador = document.getElementById('loginOperador').value;
            this.sesion.rol = pin === '1234' ? 'ADMIN' : 'CAJERO';
            this.sesion.fondoInicial = parseFloat(document.getElementById('loginFondo').value) || 0;
            this.sesion.metaDiaria = parseFloat(document.getElementById('loginMeta').value) || 4500;

            document.getElementById('pantallaLogin').classList.add('hidden');
            this.aplicarPermisosRol();
            this.actualizarMetaDiaria();
            this.renderizarReportes();
            this.beepEscanner('ok');
            setTimeout(() => document.getElementById('buscarProductoPOS').focus(), 80);
        });

        document.getElementById('btnCerrarSesion').addEventListener('click', () => {
            document.getElementById('loginPin').value = '';
            document.getElementById('pantallaLogin').classList.remove('hidden');
        });

        const temas = ['amber', 'cyan', 'emerald'];
        let idxTema = 0;
        document.getElementById('btnToggleTheme').addEventListener('click', () => {
            idxTema = (idxTema + 1) % temas.length;
            const nuevo = temas[idxTema];
            document.documentElement.setAttribute('data-theme', nuevo);
            this.renderizarReportes();
            this.mostrarNotificacion(`Tema activado: ${nuevo.toUpperCase()}`);
        });

        document.getElementById('btnFullscreen').addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });

        // Recargas Telefónicas
        document.getElementById('btnRecargas').addEventListener('click', () => {
            document.getElementById('modalRecargas').classList.remove('hidden');
            document.getElementById('recargaNumero').focus();
        });
        document.getElementById('btnCancelarRecarga').addEventListener('click', () => {
            document.getElementById('modalRecargas').classList.add('hidden');
        });
        document.getElementById('formRecarga').addEventListener('submit', (e) => {
            e.preventDefault();
            const comp = document.getElementById('recargaCompania').value;
            const num = document.getElementById('recargaNumero').value;
            const monto = parseFloat(document.getElementById('recargaMonto').value);
            this.agregarArticuloLibre(`Recarga ${comp} (${num})`, monto, 0.06);
            document.getElementById('recargaNumero').value = '';
            document.getElementById('modalRecargas').classList.add('hidden');
            this.mostrarNotificacion(`Recarga ${comp} $${monto} agregada.`);
        });

        // Importe Envase Retornable
        document.getElementById('btnEnvase').addEventListener('click', () => {
            this.agregarArticuloLibre('Importe Envase Retornable', 10.00, 0);
            this.mostrarNotificacion('Importe de envase ($10.00) agregado al ticket.');
        });

        // Arqueo de Caja
        document.getElementById('btnArqueoModal').addEventListener('click', () => {
            document.getElementById('modalArqueo').classList.remove('hidden');
        });
        document.getElementById('btnCerrarArqueo').addEventListener('click', () => {
            document.getElementById('modalArqueo').classList.add('hidden');
        });
        document.querySelectorAll('.arq-input').forEach(inp => {
            inp.addEventListener('input', () => {
                let suma = 0;
                document.querySelectorAll('.arq-input').forEach(i => {
                    suma += (parseFloat(i.value) || 0) * parseFloat(i.dataset.val);
                });
                document.getElementById('lblTotalArqueo').textContent = `$${suma.toFixed(2)}`;
                const esperado = parseFloat(document.getElementById('kpiEfectivoCajon').textContent.replace('$', '')) || 0;
                const dif = suma - esperado;
                const lblDif = document.getElementById('lblDiferenciaArqueo');
                lblDif.textContent = dif === 0 ? '✅ Caja cuadrada al centavo' : (dif > 0 ? `Sobrante: +$${dif.toFixed(2)}` : `Faltante: -$${Math.abs(dif).toFixed(2)}`);
                lblDif.style.color = dif < 0 ? 'var(--danger)' : 'var(--success)';
            });
        });

        // Artículo Varios
        document.getElementById('btnVentaLibre').addEventListener('click', () => {
            document.getElementById('modalVentaLibre').classList.remove('hidden');
            document.getElementById('librePrecio').focus();
        });
        document.getElementById('btnCancelarLibre').addEventListener('click', () => {
            document.getElementById('modalVentaLibre').classList.add('hidden');
        });
        document.getElementById('formVentaLibre').addEventListener('submit', (e) => {
            e.preventDefault();
            const nom = document.getElementById('libreNombre').value;
            const pre = parseFloat(document.getElementById('librePrecio').value);
            if (pre > 0) {
                this.agregarArticuloLibre(nom, pre);
                document.getElementById('librePrecio').value = '';
                document.getElementById('modalVentaLibre').classList.add('hidden');
            }
        });

        // Teclado numérico táctil
        document.getElementById('btnToggleNumpad').addEventListener('click', () => {
            document.getElementById('numpadContainer').classList.toggle('hidden');
        });
        document.querySelectorAll('.num-key').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById('montoRecibido');
                const k = btn.dataset.k;
                if (k === 'C') input.value = '';
                else input.value = (input.value || '') + k;
                this.actualizarCambio();
            });
        });

        document.getElementById('btnToggleVistaPOS').addEventListener('click', (e) => {
            this.vistaCompacta = !this.vistaCompacta;
            e.target.textContent = this.vistaCompacta ? '⊞ Tarjetas' : '☰ Compacta';
            this.renderizarCatalogoPOS(document.getElementById('buscarProductoPOS').value);
        });

        document.querySelectorAll('.ticket-slot-btn').forEach(btn => {
            btn.addEventListener('click', () => this.cambiarSlotTicket(parseInt(btn.dataset.slot)));
        });

        document.getElementById('btnCmdPalette').addEventListener('click', () => this.abrirCommandPalette());
        document.getElementById('inputCmdSearch').addEventListener('input', (e) => this.filtrarComandos(e.target.value));

        document.getElementById('btnAbrirCamara').addEventListener('click', () => this.iniciarEscannerCamara());
        document.getElementById('btnCerrarCamara').addEventListener('click', () => this.detenerEscannerCamara());

        document.addEventListener('keydown', (e) => {
            const loginVisible = !document.getElementById('pantallaLogin').classList.contains('hidden');
            if (loginVisible) return;

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                this.abrirCommandPalette();
            } else if (e.key === 'F2' || (e.altKey && e.key.toLowerCase() === 'b')) {
                e.preventDefault();
                this.cambiarModulo('pos');
                const buscador = document.getElementById('buscarProductoPOS');
                buscador.focus();
                buscador.select();
            } else if (e.key === 'F8' || (e.altKey && e.key.toLowerCase() === 'c')) {
                e.preventDefault();
                this.cambiarModulo('pos');
                this.procesarCobro();
            } else if (e.key === 'Escape') {
                this.detenerEscannerCamara();
                document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
            }
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.cambiarModulo(btn.dataset.tab));
        });

        document.querySelectorAll('.cat-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.categoriaActiva = pill.dataset.cat;
                this.renderizarCatalogoPOS(document.getElementById('buscarProductoPOS').value);
            });
        });

        // Filtros inventario y proveedores
        document.querySelectorAll('.inv-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.inv-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filtroInventarioEstado = btn.dataset.invfilter;
                this.renderizarInventario();
            });
        });
        document.getElementById('buscarInventario').addEventListener('input', () => this.renderizarInventario());
        document.getElementById('filtroDiaProveedor').addEventListener('change', () => this.renderizarProveedores());

        const inputBuscar = document.getElementById('buscarProductoPOS');
        inputBuscar.addEventListener('input', (e) => this.renderizarCatalogoPOS(e.target.value));
        inputBuscar.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const codigo = inputBuscar.value.trim().toUpperCase();
                const exactoProd = this.productos.find(p => p.codigo.toUpperCase() === codigo);
                const exactoCombo = this.combos.find(c => c.codigo.toUpperCase() === codigo);
                if (exactoProd) {
                    this.agregarAlCarrito(exactoProd.id);
                    inputBuscar.value = '';
                    this.renderizarCatalogoPOS('');
                    inputBuscar.focus();
                } else if (exactoCombo) {
                    this.agregarComboAlCarrito(exactoCombo.id);
                    inputBuscar.value = '';
                    this.renderizarCatalogoPOS('');
                    inputBuscar.focus();
                }
            }
        });

        document.getElementById('inputDescuento').addEventListener('input', () => this.renderizarCarrito());

        document.querySelectorAll('.bill-btn[data-val]').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.dataset.val;
                const { total } = this.calcularTotalesCarrito();
                document.getElementById('montoRecibido').value = val === 'exacto' ? total.toFixed(2) : val;
                this.actualizarCambio();
            });
        });

        document.querySelectorAll('.peso-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('inputPesoKg').value = btn.dataset.kg;
                this.actualizarPreviewGranel();
            });
        });

        document.getElementById('inputPesoKg').addEventListener('input', () => this.actualizarPreviewGranel());
        document.getElementById('prodCosto').addEventListener('input', () => this.actualizarPreviewMargen());
        document.getElementById('prodPrecio').addEventListener('input', () => this.actualizarPreviewMargen());

        document.getElementById('metodoPago').addEventListener('change', (e) => {
            const val = e.target.value;
            const esEfectivoOMixto = val === 'efectivo' || val === 'mixto';
            document.getElementById('grupoEfectivo').classList.toggle('hidden', !esEfectivoOMixto);
            document.getElementById('grupoMixtoExtra').classList.toggle('hidden', val !== 'mixto');
            document.getElementById('lblMontoEfectivo').textContent = val === 'mixto' ? 'Parte en Efectivo ($)' : 'Efectivo Recibido ($)';
            document.getElementById('grupoFiado').classList.toggle('hidden', val !== 'fiado');
            this.actualizarCambio();
        });

        document.getElementById('montoRecibido').addEventListener('input', () => this.actualizarCambio());
        document.getElementById('btnCobrar').addEventListener('click', () => this.procesarCobro());
        document.getElementById('btnCancelarVenta').addEventListener('click', () => {
            this.carrito = [];
            this.cambiarSlotTicket(this.slotActivo);
        });

        document.getElementById('btnConfirmarGranel').addEventListener('click', () => {
            const kg = parseFloat(document.getElementById('inputPesoKg').value);
            if (kg > 0 && this.productoGranelSeleccionado) {
                this.insertarItemCarrito(this.productoGranelSeleccionado, kg);
                document.getElementById('modalGranel').classList.add('hidden');
            }
        });

        document.getElementById('btnCancelarGranel').addEventListener('click', () => document.getElementById('modalGranel').classList.add('hidden'));
        document.getElementById('btnCerrarTicket').addEventListener('click', () => document.getElementById('modalTicket').classList.add('hidden'));

        document.getElementById('btnEnviarTicketWhatsApp').addEventListener('click', () => {
            const v = this.ventaModalActual;
            if (!v) return;
            const resumen = `${this.configTienda.nombre}\nFolio: ${v.folio}\nFecha: ${v.fecha}\n` +
                v.detalleItems.map(i => `- ${i.cant}${i.unidad} ${i.nombre}: $${i.subtotal}`).join('\n') +
                `\nTOTAL: $${v.total.toFixed(2)} (${v.metodo.toUpperCase()})`;
            window.open(`https://wa.me/?text=${encodeURIComponent(resumen)}`, '_blank');
        });

        document.getElementById('btnImprimirPreciadores').addEventListener('click', () => this.abrirModalPreciadores());
        document.getElementById('btnCerrarPreciadores').addEventListener('click', () => document.getElementById('modalPreciadores').classList.add('hidden'));

        document.getElementById('btnPrestarEnvase').addEventListener('click', () => this.movimientoEnvaseCliente(1));
        document.getElementById('btnDevolverEnvase').addEventListener('click', () => this.movimientoEnvaseCliente(-1));

        document.getElementById('btnCerrarEC').addEventListener('click', () => document.getElementById('modalEstadoCuenta').classList.add('hidden'));

        document.getElementById('btnWhatsAppEC').addEventListener('click', () => {
            const c = this.clienteEstadoCuentaActual;
            if (!c) return;
            const tel = c.telefono.replace(/\D/g, '');
            const msg = encodeURIComponent(`Hola ${c.nombre}, te saludamos de ${this.configTienda.nombre}. Tu saldo pendiente en tu cuenta de crédito es de $${c.deuda.toFixed(2)}. ¡Gracias!`);
            window.open(`https://wa.me/52${tel}?text=${msg}`, '_blank');
        });

        document.getElementById('formEntradaStock').addEventListener('submit', (e) => {
            e.preventDefault();
            const prodId = parseInt(document.getElementById('entradaProdSelect').value);
            const cant = parseFloat(document.getElementById('entradaCantidad').value);
            const nuevaCad = document.getElementById('entradaCaducidad').value;
            const prod = this.productos.find(p => p.id === prodId);

            if (prod && cant > 0) {
                prod.stock = parseFloat((prod.stock + cant).toFixed(3));
                if (nuevaCad) prod.caducidad = nuevaCad;
                this.registrarKardex('ENTRADA LOTE', prod.nombre, `+${cant}`);
                e.target.reset();
                this.guardarDatos();
                this.renderizarTodo();
                this.beepEscanner('ok');
                this.mostrarNotificacion(`Entrada registrada: +${cant} a ${prod.nombre}`);
            }
        });

        document.getElementById('formMerma').addEventListener('submit', (e) => {
            e.preventDefault();
            const prodId = parseInt(document.getElementById('mermaProdSelect').value);
            const cant = parseFloat(document.getElementById('mermaCantidad').value);
            const motivo = document.getElementById('mermaMotivo').value;
            const prod = this.productos.find(p => p.id === prodId);

            if (prod && cant > 0 && prod.stock >= cant) {
                prod.stock = parseFloat((prod.stock - cant).toFixed(3));
                const perdidaCosto = parseFloat((prod.costo * cant).toFixed(2));
                this.gastos.unshift({ concepto: `Merma (${motivo}): ${cant}x ${prod.nombre}`, monto: perdidaCosto });
                this.registrarKardex(`MERMA (${motivo.toUpperCase()})`, prod.nombre, `-${cant}`);
                e.target.reset();
                this.guardarDatos();
                this.renderizarTodo();
                this.mostrarNotificacion(`Merma registrada (-$${perdidaCosto.toFixed(2)} al corte).`);
            } else {
                this.mostrarNotificacion('Cantidad de merma mayor al stock disponible.');
            }
        });

        document.getElementById('formCombo').addEventListener('submit', (e) => {
            e.preventDefault();
            this.combos.push(new Combo(
                Date.now(),
                'CMB-' + String(this.combos.length + 1).padStart(2, '0'),
                document.getElementById('comboNombre').value,
                document.getElementById('comboProd1').value,
                document.getElementById('comboProd2').value,
                document.getElementById('comboPrecio').value
            ));
            e.target.reset();
            this.guardarDatos();
            this.renderizarTodo();
            this.mostrarNotificacion('Combo publicado.');
        });

        document.getElementById('btnOrdenCompra').addEventListener('click', () => this.generarOrdenCompra());
        document.getElementById('btnExportarCSV').addEventListener('click', () => this.exportarCSV());
        document.getElementById('btnCerrarOrden').addEventListener('click', () => document.getElementById('modalOrdenCompra').classList.add('hidden'));
        document.getElementById('btnCopiarOrden').addEventListener('click', () => {
            navigator.clipboard.writeText(document.getElementById('textoOrdenCompra').value);
            this.mostrarNotificacion('Orden copiada.');
        });

        document.getElementById('btnCorteZ').addEventListener('click', () => this.imprimirCorteZ());

        document.getElementById('formGasto').addEventListener('submit', (e) => {
            e.preventDefault();
            this.gastos.unshift({
                concepto: document.getElementById('gastoConcepto').value,
                monto: parseFloat(document.getElementById('gastoMonto').value)
            });
            e.target.reset();
            this.guardarDatos();
            this.renderizarReportes();
            this.mostrarNotificacion('Salida registrada.');
        });

        document.getElementById('formProducto').addEventListener('submit', (e) => {
            e.preventDefault();
            const idEdit = document.getElementById('prodId').value;
            const nuevoProd = new Producto(
                idEdit ? parseInt(idEdit) : Date.now(),
                document.getElementById('prodCodigo').value,
                document.getElementById('prodNombre').value,
                document.getElementById('prodTipo').value,
                document.getElementById('prodCategoria').value,
                document.getElementById('prodCosto').value,
                document.getElementById('prodPrecio').value,
                document.getElementById('prodStock').value,
                document.getElementById('prodMinimo').value,
                document.getElementById('prodCaducidad').value,
                document.getElementById('prodMayoreo').value,
                document.getElementById('prodCantMayoreo').value,
                document.getElementById('prodImagen').value
            );

            if (idEdit) {
                const idx = this.productos.findIndex(p => p.id === parseInt(idEdit));
                this.productos[idx] = nuevoProd;
                this.registrarKardex('EDICIÓN', nuevoProd.nombre, `Stock: ${nuevoProd.stock}`);
            } else {
                this.productos.push(nuevoProd);
                this.registrarKardex('ALTA SKU', nuevoProd.nombre, `+${nuevoProd.stock}`);
            }

            e.target.reset();
            document.getElementById('prodId').value = '';
            this.guardarDatos();
            this.renderizarTodo();
            this.mostrarNotificacion('Producto guardado.');
        });

        document.getElementById('formCliente').addEventListener('submit', (e) => {
            e.preventDefault();
            this.clientes.push(new Cliente(
                Date.now(),
                document.getElementById('clienteNombre').value,
                document.getElementById('clienteTelefono').value,
                document.getElementById('clienteLimite').value,
                0,
                [],
                {}
            ));
            e.target.reset();
            this.guardarDatos();
            this.renderizarClientes();
            this.mostrarNotificacion('Cliente registrado.');
        });

        document.getElementById('formAbono').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('abonoClienteSelect').value);
            const monto = parseFloat(document.getElementById('abonoMonto').value);
            const cliente = this.clientes.find(c => c.id === id);

            if (cliente && monto > 0) {
                const aplicado = Math.min(cliente.deuda, monto);
                cliente.deuda = parseFloat((cliente.deuda - aplicado).toFixed(2));
                if (!cliente.historial) cliente.historial = [];
                cliente.historial.unshift({
                    fecha: new Date().toLocaleString('es-MX'),
                    tipo: 'ABONO RECIBIDO',
                    monto: -aplicado
                });
                this.abonosTotales = parseFloat((this.abonosTotales + aplicado).toFixed(2));
                e.target.reset();
                this.guardarDatos();
                this.renderizarClientes();
                this.renderizarReportes();
                this.mostrarNotificacion(`Abono de $${aplicado.toFixed(2)} registrado.`);
            }
        });

        document.getElementById('formProveedor').addEventListener('submit', (e) => {
            e.preventDefault();
            this.proveedores.push(new Proveedor(
                Date.now(),
                document.getElementById('provEmpresa').value,
                document.getElementById('provContacto').value,
                document.getElementById('provTelefono').value,
                document.getElementById('provLinea').value,
                document.getElementById('provDia').value
            ));
            e.target.reset();
            this.guardarDatos();
            this.renderizarProveedores();
            this.mostrarNotificacion('Proveedor registrado.');
        });

        document.getElementById('formCompraProveedor').addEventListener('submit', (e) => {
            e.preventDefault();
            const prov = this.proveedores.find(p => p.id === parseInt(document.getElementById('compraProvSelect').value));
            const prod = this.productos.find(p => p.id === parseInt(document.getElementById('compraProdSelect').value));
            const cant = parseFloat(document.getElementById('compraCant').value) || 0;
            const monto = parseFloat(document.getElementById('compraMonto').value) || 0;
            const condicion = document.getElementById('compraCondicion').value;

            if (!prov || !prod || cant <= 0 || monto <= 0) return;

            prod.stock = parseFloat((prod.stock + cant).toFixed(3));
            const pagada = condicion === 'contado';
            if (pagada) {
                this.gastos.unshift({ concepto: `Compra ${prov.empresa}: ${cant}x ${prod.nombre}`, monto });
            }
            this.registrarKardex('COMPRA PROV.', prod.nombre, `+${cant}`);

            this.comprasProveedores.unshift({
                fecha: new Date().toLocaleDateString('es-MX'),
                proveedor: prov.empresa,
                producto: prod.nombre,
                cant,
                monto,
                pagada
            });

            e.target.reset();
            this.guardarDatos();
            this.renderizarTodo();
            this.mostrarNotificacion(`Compra registrada: +${cant} ${prod.nombre}.`);
        });

        document.getElementById('formConfigTienda').addEventListener('submit', (e) => {
            e.preventDefault();
            this.configTienda.nombre = document.getElementById('cfgNombre').value;
            this.configTienda.rfc = document.getElementById('cfgRfc').value;
            this.configTienda.direccion = document.getElementById('cfgDireccion').value;
            this.configTienda.pie = document.getElementById('cfgPie').value;
            this.guardarDatos();
            this.aplicarConfigTienda();
            this.mostrarNotificacion('Configuración de tienda actualizada.');
        });

        document.getElementById('btnExportarJSON').addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem('pos_abarrotes_v9_db'));
            const a = document.createElement('a');
            a.href = dataStr;
            a.download = "respaldo_titanium_v9.json";
            a.click();
        });

        document.getElementById('inputImportarJSON').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    JSON.parse(ev.target.result);
                    localStorage.setItem('pos_abarrotes_v9_db', ev.target.result);
                    this.cargarDatos();
                    this.aplicarConfigTienda();
                    this.renderizarTodo();
                    this.mostrarNotificacion('Base de datos restaurada con éxito.');
                } catch (err) {
                    this.mostrarNotificacion('Archivo JSON inválido.');
                }
            };
            reader.readAsText(file);
        });

        document.getElementById('btnReiniciarDemo').addEventListener('click', () => {
            localStorage.removeItem('pos_abarrotes_v9_db');
            localStorage.removeItem('pos_abarrotes_v8_db');
            this.cargarDatosIniciales();
            this.renderizarTodo();
            this.mostrarNotificacion('Base cargada: 100 productos + 20 proveedores.');
        });

        // Menú móvil
        const sidebarEl = document.getElementById('sidebarMenu');
        const backdropEl = document.getElementById('sidebarBackdrop');
        const toggleMenuMovil = (abrir) => {
            sidebarEl.classList.toggle('mobile-open', abrir);
            backdropEl.classList.toggle('hidden', !abrir);
        };
        document.getElementById('btnMenuMovil').addEventListener('click', () => {
            const estaAbierto = sidebarEl.classList.contains('mobile-open');
            toggleMenuMovil(!estaAbierto);
        });
        backdropEl.addEventListener('click', () => toggleMenuMovil(false));
        document.querySelectorAll('.nav-menu .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => toggleMenuMovil(false));
        });
    }
}

const pos = new SistemaPOS();