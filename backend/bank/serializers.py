from rest_framework import serializers
from .models import Przelew, Konto
from django.db import transaction
import random
from django.contrib.auth.models import User

class PrzelewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Przelew
        fields = '__all__'
    def validate(self, data):
        if data['nadawca'].saldo < data['kwota']:
            raise serializers.ValidationError("Niewystarczające środki na koncie")
        if data['nadawca'] == data['odbiorca']:
            raise serializers.ValidationError("Nie możesz wysłać przelewu na swoje konto")
        if data['nadawca'].status_konta == 'zablokowane':
            raise serializers.ValidationError("Twoje konto jest nieaktywne")
        if data['odbiorca'].status_konta == 'zablokowane':
            raise serializers.ValidationError("Konto odbiorcy jest nieaktywne")
        return data
    def create(self, data):
        try:
            with transaction.atomic():
                data['nadawca'].saldo -= data['kwota']
                data['nadawca'].save()
                data['odbiorca'].saldo += data['kwota']
                data['odbiorca'].save()
                return Przelew.objects.create(**data)
        except Exception as e:
            raise serializers.ValidationError({"error": "Błąd krytyczny transakcji", "details": str(e)})

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}
    def validate(self,data):
        if len(data['password']) < 8:
            raise serializers.ValidationError("Hasło musi mieć przynajmniej 8 znaków")
        if not any(char.isdigit() for char in data['password']):
            raise serializers.ValidationError("Hasło musi zawierać cyfry")
        return data
    def create(self, data):
        with transaction.atomic():
            haslo = data.pop('password')
            uzytkownik = User.objects.create(**data)
            uzytkownik.set_password(haslo)
            uzytkownik.save()
            losowy_numer_konta = "".join([str(random.randint(0, 9)) for _ in range(26)])
            Konto.objects.create(
                wlasciciel = uzytkownik,
                numer_konta = losowy_numer_konta,
                saldo = 0.00,
                status_konta = 'aktywne',
            )
            return uzytkownik

        