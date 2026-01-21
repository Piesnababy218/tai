import { useState } from 'react';
import Dashboard from './Dashboard';

function App() {
  const [strona, setStrona] = useState('logowanie');
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');

  const loguj = () => {
    if (email && haslo) {
      setStrona('dashboard');
    }
  };

  const wyloguj = () => {
    setStrona('logowanie');
    setEmail('');
    setHaslo('');
  };

  if (strona === 'dashboard') {
    return <Dashboard email={email} wyloguj={wyloguj} />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#FFD93D' }}>
      <div style={{ width: '300px', background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Logowanie</h2>
        
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
        
        <input type="password" placeholder="Hasło" value={haslo} onChange={(e) => setHaslo(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
        
        <button onClick={loguj} style={{ width: '100%', padding: '10px', background: '#FF6B6B', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Zaloguj się</button>
      </div>
    </div>
  );
}

export default App;