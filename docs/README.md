# Paul's Missionary Journeys Visualization

This is a static, interactive website that visualizes the missionary journeys and life of the Apostle Paul, designed to run directly from a plain folder or GitHub Pages without any server or complex build steps.

## Features

*   **Interactive Map:** Explore Paul's journeys on a Leaflet-powered map with customizable tile layers.
*   **Place Cards:** Click on markers to view detailed information about biblical locations.
*   **Journey Routes:** Visualize the paths of Paul's missionary journeys with segmented routes.
*   **Timeline:** Filter events and highlight routes based on a historical timeline.
*   **Scripture Integration:** Access relevant scripture passages.
*   **People Filters:** Discover places and events associated with key individuals.
*   **Guided Tours:** Follow curated tours through significant events and locations.
*   **Data-Driven:** All content is loaded from simple JSON files.
*   **Offline Support:** Designed to work offline once loaded, with Service Worker caching.
*   **Accessibility:** Keyboard navigation, ARIA roles, and high-contrast theme.

## Quick Start

To view the application, simply open `index.html` in your web browser. No server or special setup is required.

```bash
# Navigate to the project directory
cd paul-journeys-website

# Open the main file in your browser (example for Linux)
x-www-browser index.html

# Or simply double-click index.html in your file explorer.
```

## Project Structure

```
/
  index.html          # Main application entry point
  styles.css          # Global styles
  app.js              # Main JavaScript application logic
  /data/              # JSON data files
    places.json
    people.json
    events.json
    passages.json
    journeys.json
    routes.json
    tours.json
  /img/
    ui/
      icons.svg       # Placeholder for UI icons
  /docs/              # Documentation files
    CONTRIBUTING.md
    DATA_SCHEMA.md
    CONTENT_GUIDE.md
    LICENSE.txt
    README.md
```

## Data Contribution Guide

If you wish to contribute data (e.g., new places, events, passages), please refer to the `docs/DATA_SCHEMA.md` for the required JSON structure and `docs/CONTENT_GUIDE.md` for content guidelines and citation style.

## Testing Checklist

Before contributing or deploying, please ensure the following:

*   **Load from file system:** Open `index.html` directly from your local file system. Verify that the app loads without errors and all features are functional.
*   **Load from GitHub Pages (or similar static host):** If deploying, ensure the app functions correctly when hosted on a static web server.
*   **Toggle each base map style:** Verify that the 

map styles (Light, Terrain, Satellite) switch correctly.
*   **Run the Journey 2 tour end to end:** Verify that the guided tour animates through all steps, updates the map view, and highlights correctly.
*   **Turn on high-contrast mode and navigate with keyboard only:** Test accessibility features. Ensure all interactive elements are reachable via Tab and have visible focus styles.
*   **Verify deep links:** Copy a deep link for a place, an event, a tour step, and a filtered timeline. Paste them into a new tab/window and confirm that the view is reproduced accurately.
*   **Export buttons:** Test that the export buttons correctly download CSV and GeoJSON files with the currently filtered events.

## Future Enhancements (TODO)

*   **Letters Overlay:** Add a layer to visualize the locations to which Paul wrote his epistles.
*   **Roman Roads Layer:** Integrate a layer showing the Roman road network.
*   **Relationship Graph:** Develop a visualization of relationships between people and places.
*   **I18n Strings:** Centralize and implement internationalization for UI strings.

## License

This project is licensed under the MIT License - see the `LICENSE.txt` file for details.


