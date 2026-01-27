import { useState, useEffect } from 'react';
import './Historia.css';

function Historia({ setStrona, email, darkMode }) {
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
    const searchValue = (searchOdbiorca || '').toString().toLowerCase();
    const tytuValue = (przelew.tytul || '').toString().toLowerCase();
    const matchesOdbiorca = searchValue === '' || 
      (przelew.jest_wychodzacy ? przelew.odbiorca_nazwa.toLowerCase().includes(searchValue) : przelew.nadawca_nazwa.toLowerCase().includes(searchValue));
    const matchesTytul = tytuValue.includes(searchTytul.toLowerCase());
    return matchesOdbiorca && matchesTytul;
  });

  return (
    <div className="historia-container">
      <div className={`historia-sidebar ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h2>Menu</h2>
        <p>Użytkownik: {email}</p>
        <button onClick={() => setStrona('dashboard')} className="historia-button">Dashboard</button>
        <button onClick={() => setStrona('historia')} className="historia-button" style={{ fontWeight: 'bold' }}>Historia przelewów</button>
      </div>

      <div className={`historia-content ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h1>Historia przelewów</h1>
        
        {error && <div className="historia-error">{error}</div>}
        
        <div className={`historia-search-card ${darkMode ? 'dark-mode' : 'light-mode'}`}>
          <h3>Wyszukiwanie</h3>
          <div className="historia-search-inputs">
            <div className={`historia-search-group ${darkMode ? 'dark-mode' : 'light-mode'}`}>
              <label>Od/Do kogo (Email)</label>
              <input 
                type="text" 
                placeholder="Szukaj po emailu..." 
                value={searchOdbiorca}
                onChange={(e) => setSearchOdbiorca(e.target.value)}
              />
            </div>
            <div className={`historia-search-group ${darkMode ? 'dark-mode' : 'light-mode'}`}>
              <label>Tytuł przelewu</label>
              <input 
                type="text" 
                placeholder="Szukaj po tytule..." 
                value={searchTytul}
                onChange={(e) => setSearchTytul(e.target.value)}
              />
            </div>
            <button 
              onClick={() => {
                setSearchOdbiorca('');
                setSearchTytul('');
              }}
              className="historia-clear-button"
            >
              Wyczyść
            </button>
          </div>
        </div>

        <div className={`historia-results-card ${darkMode ? 'dark-mode' : 'light-mode'}`}>
          {loading ? <p className="historia-loading">Ładowanie...</p> : (
            filteredPrzelewy.length > 0 ? (
              <>
                <p className={`historia-count ${darkMode ? 'dark-mode' : 'light-mode'}`}>Znaleziono {filteredPrzelewy.length} przelewów</p>
                <table className={`historia-table ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                  <thead>
                    <tr>
                      <th>Od kogo</th>
                      <th>Do kogo</th>
                      <th onClick={() => handleSort('kwota')} style={{ cursor: 'pointer' }}>Kwota {sortKey === 'kwota' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                      <th onClick={() => handleSort('tytul')} style={{ cursor: 'pointer' }}>Tytuł {sortKey === 'tytul' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                      <th onClick={() => handleSort('data')} style={{ cursor: 'pointer' }}>Data {sortKey === 'data' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrzelewy.map((przelew) => (
                      <tr key={przelew.id}>
                        <td>{przelew.jest_wychodzacy ? '-' : przelew.nadawca_nazwa}</td>
                        <td>{przelew.jest_wychodzacy ? przelew.odbiorca_nazwa : '-'}</td>
                        <td className={`historia-table-amount ${przelew.jest_wychodzacy ? 'outgoing' : 'incoming'}`}>
                          {przelew.jest_wychodzacy ? '-' : '+'}{przelew.kwota} PLN
                        </td>
                        <td>{przelew.tytul}</td>
                        <td className="historia-table-date">{new Date(przelew.data).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className="historia-empty">Brak przelewów spełniających kryteria wyszukiwania</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Historia;