const inputTodo = document.querySelector("#getInputTask") as HTMLInputElement;
const addTodoBtn = document.querySelector(".addTodoBtn") as HTMLButtonElement;
const filterTodos = document.querySelector("#filterTodos") as HTMLSelectElement;
const todoList = document.querySelector(".todo-list") as HTMLUListElement;
const Badges = [...document.querySelectorAll(".badge")];
interface Todos {
	readonly id: number;
	subject: string;
	date: string;
	isDone: boolean;
}
type Edit = {
	isEdit: boolean;
	editId: number | null;
};
let filteredValue: string = "All";
const EditItem: Edit = {
	isEdit: false,
	editId: null,
};
// save Todos on localStorage
function saveToLocalStorage(Todos: Todos[]): void {
	localStorage.setItem("Todos", JSON.stringify(Todos));
}
//geting saved data of local storage
function getOfLocalStorage(): Todos[] {
	return JSON.parse(localStorage.getItem("Todos") as string) || [];
}
//add new Todo logic
function addTodo(): void {
	// e.preventDefault();
	if (!inputTodo.value) return;
	const Todo: Todos = {
		id: Date.now(),
		subject: inputTodo.value.trim(),
		date: new Date().toISOString(),
		isDone: false,
	};
	const savedLocal = getOfLocalStorage() || [];
	savedLocal.push(Todo);
	saveToLocalStorage(savedLocal);
}
// create Todo and append to todolist
function createTodoElement(AllTodos: Todos[]): void {
	if (!AllTodos.length) {
		const NotFound = `<p class='text-3xl'>Nothing To Do</p>`;
		todoList.innerHTML = NotFound;
	} else {
		let todoElement: string = "";
		AllTodos.forEach(({ id, subject, date, isDone }: Todos) => {
			todoElement += ` <li class="flex items-center justify-between w-full h-8 px-2 my-2 rounded bg-slate-500">
		        <input type="checkbox" name="checkTodo" data-check-id='${id}' class="checkTodo flex-grow-0 w-5 h-5 accent-green-300 bg-slate-500">
		        <p class="flex-grow px-4 ${isDone && "line-through"} ${
				isDone && "text-green-300"
			}">${subject}</p>
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
				const id = Number((e.target as HTMLButtonElement).dataset.checkId);
				checkedTodo(id);
			});
		});
		//removeBtn Handler
		const removeBtns = [...document.querySelectorAll(".removeBtn")];
		removeBtns.forEach((Btn) => {
			Btn.addEventListener("click", (e) => {
				const id = Number((e.target as HTMLButtonElement).dataset.removeId);
				removeTodo(id);
			});
		});
		// editBtn Handler
		const editBtns = [...document.querySelectorAll(".editBtn")];
		editBtns.forEach((Btn) => {
			Btn.addEventListener("click", (e) => {
				const id = Number((e.target as HTMLButtonElement).dataset.editId);
				const setInputValu = getOfLocalStorage().find((todo) => todo.id === id);
				inputTodo.value = setInputValu?.subject as string;
				EditItem.isEdit = true;
				EditItem.editId = id;
				addTodoBtn.innerText = "Edit";
			});
		});
	}
}
//check Todo Status
function checkTodoStatus(e: Event): void {
	e.preventDefault();
	let BtnLabel = (e.target as HTMLButtonElement).innerText;
	filterByStatus(filteredValue);
	switch (BtnLabel) {
		case "Add": {
			addTodo();
			break;
		}
		case "Edit": {
			if (!EditItem.editId) return;
			editTodo(EditItem.editId, inputTodo.value);
			EditItem.isEdit = false;
			addTodoBtn.innerText = "Add";
			break;
		}
	}
	createTodoElement(getOfLocalStorage());
	checkBoxStatus();
	filterByStatus(filteredValue);
	inputTodo.value = "";
}
//Edit Todo
function editTodo(id: number, value: string): void {
	const cloneTodos = [...getOfLocalStorage()];
	const findIndex = cloneTodos.findIndex((todo) => todo.id === id);
	cloneTodos[findIndex].subject = value;
	saveToLocalStorage(cloneTodos);
	filterByStatus(filteredValue);
}
//Remove Todo
function removeTodo(id: number): void {
	const getOfLocal = getOfLocalStorage();
	const removeItem: Todos[] = getOfLocal.filter((todo) => todo.id !== id);
	saveToLocalStorage(removeItem);
	createTodoElement(getOfLocalStorage());
	checkBoxStatus();
	filterByStatus(filteredValue);
	todalTodoCounter();
}
//checked Todo
function checkedTodo(id: number): void {
	const cloneTodos = [...getOfLocalStorage()];
	const findItem = cloneTodos.findIndex((todo) => todo.id === id);
	cloneTodos[findItem].isDone = !cloneTodos[findItem].isDone;
	saveToLocalStorage(cloneTodos);
	filterByStatus(filteredValue);
}
// cehck Todo Status After Dom Load
function checkBoxStatus(): void {
	const checkBoxBtns = [...document.querySelectorAll(".checkTodo")];
	const getOfLocal = getOfLocalStorage();
	checkBoxBtns.forEach((checkBox, index) => {
		const checkId = (checkBox as HTMLInputElement).dataset.checkId as string;
		if (getOfLocal[index].id === Number(checkId)) {
			(checkBox as HTMLInputElement).checked = getOfLocal[index].isDone;
		}
	});
}
//filter Todos By Staus?Done:Undone
function filterByStatus(filteredValue: string): void {
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
	}
	checkBoxStatus();
	todalTodoCounter();
}
// count Todos ans show in Badge
function todalTodoCounter(): void {
	Badges.forEach((badge) => {
		const target = (badge as HTMLSpanElement).classList;
		const Todos = getOfLocalStorage();
		if (target.contains("badge-all")) {
			(badge as HTMLSpanElement).innerText = `${Todos.length || 0}`;
		} else if (target.contains("badge-Completed")) {
			(badge as HTMLSpanElement).innerText = `${
				Todos.filter((todo) => todo.isDone).length
			}`;
		} else if (target.contains("badge-UnCompleted")) {
			(badge as HTMLSpanElement).innerText = `${
				Todos.filter((todo) => !todo.isDone).length
			}`;
		}
	});
}
//add or edite Todo Handler
addTodoBtn.addEventListener("click", checkTodoStatus);
// Filter Todos Hanlder
filterTodos.addEventListener("change", (e) => {
	e.preventDefault();
	filteredValue = (e.target as HTMLOptionElement).value;
	filterByStatus(filteredValue);
});
document.addEventListener("DOMContentLoaded", () => {
	createTodoElement(getOfLocalStorage());
	checkBoxStatus();
	todalTodoCounter();
});
