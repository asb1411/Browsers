from django.shortcuts import render
import os

# Create your views here.

def home(request):
    return render(request, 'index.html', {})

def startup(request):
    return render(request, 'startup.html', {})

def posenet(request):
    #os.system('python Browsers/ppmaster/webcam_demo.py --cam_id 0')
    return render(request, 'posenet.html', {})
