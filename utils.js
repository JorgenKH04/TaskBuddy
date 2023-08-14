import {
	taskArray,
	generateTask,
	removeTask,
	setLocalStorage,
	pickSort,
	invertTaskArray,
} from "./index.js";

const hoverableButtons = [
	"#addTask",
	"#popupCancel",
	"#popupAdd",
	"#btnTime",
	"#btnAlphabetical",
	"#btnUnchecked",
];

const $ = document.querySelector.bind(document);
let selectedSort = "btnTime";

const addPopup = $("#addPopup");
const popupInput = $("#popupInput");
const sortDropdown = $(".sortDropdown");
const sortSvg = $("#sortSvg");
const sortUp = $("#sortUp");
const sortDown = $("#sortDown");
const btnAlphabetical = $("#btnAlphabetical");
const btnTime = $("#btnTime");
const btnUnchecked = $("#btnUnchecked");
const removePopup = $("#remove-popup");

const handleClick = (evnt) => {
	if (evnt.target.closest("#addTask")) {
		addPopup.style.display = "flex";
	} else if (evnt.target.closest("#popupCancel")) {
		addPopup.style.display = "none";
		popupInput.value = "";
	} else if (evnt.target.closest("#popupAdd")) {
		generateTask(popupInput.value);
		addPopup.style.display = "none";
		popupInput.value = "";
	}
	if (evnt.target.closest("#sortUp") || evnt.target.closest("#sortDown")) {
		sortClick();
	}
	if (evnt.target.closest("#sortSvg")) {
		if (sortDropdown.style.display === "none") {
			sortDropdown.style.display = "flex";
		} else {
			sortDropdown.style.display = "none";
		}
	}
	if (evnt.target.dataset.datacheck) {
		const selectedTask = evnt.target;
		if (
			selectedTask.style.backgroundImage ===
			`url("./Assets/Icons/checkMark.svg")`
		) {
			selectedTask.style.backgroundImage = "none";
		} else {
			selectedTask.style.backgroundImage =
				"url('./Assets/Icons/checkMark.svg')";
		}
		for (const task of taskArray) {
			if (task.task === selectedTask.nextElementSibling.innerHTML) {
				task.isChecked = !task.isChecked;
			}
		}
		setLocalStorage(taskArray, "Tasks");
	}
	if (evnt.target.dataset.datatask) {
		showPopup(removePopup);
		removeTask(evnt.target.dataset.datainput);
	}
};

//Gives buttons hover effect.
//Maybe rewrite, looks clunky
const handleHover = (btn, action) => {
	for (const button of hoverableButtons) {
		if (btn.target.closest(button)) {
			const currentButton = $(button);
			if (action === "isHover") {
				currentButton.classList.add("colorFlip");
			} else {
				currentButton.classList.remove("colorFlip");
			}
		}
	}
	if (btn.target.closest("#sortSvg")) {
		if (action === "isHover") {
			sortSvg.classList.add("svgFlip");
		} else {
			sortSvg.classList.remove("svgFlip");
		}
	}
	if (btn.target.closest("#sortUp") || btn.target.closest("#sortDown")) {
		if (action === "isHover") {
			sortUp.classList.add("svgFlip");
			sortDown.classList.add("svgFlip");
		} else {
			sortUp.classList.remove("svgFlip");
			sortDown.classList.remove("svgFlip");
		}
	}
	if (btn.target.dataset.datatask) {
		const currentButton = $(`#remove${btn.target.dataset.datatask}`);
		if (action === "isHover") {
			currentButton.classList.add("removeHover");
		} else {
			currentButton.classList.remove("removeHover");
		}
	}
	if (btn.target.dataset.datacheck) {
		const currentButton = $(`#checkbox${btn.target.dataset.datacheck}`);
		if (action === "isHover") {
			currentButton.classList.add("checkHover");
		} else {
			currentButton.classList.remove("checkHover");
		}
	}
};

function sortClick() {
	if (sortUp.style.display === "block") {
		sortUp.style.display = "none";
		sortDown.style.display = "block";
	} else {
		sortUp.style.display = "block";
		sortDown.style.display = "none";
	}
	invertTaskArray();
}

const swapSort = (btn) => {
	if (
		btn === "btnTime" ||
		btn === "btnAlphabetical" ||
		btn === "btnUnchecked"
	) {
		selectedSort = btn;
		sortLocalStorage();
		checkSort();
		pickSort();
	}
};

function checkSort() {
	btnTime.classList.remove("selectedSort");
	btnAlphabetical.classList.remove("selectedSort");
	btnUnchecked.classList.remove("selectedSort");
	switch (selectedSort) {
		case "btnTime":
			btnTime.classList.add("selectedSort");
			sortDropdown.style.display = "none";
			break;
		case "btnAlphabetical":
			btnAlphabetical.classList.add("selectedSort");
			sortDropdown.style.display = "none";
			break;
		case "btnUnchecked":
			btnUnchecked.classList.add("selectedSort");
			sortDropdown.style.display = "none";
			break;
	}
}

const sortAlphabetically = (arr) => {
	arr.sort((a, b) => {
		const ta = a.task.toLowerCase();
		const tb = b.task.toLowerCase();

		if (ta < tb) {
			return -1;
		}
		if (ta > tb) {
			return 1;
		}
		return 0;
	});
	setLocalStorage(arr, "Tasks");
};

const sortDate = (arr) => {
	arr.sort((a, b) => {
		const ta = a.date;
		const tb = b.date;

		return ta - tb;
	});
	setLocalStorage(arr, "Tasks");
};

const sortUnchecked = (arr) => {
	arr.sort((a, b) => {
		return a.isChecked - b.isChecked;
	});
	setLocalStorage(arr, "Tasks");
};

const containsTask = (task, arr) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].task === task) {
			return true;
		} else if (i > arr.length) {
			return false;
		}
	}
};

const showPopup = (el) => {
	el.classList.add("show");
	setTimeout(() => {
		el.classList.remove("show");
	}, 1250);
};

function sortLocalStorage() {
	localStorage.setItem("selectedSort", JSON.stringify(selectedSort));
}

function getSortLS() {
	return JSON.parse(localStorage.getItem("selectedSort"));
}

setTimeout(() => {
	if (getSortLS()) {
		selectedSort = JSON.parse(localStorage.getItem("selectedSort"));
	}
	checkSort();
	pickSort();
}, "1000");

export {
	handleClick,
	handleHover,
	sortAlphabetically,
	sortDate,
	sortUnchecked,
	swapSort,
	containsTask,
	showPopup,
	selectedSort,
};
