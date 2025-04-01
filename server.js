const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route pour sauvegarder l'historique
app.post('/save-history', (req, res) => {
    const historyFilePath = path.join(__dirname, 'historique.json');
    const newHistory = req.body;

    fs.writeFile(historyFilePath, JSON.stringify(newHistory, null, 2), (err) => {
        if (err) {
            console.error("Erreur lors de la sauvegarde de l'historique :", err);
            return res.status(500).send("Erreur serveur");
        }
        res.status(200).send("Historique sauvegardé avec succès !");
    });
});

// Route pour servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Démarre le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});