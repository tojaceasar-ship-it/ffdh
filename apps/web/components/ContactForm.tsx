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
      className="min-h-screen py-20 px-4 flex items-center justify-center"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="max-w-2xl w-full">
        <h2 
          className="text-5xl font-bold mb-12 text-center"
          style={{ 
            color: '#FFD700',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
          }}
        >
          Kontakt
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: '#ffffff' }}
            >
              Imię
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: '#1a1a1a',
                borderColor: '#00CED1',
                color: '#ffffff'
              }}
            />
          </div>

          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: '#ffffff' }}
            >
              E-mail
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: '#1a1a1a',
                borderColor: '#00CED1',
                color: '#ffffff'
              }}
            />
          </div>

          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: '#ffffff' }}
            >
              Wiadomość
            </label>
            <textarea
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: '#1a1a1a',
                borderColor: '#00CED1',
                color: '#ffffff'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full px-8 py-4 text-lg font-bold rounded-lg transition-all hover:scale-105 hover:shadow-2xl"
            style={{ 
              backgroundColor: '#FF4500',
              color: '#000000',
              boxShadow: '0 0 20px rgba(255, 69, 0, 0.5)'
            }}
          >
            {status === 'sending' ? 'Wysyłanie...' : 'Wyślij Wiadomość'}
          </button>

          {status === 'success' && (
            <p className="text-center" style={{ color: '#FFD700' }}>
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