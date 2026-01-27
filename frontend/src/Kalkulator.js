import { useState, useEffect } from 'react';
import './Kalkulator.css';

function Kalkulator({ setStrona, darkMode }) {
  const [kursy, setKursy] = useState([]);
  const [kwota, setKwota] = useState('');
  const [waluty, setWaluty] = useState('EUR');
  const [kierunek, setKierunek] = useState('na_pln');
  const [wynik, setWynik] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    pobierzKursy();
  }, []);

  useEffect(() => {
    setWynik(null);
  }, [kierunek, waluty]);

  const pobierzKursy = () => {
    fetch('https://tai-p2p7.onrender.com/api/kalkulator/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setKursy(data);
        setLoading(false);
        setError('');
      })
      .catch(err => {
        console.error('Błąd:', err);
        setError('Błąd ładowania kursów');
        setLoading(false);
      });
  };

  const oblicz = async () => {
    if (!kwota) {
      setError('Podaj kwotę');
      return;
    }

    try {
      const response = await fetch('https://tai-p2p7.onrender.com/api/kalkulator/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        body: JSON.stringify({
          kwota: parseFloat(kwota),
          kod: waluty,
          kierunek: kierunek
        })
      });

      if (!response.ok) {
        const text = await response.text();
        setError('Błąd: ' + text);
        return;
      }

      const data = await response.json();
      setWynik(data);
      setError('');
    } catch (err) {
      setError('Błąd obliczania: ' + err.message);
    }
  };

  return (
    <div className={`kalkulator-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="kalkulator-sidebar">
        <h2>Menu</h2>
        <button onClick={() => setStrona('dashboard')} className="kalkulator-button">Dashboard</button>
      </div>

      <div className={`kalkulator-content ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h1>Kalkulator Walut</h1>
        
        {error && <div className="kalkulator-error">{error}</div>}

        <div className={`kalkulator-card ${darkMode ? 'dark-mode' : 'light-mode'}`}>
          {loading ? (
            <p className="kalkulator-loading">Ładowanie kursów...</p>
          ) : (
            <>
              <div className="kalkulator-form-group">
                <label>Kwota</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={kwota}
                  onChange={(e) => setKwota(e.target.value)}
                  className={darkMode ? 'dark-mode' : ''}
                />
              </div>

              <div className="kalkulator-form-group">
                <label>Waluta</label>
                <select 
                  value={waluty}
                  onChange={(e) => setWaluty(e.target.value)}
                  className={darkMode ? 'dark-mode' : ''}
                >
                  {kursy.map((kurs) => (
                    <option key={kurs.code} value={kurs.code}>
                      {kurs.code} - {kurs.currency}
                    </option>
                  ))}
                </select>
              </div>

              <div className="kalkulator-form-group">
                <label>Kierunek konwersji</label>
                <select 
                  value={kierunek}
                  onChange={(e) => setKierunek(e.target.value)}
                  className={darkMode ? 'dark-mode' : ''}
                >
                  <option value="na_pln">Na PLN</option>
                  <option value="z_pln">Z PLN</option>
                </select>
              </div>

              <button 
                onClick={oblicz}
                className="kalkulator-calculate-button"
              >
                Oblicz
              </button>

              {wynik && (
                <div className={`kalkulator-result ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                  <h3>Wynik</h3>
                  <p>
                    <strong>Kwota oryginalna:</strong> {wynik['kwota_oryginalna']} {kierunek === 'na_pln' ? waluty : 'PLN'}
                  </p>
                  <p>
                    <strong>Kurs:</strong> 1 {wynik.waluta} = {wynik.kurs} PLN
                  </p>
                  <p className="kalkulator-result-value">
                    Wynik: {wynik.wynik} {kierunek === 'na_pln' ? 'PLN' : waluty}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Kalkulator;