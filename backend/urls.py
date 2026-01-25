from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

from backend.bank.views import PrzelewViewSet, RejestracjaViewSet, KursyWalutView, StanKontaView, historia
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def health(_request):
    return JsonResponse({"ok": True})

router = routers.DefaultRouter()
router.register(r'przelewy', PrzelewViewSet, basename='przelew')
router.register(r'register', RejestracjaViewSet, basename='register')
router.register(r'kalkulator', KursyWalutView, basename='kalkulator')


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path('api/stan-konta/', StanKontaView.as_view(), name='stan_konta'),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/historia/', historia, name='historia'),
]
