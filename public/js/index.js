"use strict";
const inputTodo = document.querySelector("#getInputTask");
const addTodoBtn = document.querySelector(".addTodoBtn");
const filterTodos = document.querySelector("#filterTodos");
const todoList = document.querySelector(".todo-list");
const Badges = [...document.querySelectorAll(".badge")];
let filteredValue = "All";
// save Todos on localStorage
function saveToLocalStorage(Todos) {
    localStorage.setItem("Todos", JSON.stringify(Todos));
}
//geting saved data of local storage
function getOfLocalStorage() {
    return JSON.parse(localStorage.getItem("Todos")) || [];
}
//add new Todo logic
function addTodo(e) {
    e.preventDefault();
    if (!inputTodo.value)
        return;
    const Todo = {
        id: Date.now(),
        subject: inputTodo.value.trim(),
        date: new Date().toISOString(),
        isDone: false,
    };
    const savedLocal = getOfLocalStorage() || [];
    savedLocal.push(Todo);
    saveToLocalStorage(savedLocal);
    createTodoElement(savedLocal);
    inputTodo.value = "";
    filterByStatus(filteredValue);
    todalTodoCounter();
}
// create Todo and append to todolist
function createTodoElement(AllTodos) {
    if (!AllTodos.length) {
        const NotFound = `<p class='text-3xl'>Nothing To Do</p>`;
        todoList.innerHTML = NotFound;
    }
    else {
        let todoElement = "";
        AllTodos.forEach(({ id, subject, date, isDone }) => {
            todoElement += ` <li class="flex items-center justify-between w-full h-8 px-2 my-2 rounded bg-slate-500">
		        <input type="checkbox" name="checkTodo" data-check-id='${id}' class="checkTodo flex-grow-0 w-5 h-5 accent-green-300 bg-slate-500">
		        <p class="flex-grow px-4 ${isDone && "line-through"} ${isDone && "text-green-300"}">${subject}</p>
		        <p>${new Date(date).toLocaleDateString("fa-IR")}</p>
		        <div class="flex justify-around w-16 h-full">
		         <button data-edit-id='${id}' class='editBtn'><i class="fas fa-edit"></i></button>
		         <button data-remove-id='${id}' class='removeBtn'><i class="fas far fa-trash-alt"></i></button>
		        </div>
		      </li>`;
            todoList.innerHTML = todoElement;
        });
        // chekcBox Handler
        const checkBoxBtns = [...document.querySelectorAll(".checkTodo")];
        checkBoxBtns.forEach((checkBox) => {
            checkBox.addEventListener("change", (e) => {
                const id = Number(e.target.dataset.checkId);
                checkedTodo(id);
            });
        });
        //removeBtn Handler
        const removeBtns = [...document.querySelectorAll(".removeBtn")];
        removeBtns.forEach((Btn) => {
            Btn.addEventListener("click", (e) => {
                const id = Number(e.target.dataset.removeId);
                removeTodo(id);
            });
        });
        // editBtn Handler
        const editBtns = [...document.querySelectorAll(".editBtn")];
        editBtns.forEach((Btn) => {
            Btn.addEventListener("click", (e) => {
                const id = Number(e.target.dataset.editId);
            });
        });
    }
}
//Remove Todo
function removeTodo(id) {
    const getOfLocal = getOfLocalStorage();
    const removeItem = getOfLocal.filter((todo) => todo.id !== id);
    saveToLocalStorage(removeItem);
    createTodoElement(getOfLocalStorage());
    checkBoxStatus();
    filterByStatus(filteredValue);
    todalTodoCounter();
}
//checked Todo
function checkedTodo(id) {
    const cloneTodos = [...getOfLocalStorage()];
    const findItem = cloneTodos.findIndex((todo) => todo.id === id);
    cloneTodos[findItem].isDone = !cloneTodos[findItem].isDone;
    saveToLocalStorage(cloneTodos);
    filterByStatus(filteredValue);
}
// cehck Todo Status After Dom Load
function checkBoxStatus() {
    const checkBoxBtns = [...document.querySelectorAll(".checkTodo")];
    const getOfLocal = getOfLocalStorage();
    checkBoxBtns.forEach((checkBox, index) => {
        const checkId = checkBox.dataset.checkId;
        if (getOfLocal[index].id === Number(checkId)) {
            checkBox.checked = getOfLocal[index].isDone;
        }
    });
}
//filter Todos By Staus?Done:Undone
function filterByStatus(filteredValue) {
    switch (filteredValue) {
        case "All":
            createTodoElement(getOfLocalStorage());
            break;
        case "Completed":
            createTodoElement(getOfLocalStorage().filter((todo) => todo.isDone));
            break;
        case "UnCompleted":
            createTodoElement(getOfLocalStorage().filter((todo) => !todo.isDone));
            break;
        // default:
        // 	createTodoElement(getOfLocalStorage());
    }
    checkBoxStatus();
    todalTodoCounter();
}
// count Todos ans show in Badge
function todalTodoCounter() {
    Badges.forEach((badge) => {
        const target = badge.classList;
        const Todos = getOfLocalStorage();
        if (target.contains("badge-all")) {
            badge.innerText = `${Todos.length || 0}`;
        }
        else if (target.contains("badge-Completed")) {
            badge.innerText = `${Todos.filter((todo) => todo.isDone).length}`;
        }
        else if (target.contains("badge-UnCompleted")) {
            badge.innerText = `${Todos.filter((todo) => !todo.isDone).length}`;
        }
    });
}
//add new Todo Handler
addTodoBtn.addEventListener("click", addTodo);
// Filter Todos Hanlder
filterTodos.addEventListener("change", (e) => {
    e.preventDefault();
    filteredValue = e.target.value;
    filterByStatus(filteredValue);
});
document.addEventListener("DOMContentLoaded", () => {
    createTodoElement(getOfLocalStorage());
    checkBoxStatus();
    todalTodoCounter();
});
