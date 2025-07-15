# 🛍️ RetailVision – Computer Vision Platform with React, Django & YOLOv8

RetailVision is a full-stack computer vision application that uses **YOLOv8** for object detection and **EasyOCR** for text extraction. It is built with a **React frontend**, a **Django backend**, and stores results in a **local MongoDB database**.

---

## 🚀 Features

- 🎯 Real-time object detection using YOLOv8
- 🧠 OCR (Optical Character Recognition) via EasyOCR
- 🔌 Django REST API for backend logic
- 💻 React frontend with Tailwind CSS
- 🗃️ Data stored in local MongoDB instance
- 📁 Image and video frame extraction (OpenCV)

---

## 🛠️ Technologies Used

| Layer      | Stack                                   |
|------------|------------------------------------------|
| Frontend   | React, Tailwind CSS                     |
| Backend    | Django, Django REST Framework           |
| AI Models  | YOLOv8 (via Ultralytics), EasyOCR       |
| Database   | MongoDB (running locally)               |
| Utilities  | OpenCV, PyMongo, ImageIO, dotenv        |

---

## ⚙️ How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/medaminesalhi/retailvision.git
cd retailvision
2. Frontend Setup (React)
bash
Copier
Modifier
cd retailvision-frontend
npm install
npm start
This will launch the frontend at http://localhost:3000/.

3. Backend Setup (Django)
bash
Copier
Modifier
cd ../retailvision-backend
pip install -r requirements.txt
python manage.py runserver
Django API will run at http://localhost:8000/api/.
