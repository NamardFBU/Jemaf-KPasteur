// --------------------------------------------------------
// CHARGEMENT DES CHANTS
// --------------------------------------------------------

let chants = [];


// --------------------------------------------------------
// AMPLIFICATION AUDIO
// --------------------------------------------------------

let contexteAudio = null;

function preparerAmplification(audio) {
    const AudioContextDisponible =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextDisponible) {
        return false;
    }

    // Chaque élément audio ne doit être connecté qu'une seule fois.
    if (audio.dataset.amplificationPreparee === "oui") {
        return true;
    }

    try {
        if (!contexteAudio) {
            contexteAudio = new AudioContextDisponible();
        }

        const sourceAudio =
            contexteAudio.createMediaElementSource(audio);

        const gainAudio =
            contexteAudio.createGain();

        const compresseurAudio =
            contexteAudio.createDynamicsCompressor();

        // Amplification de base : x1,8.
        gainAudio.gain.value = 1.8;

        // Réduction des crêtes pour limiter le risque de saturation.
        compresseurAudio.threshold.value = -10;
        compresseurAudio.knee.value = 6;
        compresseurAudio.ratio.value = 12;
        compresseurAudio.attack.value = 0.003;
        compresseurAudio.release.value = 0.25;

        // Chaîne audio : amplification puis compression.
        sourceAudio.connect(gainAudio);
        gainAudio.connect(compresseurAudio);
        compresseurAudio.connect(contexteAudio.destination);

        audio.dataset.amplificationPreparee = "oui";

        return true;

    } catch (error) {
        console.error(
            "Impossible d'activer l'amplification audio :",
            error
        );

        return false;
    }
}


// --------------------------------------------------------
// INDICATION AU-DESSUS DES RESULTATS
// --------------------------------------------------------

const aideResultats =
    document.querySelector(".aide-resultats");

if (aideResultats) {
    aideResultats.innerHTML =
        '<span class="fleche-aide">➡️</span>' +
        '<span>Cliquez sur le résultat ci-dessous, et voir en bas le lecteur :</span>';
}


// --------------------------------------------------------
// NORMALISATION DU TEXTE
// --------------------------------------------------------

function normaliserTexte(texte) {
    return texte
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}


// --------------------------------------------------------
// CHARGEMENT DU FICHIER JSON
// --------------------------------------------------------

fetch("chants.json")
    .then(response => response.json())
    .then(data => {
        chants = data;
        remplirListeChants();
    })
    .catch(error => {
        console.error(
            "Erreur lors du chargement des chants :",
            error
        );
    });


// --------------------------------------------------------
// REMPLISSAGE DE LA LISTE DEROULANTE
// --------------------------------------------------------

function remplirListeChants() {
    const select =
        document.getElementById("chant");

    if (!select) {
        return;
    }

    chants.forEach(chant => {
        const option =
            document.createElement("option");

        option.value =
            chant.numero;

        option.textContent =
            chant.numero +
            " - " +
            chant.titre.replace(/_/g, " ");

        select.appendChild(option);
    });
}


// --------------------------------------------------------
// RECHERCHE PAR NUMERO
// --------------------------------------------------------

const boutonNumero =
    document.getElementById("boutonNumero");

const champNumero =
    document.getElementById("numero");

if (boutonNumero) {
    boutonNumero.addEventListener(
        "click",
        rechercherParNumero
    );
}

if (champNumero) {
    champNumero.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                rechercherParNumero();
            }
        }
    );
}

function rechercherParNumero() {
    const numero =
        champNumero.value.trim();

    if (!numero) {
        afficherResultats([]);
        return;
    }

    const resultats =
        chants.filter(
            chant =>
                String(chant.numero) === numero
        );

    afficherResultats(resultats);
}


// --------------------------------------------------------
// EFFACER LA RECHERCHE PAR NUMERO
// --------------------------------------------------------

const effacerNumero =
    document.getElementById("effacerNumero");

