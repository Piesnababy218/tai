import { useState } from 'react';

function Rejestracja({ setStrona }) {
    const [formData, setFormData] = useState({
        imie: '',
        nazwisko: '',
        email: '',
        telefon: '',
        pesel: '',
        haslo: '',
        hasloPowtorz: ''
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

        if (!formData.imie) noweBledy.imie = 'Imię jest wymagane';
        if (!formData.nazwisko) noweBledy.nazwisko = 'Nazwisko jest wymagane';
        if (!formData.email) noweBledy.email = 'Email jest wymagany';
        else if (!formData.email.includes('@')) noweBledy.email = 'Email musi zawierać @';
        if (!formData.telefon) noweBledy.telefon = 'Telefon jest wymagany';
        if (!formData.pesel) noweBledy.pesel = 'PESEL jest wymagany';
        if (!formData.haslo) noweBledy.haslo = 'Hasło jest wymagane';
        else if (formData.haslo.length < 6) noweBledy.haslo = 'Hasło musi mieć co najmniej 6 znaków';
        if (formData.haslo !== formData.hasloPowtorz) noweBledy.hasloPowtorz = 'Hasła się nie zgadzają';

        setErrors(noweBledy);
        return Object.keys(noweBledy).length === 0;
    };

    const handleSubmit = async () => {
        if (!waliduj()) return;

        setLoading(true);
        try {
            const response = await fetch('https://tai-1-ubol.onrender.com/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.email,
                    email: formData.email,
                    password: formData.haslo,
                    first_name: formData.imie,
                    last_name: formData.nazwisko,
                    telefon: formData.telefon,
                    pesel: formData.pesel
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('Konto zostało utworzone!');
                setStrona('logowanie');
            } else {
                alert('Błąd: ' + JSON.stringify(data));
            }
        } catch (error) {
            console.error('Błąd:', error);
            alert('Błąd przy wysyłaniu danych');
        }
        setLoading(false);
    };

    return(
        <div style={{ background: '#1E3A8A', height: '100vh', width: '100vw', margin: 0, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '50vw', background: '#F8FAFC', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '40px', overflowY: 'auto' }}>
            <h1 style={{ color: '#1E3A8A', marginBottom: '40px', textAlign: 'center' }}>Utwórz konto bankowe</h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              
              <div>
                <label style={{ color: '#1E3A8A', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Imię</label>
                <input type="text" name="imie" placeholder="Jan" value={formData.imie} onChange={handleChange} style={{ width: '100%', padding: '12px', border: errors.imie ? '2px solid #DC2626' : '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
                {errors.imie && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.imie}</p>}
              </div>

              <div>
                <label style={{ color: '#1E3A8A', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Nazwisko</label>
                <input type="text" name="nazwisko" placeholder="Kowalski" value={formData.nazwisko} onChange={handleChange} style={{ width: '100%', padding: '12px', border: errors.nazwisko ? '2px solid #DC2626' : '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
                {errors.nazwisko && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.nazwisko}</p>}
              </div>

              <div>
                <label style={{ color: '#1E3A8A', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Email</label>
                <input type="email" name="email" placeholder="jan@example.com" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', border: errors.email ? '2px solid #DC2626' : '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
                {errors.email && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
              </div>

              <div>
                <label style={{ color: '#1E3A8A', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Numer telefonu</label>
                <input type="tel" name="telefon" placeholder="+48 123 456 789" value={formData.telefon} onChange={handleChange} style={{ width: '100%', padding: '12px', border: errors.telefon ? '2px solid #DC2626' : '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
                {errors.telefon && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.telefon}</p>}
              </div>

              <div>
                <label style={{ color: '#1E3A8A', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>PESEL</label>
                <input type="text" name="pesel" placeholder="00000000000" value={formData.pesel} onChange={handleChange} style={{ width: '100%', padding: '12px', border: errors.pesel ? '2px solid #DC2626' : '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
                {errors.pesel && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.pesel}</p>}
              </div>

              <div>
                <label style={{ color: '#1E3A8A', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Hasło</label>
                <input type="password" name="haslo" placeholder="••••••••" value={formData.haslo} onChange={handleChange} style={{ width: '100%', padding: '12px', border: errors.haslo ? '2px solid #DC2626' : '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
                {errors.haslo && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.haslo}</p>}
              </div>

              <div>
                <label style={{ color: '#1E3A8A', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Powtórz hasło</label>
                <input type="password" name="hasloPowtorz" placeholder="••••••••" value={formData.hasloPowtorz} onChange={handleChange} style={{ width: '100%', padding: '12px', border: errors.hasloPowtorz ? '2px solid #DC2626' : '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
                {errors.hasloPowtorz && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.hasloPowtorz}</p>}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '12px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                  {loading ? 'Wysyłanie...' : 'Utwórz konto'}
                </button>
                <button onClick={() => setStrona('logowanie')} style={{ flex: 1, padding: '12px', background: '#E2E8F0', color: '#1E3A8A', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Wróć</button>
              </div>
            </div>
          </div>
        </div>
    )
}
export default Rejestracja;