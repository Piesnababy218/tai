import { useState, useEffect } from 'react';

function Historia({ setStrona, email }) {
  const [przelewy, setPrzelewy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState('data');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchOdbiorca, setSearchOdbiorca] = useState('');
  const [searchTytul, setSearchTytul] = useState('');

  const fetchPrzelewy = (sort, order) => {
    setLoading(true);
    const token = localStorage.getItem('access');
    
    fetch(`https://tai-p2p7.onrender.com/api/przelewy/?sort=${sort}&order=${order}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Otrzymane dane:', data);
        if (Array.isArray(data)) {
          setPrzelewy(data);
        } else if (data.results) {
          setPrzelewy(data.results);
        } else {
          setPrzelewy([]);
        }
        setError('');
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd:', err);
        setError('Błąd ładowania przelewów: ' + err.message);
        setPrzelewy([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPrzelewy(sortKey, sortOrder);
  }, [sortKey, sortOrder]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredPrzelewy = przelewy.filter(przelew => {
    const odborcaValue = (przelew.odbiorca_nazwa || '').toString().toLowerCase();
    const tytuValue = (przelew.tytul || '').toString().toLowerCase();
    const matchesOdbiorca = odborcaValue.includes(searchOdbiorca.toLowerCase());
    const matchesTytul = tytuValue.includes(searchTytul.toLowerCase());
    return matchesOdbiorca && matchesTytul;
  });

  const SortHeader = ({ sortBy, label }) => (
    <th 
      onClick={() => handleSort(sortBy)}
      style={{ 
        textAlign: 'left', 
        padding: '10px', 
        color: '#1E3A8A',
        cursor: 'pointer',
        userSelect: 'none',
        background: sortKey === sortBy ? '#E0F2FE' : '#F0F9FF'
      }}
    >
      {label} {sortKey === sortBy ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
    </th>
  );

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
        
        {error && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#1E3A8A', marginBottom: '15px' }}>Wyszukiwanie</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', color: '#1E3A8A', fontWeight: 'bold', marginBottom: '5px' }}>Do kogo (Email odbiorcy)</label>
              <input 
                type="text" 
                placeholder="Szukaj po emailu odbiorcy..." 
                value={searchOdbiorca}
                onChange={(e) => setSearchOdbiorca(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', color: '#1E3A8A', fontWeight: 'bold', marginBottom: '5px' }}>Tytuł przelewu</label>
              <input 
                type="text" 
                placeholder="Szukaj po tytule..." 
                value={searchTytul}
                onChange={(e) => setSearchTytul(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button 
                onClick={() => {
                  setSearchOdbiorca('');
                  setSearchTytul('');
                }}
                style={{ padding: '10px 20px', background: '#E2E8F0', color: '#1E3A8A', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Wyczyść
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {loading ? <p>Ładowanie...</p> : (
            filteredPrzelewy.length > 0 ? (
              <>
                <p style={{ color: '#64748B', marginBottom: '15px' }}>Znaleziono {filteredPrzelewy.length} przelewów</p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #0EA5E9', background: '#F0F9FF' }}>
                      <th style={{ textAlign: 'left', padding: '10px', color: '#1E3A8A' }}>Do (Email)</th>
                      <SortHeader sortBy="kwota" label="Kwota" />
                      <SortHeader sortBy="tytul" label="Tytuł" />
                      <SortHeader sortBy="data" label="Data" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrzelewy.map((przelew) => (
                      <tr key={przelew.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '10px' }}>{przelew.odbiorca_nazwa || przelew.odbiorca}</td>
                        <td style={{ padding: '10px', color: '#DC2626', fontWeight: 'bold' }}>-{przelew.kwota} PLN</td>
                        <td style={{ padding: '10px' }}>{przelew.tytul}</td>
                        <td style={{ padding: '10px', color: '#64748B' }}>{new Date(przelew.data).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p>Brak przelewów spełniających kryteria wyszukiwania</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Historia;