const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Endpoint pour sauvegarder l'historique
app.post('/save-history', (req, res) => {
    const history = req.body;

    fs.writeFile('historique.json', JSON.stringify(history, null, 2), (err) => {
        if (err) {
            console.error("Erreur lors de la sauvegarde :", err);
            res.status(500).send("Erreur lors de la sauvegarde.");
        } else {
            console.log("Historique sauvegardé avec succès !");
            res.status(200).send("Historique sauvegardé !");
        }
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});