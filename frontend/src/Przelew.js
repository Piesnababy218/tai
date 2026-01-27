import { useState, useEffect } from 'react';
import './Przelew.css';

function Przelew({ setStrona, email }) {
  const [formData, setFormData] = useState({
    odbiorca: '',
    numer_konta: '',
    kwota: '',
    tytul: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [nadawcaId, setNadawcaId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch('https://tai-p2p7.onrender.com/api/stan-konta/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Konto nadawcy:', data);
        setNadawcaId(data.id);
      })
      .catch(err => console.error('Błąd:', err));
  }, []);

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
    if (!nadawcaId) {
      alert('Czekaj na załadowanie danych konta...');
      return;
    }
    
    if (!waliduj()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('access');
      
      const kontoResponse = await fetch(`https://tai-p2p7.onrender.com/api/konto-by-numer/${formData.numer_konta}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!kontoResponse.ok) {
        alert('Błąd: Konto odbiorcy nie znalezione');
        setLoading(false);
        return;
      }

      const kontoData = await kontoResponse.json();
      const odborcaId = kontoData.id;

      const response = await fetch('https://tai-p2p7.onrender.com/api/przelewy/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nadawca: nadawcaId,
          odbiorca: odborcaId,
          kwota: parseFloat(formData.kwota),
          tytul: formData.tytul
        })
      });

      if (!response.ok) {
        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Odpowiedź:', text);
        alert('Błąd: ' + text);
        setLoading(false);
        return;
      }

      const data = await response.json();
      alert('Przelew został wysłany!');
      window.location.href = '/';
    } catch (error) {
      console.error('Błąd:', error);
      alert('Błąd: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="przelew-wrapper">
      <div className="przelew-container">
        <h1>Nowy Przelew</h1>
        
        <div className="przelew-form">
          
          <div className="przelew-form-group">
            <label>Imię odbiorcy</label>
            <input type="text" name="odbiorca" placeholder="Jan Kowalski" value={formData.odbiorca} onChange={handleChange} className={errors.odbiorca ? 'error' : ''} />
            {errors.odbiorca && <p className="przelew-form-error">{errors.odbiorca}</p>}
          </div>

          <div className="przelew-form-group">
            <label>Numer konta</label>
            <input type="text" name="numer_konta" placeholder="12345678901234567890" value={formData.numer_konta} onChange={handleChange} className={errors.numer_konta ? 'error' : ''} />
            {errors.numer_konta && <p className="przelew-form-error">{errors.numer_konta}</p>}
          </div>

          <div className="przelew-form-group">
            <label>Kwota (PLN)</label>
            <input type="number" name="kwota" placeholder="100" value={formData.kwota} onChange={handleChange} className={errors.kwota ? 'error' : ''} />
            {errors.kwota && <p className="przelew-form-error">{errors.kwota}</p>}
          </div>

          <div className="przelew-form-group">
            <label>Tytuł przelewu</label>
            <input type="text" name="tytul" placeholder="Zapłata za..." value={formData.tytul} onChange={handleChange} className={errors.tytul ? 'error' : ''} />
            {errors.tytul && <p className="przelew-form-error">{errors.tytul}</p>}
          </div>

          <div className="przelew-buttons">
            <button onClick={handleSubmit} disabled={loading || !nadawcaId} className="przelew-button przelew-button-submit">
              {loading ? 'Wysyłanie...' : nadawcaId ? 'Wyślij przelew' : 'Ładowanie...'}
            </button>
            <button onClick={() => setStrona('dashboard')} className="przelew-button przelew-button-cancel">Wróć</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Przelew;