from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('startup', views.startup, name='startup'),
    path('posenet', views.posenet, name='posenet'),
]
