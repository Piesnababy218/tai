import { useState } from 'react';
import Dashboard from './Dashboard';
import Rejestracja from './Rejestracja';

function App() {
  const [strona, setStrona] = useState('logowanie');
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      const response = await fetch('https://tai-1-ubol.onrender.com/api/token/', {
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

  if (strona === 'dashboard') {
    return <Dashboard email={email} wyloguj={wyloguj} />;
  }

  if (strona === 'rejestracja') {
    return <Rejestracja setStrona={setStrona} />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#FFD93D' }}>
      <div style={{ width: '300px', background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Logowanie</h2>
        
        {errors.form && <p style={{ color: '#DC2626', marginBottom: '15px', textAlign: 'center' }}>{errors.form}</p>}
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '5px', border: errors.email ? '2px solid red' : '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} 
        />
        {errors.email && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{errors.email}</p>}
        
        <input 
          type="password" 
          placeholder="Hasło" 
          value={haslo}
          onChange={(e) => setHaslo(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '5px', border: errors.haslo ? '2px solid red' : '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} 
        />
        {errors.haslo && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{errors.haslo}</p>}
        
        <button 
          onClick={loguj}
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: '#FF6B6B', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px' }}
        >
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
        <button
          onClick={rejestracja}
          style={{ width: '100%', padding: '10px', color: 'white', background: '#3498DB', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Rejestracja konta w banku
        </button>
      </div>
    </div>
  );
}

export default App;