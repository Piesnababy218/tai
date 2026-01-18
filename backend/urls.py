from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from backend.bank.views import PrzelewViewSet, RejestracjaViewSet
from rest_framework import routers

def health(_request):
    return JsonResponse({"ok": True})

router = routers.DefaultRouter()
router.register(r'przelewy',PrzelewViewSet, basename='przelew')
router.register(r'register', RejestracjaViewSet, basename='register')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path('api/', include(router.urls)),
]
