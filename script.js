const participants = ["Nathan", "Aaron", "Anna"];
const tasks = ["Cuisine", "Salon", "Véranda"];
let history = []; // Historique local

// Ordre de base
const baseAssignment = {
    "Cuisine": "Aaron",
    "Salon": "Anna",
    "Véranda": "Nathan"
};

// Fonction pour mélanger un tableau
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fonction pour obtenir l'ordre de base en fonction de la date
function getBaseAssignment() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi

    // Si c'est dimanche, retourne l'ordre de base
    if (dayOfWeek === 0) {
        return { ...baseAssignment };
    }

    // Sinon, retourne une répartition aléatoire basée sur les participants
    const shuffledParticipants = shuffle([...participants]);
    let dynamicAssignment = {};
    tasks.forEach((task, index) => {
        dynamicAssignment[task] = shuffledParticipants[index % shuffledParticipants.length];
    });
    return dynamicAssignment;
}

// Fonction pour afficher les tâches avec un menu déroulant
function displayAssignmentsWithDropdown(assignments) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Réinitialisez la liste

    for (let task in assignments) {
        let li = document.createElement("li");

        // Texte de la tâche
        let taskText = document.createElement("span");
        taskText.textContent = `${task}: `;

        // Menu déroulant
        let select = document.createElement("select");
        select.dataset.task = task; // Associez la tâche au menu déroulant
        [...participants, "Maman", "Papa"].forEach(participant => {
            let option = document.createElement("option");
            option.value = participant;
            option.textContent = participant;
            if (participant === assignments[task]) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        li.appendChild(taskText);
        li.appendChild(select);
        taskList.appendChild(li);
    }
}

function displayAssignments(assignments) {
    console.log("Affichage des tâches :", assignments);
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Réinitialisez la liste
    for (let task in assignments) {
        let li = document.createElement("li");
        li.textContent = `${task}: ${assignments[task]}`;
        taskList.appendChild(li);
    }
    console.log("Contenu HTML mis à jour :", taskList.innerHTML);
}

// Fonction pour rééquilibrer les tâches équitablement
function reequilibrerTaches() {
    const allTasks = Object.keys(baseAssignment);
    const shuffledParticipants = shuffle([...participants]); // Mélangez les participants
    let newAssignment = {};

    for (let i = 0; i < allTasks.length; i++) {
        newAssignment[allTasks[i]] = shuffledParticipants[i % shuffledParticipants.length];
    }

    // Affichez le résultat du rééquilibrage
    const resultDiv = document.getElementById("reequilibrageResult");
    resultDiv.innerHTML = "<h3>Rééquilibrage des tâches :</h3>";
    for (let task in newAssignment) {
        let p = document.createElement("p");
        p.textContent = `${task}: ${newAssignment[task]}`;
        resultDiv.appendChild(p);
    }

    console.log("Rééquilibrage effectué :", newAssignment);
}

// Fonction pour mettre à jour les tâches en fonction des sélections
function updateTasksFromDropdown() {
    const taskList = document.getElementById("taskList");
    const selects = taskList.querySelectorAll("select");
    let updatedAssignment = {};

    selects.forEach(select => {
        const task = select.dataset.task;
        const selectedParticipant = select.value;
        updatedAssignment[task] = selectedParticipant;
    });

    console.log("Mise à jour des tâches :", updatedAssignment);
    displayAssignmentsWithDropdown(updatedAssignment);
}

// Fonction pour sauvegarder l'historique dans un fichier
async function saveHistoryToFile() {
    const response = await fetch('/save-history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(history),
    });

    if (response.ok) {
        console.log("Historique sauvegardé avec succès !");
    } else {
        console.error("Erreur lors de la sauvegarde de l'historique.");
    }
}

// Fonction pour valider la répartition actuelle
function validateCurrentAssignment() {
    const taskList = document.getElementById("taskList");
    const selects = taskList.querySelectorAll("select");
    let validatedAssignment = {};

    selects.forEach(select => {
        const task = select.dataset.task;
        const selectedParticipant = select.value;
        validatedAssignment[task] = selectedParticipant;
    });

    // Ajoutez la répartition validée à l'historique
    history.push({
        date: new Date().toISOString(),
        assignment: validatedAssignment,
    });

    console.log("Répartition validée :", validatedAssignment);
    console.log("Historique mis à jour :", history);

    // Sauvegardez l'historique dans un fichier
    saveHistoryToFile();
}

// Initialisation de la page
document.addEventListener("DOMContentLoaded", () => {
    // Affichez l'ordre de base ou dynamique en fonction de la date
    const initialAssignment = getBaseAssignment();
    displayAssignmentsWithDropdown(initialAssignment);

    // Ajoutez un gestionnaire d'événements pour le bouton "Rééquilibrer"
    const reequilibrerBtn = document.getElementById("reequilibrerBtn");
    reequilibrerBtn.addEventListener("click", () => {
        reequilibrerTaches();
    });

    // Ajoutez un gestionnaire d'événements pour mettre à jour les tâches depuis les menus déroulants
    const taskList = document.getElementById("taskList");
    taskList.addEventListener("change", () => {
        updateTasksFromDropdown();
    });

    // Ajoutez un gestionnaire d'événements pour le bouton "Valider"
    const validateBtn = document.getElementById("validateBtn");
    validateBtn.addEventListener("click", () => {
        validateCurrentAssignment();
    });
});
