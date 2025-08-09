# Deployment Guide

This guide covers various ways to deploy the Paul's Missionary Journeys website.

## 🌐 Deployment Options

### 1. GitHub Pages (Recommended)

GitHub Pages is the easiest way to deploy this static website for free.

#### Steps:
1. **Fork the Repository**
   - Go to the GitHub repository
   - Click "Fork" to create your own copy

2. **Enable GitHub Pages**
   - Go to your fork's Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Access Your Site**
   - Your site will be available at: `https://yourusername.github.io/paul-journeys-website`
   - It may take a few minutes to become available

#### Custom Domain (Optional):
1. Add a `CNAME` file to the root directory with your domain name
2. Configure your domain's DNS to point to GitHub Pages
3. Enable "Enforce HTTPS" in repository settings

### 2. Netlify

Netlify offers easy deployment with continuous integration.

#### Steps:
1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository

2. **Configure Build Settings**
   - Build command: (leave empty)
   - Publish directory: (leave empty or use `/`)
   - Click "Deploy site"

3. **Custom Domain (Optional)**
   - Go to Site settings > Domain management
   - Add your custom domain
   - Configure DNS as instructed

### 3. Vercel

Vercel provides fast deployment with global CDN.

#### Steps:
1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository

2. **Deploy**
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Click "Deploy"

### 4. Firebase Hosting

Google Firebase offers reliable hosting with good performance.

#### Prerequisites:
```bash
npm install -g firebase-tools
```

#### Steps:
1. **Initialize Firebase**
   ```bash
   firebase login
   firebase init hosting
   ```

2. **Configure**
   - Select or create a Firebase project
   - Set public directory to current directory (.)
   - Configure as single-page app: No
   - Don't overwrite index.html

3. **Deploy**
   ```bash
   firebase deploy
   ```

### 5. Local Server (Development)

For local development and testing:

#### Python:
```bash
python3 -m http.server 8000
```

#### Node.js:
```bash
npx serve .
# or
npx http-server
```

#### PHP:
```bash
php -S localhost:8000
```

## 🔧 Configuration

### Environment-Specific Settings

The website works out of the box, but you may want to customize:

#### Map Tiles
Edit `app.js` to change map tile providers:
```javascript
const tileProviders = {
    light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
};
```

#### Analytics (Optional)
Add Google Analytics or other tracking:
```html
<!-- Add to index.html <head> section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚀 Performance Optimization

### CDN Configuration
For better performance, consider using a CDN:

#### Cloudflare:
1. Sign up for Cloudflare
2. Add your domain
3. Update nameservers
4. Enable caching and minification

#### AWS CloudFront:
1. Create CloudFront distribution
2. Set origin to your hosting provider
3. Configure caching behaviors
4. Update DNS to point to CloudFront

### Compression
Most hosting providers automatically enable gzip compression. Verify with:
```bash
curl -H "Accept-Encoding: gzip" -I https://yoursite.com
```

## 🔒 Security Considerations

### HTTPS
- Always use HTTPS in production
- Most hosting providers offer free SSL certificates
- GitHub Pages, Netlify, and Vercel provide HTTPS by default

### Content Security Policy
Add CSP headers for enhanced security:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https:; connect-src 'self';">
```

## 📊 Monitoring

### Performance Monitoring
- Use Google PageSpeed Insights
- Monitor Core Web Vitals
- Set up uptime monitoring

### Analytics
- Google Analytics for user behavior
- Search Console for SEO monitoring
- Error tracking with Sentry (optional)

## 🐛 Troubleshooting

### Common Issues

#### CORS Errors
- Ensure you're serving via HTTP/HTTPS, not file://
- Use a local server for development

#### Map Not Loading
- Check browser console for errors
- Verify internet connection
- Ensure Leaflet.js CDN is accessible

#### Data Not Loading
- Check network tab for failed requests
- Verify JSON files are valid
- Ensure proper file paths

#### Mobile Issues
- Test on actual devices
- Use browser dev tools mobile simulation
- Check viewport meta tag

### Debug Mode
Enable debug logging by adding to `app.js`:
```javascript
const DEBUG = true;
if (DEBUG) {
    console.log('Debug mode enabled');
}
```

## 📱 Mobile Optimization

### PWA (Progressive Web App)
To make the site installable on mobile devices, add:

#### `manifest.json`:
```json
{
  "name": "Paul's Missionary Journeys",
  "short_name": "Paul's Journeys",
  "description": "Interactive map of Paul's missionary journeys",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007acc",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

#### Service Worker (Optional):
```javascript
// sw.js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

## 🔄 Continuous Deployment

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

---

Choose the deployment method that best fits your needs. GitHub Pages is recommended for most users due to its simplicity and integration with the development workflow.

