import requests

def pobierz_kursy():
    url="http://api.nbp.pl/api/exchangerates/tables/A/?format=json"
    try:
        response = requests.get(url,timeout=5)
        response.raise_for_status()
        dane = response.json()
        kursy = dane[0]['rates']
        return kursy
    except requests.RequestException:
        return None