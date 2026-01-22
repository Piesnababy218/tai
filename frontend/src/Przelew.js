import { useState } from 'react';

function Przelew({ setStrona, email }) {
  const [formData, setFormData] = useState({
    odbiorca: '',
    numer_konta: '',
    kwota: '',
    tytul: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const waliduj = () => {
    const noweBledy = {};

    if (!formData.odbiorca) noweBledy.odbiorca = 'Imię odbiorcy jest wymagane';
    if (!formData.numer_konta) noweBledy.numer_konta = 'Numer konta jest wymagany';
    if (!formData.kwota) noweBledy.kwota = 'Kwota jest wymagana';
    else if (formData.kwota <= 0) noweBledy.kwota = 'Kwota musi być większa niż 0';
    if (!formData.tytul) noweBledy.tytul = 'Tytuł przelewu jest wymagany';

    setErrors(noweBledy);
    return Object.keys(noweBledy).length === 0;
  };

  const handleSubmit = async () => {
    if (!waliduj()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/przelewy/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          do: formData.odbiorca,
          numer_konta: formData.numer_konta,
          kwota: formData.kwota,
          tytul: formData.tytul,
          nadawca: email
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Przelew został wysłany!');
        setStrona('dashboard');
      } else {
        alert('Błąd: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Błąd:', error);
      alert('Błąd przy wysyłaniu przelewu');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#1E3A8A', height: '100vh', width: '100vw', margin: 0, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', width: '50vw', background: '#F8FAFC', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '40px', overflowY: 'auto' }}>
        <h1 style={{ color: '#1E3A8A', marginBottom: '40px', textAlign: 'center' }}>Nowy Przelew</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          
          <div>
            <label style={{ color: '#1E3A8A', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Imię odbiorcy</label>
            <input type="text" name="odbiorca" placeholder="Jan Kowalski" value={formData.odbiorca} onChange={handleChange} style={{ width: '100%', padding: '12px', border: errors.odbiorca ? '2px solid #DC2626' : '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
            {errors.odbiorca && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.odbiorca}</p>}
          </div>

          <div>
            <label style={{ color: '#1E3A8A', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Numer konta</label>
            <input type="text" name="numer_konta" placeholder="12345678901234567890" value={formData.numer_konta} onChange={handleChange} style={{ width: '100%', padding: '12px', border: errors.numer_konta ? '2px solid #DC2626' : '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
            {errors.numer_konta && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.numer_konta}</p>}
          </div>

          <div>
            <label style={{ color: '#1E3A8A', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Kwota (PLN)</label>
            <input type="number" name="kwota" placeholder="100" value={formData.kwota} onChange={handleChange} style={{ width: '100%', padding: '12px', border: errors.kwota ? '2px solid #DC2626' : '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
            {errors.kwota && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.kwota}</p>}
          </div>

          <div>
            <label style={{ color: '#1E3A8A', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Tytuł przelewu</label>
            <input type="text" name="tytul" placeholder="Zapłata za..." value={formData.tytul} onChange={handleChange} style={{ width: '100%', padding: '12px', border: errors.tytul ? '2px solid #DC2626' : '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
            {errors.tytul && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.tytul}</p>}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '12px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
              {loading ? 'Wysyłanie...' : 'Wyślij przelew'}
            </button>
            <button onClick={() => setStrona('dashboard')} style={{ flex: 1, padding: '12px', background: '#E2E8F0', color: '#1E3A8A', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Wróć</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Przelew;