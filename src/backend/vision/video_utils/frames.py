import cv2
import os

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
            frame_path = os.path.join(output_dir, f"frame_{count}.jpg")
            cv2.imwrite(frame_path, frame)
            saved_paths.append('/media/frames/' + f"frame_{count}.jpg")
        count += 1

    cap.release()
    return saved_paths
