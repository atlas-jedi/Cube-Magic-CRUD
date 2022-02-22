'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active');

const closeModal = () => {
    document.getElementById('modal').classList.remove('active');
    clearFields();
}

const tempRecord = {
    nome: "Matheus",
    record: "2:00.00",
    data: "00/00/00",
    hora: "00:00"
}

// Read
const readRecord = () => JSON.parse(localStorage.getItem("db_record")) ?? [];

// Send
const setLocalStorage = (db_record) => localStorage.setItem("db_record", JSON.stringify(db_record));

// Create
const createRecord = (record) => {
    const db_record = readRecord();
    db_record.push(record);
    setLocalStorage(db_record);
}

// Update
const updateRecord = (i, record) => {
    const db_record = readRecord();
    db_record[i] = record;
    setLocalStorage(db_record);
}

// Delete
const deleteRecord = (i) => {
    const db_record = readRecord();
    db_record.splice(i, 1);
    setLocalStorage(db_record);
}

// Modal Data Control
const isValidFields = () => {
   return document.getElementById('form').reportValidity();
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
}

// Modal Save Record
const saveRecord = () => {
    if (isValidFields()){
        const record = {
            nome: document.getElementById('nome').value,
            record: document.getElementById('record').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value
        }
        createRecord(record);
        updateTable();
        closeModal();
    }
}

// Create Records on HTML
const createRow = (record, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${record.nome}</td>
        <td>${record.record}</td>
        <td>${record.date}</td>
        <td>${record.time}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">editar</button>
            <button type="button" class="button red" id="delete-${index}">excluir</button>
        </td>
    `
    document.querySelector('#tableRecord>tbody').appendChild(newRow);
}

// Clear Records on HTML
const clearTable = () => {
    const rows = document.querySelectorAll("#tableRecord>tbody tr");
    rows.forEach(row => row.parentNode.removeChild(row));
}

// Update Records on HTML
const updateTable = () => {
    const db_record = readRecord();
    clearTable();
    db_record.forEach(createRow);
}

// Edit/Delete
const editDeleteButton = (event) => {
    if (event.target.type == 'button'){
        const [action, index] = event.target.id.split('-');
        if (action == "edit"){
            const db_record = readRecord();
            document.getElementById('nome').value = db_record[index]['nome'];
            document.getElementById('record').value = db_record[index]['record'];
            document.getElementById('date').value = db_record[index]['date'];
            document.getElementById('time').value = db_record[index]['time'];
            let actionConfirm = (confirm("Os dados serão subistituidos, tem certeza que quer continuar?")) ? true : false;
            if (actionConfirm) {
                openModal();
                deleteRecord(index);
            } else {
                clearTable();
            }
        } else {
            let actionConfirm = (confirm("Tem certeza que deseja deletar?")) ? deleteRecord(index) : false;
        }
    }
    updateTable();
}

// Events
document.getElementById('cadastrarRecord')
    .addEventListener('click', openModal);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

document.getElementById('save')
    .addEventListener('click', saveRecord);

document.querySelector('#tableRecord>tbody')
    .addEventListener('click', editDeleteButton)