if (effacerNumero) {
    effacerNumero.addEventListener(
        "click",
        () => {
            champNumero.value = "";
            afficherResultats([]);
        }
    );
}


// --------------------------------------------------------
// RECHERCHE PAR MOT CLE
// --------------------------------------------------------

const boutonMotCle =
    document.getElementById("boutonMotCle");

const champMotCle =
    document.getElementById("motCle");

if (boutonMotCle) {
    boutonMotCle.addEventListener(
        "click",
        rechercherParMotCle
    );
}

if (champMotCle) {
    champMotCle.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                rechercherParMotCle();
            }
        }
    );
}

function rechercherParMotCle() {
    const recherche =
        normaliserTexte(
            champMotCle.value.trim()
        );

    if (!recherche) {
        afficherResultats([]);
        return;
    }

    const resultats =
        chants.filter(chant => {
            const titre =
                normaliserTexte(
                    chant.titre.replace(/_/g, " ")
                );

            const numero =
                String(chant.numero);

            return (
                titre.includes(recherche) ||
                numero.includes(recherche)
            );
        });

    afficherResultats(resultats);
}


// --------------------------------------------------------
// EFFACER LA RECHERCHE PAR MOT CLE
// --------------------------------------------------------

const effacerMotCle =
    document.getElementById("effacerMotCle");

if (effacerMotCle) {
    effacerMotCle.addEventListener(
        "click",
        () => {
            champMotCle.value = "";
            afficherResultats([]);
        }
    );
}


// --------------------------------------------------------
// LISTE DEROULANTE
// --------------------------------------------------------

const listeChants =
    document.getElementById("chant");

if (listeChants) {
    listeChants.addEventListener(
        "change",
        () => {
            const numero =
                listeChants.value;

            if (!numero) {
                return;
            }

            const chant =
                chants.find(
                    item =>
                        String(item.numero) === numero
                );

            if (chant) {
                afficherResultats([chant]);
            }
        }
    );
}


// --------------------------------------------------------
// BOUTON POUR EFFACER LA LISTE DEROULANTE
// --------------------------------------------------------

const boutonEffacerListe =
    document.getElementById("effacerChant");

if (boutonEffacerListe) {
    boutonEffacerListe.addEventListener(
        "click",
        () => {
            listeChants.value = "";
            afficherResultats([]);
        }
    );
}


// --------------------------------------------------------
// AFFICHAGE DES RESULTATS
// --------------------------------------------------------

function afficherResultats(resultats) {
    const conteneur =
        document.getElementById(
            "resultats-recherche"
        );

    if (!conteneur) {
        return;
    }

    conteneur.innerHTML = "";

    if (resultats.length === 0) {
        const message =
            document.createElement("p");

        message.textContent =
            "Aucun chant trouvé.";

        conteneur.appendChild(message);

        return;
    }

    resultats.forEach(chant => {
        const resultat =
            document.createElement("div");

        resultat.className =
            "resultat-chant";

        resultat.textContent =
            chant.numero +
            " - " +
            chant.titre.replace(/_/g, " ");

        resultat.addEventListener(
            "click",
            () => {
                afficherChant(chant);
            }
        );

        conteneur.appendChild(resultat);
    });
}


// --------------------------------------------------------
// AFFICHAGE DU CHANT SELECTIONNE
// --------------------------------------------------------

