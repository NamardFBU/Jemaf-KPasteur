let chants = [];


// ============================================================
// ELEMENTS HTML
// ============================================================

const numeroInput =
    document.getElementById("numero");

const motCleInput =
    document.getElementById("motCle");

const chantSelect =
    document.getElementById("chant");

const boutonNumero =
    document.getElementById("boutonNumero");

const boutonMotCle =
    document.getElementById("boutonMotCle");

const effacerNumero =
    document.getElementById("effacerNumero");

const effacerMotCle =
    document.getElementById("effacerMotCle");

const effacerChant =
    document.getElementById("effacerChant");

const resultatsRecherche =
    document.getElementById("resultats-recherche");


// ============================================================
// CHARGEMENT DE LA LISTE DES CHANTS
// ============================================================

fetch("chants.json")
    .then(response => {

        if (!response.ok) {
            throw new Error(
                "Impossible de charger chants.json"
            );
        }

        return response.json();

    })
    .then(data => {

        chants = data;

        afficherListe();

    })
    .catch(error => {

        console.error(error);

        afficherMessage(
            "Erreur lors du chargement de la liste des chants."
        );

    });


// ============================================================
// AFFICHER LA LISTE DANS LA LISTE DEROUlANTE
// ============================================================

function afficherListe() {

    chants.forEach(chant => {

        const option =
            document.createElement("option");

        option.value = chant.numero;

        option.textContent =
            chant.numero + " - " + chant.titre;

        chantSelect.appendChild(option);

    });

}


// ============================================================
// NORMALISER UN TEXTE
// ============================================================

function normaliserTexte(texte) {

    return texte
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

}


// ============================================================
// RECHERCHE PAR NUMERO
// ============================================================

function rechercherNumero() {

    const numero =
        numeroInput.value.trim();

    if (numero === "") {

        afficherMessage(
            "Veuillez entrer un numéro de chant."
        );

        return;
    }

    const resultat =
        chants.find(
            chant =>
                String(chant.numero) === numero
        );

    if (!resultat) {

        afficherMessage(
            "Aucun chant ne correspond à ce numéro."
        );

        return;
    }

    afficherResultats([resultat]);

}


// ============================================================
// RECHERCHE PAR MOT-CLE
// ============================================================

function rechercherMotCle() {

    const motCle =
        normaliserTexte(
            motCleInput.value.trim()
        );

    if (motCle === "") {

        afficherMessage(
            "Veuillez entrer un mot-clé."
        );

        return;
    }

    const resultats =
        chants.filter(chant => {

            const titre =
                normaliserTexte(chant.titre);

            return titre.includes(motCle);

        });

    if (resultats.length === 0) {

        afficherMessage(
            "Aucun chant ne correspond à votre recherche."
        );

        return;
    }

    afficherResultats(resultats);

}


// ============================================================
// AFFICHER LES RESULTATS
// ============================================================

function afficherResultats(resultats) {

    resultatsRecherche.innerHTML = "";

    resultats.forEach(chant => {

        const bouton =
            document.createElement("button");

        bouton.type = "button";

        bouton.className =
            "resultat-recherche";

        bouton.textContent =
            chant.numero + " - " + chant.titre;

        bouton.addEventListener(
            "click",
            () => {

                afficherChant(chant);

                supprimerResultat();

            }
        );

        resultatsRecherche.appendChild(
            bouton
        );

    });

}


// ============================================================
// MESSAGE DE RECHERCHE
// ============================================================

function afficherMessage(message) {

    resultatsRecherche.innerHTML = "";

    const texte =
        document.createElement("div");

    texte.className =
        "message-recherche";

    texte.textContent =
        message;

    resultatsRecherche.appendChild(
        texte
    );

}


// ============================================================
// EFFACER LES RESULTATS
// ============================================================

function supprimerResultat() {

    resultatsRecherche.innerHTML = "";

}


// ============================================================
// BOUTON X — NUMERO
// ============================================================

