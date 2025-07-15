
from paddleocr import PaddleOCR, draw_ocr
from PIL import Image
import os

# === Configuration OCR ===
ocr = PaddleOCR(use_angle_cls=True, lang='fr')  # Utilise le modèle français

# === Chemin vers l’image à tester ===
img_path = 'tes01.jpg'  # Remplace par le chemin réel de ton image

# === Exécuter OCR ===
print(f"[INFO] Lecture de l’image : {img_path}")
result = ocr.ocr(img_path, cls=True)

# === Afficher les textes détectés ===
print("\n=== Résultats OCR ===")
for idx, line in enumerate(result[0]):
    text = line[1][0]
    score = line[1][1]
    print(f"{idx+1}. {text} (confiance: {score:.2f})")

# === Dessiner l’image annotée ===
image = Image.open(img_path).convert('RGB')
boxes = [line[0] for line in result[0]]
txts = [line[1][0] for line in result[0]]
scores = [line[1][1] for line in result[0]]

# Générer une image avec annotations
image_with_box = draw_ocr(image, boxes, txts, scores, font_path='Arial.ttf')  # Tu peux changer la police
image_with_box = Image.fromarray(image_with_box)

# Sauvegarder ou afficher
output_path = 'image_resultat_ocr.jpg'
image_with_box.save(output_path)
print(f"\n[INFO] Image annotée enregistrée sous : {output_path}")
image_with_box.show()

