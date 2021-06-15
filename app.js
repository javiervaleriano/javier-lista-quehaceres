// ***** SELECCIÓN DE ELEMENTOS DEL DOM *****
const aviso = document.querySelector('.alert');
const form = document.getElementById('form');
const inputText = document.getElementById('text-item');
const envioBtn = document.getElementById('submit-btn');
const lista = document.querySelector('.body-table');
const despBtn = document.querySelector('.clear-items');

// Opciones de edición
let editElement;
let editID = '';
let editFlag = false;


// ***** DETECTORES DE EVENTO *****
// Cargar items desde el Local Storage al iniciar aplicación
window.addEventListener('DOMContentLoaded', cargarItems);


// Enviar formulario
form.addEventListener('submit', agregarItem);

// Limpiar lista de elementos
despBtn.addEventListener('click', despejarItems);



// ***** FUNCIONES *****
function agregarItem(e) {
    e.preventDefault();
    
    const valor = inputText.value;
    const id = new Date().getTime().toString();
    
    if (valor && !editFlag) {
        crearItem(id, valor);
        
        // Hacer aparecer botón de despeje
        if (lista.children.length > 0) {
            despBtn.classList.add('show-clear-items');
        }
        
        // Mostrar alerta
        mostrarAlerta('Elemento agregado', 'success');
        
        // Config por defecto
        porDefecto();
        
        // Agregar a Local Storage
        agregarLocalStorage(id, valor);
        
    } else if (valor && editFlag) {
        editElement.innerHTML = valor;
        
        mostrarAlerta('Elemento editado', 'success');
        
        // Editar Local Storage
        editarLocalStorage(editID, valor);
        
        // Config por defecto
        porDefecto();

    } else {
        mostrarAlerta('Por favor, introduce un valor', 'warning');
    }
}

// Mostrar alerta
function mostrarAlerta(text, className) {
    aviso.textContent = text;
    aviso.classList.add(className);
        
    setTimeout(function() {
        aviso.textContent = '';
        aviso.classList.remove(className);
    }, 1000);
}


// Limpiar lista
function despejarItems() {
    while(lista.contains(lista.firstChild)) {
        lista.removeChild(lista.firstChild);
    }
    
    mostrarAlerta('Lista vacía', 'warning');
    
    despBtn.classList.remove('show-clear-items');
    
    // Eliminar la lista del Local Storage
    localStorage.removeItem('lista');
    
    porDefecto();
}

// Eliminar el item individualmente
function elmIndItem(e) {
    const parent = e.currentTarget.parentElement.parentElement.parentElement;
    lista.removeChild(parent);
    
    if (lista.children.length === 0) {
        despBtn.classList.remove('show-clear-items');
        mostrarAlerta('Lista vacía', 'warning');
    } else {
        mostrarAlerta('Elemento eliminado', 'warning');
    }
    
    // Eliminar del Local Storage
    const id = parent.dataset.id;
    eliminarDelLocalStorage(id);
    
    porDefecto();
}

// Editar el item
function editarItem(e) {
    const parent = e.currentTarget.parentElement.parentElement.parentElement;
    const id = parent.dataset.id;
    // Configurar valores del formulario
    editElement = e.currentTarget.parentElement.previousElementSibling;
    inputText.value = editElement.innerHTML;
    
    // Cambiar variables de edición
    editID = parent.dataset.id;
    editFlag = true;
    envioBtn.textContent = 'editar';
}

// Config por defecto
function porDefecto() {
    inputText.value = '';
    editID = '';
    editFlag = false;
    envioBtn.textContent = 'enviar';
}

// Cargar items desde el Local Storage
function cargarItems() {
    let arrItems = obtenerLocalStorage();
    
    if (arrItems.length > 0) {
        arrItems.map(item => crearItem(item.id, item.valor));
        despBtn.classList.add('show-clear-items');
    }
}


// Generar item de la lista
function crearItem(id, valor) {
    const row = document.createElement('tr');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    row.setAttributeNode(attr);
        
    row.innerHTML = `<td><span class="title">${valor}</span> <span><i class="fas fa-edit icon"></i> <i class="fas fa-trash icon"></i></span></td>`;
        
    // Adjuntar elemento hijo
    lista.appendChild(row);
        
    const eliminarBtn = lista.querySelectorAll('.fa-trash');
    const editarBtn = lista.querySelectorAll('.fa-edit');
    eliminarBtn.forEach(elmBtn => {
        elmBtn.addEventListener('click', elmIndItem);
    });
        
    editarBtn.forEach(editBtn => {
        editBtn.addEventListener('click', editarItem);
    });
}


// ***** LOCAL STORAGE *****
function agregarLocalStorage(id, valor) {
    const item = { id, valor };
    const arrItems = obtenerLocalStorage();
    arrItems.push(item);
    localStorage.setItem('lista', JSON.stringify(arrItems));
}

function editarLocalStorage(id, valor) {
    let arrItems = obtenerLocalStorage();
    arrItems = arrItems.map(item => {
        if (item.id === id) {
            item.valor = valor;
        }
        
        return item;
    });
    
    localStorage.setItem('lista', JSON.stringify(arrItems));
}

function eliminarDelLocalStorage(id) {
    let arrItems = obtenerLocalStorage();
    
    arrItems = arrItems.filter(item => item.id !== id);
    
    localStorage.setItem('lista', JSON.stringify(arrItems));
}

function obtenerLocalStorage() {
    return localStorage.getItem('lista') ? JSON.parse(localStorage.getItem('lista')) : [];
}