effacerNumero.addEventListener(
    "click",
    () => {

        numeroInput.value = "";

        supprimerResultat();

    }
);


// ============================================================
// BOUTON X — MOT-CLE
// ============================================================

effacerMotCle.addEventListener(
    "click",
    () => {

        motCleInput.value = "";

        supprimerResultat();

    }
);


// ============================================================
// BOUTON X — LISTE DES CHANTS
// ============================================================

effacerChant.addEventListener(
    "click",
    () => {

        chantSelect.value = "";

        supprimerResultat();

    }
);


// ============================================================
// SELECTION DANS LA LISTE
// ============================================================

chantSelect.addEventListener(
    "change",
    () => {

        const numero =
            chantSelect.value;

        if (numero === "") {

            supprimerResultat();

            return;
        }

        const chant =
            chants.find(
                element =>
                    String(element.numero) === numero
            );

        if (chant) {

            afficherChant(chant);

        }

    }
);


// ============================================================
// BOUTON RECHERCHE PAR NUMERO
// ============================================================

boutonNumero.addEventListener(
    "click",
    rechercherNumero
);


// ============================================================
// BOUTON RECHERCHE PAR MOT-CLE
// ============================================================

boutonMotCle.addEventListener(
    "click",
    rechercherMotCle
);


// ============================================================
// TOUCHE ENTREE — NUMERO
// ============================================================

numeroInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            rechercherNumero();

        }

    }
);


// ============================================================
// TOUCHE ENTREE — MOT-CLE
// ============================================================

motCleInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            rechercherMotCle();

        }

    }
);


// ============================================================
// FORMATER LE TEMPS
// ============================================================

function formaterTemps(secondes) {

    if (!Number.isFinite(secondes)) {
        return "0:00";
    }

    const minutes =
        Math.floor(secondes / 60);

    const secondesRestantes =
        Math.floor(secondes % 60);

    return (
        minutes +
        ":" +
        String(secondesRestantes).padStart(2, "0")
    );

}


// ============================================================
// AFFICHER UN CHANT
// ============================================================

