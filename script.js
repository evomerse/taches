const participants = ["Nathan", "Aaron", "Anna"];
const tasks = ["Cuisine", "Salon", "Véranda"];
let history = [];

function distributeTasks(extraParticipants = []) {
    // Ajouter les participants supplémentaires
    const allParticipants = [...participants, ...extraParticipants];
    
    // Rééquilibrer les tâches
    let assignment = {};
    for (let i = 0; i < tasks.length; i++) {
        assignment[tasks[i]] = allParticipants[i % allParticipants.length];
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

function updateTasks(extraParticipants = []) {
    let newAssignment = distributeTasks(extraParticipants);
    displayAssignments(newAssignment);
}

document.addEventListener("DOMContentLoaded", () => {
    // Exemple : Ajouter "Maman" et "Papa" comme participants supplémentaires
    let initialAssignment = distributeTasks(["Maman", "Papa"]);
    displayAssignments(initialAssignment);

    // Ajout d'un gestionnaire d'événements pour le bouton "Répartir à nouveau"
    const repartirBtn = document.getElementById("repartirBtn");
    repartirBtn.addEventListener("click", () => {
        updateTasks(["Maman", "Papa"]); // Répartir à nouveau avec les participants supplémentaires
    });
});
