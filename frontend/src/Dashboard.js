function Dashboard({ email, wyloguj }) {
  const stanKonta = 5000;
  const przelewy = [
    { id: 1, do: 'Jan Kowalski', kwota: 100, data: '2025-01-20' },
    { id: 2, do: 'Maria Nowak', kwota: 250, data: '2025-01-19' },
    { id: 3, do: 'Piotr Lewandowski', kwota: 500, data: '2025-01-18' },
    { id: 4, do: 'Anna Wójcik', kwota: 75, data: '2025-01-17' },
    { id: 5, do: 'Tomasz Ostrowski', kwota: 300, data: '2025-01-16' },
    { id: 6, do: 'Katarzyna Szymańska', kwota: 150, data: '2025-01-15' },
    { id: 7, do: 'Łukasz Michalik', kwota: 200, data: '2025-01-14' },
    { id: 8, do: 'Agnieszka Borkowska', kwota: 120, data: '2025-01-13' },
    { id: 9, do: 'Marcin Gajewski', kwota: 450, data: '2025-01-12' },
    { id: 10, do: 'Ewa Kędzierska', kwota: 180, data: '2025-01-11' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 0.15, background: '#2C3E50', padding: '20px', color: 'white' }}>
        <h2>Menu</h2>
        <p>Użytkownik: {email}</p>
        <button onClick={wyloguj} style={{ padding: '10px 20px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>Wyloguj</button>
      </div>

      <div style={{ flex: 0.7, background: '#ECF0F1', padding: '30px', overflowY: 'auto' }}>
        <h1>Twoje Konto</h1>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Stan Konta</h2>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#27AE60' }}>{stanKonta} PLN</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>10 Ostatnich Przelewów</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #BDC3C7' }}>
                <th style={{ textAlign: 'left', padding: '10px' }}>Do</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>Kwota</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {przelewy.map((przelew) => (
                <tr key={przelew.id} style={{ borderBottom: '1px solid #ECF0F1' }}>
                  <td style={{ padding: '10px' }}>{przelew.do}</td>
                  <td style={{ padding: '10px', color: '#E74C3C' }}>-{przelew.kwota} PLN</td>
                  <td style={{ padding: '10px' }}>{przelew.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ flex: 0.15, background: '#34495E', padding: '20px', color: 'white' }}>
        <h3>Skróty</h3>
        <p>Przelewy</p>
        <p>Ustawienia</p>
      </div>
    </div>
  );
}

export default Dashboard;