const participants = ["Nathan", "Aaron", "Anna"];
const tasks = ["Cuisine", "Salon", "Véranda"];
let history = [];

function distributeTasks() {
    let assignment = {};
    for (let i = 0; i < tasks.length; i++) {
        assignment[tasks[i]] = participants[i % participants.length];
    }
    history.push(assignment);
    return assignment;
}

function displayAssignments(assignments) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    for (let task in assignments) {
        let li = document.createElement("li");
        li.textContent = `${task}: ${assignments[task]}`;
        taskList.appendChild(li);
    }
}

function updateTasks() {
    let newAssignment = distributeTasks();
    displayAssignments(newAssignment);
}

document.addEventListener("DOMContentLoaded", () => {
    let initialAssignment = distributeTasks();
    displayAssignments(initialAssignment);
});
