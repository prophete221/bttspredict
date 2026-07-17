const http = require('http');
http.get('http://localhost:3000/', { timeout: 10000 }, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Page Size:', data.length, 'bytes');
    const checks = ['btn-linebet', 'promo-code-shimmer', 'neon-glow', 'BttsBet', 'VISION221', 'testimonial-card', 'urgent-badge', 'glass-strong', 'btn-star888', 'Quantum'];
    checks.forEach(c => {
      const escaped = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const count = (data.match(new RegExp(escaped, 'g')) || []).length;
      console.log('  ' + c + ': ' + count);
    });
  });
}).on('error', e => console.error('Error:', e.message));
