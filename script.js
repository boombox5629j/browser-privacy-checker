document.addEventListener('DOMContentLoaded', function() {
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    
    // Simulate short loading
    setTimeout(() => {
        const data = getBrowserData();
        const score = calcRisk(data);
        const risk = getRiskLevel(score);
        showResults(data, score, risk);
        
        loading.style.display = 'none';
        results.classList.remove('hidden');
    }, 1000);
});

function getBrowserData() {
    // IP/location (offline safe)
    let ipCity = 'Unknown';
    let ipCountry = 'Unknown';
    
    // Try IP API (works 90% of time)
    fetch('https://ipapi.co/json/')
        .then(r => r.json())
        .then(data => {
            ipCity = data.city || 'Unknown';
            ipCountry = data.country || 'Unknown';
        })
        .catch(() => {}); // Offline safe
    
    return {
        browser: getBrowser(),
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ipCity: ipCity,
        ipCountry: ipCountry,
        cookies: navigator.cookieEnabled ? 'Enabled' : 'Disabled',
        screen: screen.width + 'x' + screen.height,
        cpu: navigator.hardwareConcurrency || 'Unknown',
        colorDepth: screen.colorDepth + ' bits'
    };
}

function getBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari')) return 'Safari';
    if (ua.includes('edge')) return 'Edge';
    return 'Unknown';
}

function calcRisk(data) {
    let score = 0;
    if (data.cookies === 'Enabled') score += 25;
    if (data.screen === '1920x1080' || data.screen === '1366x768') score += 15;
    if (data.language === 'en-US' || data.language === 'en') score += 10;
    if (data.cpu > 4) score += 10;
    return Math.min(score, 100);
}

function getRiskLevel(score) {
    if (score <= 30) return { label: 'Low Risk', color: 'low' };
    if (score <= 60) return { label: 'Medium Risk', color: 'medium' };
    return { label: 'High Risk', color: 'high' };
}

function showResults(data, score, risk) {
    document.getElementById('risk-label').textContent = risk.label;
    document.getElementById('risk-label').className = risk.color;
    document.getElementById('risk-score').textContent = score;
    document.getElementById('risk-score').className = risk.color;
    document.getElementById('risk-fill').style.width = score + '%';
    
    document.getElementById('device-info').innerHTML = `
        <div>Browser: ${data.browser}</div>
        <div>Platform: ${data.platform}</div>
        <div>Cookies: ${data.cookies}</div>
    `;
    
    document.getElementById('screen-info').innerHTML = `
        <div>Resolution: ${data.screen}</div>
        <div>Color Depth: ${data.colorDepth}</div>
        <div>CPU Cores: ${data.cpu}</div>
    `;
    
    document.getElementById('location-info').innerHTML = `
        <div>Language: ${data.language}</div>
        <div>Time Zone: ${data.timezone}</div>
        <div>Detected City: ${data.ipCity}</div>
        <div>Country: ${data.ipCountry}</div>
    `;
}