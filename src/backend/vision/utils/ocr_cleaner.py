import re
from textblob import TextBlob # type: ignore

def nettoyer_texte_ocr_brut(texte):
    texte = texte.lower()
    texte = re.sub(r'[^\w\s]', '', texte)       # ponctuation
    texte = re.sub(r'\d+', '', texte)           # chiffres
    texte = re.sub(r'\s+', ' ', texte).strip()  # espaces
    return texte

def est_valide(mot):
    if len(mot) <= 2:
        return False
    if not mot.isalpha():
        return False
    if re.search(r'(.)\1{2,}', mot):  # ex: aaaa
        return False
    return True

def corriger_mot(mot):
    try:
        blob = TextBlob(mot)
        correction = str(blob.correct())
        return correction
    except:
        return mot

def nettoyer_et_corriger_ocr(ocr_list):
    texte_concatené = ' '.join(ocr_list)
    texte_nettoye = nettoyer_texte_ocr_brut(texte_concatené)
    mots = texte_nettoye.split()

    mots_corrigés = []
    for mot in mots:
        mot_corrigé = corriger_mot(mot)
        if est_valide(mot_corrigé):
            mots_corrigés.append(mot_corrigé)

    return list(dict.fromkeys(mots_corrigés))  # sans doublons
