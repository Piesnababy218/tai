import { useState, useEffect } from 'react';
import Przelew from './Przelew';

function Dashboard({ email, wyloguj }) {
  const [przelewy, setPrzelewy] = useState([]);
  const [stanKonta, setStanKonta] = useState(0);
  const [loading, setLoading] = useState(true);
  const [strona, setStrona] = useState('dashboard');

  useEffect(() => {
    fetch('http://localhost:8000/api/stan-konta/')
      .then(res => res.json())
      .then(data => {
        setStanKonta(data.stan);
      })
      .catch(err => console.error('Błąd:', err));

    fetch('http://localhost:8000/api/przelewy/')
      .then(res => res.json())
      .then(data => {
        console.log('Otrzymane dane:', data);
        if (Array.isArray(data)) {
          setPrzelewy(data);
        } else if (data.results) {
          setPrzelewy(data.results);
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
    return <Przelew setStrona={setStrona} email={email} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 0.15, background: '#1E3A8A', padding: '20px', color: 'white' }}>
        <h2>Menu</h2>
        <p>Użytkownik: {email}</p>
        <button onClick={() => setStrona('przelew')} style={{ padding: '10px 20px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px', width: '100%', marginBottom: '10px' }}>Nowy przelew</button>
        <button onClick={wyloguj} style={{ padding: '10px 20px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>Wyloguj</button>
      </div>

      <div style={{ flex: 0.7, background: '#F8FAFC', padding: '30px', overflowY: 'auto' }}>
        <h1 style={{ color: '#1E3A8A' }}>Twoje Konto</h1>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #0EA5E9' }}>
          <h2 style={{ color: '#1E3A8A' }}>Stan Konta</h2>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#0EA5E9' }}>{stanKonta} PLN</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#1E3A8A' }}>10 Ostatnich Przelewów</h2>
          
          {loading ? <p>Ładowanie...</p> : (
            przelewy.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #0EA5E9', background: '#F0F9FF' }}>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#1E3A8A' }}>Do</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#1E3A8A' }}>Kwota</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#1E3A8A' }}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {przelewy.map((przelew) => (
                    <tr key={przelew.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '10px' }}>{przelew.do}</td>
                      <td style={{ padding: '10px', color: '#DC2626', fontWeight: 'bold' }}>-{przelew.kwota} PLN</td>
                      <td style={{ padding: '10px', color: '#64748B' }}>{przelew.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Brak przelewów</p>
            )
          )}
        </div>
      </div>

      <div style={{ flex: 0.15, background: '#0F172A', padding: '20px', color: 'white' }}>
        <h3 style={{ color: '#0EA5E9' }}>Skróty</h3>
        <p>Przelewy</p>
        <p>Ustawienia</p>
      </div>
    </div>
  );
}

export default Dashboard;