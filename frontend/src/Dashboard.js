import { useState, useEffect } from 'react';
import Przelew from './Przelew';
import Historia from './Historia';
import Kalkulator from './Kalkulator';
import './Dashboard.css';

function Dashboard({ email, wyloguj, darkMode, toggleDarkMode }) {
  const [przelewy, setPrzelewy] = useState([]);
  const [stanKonta, setStanKonta] = useState(0);
  const [numerKonta, setNumerKonta] = useState('');
  const [loading, setLoading] = useState(true);
  const [strona, setStrona] = useState('dashboard');

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
    <div className={`dashboard ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className={`dashboard-sidebar ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h2>Menu</h2>
        <p>Użytkownik: {email}</p>
        <button onClick={() => setStrona('przelew')} className="dashboard-button">Nowy przelew</button>
        <button onClick={() => setStrona('historia')} className="dashboard-button">Historia</button>
        <button onClick={() => setStrona('kalkulator')} className="dashboard-button">Kalkulator walut</button>
        <button onClick={wyloguj} className="dashboard-button dashboard-button-logout">Wyloguj</button>
      </div>

      <div className={`dashboard-content ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h1>Twoje Konto</h1>
        
        <div className={`dashboard-card ${darkMode ? 'dark-mode' : 'light-mode'}`}>
          <h2>Stan Konta</h2>
          <p className="dashboard-balance">{stanKonta} PLN</p>
          <p className="dashboard-account-number">Numer konta: {numerKonta}</p>
        </div>

        <div className={`dashboard-card ${darkMode ? 'dark-mode' : 'light-mode'}`}>
          <h2>10 Ostatnich Przelewów</h2>
          
          {loading ? <p className="dashboard-loading">Ładowanie...</p> : (
            przelewy.length > 0 ? (
              <table className={`dashboard-table ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                <thead>
                  <tr>
                    <th>Od kogo</th>
                    <th>Do kogo</th>
                    <th>Kwota</th>
                    <th>Tytuł</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {przelewy.map((przelew) => (
                    <tr key={przelew.id}>
                      <td>{przelew.jest_wychodzacy ? '-' : przelew.nadawca_nazwa}</td>
                      <td>{przelew.jest_wychodzacy ? przelew.odbiorca_nazwa : '-'}</td>
                      <td className={`dashboard-table-amount ${przelew.jest_wychodzacy ? 'outgoing' : 'incoming'}`}>
                        {przelew.jest_wychodzacy ? '-' : '+'}{przelew.kwota} PLN
                      </td>
                      <td>{przelew.tytul}</td>
                      <td className="dashboard-table-date">{new Date(przelew.data).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="dashboard-empty">Brak przelewów</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;