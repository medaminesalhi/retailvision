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
| Utilities  | OpenCV, PyMongo, ImageIO, python-dotenv |

---

## ⚙️ How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/medaminesalhi/retailvision.git
cd retailvision
```

---

### 2. Frontend Setup (React)

```bash
cd retailvision-frontend
npm install
npm start
```

The frontend will be available at:  
`http://localhost:3000/`

---

### 3. Backend Setup (Django)

```bash
cd ../retailvision-backend
pip install -r requirements.txt
python manage.py runserver
```

The Django REST API will be available at:  
`http://localhost:8000/api/`

---

## 🧾 MongoDB Notice

> ⚠️ This project uses a **MongoDB instance running locally**.
>
> Please ensure MongoDB is installed and running on the default port:
> `mongodb://localhost:27017`

---

## 🗂️ Project Structure

```
retailvision/
├── retailvision-frontend/    # React application
│   └── src/
│       └── components/      # React components
├── retailvision-backend/     # Django application
│   └── vision/               # YOLOv8 + OCR logic
├── media/                    # Uploaded images and videos
├── .gitignore
└── README.md
```

---

## 👤 Author

- **Name:** Med Amine Salhi  

This project is intended for educational and research purposes.
