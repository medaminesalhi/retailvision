from django.urls import path
from .views import process_image, process_video, history_images, history_videos

urlpatterns = [
    path('process-image/', process_image, name='process_image'),
    path('process-video/', process_video, name='process_video'),
    path('history-images/',  history_images,  name='history_images'),
    path('history-videos/',  history_videos,  name='history_videos'),
]
