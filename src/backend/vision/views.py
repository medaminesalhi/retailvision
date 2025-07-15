from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
import os
import datetime
import cv2
from .video_utils.yolo_utils import run_yolo_on_frame
from .video_utils.ocr_utils import run_ocr_on_frame
from ultralytics import YOLO
import easyocr
import pymongo
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from .utils.ocr_cleaner import nettoyer_et_corriger_ocr
import imageio

mongo_settings   = settings.MONGO_CONNECTION
mongo_client     = pymongo.MongoClient(mongo_settings['HOST'])
mongo_db         = mongo_client[mongo_settings['DB']]
image_collection = mongo_db[mongo_settings['IMAGE_COLLECTION']]
video_collection = mongo_db[mongo_settings['VIDEO_COLLECTION']]
def extract_frames(video_path, output_dir, frame_rate=1):
    cap = cv2.VideoCapture(video_path)
    count = 0
    saved_paths = []

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if int(cap.get(1)) % frame_rate == 0:
            frame_path = os.path.join(output_dir, f'frame_{count}.jpg')
            cv2.imwrite(frame_path, frame)
            saved_paths.append('/media/frames/' + f'frame_{count}.jpg')
            count += 1

    cap.release()
    return saved_paths
# Charger YOLO
model_path = os.path.join(os.path.dirname(__file__), "best.pt")
yolo_model = YOLO(model_path)

# Charger OCR
ocr_reader = easyocr.Reader(['en', 'ar'])

# Connexion MongoDB
import pymongo
from django.conf import settings

# 1) Récupère la config depuis settings
mongo_settings = settings.MONGO_CONNECTION

# 2) Crée le client et la base
mongo_client = pymongo.MongoClient(mongo_settings["HOST"])
mongo_db     = mongo_client[mongo_settings["DB"]]

# 3) Sélectionne les deux collections
image_collection = mongo_db[mongo_settings["IMAGE_COLLECTION"]]
video_collection = mongo_db[mongo_settings["VIDEO_COLLECTION"]]

@api_view(['POST'])
@parser_classes([MultiPartParser])
def process_image(request):
    image_file = request.FILES.get('image')
    source = request.POST.get('source', 'unknown')

    if not image_file:
        return JsonResponse({'error': 'Aucune image reçue.'}, status=400)

    try:
        # === 1. Sauvegarde de l'image originale ===
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"image_{timestamp}.jpg"
        save_path = os.path.join(settings.MEDIA_ROOT, filename)
        with open(save_path, 'wb+') as f:
            for chunk in image_file.chunks():
                f.write(chunk)

        # === 2. YOLOv8 Detection ===
        yolo_result = yolo_model(save_path)[0]
        class_ids = yolo_result.boxes.cls.tolist() if yolo_result.boxes is not None else []
        categories = list(set([yolo_model.names[int(cls)] for cls in class_ids]))

        # === 3. OCR Prétraitement avec OpenCV ===
        image = cv2.imread(save_path)
        image = cv2.bilateralFilter(image, 9, 75, 75)
        image = cv2.convertScaleAbs(image, alpha=1.2, beta=10)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # === 4. OCR Lecture ===
        results = ocr_reader.readtext(image_rgb)
        ocr_raw_list = []

        for (bbox, text, prob) in results:
            if text.strip():
                ocr_raw_list.append(text.strip())
                top_left = tuple(map(int, bbox[0]))
                bottom_right = tuple(map(int, bbox[2]))
                cv2.rectangle(image_rgb, top_left, bottom_right, (0, 255, 0), 2)
                cv2.putText(image_rgb, text, (top_left[0], top_left[1] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2)

        # === Nettoyage + Correction OCR ===
        from .utils.ocr_cleaner import nettoyer_et_corriger_ocr
        ocr_text_cleaned = nettoyer_et_corriger_ocr(ocr_raw_list)

        # === 5. Sauvegarder l'image annotée ===
        output_filename = f"annotated_{timestamp}.jpg"
        output_path = os.path.join(settings.MEDIA_ROOT, output_filename)
        cv2.imwrite(output_path, cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR))

        # === 6. Enregistrement MongoDB ===
        image_collection.insert_one({
            "date":       datetime.datetime.now(),
            "source":     source,                       # ex: "frontend"
            "image_path": f"{settings.MEDIA_URL}{filename}",
            "categories": categories,                   # liste de catégories YOLO
            "ocr_text":   ocr_text_cleaned,             # texte nettoyé + corrigé
        })

        # === 7. Réponse ===
        return JsonResponse({
            "image_path": f"{settings.MEDIA_URL}{output_filename}",
            "categories": categories,
            "ocr_text": ocr_text_cleaned
        })

    except Exception as e:
        return JsonResponse({'error': f'Erreur interne : {str(e)}'}, status=500)




