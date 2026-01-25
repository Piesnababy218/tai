import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Rejestracja from './Rejestracja';
import './App.css';

function App() {
  const [strona, setStrona] = useState('logowanie');
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      setDarkMode(JSON.parse(saved));
    }
  }, []);

  const waliduj = () => {
    const noweBledy = {};

    if (!email) {
      noweBledy.email = 'Email jest wymagany';
    } else if (!email.includes('@')) {
      noweBledy.email = 'Email musi zawierać @';
    }

    if (!haslo) {
      noweBledy.haslo = 'Hasło jest wymagane';
    } else if (haslo.length < 6) {
      noweBledy.haslo = 'Hasło musi mieć co najmniej 6 znaków';
    }

    setErrors(noweBledy);
    return Object.keys(noweBledy).length === 0;
  };

  const loguj = async () => {
    if (!waliduj()) return;

    setLoading(true);
    try {
      const response = await fetch('https://tai-p2p7.onrender.com/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: haslo
        })
      });

      if (!response.ok) {
        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Odpowiedź:', text);
        setErrors({ form: 'Błędne dane logowania' });
        setLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      setStrona('dashboard');
    } catch (error) {
      console.error('Błąd:', error);
      setErrors({ form: 'Błąd połączenia z serwerem' });
    }
    setLoading(false);
  };

  const rejestracja = () => {
    setStrona('rejestracja');
  };

  const wyloguj = () => {
    setStrona('logowanie');
    setEmail('');
    setHaslo('');
    setErrors({});
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  if (strona === 'dashboard') {
    return <Dashboard email={email} wyloguj={wyloguj} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
  }

  if (strona === 'rejestracja') {
    return <Rejestracja setStrona={setStrona} />;
  }

  return (
    <div className={`login-wrapper ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className={`login-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h2>Logowanie</h2>
        
        {errors.form && <p className="form-error">{errors.form}</p>}
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`login-input ${darkMode ? 'dark-mode' : 'light-mode'} ${errors.email ? 'error' : ''}`}
        />
        {errors.email && <p className="input-error">{errors.email}</p>}
        
        <input 
          type="password" 
          placeholder="Hasło" 
          value={haslo}
          onChange={(e) => setHaslo(e.target.value)}
          className={`login-input ${darkMode ? 'dark-mode' : 'light-mode'} ${errors.haslo ? 'error' : ''}`}
        />
        {errors.haslo && <p className="input-error">{errors.haslo}</p>}
        
        <button 
          onClick={loguj}
          disabled={loading}
          className="login-button login-btn-primary"
        >
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
        <button
          onClick={rejestracja}
          className="login-button login-btn-secondary"
        >
          Rejestracja konta w banku
        </button>
        <button
          onClick={toggleDarkMode}
          className={`login-btn-theme ${darkMode ? 'dark-mode' : 'light-mode'}`}
        >
          {darkMode ? '👨🏻 Tryb jasny' : '👨🏿 Tryb ciemny'}
        </button>
      </div>
    </div>
  );
}

export default App;