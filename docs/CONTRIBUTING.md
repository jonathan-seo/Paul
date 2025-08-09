# Contributing to Paul's Missionary Journeys

Thank you for your interest in contributing to this educational project! This guide will help you get started with contributing to the Paul's Missionary Journeys interactive map.

## 🎯 Types of Contributions

We welcome several types of contributions:

### 📊 Data Contributions
- **Historical Events**: Add or improve event descriptions
- **Geographical Data**: Enhance place information and coordinates
- **Biblical References**: Add scripture citations and cross-references
- **People Information**: Expand biographical details
- **Tour Content**: Create new guided tours or improve existing ones

### 💻 Code Contributions
- **Bug Fixes**: Resolve issues with functionality
- **Feature Enhancements**: Improve existing features
- **New Features**: Add new capabilities
- **Performance Improvements**: Optimize loading and rendering
- **Accessibility**: Enhance screen reader support and keyboard navigation

### 📝 Documentation
- **User Guides**: Improve help documentation
- **Technical Documentation**: Enhance developer guides
- **Educational Content**: Add historical context and explanations

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime Text, etc.)
- Basic knowledge of HTML, CSS, and JavaScript
- Understanding of JSON data format

### Setting Up Development Environment

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/yourusername/paul-journeys-website.git
   cd paul-journeys-website
   ```

2. **Start Local Server**
   ```bash
   # Option 1: Python
   python3 -m http.server 8000
   
   # Option 2: Node.js
   npx serve .
   
   # Option 3: PHP
   php -S localhost:8000
   ```

3. **Open in Browser**
   Navigate to `http://localhost:8000`

## 📊 Data Contribution Guidelines

### Data Accuracy Standards
- **Biblical Foundation**: All events must have biblical references
- **Historical Accuracy**: Use scholarly sources for historical claims
- **Geographical Precision**: Verify coordinates using reliable sources
- **Source Attribution**: Include references for all data

### JSON Schema Guidelines

#### Places (`data/places.json`)
```json
{
  "id": "place.unique-identifier",
  "names": ["Primary Name", "Alternative Name"],
  "type": "city|region|landmark",
  "coords": {"lat": 0.0, "lng": 0.0},
  "modernCountry": "Modern Country Name",
  "province": "Ancient Province",
  "description": "Historical description",
  "significance": "Why this place matters",
  "citations": ["Acts 16:12", "Phil 1:1"]
}
```

#### Events (`data/events.json`)
```json
{
  "id": "event.unique-identifier",
  "title": "Event Title",
  "type": "preaching|miracle|opposition|etc",
  "dateRange": {"start": 50, "end": 50},
  "placeId": "place.reference",
  "peopleIds": ["person.paul", "person.silas"],
  "summary": "Brief description",
  "details": "Detailed account",
  "citations": ["Acts 16:16-40"]
}
```

### Data Quality Checklist
- [ ] All required fields are present
- [ ] Biblical references are accurate
- [ ] Coordinates are verified
- [ ] Spelling and grammar are correct
- [ ] Historical context is accurate
- [ ] Sources are cited

## 💻 Code Contribution Guidelines

### Code Style
- **JavaScript**: Use ES6+ features, camelCase naming
- **CSS**: Use BEM methodology for class names
- **HTML**: Semantic HTML5 with proper ARIA labels
- **Indentation**: 4 spaces (no tabs)

### Testing Requirements
- Test on multiple browsers
- Verify mobile responsiveness
- Check accessibility with screen readers
- Validate all data loads correctly
- Test search functionality
- Verify tour navigation works

### Performance Guidelines
- Minimize DOM manipulations
- Use efficient data filtering
- Optimize image sizes
- Lazy load when possible
- Monitor console for errors

## 🔄 Contribution Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b data/add-new-events
```

### 2. Make Changes
- Follow the guidelines above
- Test thoroughly
- Document your changes

### 3. Commit Changes
```bash
git add .
git commit -m "Add detailed description of changes"
```

### 4. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```
Then create a pull request on GitHub.

## 📋 Pull Request Guidelines

### PR Title Format
- `feat: Add new feature description`
- `fix: Resolve specific bug`
- `data: Add events for second journey`
- `docs: Update user guide`

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Data update
- [ ] Documentation update

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on mobile
- [ ] Verified accessibility

## Biblical References
List any new biblical references added

## Sources
List sources for historical data
```

## 🎓 Educational Standards

### Historical Accuracy
- Use multiple scholarly sources
- Prefer archaeological evidence
- Acknowledge uncertainties
- Avoid speculation without evidence

### Biblical Fidelity
- Use standard biblical references
- Include multiple translations when helpful
- Respect different denominational perspectives
- Focus on widely accepted historical facts

### Educational Value
- Make content accessible to various education levels
- Provide context for historical events
- Include relevant background information
- Support different learning styles

## 🐛 Reporting Issues

### Bug Reports
Include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Console error messages

### Feature Requests
Include:
- Clear description of desired feature
- Use case or educational benefit
- Potential implementation approach
- Relevant biblical or historical context

## 🏆 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project documentation
- Release notes for significant contributions

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Documentation**: Check the `docs/` folder first

## 📚 Resources

### Biblical Resources
- Bible Gateway (multiple translations)
- Blue Letter Bible (original languages)
- Archaeological study Bibles

### Historical Resources
- Academic biblical commentaries
- Historical atlases
- Archaeological journals

### Technical Resources
- Leaflet.js documentation
- MDN Web Docs
- Web Accessibility Guidelines (WCAG)

---

Thank you for contributing to this educational resource! Your efforts help make biblical history more accessible and engaging for learners worldwide.

