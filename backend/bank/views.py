from django.shortcuts import render
from .serializers import PrzelewSerializer, UserSerializer
from rest_framework import viewsets
from django.contrib.auth.models import User
from .models import Konto, Przelew
from rest_framework.permissions import AllowAny
# Create your views here.

class PrzelewViewSet(viewsets.ModelViewSet):
    queryset = Przelew.objects.all()
    serializer_class = PrzelewSerializer

class RejestracjaViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]