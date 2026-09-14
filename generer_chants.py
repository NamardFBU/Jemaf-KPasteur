from pathlib import Path
import json
import re


# ============================================================
# DOSSIERS
# ============================================================

BASE = Path(__file__).resolve().parent

DOSSIER_MP3 = BASE / "mp3"
DOSSIER_PDF = BASE / "pdf"

FICHIER_SORTIE = BASE / "chants.json"


# ============================================================
# FONCTION POUR TRANSFORMER LE NOM EN TITRE
# ============================================================

def titre_affichage(titre):
    """
    Transforme les underscores en espaces.

    Exemple :
    Dieu_bénit
    devient :
    Dieu bénit
    """

    return titre.replace("_", " ")


# ============================================================
# LECTURE DES CHANTS
# ============================================================

chants = []
problemes = []

for fichier_mp3 in DOSSIER_MP3.iterdir():

    # On ne s'intéresse qu'aux fichiers MP3
    if not fichier_mp3.is_file():
        continue

    if fichier_mp3.suffix.lower() != ".mp3":
        continue

    nom_sans_extension = fichier_mp3.stem

    # --------------------------------------------------------
    # Recherche du numéro au début du nom
    #
    # Exemples acceptés :
    # 1-Tu_avais_tout
    # 10-A_toi
    # 101-Heureux_l'homme
    # --------------------------------------------------------

    correspondance = re.match(r"^(\d+)\s*[-_]\s*(.+)$", nom_sans_extension)

    if not correspondance:
        problemes.append(
            f"Nom MP3 non reconnu : {fichier_mp3.name}"
        )
        continue

    numero = int(correspondance.group(1))
    titre_original = correspondance.group(2)

    titre = titre_affichage(titre_original)

    # --------------------------------------------------------
    # Recherche du PDF correspondant
    # --------------------------------------------------------

    fichier_pdf = DOSSIER_PDF / f"{nom_sans_extension}.pdf"

    if not fichier_pdf.exists():
        problemes.append(
            f"PDF manquant pour : {fichier_mp3.name}"
        )
        chemin_pdf = ""
    else:
        chemin_pdf = f"pdf/{fichier_pdf.name}"

    # --------------------------------------------------------
    # Ajout du chant
    # --------------------------------------------------------

    chants.append(
        {
            "numero": numero,
            "titre": titre,
            "mp3": f"mp3/{fichier_mp3.name}",
            "pdf": chemin_pdf
        }
    )


# ============================================================
# TRI PAR NUMERO
# ============================================================

chants.sort(key=lambda chant: chant["numero"])


# ============================================================
# CREATION DU FICHIER JSON
# ============================================================

with open(FICHIER_SORTIE, "w", encoding="utf-8") as fichier:

    json.dump(
        chants,
        fichier,
        ensure_ascii=False,
        indent=2
    )


# ============================================================
# AFFICHAGE DU RESULTAT
# ============================================================

print()
print("=" * 60)
print("GENERATION DE LA LISTE DES CHANTS")
print("=" * 60)
print()

print(f"Nombre de fichiers MP3 trouvés : {len(chants)}")

print(f"Fichier créé : {FICHIER_SORTIE.name}")

print()

if problemes:

    print("ATTENTION :")
    print()

    for probleme in problemes:
        print(" -", probleme)

    print()
    print(f"Nombre de problèmes : {len(problemes)}")

else:

    print("Aucun problème détecté.")

print()
print("=" * 60)