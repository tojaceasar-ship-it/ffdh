'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section 
      className="py-20 px-4"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-2xl mx-auto">
        <h2 
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: '#007bff' }}
        >
          Kontakt
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: '#000000' }}
            >
              Imię
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2"
              style={{ 
                backgroundColor: '#ffffff',
                borderColor: '#6c757d',
                color: '#000000'
              }}
            />
          </div>

          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: '#000000' }}
            >
              E-mail
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2"
              style={{ 
                backgroundColor: '#ffffff',
                borderColor: '#6c757d',
                color: '#000000'
              }}
            />
          </div>

          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: '#000000' }}
            >
              Wiadomość
            </label>
            <textarea
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2"
              style={{ 
                backgroundColor: '#ffffff',
                borderColor: '#6c757d',
                color: '#000000'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full px-8 py-4 text-lg font-bold rounded-lg transition-all hover:scale-105"
            style={{ 
              backgroundColor: '#FF4500',
              color: '#ffffff'
            }}
          >
            {status === 'sending' ? 'Wysyłanie...' : 'Wyślij Wiadomość'}
          </button>

          {status === 'success' && (
            <p className="text-center" style={{ color: '#007bff' }}>
              ✅ Wiadomość wysłana pomyślnie!
            </p>
          )}
          
          {status === 'error' && (
            <p className="text-center" style={{ color: '#FF4500' }}>
              ❌ Błąd wysyłania. Spróbuj ponownie.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}