function afficherChant(chant) {

    supprimerResultat();

    const ancienResultat =
        document.querySelector(".result");

    if (ancienResultat) {
        ancienResultat.remove();
    }


    const result =
        document.createElement("div");

    result.className = "result";


    // --------------------------------------------------------
    // TITRE
    // --------------------------------------------------------

    const titre =
        document.createElement("h2");

    titre.textContent =
        chant.numero + " - " + chant.titre;

    result.appendChild(titre);


    // --------------------------------------------------------
    // LECTEUR AUDIO
    // --------------------------------------------------------

    const audioPlayer =
        document.createElement("div");

    audioPlayer.className =
        "audio-player";


    const audio =
        document.createElement("audio");

    // IMPORTANT :
    // chants.json contient déjà le chemin complet du MP3
    audio.src =
        chant.mp3;

    audio.preload =
        "metadata";


    // --------------------------------------------------------
    // CONTROLES
    // --------------------------------------------------------

    const audioControls =
        document.createElement("div");

    audioControls.className =
        "audio-controls";


    // --------------------------------------------------------
    // BOUTON PLAY / PAUSE
    // --------------------------------------------------------

    const playButton =
        document.createElement("button");

    playButton.type = "button";

    playButton.className =
        "player-button";

    playButton.textContent =
        "▶";

    playButton.title =
        "Lecture / Pause";


    playButton.addEventListener(
        "click",
        () => {

            if (audio.paused) {

                audio.play()
                    .catch(error => {

                        console.error(
                            "Erreur de lecture MP3 :",
                            error
                        );

                    });

            } else {

                audio.pause();

            }

        }
    );


    // --------------------------------------------------------
    // BOUTON STOP
    // --------------------------------------------------------

    const stopButton =
        document.createElement("button");

    stopButton.type = "button";

    stopButton.className =
        "player-button";

    stopButton.textContent =
        "■";

    stopButton.title =
        "Arrêter";


    stopButton.addEventListener(
        "click",
        () => {

            audio.pause();

            audio.currentTime = 0;

            playButton.textContent =
                "▶";

            currentTime.textContent =
                "0:00";

            progressBar.value =
                "0";

        }
    );


    // --------------------------------------------------------
    // TEMPS ACTUEL
    // --------------------------------------------------------

    const currentTime =
        document.createElement("span");

    currentTime.className =
        "time";

    currentTime.textContent =
        "0:00";


    // --------------------------------------------------------
    // BARRE DE PROGRESSION
    // --------------------------------------------------------

    const progressBar =
        document.createElement("input");

    progressBar.type =
        "range";

    progressBar.className =
        "progress-bar";

    progressBar.min =
        "0";

    progressBar.max =
        "100";

    progressBar.value =
        "0";

    progressBar.step =
        "0.1";

    progressBar.title =
        "Position dans le morceau";


    progressBar.addEventListener(
        "input",
        () => {

            if (Number.isFinite(audio.duration)) {

                audio.currentTime =
                    audio.duration *
                    (
                        parseFloat(
                            progressBar.value
                        ) / 100
                    );

            }

        }
    );


    // --------------------------------------------------------
    // DUREE TOTALE
    // --------------------------------------------------------

    const totalTime =
        document.createElement("span");

    totalTime.className =
        "time";

    totalTime.textContent =
        "0:00";


    // --------------------------------------------------------
    // CONTENEUR PROGRESSION
    // --------------------------------------------------------

    const progressContainer =
        document.createElement("div");

    progressContainer.className =
        "progress-container";

    progressContainer.appendChild(
        currentTime
    );

    progressContainer.appendChild(
        progressBar
    );

    progressContainer.appendChild(
        totalTime
    );


    // --------------------------------------------------------
    // VOLUME
    // --------------------------------------------------------

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

    volumeIcon.title =
        "Couper le son";


    const volumeBar =
        document.createElement("input");

    volumeBar.type =
        "range";

    volumeBar.className =
        "volume-bar";

    volumeBar.min =
        "0";

    volumeBar.max =
        "1";

    volumeBar.step =
        "0.01";

    volumeBar.value =
        "1";

    volumeBar.title =
        "Volume";


    // On force le volume initial à 100 %
    audio.volume = 1;


    volumeIcon.addEventListener(
        "click",
        () => {

            if (audio.muted) {

                audio.muted = false;

                volumeIcon.textContent =
                    "🔊";

                volumeIcon.title =
                    "Couper le son";

            } else {

                audio.muted = true;

                volumeIcon.textContent =
                    "🔇";

                volumeIcon.title =
                    "Rétablir le son";

            }

        }
    );


    volumeBar.addEventListener(
        "input",
        () => {

            const nouveauVolume =
                Math.min(
                    1,
                    Math.max(
                        0,
                        parseFloat(
                            volumeBar.value
                        )
                    )
                );

            audio.volume =
                nouveauVolume;

            if (nouveauVolume === 0) {

                audio.muted = true;

                volumeIcon.textContent =
                    "🔇";

                volumeIcon.title =
                    "Rétablir le son";

            } else {

                audio.muted = false;

                volumeIcon.textContent =
                    "🔊";

                volumeIcon.title =
                    "Couper le son";

            }

        }
    );


    volumeContainer.appendChild(
        volumeIcon
    );

    volumeContainer.appendChild(
        volumeBar
    );


    // --------------------------------------------------------
    // VITESSE
    // --------------------------------------------------------

    const speedSelect =
        document.createElement("select");

    speedSelect.className =
        "speed-select";

    speedSelect.title =
        "Vitesse de lecture";


    const vitesses = [
        {
            valeur: "0.5",
            texte: "x0,50"
        },
        {
            valeur: "0.75",
            texte: "x0,75"
        },
        {
            valeur: "1",
            texte: "x1"
        },
        {
            valeur: "1.25",
            texte: "x1,25"
        },
        {
            valeur: "1.5",
            texte: "x1,50"
        }
    ];


    vitesses.forEach(
        vitesse => {

            const option =
                document.createElement("option");

            option.value =
                vitesse.valeur;

            option.textContent =
                vitesse.texte;

            if (vitesse.valeur === "1") {

                option.selected =
                    true;

            }

            speedSelect.appendChild(
                option
            );

        }
    );


    speedSelect.addEventListener(
        "change",
        () => {

            audio.playbackRate =
                parseFloat(
                    speedSelect.value
                );

        }
    );


    // --------------------------------------------------------
    // ASSEMBLAGE DES CONTROLES
    // --------------------------------------------------------

    audioControls.appendChild(
        playButton
    );

    audioControls.appendChild(
        stopButton
    );

    audioControls.appendChild(
        progressContainer
    );

    audioControls.appendChild(
        volumeContainer
    );

    audioControls.appendChild(
        speedSelect
    );


    audioPlayer.appendChild(
        audioControls
    );


    // --------------------------------------------------------
    // EVENEMENTS AUDIO
    // --------------------------------------------------------

    audio.addEventListener(
        "loadedmetadata",
        () => {

            totalTime.textContent =
                formaterTemps(
                    audio.duration
                );

            audio.volume =
                1;

            volumeBar.value =
                "1";

            audio.muted =
                false;

            volumeIcon.textContent =
                "🔊";

            volumeIcon.title =
                "Couper le son";

            audio.playbackRate =
                1;

            speedSelect.value =
                "1";

        }
    );


    audio.addEventListener(
        "timeupdate",
        () => {

            currentTime.textContent =
                formaterTemps(
                    audio.currentTime
                );

            if (
                Number.isFinite(audio.duration) &&
                audio.duration > 0
            ) {

                progressBar.value =
                    (
                        audio.currentTime /
                        audio.duration *
                        100
                    );

            }

        }
    );


    audio.addEventListener(
        "play",
        () => {

            playButton.textContent =
                "❚❚";

        }
    );


    audio.addEventListener(
        "pause",
        () => {

            playButton.textContent =
                "▶";

        }
    );


    audio.addEventListener(
        "ended",
        () => {

            playButton.textContent =
                "▶";

            progressBar.value =
                "0";

            currentTime.textContent =
                "0:00";

        }
    );


    audio.addEventListener(
        "error",
        () => {

            console.error(
                "Impossible de charger le MP3 :",
                chant.mp3
            );

        }
    );


    // --------------------------------------------------------
    // AJOUT DU LECTEUR
    // --------------------------------------------------------

    result.appendChild(
        audioPlayer
    );


    // --------------------------------------------------------
    // BOUTON TELECHARGEMENT MP3
    // --------------------------------------------------------

    const downloadMp3Button =
        document.createElement("a");

    downloadMp3Button.className =
        "download-button";

    downloadMp3Button.href =
        chant.mp3;

    downloadMp3Button.download =
        "";

    downloadMp3Button.textContent =
        "Télécharger le MP3";

    result.appendChild(
        downloadMp3Button
    );


    // --------------------------------------------------------
    // BOUTON TELECHARGEMENT PDF
    // --------------------------------------------------------

    const downloadPdfButton =
        document.createElement("a");

    downloadPdfButton.className =
        "download-button";

    downloadPdfButton.href =
        chant.pdf;

    downloadPdfButton.download =
        "";

    downloadPdfButton.textContent =
        "Télécharger la partition PDF";


    result.appendChild(
        downloadPdfButton
    );


    // --------------------------------------------------------
    // AJOUT DE LA ZONE DU CHANT A LA PAGE
    // --------------------------------------------------------

    document
        .querySelector(".search-box")
        .after(result);

}


// ============================================================
// FIN DU SCRIPT
// ============================================================