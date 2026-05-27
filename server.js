const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Permet au serveur de lire le format JSON
app.use(express.json());

// Sert les fichiers du dossier "public" (HTML, CSS, JS du joueur)
// Remplace 'public' par 'publique'
app.use(express.static(path.join(__dirname, 'publique')));

// Exemple de route dynamique : Sauvegarde des scores en mémoire (temporaire)
let scoresGlobaux = { victoiresX: 0, victoiresO: 0 };

app.get('/api/scores', (req, res) => {
    res.json(scoresGlobaux);
});

app.post('/api/scores/gagnant', (req, res) => {
    const { joueur } = req.body;
    if (joueur === 'X') scoresGlobaux.victoiresX++;
    if (joueur === 'O') scoresGlobaux.victoiresO++;
    res.json({ message: "Score mis à jour", scores: scoresGlobaux });
});

// Démarre le serveur
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
});
