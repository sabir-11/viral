import { useState } from 'react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');

  const analyzeVideo = async () => {
    if (!videoUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      });
      
      const { score, feedback } = await response.json();
      setScore(score);
      setFeedback(feedback);
    } catch (error) {
      alert('Error analyzing video: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>🔥 ViralEngine AI</h1>
      <p>Paste your TikTok/Reels URL to get a viral score</p>
      
      <input
        type="text"
        placeholder="https://www.tiktok.com/@user/video/123456"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
      />
      
      <button
        onClick={analyzeVideo}
        disabled={loading}
        style={{
          background: loading ? 'gray' : '#0070f3',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Analyzing...' : 'Get Viral Score'}
      </button>

      {score && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '5px' }}>
          <h2>Viral Score: {score}/10</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{feedback}</p>
        </div>
      )}
    </div>
  );
}
