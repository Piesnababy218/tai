import { useState, useEffect } from 'react';

function Historia({ setStrona, email }) {
  const [przelewy, setPrzelewy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    
    fetch('https://tai-p2p7.onrender.com/api/przelewy/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 0.15, background: '#1E3A8A', padding: '20px', color: 'white' }}>
        <h2>Menu</h2>
        <p>Użytkownik: {email}</p>
        <button onClick={() => setStrona('dashboard')} style={{ padding: '10px 20px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px', width: '100%', marginBottom: '10px' }}>Dashboard</button>
        <button onClick={() => setStrona('historia')} style={{ padding: '10px 20px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', width: '100%', marginBottom: '10px', fontWeight: 'bold' }}>Historia przelewów</button>
      </div>

      <div style={{ flex: 0.85, background: '#F8FAFC', padding: '30px', overflowY: 'auto' }}>
        <h1 style={{ color: '#1E3A8A' }}>Historia przelewów</h1>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {loading ? <p>Ładowanie...</p> : (
            przelewy.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #0EA5E9', background: '#F0F9FF' }}>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#1E3A8A' }}>Do</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#1E3A8A' }}>Kwota</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#1E3A8A' }}>Tytuł</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#1E3A8A' }}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {przelewy.map((przelew) => (
                    <tr key={przelew.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '10px' }}>{przelew.do}</td>
                      <td style={{ padding: '10px', color: '#DC2626', fontWeight: 'bold' }}>-{przelew.kwota} PLN</td>
                      <td style={{ padding: '10px' }}>{przelew.tytul}</td>
                      <td style={{ padding: '10px', color: '#64748B' }}>{new Date(przelew.data).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
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
    </div>
  );
}

export default Historia;
