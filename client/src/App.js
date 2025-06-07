import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [urls, setUrls] = useState([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/urls');
      const data = await response.json();
      setUrls(data);
    } catch (error) {
      setError('Error fetching URLs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('URL shortened successfully!');
        setOriginalUrl('');
        fetchUrls();
      } else {
        setError(data.error || 'Error shortening URL');
      }
    } catch (error) {
      setError('Error shortening URL');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>URL Shortener</h1>
      </header>
      <main className="App-main">
        <form onSubmit={handleSubmit} className="url-form">
          <input
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Enter URL to shorten"
            required
            className="url-input"
          />
          <button type="submit" className="submit-button">
            Shorten URL
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="urls-list">
          <h2>Recent URLs</h2>
          <table>
            <thead>
              <tr>
                <th>Original URL</th>
                <th>Short URL</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr key={url.id}>
                  <td>
                    <a href={url.original_url} target="_blank" rel="noopener noreferrer">
                      {url.original_url}
                    </a>
                  </td>
                  <td>
                    <a href={`http://localhost:5000/${url.short_key}`} target="_blank" rel="noopener noreferrer">
                      {`http://localhost:5000/${url.short_key}`}
                    </a>
                  </td>
                  <td>{new Date(url.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;