import os, datetime, cv2
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from .video_utils.yolo_utils import run_yolo_on_frame
from .video_utils.ocr_utils  import run_ocr_on_frame
import pymongo

# connexion MongoDB
mongo_settings   = settings.MONGO_CONNECTION
mongo_client     = pymongo.MongoClient(mongo_settings['HOST'])
mongo_db         = mongo_client[mongo_settings['DB']]

# collection pour les vidéos
video_collection = mongo_db[mongo_settings['VIDEO_COLLECTION']]

@csrf_exempt
def process_video(request):
    if request.method != 'POST' or 'video' not in request.FILES:
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

    video_file = request.FILES['video']
    ts         = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    ext        = os.path.splitext(video_file.name)[1] or ".mp4"
    video_name = f"video_{ts}{ext}"
    video_path = os.path.join(settings.MEDIA_ROOT, 'videos', video_name)
    os.makedirs(os.path.dirname(video_path), exist_ok=True)

    # 1) Sauvegarde
    with open(video_path, 'wb+') as f:
        for chunk in video_file.chunks():
            f.write(chunk)

    # 2) Lecture
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return JsonResponse({'error': 'Impossible de lire la vidéo.'}, status=400)

    fps       = int(cap.get(cv2.CAP_PROP_FPS)) or 1
    base      = os.path.splitext(video_name)[0]
    frame_dir = os.path.join(settings.MEDIA_ROOT, 'frames', base)
    os.makedirs(frame_dir, exist_ok=True)

    frames = []
    idx    = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        # on prend 1 frame par seconde
        if int(cap.get(cv2.CAP_PROP_POS_FRAMES)) % fps == 0:
            fn = f"frame_{idx}.jpg"
            fp = os.path.join(frame_dir, fn)
            cv2.imwrite(fp, frame)

            frames.append({
                "frame": f"{settings.MEDIA_URL}frames/{base}/{fn}",
                "yolo":  run_yolo_on_frame(fp),
                "ocr":   run_ocr_on_frame(fp),
            })
            idx += 1

    cap.release()

    # 3) Enregistrement dans MongoDB
    video_collection.insert_one({
        "date":      datetime.datetime.now(),
        "video_url": f"{settings.MEDIA_URL}videos/{video_name}",
        "frames":    frames
    })

    # 4) Réponse au front
    return JsonResponse({
        "video_url": f"{settings.MEDIA_URL}videos/{video_name}",
        "frames":    frames
    })
from django.http import JsonResponse
from django.conf import settings
import datetime
import pymongo

# --- connexion MongoDB existante ---
mongo_settings   = settings.MONGO_CONNECTION
mongo_client     = pymongo.MongoClient(mongo_settings['HOST'])
mongo_db         = mongo_client[mongo_settings['DB']]
image_collection = mongo_db[mongo_settings['IMAGE_COLLECTION']]
video_collection = mongo_db[mongo_settings['VIDEO_COLLECTION']]


from django.views.decorators.http import require_GET

@require_GET
def history_images(request):
    docs = list(image_collection.find().sort('date', -1))
    results = []
    for d in docs:
        results.append({
            'id':         str(d.get('_id','')),
            'date':       d.get('date', datetime.datetime.now()).isoformat(),
            'image_path': d.get('image_path',''),
            'categories': d.get('categories', []),
            'ocr_text':   d.get('ocr_text', []),
        })
    return JsonResponse(results, safe=False)


@require_GET
def history_videos(request):
    docs = list(video_collection.find().sort('date', -1))
    results = []
    for d in docs:
        results.append({
            'id':        str(d.get('_id','')),
            'date':      d.get('date', datetime.datetime.now()).isoformat(),
            'video_url': d.get('video_url',''),
            'frames':    d.get('frames', []),
        })
    return JsonResponse(results, safe=False)
