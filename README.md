# Paul's Missionary Journeys - Interactive Map

An interactive web application that visualizes the missionary journeys and life of the Apostle Paul through an engaging map interface with historical data, guided tours, and comprehensive filtering capabilities.

## 🌟 Features

### Interactive Map
- **Zoomable Map**: Explore the Mediterranean region with multiple map styles (Light, Terrain, Satellite)
- **Place Markers**: Click on blue markers to see detailed information about cities and locations
- **Journey Routes**: Colored route lines showing Paul's four missionary journeys
- **Dynamic Filtering**: Filter content by timeline, people, and event types

### Search & Discovery
- **Real-time Search**: Search across places, people, passages, and events
- **Smart Results**: Categorized search results with type indicators
- **Deep Linking**: Share specific locations and content with generated URLs

### Guided Tours
- **Step-by-step Tours**: Follow Paul's journeys with guided narration
- **Interactive Navigation**: Use buttons or keyboard arrows to navigate tour steps
- **Highlighted Locations**: Visual emphasis on relevant places during tours

### Accessibility & Performance
- **Screen Reader Support**: Full ARIA labels and semantic HTML
- **Keyboard Navigation**: Complete keyboard accessibility with shortcuts
- **Mobile Responsive**: Optimized for all device sizes
- **Performance Optimized**: Fast loading with performance monitoring

## 🚀 Quick Start

### Option 1: Direct File Access
1. Download or clone this repository
2. Open `index.html` in a modern web browser
3. Start exploring Paul's journeys!

### Option 2: Local Server (Recommended)
```bash
# Navigate to the project directory
cd paul-journeys-website

# Start a simple HTTP server
python3 -m http.server 8000
# OR
npx serve .

# Open http://localhost:8000 in your browser
```

### Option 3: GitHub Pages
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Your site will be available at `https://yourusername.github.io/paul-journeys-website`

## 📖 How to Use

### Basic Navigation
- **Pan**: Click and drag the map to move around
- **Zoom**: Use mouse wheel or +/- buttons to zoom in/out
- **Markers**: Click blue markers to see place details
- **Routes**: Click colored lines to see journey information

### Filtering Content
- **Timeline**: Use the slider or preset buttons (AD 33, 46-48, etc.) to filter by date
- **People**: Check boxes to show events involving specific individuals
- **Event Types**: Filter by categories like Preaching, Miracles, Opposition, etc.

### Search Functionality
- Type in the search box to find places, people, or biblical passages
- Click on search results to navigate directly to that content
- Use `Ctrl+F` to quickly focus the search box

### Guided Tours
1. Scroll to the "Guided Tours" section in the left sidebar
2. Click "Start Tour" for any available journey
3. Use "Next" and "Previous" buttons to navigate through steps
4. Press "End Tour" or `Escape` key to exit

### Keyboard Shortcuts
- `Ctrl+F` - Focus search box
- `←/→` - Navigate tour steps (when tour is active)
- `Escape` - Close search results or end tour

## 📊 Data Structure

The application uses JSON files for all historical data:

- **`places.json`** - Cities, regions, and geographical locations
- **`people.json`** - Key figures in Paul's ministry
- **`events.json`** - Historical events and their details
- **`journeys.json`** - Paul's four missionary journeys
- **`routes.json`** - Geographical routes between locations
- **`passages.json`** - Biblical references and cross-references
- **`tours.json`** - Guided tour definitions and steps

## 🛠 Technical Details

### Technologies Used
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js with OpenStreetMap tiles
- **Data**: JSON files for all content
- **Styling**: CSS Grid and Flexbox for responsive layout

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- No build step required
- Lazy loading of map tiles
- Efficient data filtering and search
- Performance monitoring built-in

## 📚 Educational Use

This application is designed for:
- **Bible Study Groups**: Interactive exploration of Paul's ministry
- **Educational Institutions**: Teaching New Testament history
- **Personal Study**: Self-guided learning about early Christianity
- **Churches**: Visual aids for sermons and lessons

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Data Contributions
- Historical accuracy is paramount
- Include biblical references for all events
- Follow the existing JSON schema
- Provide sources for new information

## 📄 License

This project is licensed under the MIT License - see [LICENSE.txt](docs/LICENSE.txt) for details.

## 🙏 Acknowledgments

- **Biblical Data**: Various scholarly sources and biblical commentaries
- **Mapping**: OpenStreetMap contributors and Leaflet.js
- **Historical Research**: Multiple academic sources on early Christianity
- **Community**: Contributors and users who help improve the application

## 📞 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Documentation**: See the `docs/` folder for detailed guides
- **Community**: Join discussions in GitHub Discussions

## 🗺 Data Sources

Historical data compiled from:
- The Acts of the Apostles (New Testament)
- Pauline Epistles
- Archaeological evidence
- Historical atlases of the ancient world
- Academic biblical commentaries

---

**Note**: This is an educational tool designed to enhance understanding of biblical history. While we strive for historical accuracy, this should complement, not replace, serious biblical study and scholarship.

