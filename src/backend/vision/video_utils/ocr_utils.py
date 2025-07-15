import easyocr
import cv2

# Instanciez le reader une seule fois
reader = easyocr.Reader(['en','ar'], gpu=False)

def run_ocr_on_frame(frame_path: str) -> list[str]:
    """
    Lit le texte dans la frame, renvoie la liste des chaînes OCR.
    """
    img = cv2.imread(frame_path)
    if img is None:
        return []
    # convert BGR→RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = reader.readtext(img)
    # on ne garde que le texte non vide
    return [text.strip() for (_, text, _) in results if text.strip()]
