import os
from ultralytics import YOLO

# Chargez votre modèle une seule fois à l’import
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../best.pt")
yolo_model = YOLO(MODEL_PATH)

def run_yolo_on_frame(frame_path: str) -> list[str]:
    """
    Exécute YOLOv8 sur l’image frame_path, 
    et renvoie la liste des noms de classes détectées (sans doublons).
    """
    # inference
    result = yolo_model(frame_path)[0]
    if not result.boxes:
        return []
    class_ids = result.boxes.cls.tolist()
    return list({ yolo_model.names[int(cid)] for cid in class_ids })
