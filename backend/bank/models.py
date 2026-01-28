from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Konto(models.Model):
    numer_konta = models.CharField(max_length=26, unique=True)
    wlasciciel = models.ForeignKey(User, on_delete=models.CASCADE)
    saldo = models.DecimalField(max_digits=15,decimal_places=2, default = 0)
    status_konta = models.CharField(max_length=11, choices=[('aktywne', 'Aktywne'), ('zablokowane', 'Zablokowane')], default='aktywne')

class Przelew(models.Model):
    tytul = models.CharField(max_length=50, default="Przelew krajowy")
    nadawca = models.ForeignKey(Konto, on_delete=models.CASCADE, related_name='wychodzace')
    odbiorca = models.ForeignKey(Konto, on_delete=models.CASCADE, related_name='przychodzace')
    kwota = models.DecimalField(max_digits=15,decimal_places=2)
    data = models.DateTimeField(auto_now_add=True)