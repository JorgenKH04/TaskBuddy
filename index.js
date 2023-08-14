/*I hope this message finds you in good health and high spirits.
 I am writing to offer my sincerest apologies for the mess that
  my code must have been when you had to review it.
   I am fully aware that it was nothing short of a chaotic "spaghetti code" nightmare,
    and I deeply regret subjecting you to such an ordeal. */

import {
	handleClick,
	handleHover,
	sortAlphabetically,
	sortDate,
	sortUnchecked,
	swapSort,
	containsTask,
	showPopup,
	selectedSort,
} from "./utils.js";

const $ = document.querySelector.bind(document);
let taskArray = [];
let search = "";

const taskAdded = $("#task-added");
const alreadyAdded = $("#already-added");
const searchInput = $("#searchInput");
//Checks if target moused over has id addTodo or if any parent up to root does.
document.addEventListener("mouseover", (e) => {
	e.preventDefault();
	handleHover(e, "isHover");
});

//Same as above except when your mouse leaves the element
document.addEventListener("mouseout", (e) => {
	e.preventDefault();

	handleHover(e, "notHover");
});

//Click eventlistener
document.addEventListener("click", (e) => {
	e.preventDefault();
	handleClick(e);
	swapSort(e.target.id);
});

//searchbar
searchInput.addEventListener("keyup", (e) => {
	search = e.target.value;
	taskRender();
});

//Generates task and pushes to taskArray
const generateTask = (input) => {
	if (containsTask(input, taskArray)) {
		showPopup(alreadyAdded);
	} else {
		taskArray.push({
			task: input,
			date: Date.now(),
			isChecked: false,
			html: `<div class="TaskItem" id="w${Date.now()}">
          <div class="checkbox checkbox${input}" id="checkbox${Date.now()}" data-dataCheck="${Date.now()}">
          </div>
          <p>${input}</p>
          <p class="taskRemove" id="remove${Date.now()}" data-dataInput="${input}" data-dataTask="${Date.now()}">Remove</p>
        </div>`,
		});
		showPopup(taskAdded);
		setLocalStorage(taskArray, "Tasks");
	}
	pickSort();
};

//Renders tasks from taskArray
function taskRender() {
	getLocalStorage();
	let taskHtml = "";
	for (const task of taskArray) {
		if (
			search === "" ||
			task.task.toLowerCase().includes(search.toLowerCase())
		) {
			taskHtml += task.html;
		}
	}
	document.querySelector("#taskContainer").innerHTML = taskHtml;
	for (const task of taskArray) {
		if (task.isChecked) {
			if (
				search === "" ||
				task.task.toLowerCase().includes(search.toLowerCase())
			) {
				document.querySelector(`#checkbox${task.date}`).style.backgroundImage =
					"url('./Assets/Icons/checkMark.svg')";
			}
		}
	}
}

const removeTask = (target) => {
	const newArray = [];
	for (const task of taskArray) {
		if (task.task === target) {
			continue;
		}
		newArray.push(task);
	}
	taskArray = newArray;
	setLocalStorage(taskArray, "Tasks");
	taskRender();
};

function invertTaskArray() {
	taskArray.reverse();
	setLocalStorage(taskArray, "Tasks");
	taskRender();
}

function getLocalStorage() {
	if (localStorage.getItem("Tasks")) {
		taskArray = JSON.parse(localStorage.getItem("Tasks"));
		return JSON.parse(localStorage.getItem("Tasks"));
	}
}

function setLocalStorage(arr, key) {
	if (arr) {
		localStorage.setItem(key, JSON.stringify(arr));
	}
}

const pickSort = () => {
	switch (selectedSort) {
		case "btnTime":
			setTimeout(() => {
				sortDate(taskArray);
				taskRender();
			}, "1000");
			break;
		case "btnAlphabetical":
			setTimeout(() => {
				sortAlphabetically(taskArray);
				taskRender();
			}, "1000");
			break;
		case "btnUnchecked":
			setTimeout(() => {
				sortUnchecked(taskArray);
				taskRender();
			}, "1000");

			break;
	}
};

if (getLocalStorage) {
	taskRender();
}

export {
	taskArray,
	generateTask,
	removeTask,
	setLocalStorage,
	pickSort,
	invertTaskArray,
};
