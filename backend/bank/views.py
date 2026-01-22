from django.shortcuts import render
from .serializers import PrzelewSerializer, UserSerializer
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Konto, Przelew
from .services import pobierz_kursy

from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class PrzelewViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PrzelewSerializer
    def get_queryset(self):
        user = self.request.user
        return Przelew.objects.filter(
            Q(nadawca__wlasciciel=user) | Q(odbiorca__wlasciciel=user)
        )


class RejestracjaViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class KursyWalutView(viewsets.ViewSet):
    def list(self,request):
        kursy = pobierz_kursy()
        if kursy is None:
            return Response({"error": "Nie udało się pobrać kursów z NBP"})
        return Response(kursy)
    def create(self,request):
        dane = request.data
        try:
            kwota = float(dane.get('kwota', 0))
        except ValueError:
            return Response({"error": "Kwota musi być liczbą"},status=400)
        if kwota <= 0:
            return Response({"error": "Kwota musi być większa od 0"},status=400)
        kod_waluty = dane.get('kod', 'EUR')
        kierunek = dane.get('kierunek', 'na_pln')
        kursy = pobierz_kursy()
        kurs_info = next((item for item in kursy if item["code"] == kod_waluty),None)

        if kurs_info:
            if kierunek == "na_pln":
                wynik = kwota * kurs_info['mid']
            elif kierunek == "z_pln":
                wynik = kwota / kurs_info['mid']
            return Response({
                "kwota oryginalna": kwota,
                "waluta": kod_waluty,
                "kurs": kurs_info['mid'],
                "wynik": round(wynik,2)
            })
        return Response({"error": "Nie znaleziono waluty"}, status=400)