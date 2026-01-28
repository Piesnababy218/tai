from rest_framework import serializers
from .models import Przelew, Konto
from django.db import transaction
import random
from django.contrib.auth.models import User

class PrzelewSerializer(serializers.ModelSerializer):
    odbiorca_nazwa = serializers.SerializerMethodField()
    nadawca_nazwa = serializers.SerializerMethodField()
    jest_wychodzacy = serializers.SerializerMethodField()
    nadawca = serializers.PrimaryKeyRelatedField(queryset=Konto.objects.all())
    odbiorca = serializers.PrimaryKeyRelatedField(queryset=Konto.objects.all())
    
    class Meta:
        model = Przelew
        fields = ['id', 'tytul', 'kwota', 'data', 'nadawca', 'nadawca_nazwa', 'odbiorca', 'odbiorca_nazwa', 'jest_wychodzacy']
    
    def get_nadawca_nazwa(self, obj):
        return obj.nadawca.wlasciciel.email
    
    def get_odbiorca_nazwa(self, obj):
        return obj.odbiorca.wlasciciel.email
    
    def get_jest_wychodzacy(self, obj):
        user = self.context['request'].user
        return obj.nadawca.wlasciciel.id == user.id
    
    def validate(self, data):
        user = self.context['request'].user
        if data['nadawca'].wlasciciel != user:
            raise serializers.ValidationError("Nie możesz wysłać pieniędzy z cudzego konta")
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
                nadawca = data['nadawca']
                odbiorca = data['odbiorca']
                kwota = data['kwota']         
                nadawca.saldo -= kwota
                nadawca.save()
                
                odbiorca.saldo += kwota
                odbiorca.save()                
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