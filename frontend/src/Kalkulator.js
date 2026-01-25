import { useState, useEffect } from 'react';

function Kalkulator({ setStrona, darkMode }) {
  const [kursy, setKursy] = useState([]);
  const [kwota, setKwota] = useState('');
  const [waluty, setWaluty] = useState('EUR');
  const [kierunek, setKierunek] = useState('na_pln');
  const [wynik, setWynik] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const bgColor = darkMode ? '#1a1a2e' : '#F8FAFC';
  const cardColor = darkMode ? '#16213e' : 'white';
  const textColor = darkMode ? '#fff' : '#1E3A8A';
  const sidebarColor = darkMode ? '#0f3460' : '#1E3A8A';
  const inputBg = darkMode ? '#0f3460' : '#fff';
  const inputText = darkMode ? '#fff' : '#000';

  useEffect(() => {
    pobierzKursy();
  }, []);

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
    <div style={{ display: 'flex', height: '100vh', background: bgColor }}>
      <div style={{ flex: 0.15, background: sidebarColor, padding: '20px', color: 'white' }}>
        <h2>Menu</h2>
        <button onClick={() => setStrona('dashboard')} style={{ padding: '10px 20px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px', width: '100%', marginBottom: '10px' }}>Dashboard</button>
      </div>

      <div style={{ flex: 0.85, background: bgColor, padding: '30px', overflowY: 'auto' }}>
        <h1 style={{ color: textColor }}>Kalkulator Walut</h1>
        
        {error && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

        <div style={{ background: cardColor, padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '500px' }}>
          {loading ? (
            <p style={{ color: textColor }}>Ładowanie kursów...</p>
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: textColor, fontWeight: 'bold', marginBottom: '8px' }}>Kwota</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={kwota}
                  onChange={(e) => setKwota(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', background: inputBg, color: inputText }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: textColor, fontWeight: 'bold', marginBottom: '8px' }}>Waluta</label>
                <select 
                  value={waluty}
                  onChange={(e) => setWaluty(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', background: inputBg, color: inputText }}
                >
                  {kursy.map((kurs) => (
                    <option key={kurs.code} value={kurs.code}>
                      {kurs.code} - {kurs.currency}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: textColor, fontWeight: 'bold', marginBottom: '8px' }}>Kierunek konwersji</label>
                <select 
                  value={kierunek}
                  onChange={(e) => setKierunek(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', background: inputBg, color: inputText }}
                >
                  <option value="na_pln">Na PLN</option>
                  <option value="z_pln">Z PLN</option>
                </select>
              </div>

              <button 
                onClick={oblicz}
                style={{ width: '100%', padding: '12px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
              >
                Oblicz
              </button>

              {wynik && (
                <div style={{ marginTop: '30px', padding: '20px', background: darkMode ? '#0f3460' : '#F0F9FF', borderRadius: '8px', borderLeft: '4px solid #0EA5E9' }}>
                  <h3 style={{ color: textColor, marginBottom: '15px' }}>Wynik</h3>
                  <p style={{ color: textColor, marginBottom: '10px' }}>
                    <strong>Kwota oryginalna:</strong> {wynik['kwota oryginalna']} {wynik.waluta}
                  </p>
                  <p style={{ color: textColor, marginBottom: '10px' }}>
                    <strong>Kurs:</strong> 1 {wynik.waluta} = {wynik.kurs} PLN
                  </p>
                  <p style={{ color: '#0EA5E9', fontSize: '20px', fontWeight: 'bold' }}>
                    Wynik: {wynik.wynik} PLN
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