import { useState, useEffect } from 'react';
import Przelew from './Przelew';
import Historia from './Historia';
import Kalkulator from './Kalkulator';

function Dashboard({ email, wyloguj, darkMode, toggleDarkMode }) {
  const [przelewy, setPrzelewy] = useState([]);
  const [stanKonta, setStanKonta] = useState(0);
  const [numerKonta, setNumerKonta] = useState('');
  const [loading, setLoading] = useState(true);
  const [strona, setStrona] = useState('dashboard');

  const bgColor = darkMode ? '#1a1a2e' : '#F8FAFC';
  const cardColor = darkMode ? '#16213e' : '#F8FAFC';
  const textColor = darkMode ? '#fff' : '#1E3A8A';
  const sidebarColor = darkMode ? '#0f3460' : '#1E3A8A';

  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch('https://tai-p2p7.onrender.com/api/stan-konta/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setStanKonta(data.stan);
        setNumerKonta(data.numer_konta);
      })
      .catch(err => console.error('Błąd stan-konta:', err));

    fetch('https://tai-p2p7.onrender.com/api/przelewy/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPrzelewy(data.slice(0, 10));
        } else if (data.results) {
          setPrzelewy(data.results.slice(0, 10));
        } else {
          setPrzelewy([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd:', err);
        setPrzelewy([]);
        setLoading(false);
      });
  }, []);

  if (strona === 'przelew') {
    return <Przelew setStrona={setStrona} email={email} darkMode={darkMode} />;
  }

  if (strona === 'historia') {
    return <Historia setStrona={setStrona} email={email} darkMode={darkMode} />;
  }

  if (strona === 'kalkulator') {
    return <Kalkulator setStrona={setStrona} darkMode={darkMode} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: bgColor }}>
      <div style={{ flex: 0.15, background: sidebarColor, padding: '20px', color: 'white' }}>
        <h2>Menu</h2>
        <p>Użytkownik: {email}</p>
        <button onClick={() => setStrona('przelew')} style={{ padding: '10px 20px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px', width: '100%', marginBottom: '10px' }}>Nowy przelew</button>
        <button onClick={() => setStrona('historia')} style={{ padding: '10px 20px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', width: '100%', marginBottom: '10px' }}>Historia</button>
        <button onClick={() => setStrona('kalkulator')} style={{ padding: '10px 20px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', width: '100%', marginBottom: '10px' }}>Kalkulator walut</button>
        <button onClick={wyloguj} style={{ padding: '10px 20px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '10px' }}>Wyloguj</button>
      </div>

      <div style={{ flex: 0.7, background: bgColor, padding: '30px', overflowY: 'auto' }}>
        <h1 style={{ color: textColor }}>Twoje Konto</h1>
        
        <div style={{ background: cardColor, padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #0EA5E9' }}>
          <h2 style={{ color: textColor }}>Stan Konta</h2>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#0EA5E9' }}>{stanKonta} PLN</p>
          <p style={{ color: darkMode ? '#aaa' : '#64748B', marginTop: '10px', fontSize: '14px' }}>Numer konta: {numerKonta}</p>
        </div>

        <div style={{ background: cardColor, padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: textColor }}>10 Ostatnich Przelewów</h2>
          
          {loading ? <p style={{ color: textColor }}>Ładowanie...</p> : (
            przelewy.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #0EA5E9', background: darkMode ? '#0f3460' : '#F0F9FF' }}>
                    <th style={{ textAlign: 'left', padding: '10px', color: textColor }}>Do</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: textColor }}>Kwota</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: textColor }}>Tytuł</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: textColor }}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {przelewy.map((przelew) => (
                    <tr key={przelew.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '10px', color: textColor }}>{przelew.odbiorca_nazwa}</td>
                      <td style={{ padding: '10px', color: przelew.jest_wychodzacy ? '#DC2626' : '#10B981', fontWeight: 'bold' }}>{przelew.jest_wychodzacy ? '-' : '+'}{przelew.kwota} PLN</td>
                      <td style={{ padding: '10px', color: textColor }}>{przelew.tytul}</td>
                      <td style={{ padding: '10px', color: darkMode ? '#aaa' : '#64748B' }}>{new Date(przelew.data).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: textColor }}>Brak przelewów</p>
            )
          )}
        </div>
      </div>

      <div style={{ flex: 0.15, background: darkMode ? '#0f3460' : '#0F172A', padding: '20px', color: 'white' }}>
        <h3 style={{ color: '#0EA5E9' }}>Skróty</h3>
        <p>Przelewy</p>
        <p>Kalkulator</p>
      </div>
    </div>
  );
}

export default Dashboard;