function afficherChant(chant) {
    const conteneur =
        document.getElementById(
            "chant-selectionne"
        );

    if (!conteneur) {
        return;
    }

    conteneur.innerHTML = "";

    // ----------------------------------------------------
    // TITRE
    // ----------------------------------------------------

    const titre =
        document.createElement("h2");

    titre.textContent =
        chant.numero +
        " - " +
        chant.titre.replace(/_/g, " ");

    conteneur.appendChild(titre);


    // ----------------------------------------------------
    // LECTEUR AUDIO
    // ----------------------------------------------------

    const audio =
        document.createElement("audio");

    audio.preload = "metadata";

    audio.src =
        chant.mp3;


    // ----------------------------------------------------
    // CONTENEUR DU LECTEUR
    // ----------------------------------------------------

    const lecteur =
        document.createElement("div");

    lecteur.className =
        "lecteur-audio";


    // ----------------------------------------------------
    // BOUTON PLAY / PAUSE
    // ----------------------------------------------------

    const boutonPlay =
        document.createElement("button");

    boutonPlay.className =
        "audio-button";

    boutonPlay.textContent =
        "▶";

    boutonPlay.addEventListener(
        "click",
        async () => {
            if (audio.paused) {

                // Préparer l'amplification au premier clic sur Lecture.
                // Cela respecte les restrictions audio des navigateurs,
                // notamment sur iPhone.
                preparerAmplification(audio);

                try {
                    if (
                        contexteAudio &&
                        contexteAudio.state === "suspended"
                    ) {
                        await contexteAudio.resume();
                    }

                    await audio.play();

                } catch (error) {
                    console.error(
                        "Erreur lors du démarrage de la lecture :",
                        error
                    );
                }

            } else {
                audio.pause();
            }
        }
    );

    audio.addEventListener(
        "play",
        () => {
            boutonPlay.textContent =
                "❚❚";
        }
    );

    audio.addEventListener(
        "pause",
        () => {
            boutonPlay.textContent =
                "▶";
        }
    );


    // ----------------------------------------------------
    // BOUTON STOP
    // ----------------------------------------------------

    const boutonStop =
        document.createElement("button");

    boutonStop.className =
        "audio-button";

    boutonStop.textContent =
        "■";

    boutonStop.addEventListener(
        "click",
        () => {
            audio.pause();
            audio.currentTime = 0;
        }
    );


    // ----------------------------------------------------
    // BARRE DE PROGRESSION
    // ----------------------------------------------------

    const barreProgression =
        document.createElement("input");

    barreProgression.type =
        "range";

    barreProgression.min =
        0;

    barreProgression.max =
        100;

    barreProgression.value =
        0;

    barreProgression.className =
        "progress-bar";

    barreProgression.addEventListener(
        "input",
        () => {
            if (audio.duration) {
                audio.currentTime =
                    (
                        barreProgression.value / 100
                    ) *
                    audio.duration;
            }
        }
    );

    audio.addEventListener(
        "timeupdate",
        () => {
            if (audio.duration) {
                barreProgression.value =
                    (
                        audio.currentTime /
                        audio.duration
                    ) *
                    100;
            }

            tempsEcoule.textContent =
                formaterTemps(
                    audio.currentTime
                );
        }
    );


    // ----------------------------------------------------
    // TEMPS
    // ----------------------------------------------------

    const tempsEcoule =
        document.createElement("span");

    tempsEcoule.className =
        "audio-time";

    tempsEcoule.textContent =
        "0:00";

    const tempsTotal =
        document.createElement("span");

    tempsTotal.className =
        "audio-time";

    tempsTotal.textContent =
        "0:00";

    audio.addEventListener(
        "loadedmetadata",
        () => {
            tempsTotal.textContent =
                formaterTemps(
                    audio.duration
                );
        }
    );


    // ----------------------------------------------------
    // VOLUME
    // ----------------------------------------------------

    const volumeContainer =
        document.createElement("div");

    volumeContainer.className =
        "volume-container";

    const volumeIcon =
        document.createElement("span");

    volumeIcon.className =
        "volume-icon";

    volumeIcon.textContent =
        "🔊";

    const volumeBar =
        document.createElement("input");

    volumeBar.type =
        "range";

    volumeBar.min =
        0;

    volumeBar.max =
        1;

    volumeBar.step =
        0.01;

    volumeBar.value =
        1;

    volumeBar.className =
        "volume-bar";

    volumeBar.addEventListener(
        "input",
        () => {
            audio.volume =
                volumeBar.value;

            if (audio.volume === 0) {
                volumeIcon.textContent =
                    "🔇";
            } else {
                volumeIcon.textContent =
                    "🔊";
            }
        }
    );

    volumeIcon.addEventListener(
        "click",
        () => {
            if (audio.muted) {
                audio.muted = false;

                volumeIcon.textContent =
                    "🔊";

            } else {
                audio.muted = true;

                volumeIcon.textContent =
                    "🔇";
            }
        }
    );

    volumeContainer.appendChild(
        volumeIcon
    );

    volumeContainer.appendChild(
        volumeBar
    );


    // ----------------------------------------------------
    // VITESSE DE LECTURE
    // ----------------------------------------------------

    const vitesse =
        document.createElement("select");

    vitesse.className =
        "speed-select";

    const vitesses = [
        ["0.5", "x0,50"],
        ["0.75", "x0,75"],
        ["1", "x1"],
        ["1.25", "x1,25"],
        ["1.5", "x1,50"]
    ];

    vitesses.forEach(
        valeur => {
            const option =
                document.createElement("option");

            option.value =
                valeur[0];

            option.textContent =
                valeur[1];

            if (valeur[0] === "1") {
                option.selected =
                    true;
            }

            vitesse.appendChild(option);
        }
    );

    vitesse.addEventListener(
        "change",
        () => {
            audio.playbackRate =
                Number(vitesse.value);
        }
    );


    // ----------------------------------------------------
    // ASSEMBLAGE DU LECTEUR
    // ----------------------------------------------------

    lecteur.appendChild(
        boutonPlay
    );

    lecteur.appendChild(
        boutonStop
    );

    lecteur.appendChild(
        tempsEcoule
    );

    lecteur.appendChild(
        barreProgression
    );

    lecteur.appendChild(
        tempsTotal
    );

    lecteur.appendChild(
        volumeContainer
    );

    lecteur.appendChild(
        vitesse
    );

    conteneur.appendChild(
        lecteur
    );

    conteneur.appendChild(
        audio
    );


    // ----------------------------------------------------
    // BOUTON TELECHARGEMENT PDF
    // ----------------------------------------------------

    const downloadPdfButton =
        document.createElement("button");

    downloadPdfButton.className =
        "download-button";

    downloadPdfButton.type =
        "button";

    downloadPdfButton.textContent =
        "Télécharger la partition PDF";

    downloadPdfButton.addEventListener(
        "click",
        async () => {
            try {
                const response =
                    await fetch(chant.pdf);

                if (!response.ok) {
                    throw new Error(
                        "Impossible de récupérer le PDF."
                    );
                }

                const blob =
                    await response.blob();

                const url =
                    URL.createObjectURL(blob);

                const lien =
                    document.createElement("a");

                lien.href =
                    url;

                lien.download =
                    chant.numero +
                    " - " +
                    chant.titre.replace(/_/g, " ") +
                    ".pdf";

                document.body.appendChild(lien);

                lien.click();

                lien.remove();

                setTimeout(
                    () => URL.revokeObjectURL(url),
                    1000
                );

            } catch (error) {
                console.error(
                    "Erreur lors du téléchargement du PDF :",
                    error
                );

                alert(
                    "Impossible de télécharger la partition PDF."
                );
            }
        }
    );

    conteneur.appendChild(
        downloadPdfButton
    );


    // ----------------------------------------------------
    // REMONTER VERS LE CHANT
    // ----------------------------------------------------

    conteneur.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// --------------------------------------------------------
// FORMATAGE DU TEMPS
// --------------------------------------------------------

function formaterTemps(secondes) {
    if (!Number.isFinite(secondes)) {
        return "0:00";
    }

    const minutes =
        Math.floor(
            secondes / 60
        );

    const secondesRestantes =
        Math.floor(
            secondes % 60
        );

    return (
        minutes +
        ":" +
        String(
            secondesRestantes
        ).padStart(2, "0")
    );
}