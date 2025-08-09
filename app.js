// app.js - Paul's Missionary Journeys Visualization

// Global variables
let map;
let currentTileLayer;
let placesData = [];
let peopleData = [];
let eventsData = [];
let passagesData = [];
let journeysData = [];
let routesData = [];
let toursData = [];
let markersLayer;
let routesLayer;
let currentFilters = {
    timeline: { start: 30, end: 70 },
    people: [],
    eventTypes: []
};

// Initialize the map
function initMap() {
    map = L.map('map').setView([34.0, 36.0], 6); // Centered roughly on the Mediterranean

    // Default tile layer (Light)
    const lightLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    });

    // Other tile layers
    const terrainLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        maxZoom: 18
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Set default layer
    currentTileLayer = lightLayer;
    lightLayer.addTo(map);

    // Map style switcher logic
    document.getElementById('map-style').addEventListener('change', function(e) {
        const selectedStyle = e.target.value;
        
        // Remove current layer
        map.removeLayer(currentTileLayer);
        
        // Add new layer
        if (selectedStyle === 'light') {
            currentTileLayer = lightLayer;
        } else if (selectedStyle === 'terrain') {
            currentTileLayer = terrainLayer;
        } else if (selectedStyle === 'satellite') {
            currentTileLayer = satelliteLayer;
        }
        
        currentTileLayer.addTo(map);
    });

    // Initialize layer groups
    markersLayer = L.layerGroup().addTo(map);
    routesLayer = L.layerGroup().addTo(map);
}

// Data loading function
async function loadData(filename) {
    try {
        const response = await fetch(`./data/${filename}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}.json: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        showError(`Failed to load ${filename} data. Please check the console for details.`);
        return [];
    }
}

// Error display function
function showError(message) {
    const contextPanel = document.getElementById('context-panel');
    contextPanel.innerHTML = `
        <div class="error-panel">
            <h2>Error</h2>
            <p>${message}</p>
        </div>
    `;
}

// Create marker for a place
function createPlaceMarker(place) {
    const marker = L.marker([place.coords.lat, place.coords.lng])
        .bindTooltip(place.names[0], { 
            permanent: false, 
            direction: 'top',
            offset: [0, -10]
        })
        .on('click', () => showPlaceCard(place));
    
    return marker;
}

// Show place card in right sidebar
function showPlaceCard(place) {
    const contextPanel = document.getElementById('context-panel');
    
    // Find related events
    const relatedEvents = eventsData.filter(event => event.placeId === place.id);
    const relatedPeople = [...new Set(relatedEvents.flatMap(event => event.peopleIds))]
        .map(personId => peopleData.find(person => person.id === personId))
        .filter(person => person);
    
    contextPanel.innerHTML = `
        <div class="place-card">
            <h3>${place.names[0]}</h3>
            <div class="place-names">${place.names.length > 1 ? 'Also known as: ' + place.names.slice(1).join(', ') : ''}</div>
            <div class="place-location">
                <strong>Type:</strong> ${place.type}<br>
                <strong>Province:</strong> ${place.province || 'Unknown'}<br>
                <strong>Modern Location:</strong> ${place.modernCountry}
            </div>
            <p>${place.description}</p>
            
            ${relatedPeople.length > 0 ? `
                <div class="related-people">
                    <strong>Related People:</strong> ${relatedPeople.map(person => person.names[0]).join(', ')}
                </div>
            ` : ''}
            
            ${relatedEvents.length > 0 ? `
                <div class="related-events">
                    <strong>Related Events:</strong>
                    <ul>
                        ${relatedEvents.map(event => `<li>${event.title} (${event.dateRange.start} AD)</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div class="citations">
                <strong>Scripture References:</strong> ${place.citations.join(', ')}
            </div>
            
            <button class="deep-link-button" onclick="copyDeepLink('place', '${place.id}')">
                Copy Deep Link
            </button>
        </div>
    `;
}

// Render places on map
function renderPlaces() {
    markersLayer.clearLayers();
    
    placesData.forEach(place => {
        const marker = createPlaceMarker(place);
        markersLayer.addLayer(marker);
    });
}

// Initialize filters
function initFilters() {
    // Timeline slider
    const timelineSlider = document.getElementById('timeline-slider');
    timelineSlider.addEventListener('input', (e) => {
        currentFilters.timeline.start = parseInt(e.target.value);
        currentFilters.timeline.end = parseInt(e.target.value) + 10; // 10-year window
        applyFilters();
    });

    // Timeline presets
    document.querySelectorAll('.timeline-presets button').forEach(button => {
        button.addEventListener('click', (e) => {
            const year = parseInt(e.target.dataset.year);
            timelineSlider.value = year;
            currentFilters.timeline.start = year;
            currentFilters.timeline.end = year + 10;
            
            // Update active state
            document.querySelectorAll('.timeline-presets button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            applyFilters();
        });
    });

    // People checkboxes
    const peopleContainer = document.getElementById('people-checkboxes');
    peopleData.forEach(person => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" value="${person.id}">
            ${person.names[0]}
        `;
        label.querySelector('input').addEventListener('change', updatePeopleFilter);
        peopleContainer.appendChild(label);
    });

    // Event type checkboxes
    const eventTypes = [...new Set(eventsData.map(event => event.type))];
    const eventTypeContainer = document.getElementById('event-type-checkboxes');
    eventTypes.forEach(type => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" value="${type}" checked>
            ${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
        `;
        label.querySelector('input').addEventListener('change', updateEventTypeFilter);
        eventTypeContainer.appendChild(label);
    });

    // Initialize event types filter with all types selected
    currentFilters.eventTypes = eventTypes;
}

// Update people filter
function updatePeopleFilter() {
    const checkedPeople = Array.from(document.querySelectorAll('#people-checkboxes input:checked'))
        .map(input => input.value);
    currentFilters.people = checkedPeople;
    applyFilters();
}

// Update event type filter
function updateEventTypeFilter() {
    const checkedTypes = Array.from(document.querySelectorAll('#event-type-checkboxes input:checked'))
        .map(input => input.value);
    currentFilters.eventTypes = checkedTypes;
    applyFilters();
}

// Apply current filters
function applyFilters() {
    // Filter events based on current filters
    const filteredEvents = eventsData.filter(event => {
        // Timeline filter
        const eventInTimeRange = event.dateRange.start <= currentFilters.timeline.end && 
                                 event.dateRange.end >= currentFilters.timeline.start;
        
        // People filter (if any people selected, event must involve at least one)
        const peopleMatch = currentFilters.people.length === 0 || 
                           currentFilters.people.some(personId => event.peopleIds.includes(personId));
        
        // Event type filter
        const typeMatch = currentFilters.eventTypes.includes(event.type);
        
        return eventInTimeRange && peopleMatch && typeMatch;
    });

    // Update map display based on filtered events
    updateMapDisplay(filteredEvents);
}

// Update map display based on filtered events
function updateMapDisplay(filteredEvents) {
    // Get places involved in filtered events
    const relevantPlaceIds = [...new Set(filteredEvents.map(event => event.placeId))];
    const relevantPlaces = placesData.filter(place => relevantPlaceIds.includes(place.id));
    
    // Clear and re-render markers
    markersLayer.clearLayers();
    relevantPlaces.forEach(place => {
        const marker = createPlaceMarker(place);
        markersLayer.addLayer(marker);
    });
    
    // Re-render routes based on current timeline
    renderRoutes();
}

// Render journey routes on map
function renderRoutes() {
    routesLayer.clearLayers();
    
    // Get filtered journeys based on timeline
    const filteredJourneys = journeysData.filter(journey => {
        return journey.dateRange.start <= currentFilters.timeline.end && 
               journey.dateRange.end >= currentFilters.timeline.start;
    });
    
    filteredJourneys.forEach(journey => {
        const route = routesData.find(r => r.id === journey.routeRef);
        if (!route) return;
        
        // Create polyline for each route
        const routeCoords = [];
        route.segments.forEach(segment => {
            const fromPlace = placesData.find(p => p.id === segment.from);
            const toPlace = placesData.find(p => p.id === segment.to);
            
            if (fromPlace && toPlace) {
                if (routeCoords.length === 0) {
                    routeCoords.push([fromPlace.coords.lat, fromPlace.coords.lng]);
                }
                routeCoords.push([toPlace.coords.lat, toPlace.coords.lng]);
            }
        });
        
        if (routeCoords.length > 1) {
            const polyline = L.polyline(routeCoords, {
                color: getJourneyColor(journey.id),
                weight: 3,
                opacity: 0.7
            }).bindTooltip(`${journey.label} (${journey.dateRange.start}-${journey.dateRange.end} AD)`);
            
            // Add click handler for route segments
            polyline.on('click', () => showJourneyDetails(journey));
            
            routesLayer.addLayer(polyline);
        }
    });
}

// Get color for journey routes
function getJourneyColor(journeyId) {
    const colors = {
        'journey.1': '#e74c3c',      // Red for first journey
        'journey.2': '#3498db',      // Blue for second journey  
        'journey.3': '#2ecc71',      // Green for third journey
        'journey.rome-voyage': '#9b59b6'  // Purple for Rome voyage
    };
    return colors[journeyId] || '#34495e';
}

// Show journey details in right sidebar
function showJourneyDetails(journey) {
    const contextPanel = document.getElementById('context-panel');
    
    // Get events for this journey
    const journeyEvents = eventsData.filter(event => journey.eventIds.includes(event.id));
    
    contextPanel.innerHTML = `
        <div class="journey-details">
            <h3>${journey.label}</h3>
            <p><strong>Date Range:</strong> ${journey.dateRange.start}-${journey.dateRange.end} AD</p>
            <p>${journey.summary}</p>
            
            <div class="journey-events">
                <h4>Key Events:</h4>
                <ul>
                    ${journeyEvents.map(event => `
                        <li>
                            <strong>${event.title}</strong> (${event.dateRange.start} AD)<br>
                            <small>${event.summary}</small>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <button class="deep-link-button" onclick="copyDeepLink('journey', '${journey.id}')">
                Copy Deep Link
            </button>
        </div>
    `;
}

// Initialize tours
function initTours() {
    const tourList = document.getElementById('tour-list');
    
    if (toursData.length === 0) {
        tourList.innerHTML = '<p>No tours available.</p>';
        return;
    }
    
    toursData.forEach(tour => {
        const tourDiv = document.createElement('div');
        tourDiv.className = 'tour-item';
        tourDiv.innerHTML = `
            <h4>${tour.title}</h4>
            <div class="tour-controls-buttons">
                <button onclick="startTour('${tour.id}')">Start Tour</button>
                <button id="pause-${tour.id}" onclick="pauseTour()" disabled>Pause</button>
                <button id="next-${tour.id}" onclick="nextTourStep()" disabled>Next</button>
                <button id="prev-${tour.id}" onclick="prevTourStep()" disabled>Previous</button>
            </div>
        `;
        tourList.appendChild(tourDiv);
    });
}

// Tour functionality (improved implementation)
let currentTour = null;
let currentTourStep = 0;

function startTour(tourId) {
    currentTour = toursData.find(tour => tour.id === tourId);
    currentTourStep = 0;
    
    if (currentTour && currentTour.steps.length > 0) {
        showTourStep(currentTourStep);
        updateTourButtons();
    }
}

function showTourStep(stepIndex) {
    if (!currentTour || stepIndex < 0 || stepIndex >= currentTour.steps.length) return;
    
    const step = currentTour.steps[stepIndex];
    
    // Update map view
    map.setView([step.view.lat, step.view.lng], step.view.zoom);
    
    // Highlight places mentioned in step.highlights
    if (step.highlights && step.highlights.length > 0) {
        // Clear existing highlights
        markersLayer.eachLayer(layer => {
            if (layer.options.className) {
                layer.options.className = '';
            }
        });
        
        // Add highlights
        step.highlights.forEach(highlightId => {
            const place = placesData.find(p => p.id === highlightId);
            if (place) {
                markersLayer.eachLayer(layer => {
                    if (layer.getLatLng().lat === place.coords.lat && 
                        layer.getLatLng().lng === place.coords.lng) {
                        layer.setIcon(L.divIcon({
                            className: 'highlighted-marker',
                            html: '<div style="background: #ff6b6b; border-radius: 50%; width: 20px; height: 20px; border: 3px solid white;"></div>',
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                        }));
                    }
                });
            }
        });
    }
    
    // Show step info in context panel
    const contextPanel = document.getElementById('context-panel');
    contextPanel.innerHTML = `
        <div class="tour-step">
            <h3>${currentTour.title}</h3>
            <p><strong>Step ${stepIndex + 1} of ${currentTour.steps.length}</strong></p>
            <p>${step.note}</p>
            <div class="tour-navigation">
                <button onclick="prevTourStep()" ${stepIndex === 0 ? 'disabled' : ''}>← Previous</button>
                <button onclick="nextTourStep()" ${stepIndex === currentTour.steps.length - 1 ? 'disabled' : ''}>Next →</button>
                <button onclick="pauseTour()">End Tour</button>
            </div>
        </div>
    `;
}

function nextTourStep() {
    if (currentTour && currentTourStep < currentTour.steps.length - 1) {
        currentTourStep++;
        showTourStep(currentTourStep);
        updateTourButtons();
    }
}

function prevTourStep() {
    if (currentTour && currentTourStep > 0) {
        currentTourStep--;
        showTourStep(currentTourStep);
        updateTourButtons();
    }
}

function pauseTour() {
    // Reset highlights
    markersLayer.eachLayer(layer => {
        if (layer.options.className) {
            layer.setIcon(L.marker([0,0]).options.icon); // Reset to default icon
        }
    });
    
    currentTour = null;
    updateTourButtons();
    
    // Reset context panel
    const contextPanel = document.getElementById('context-panel');
    contextPanel.innerHTML = `
        <h2>Details</h2>
        <p>Click on a map marker or select an item from the left sidebar to see details here.</p>
    `;
}

function updateTourButtons() {
    // Update all tour control buttons
    document.querySelectorAll('.tour-controls-buttons button').forEach(button => {
        if (button.textContent === 'Pause') {
            button.disabled = !currentTour;
        } else if (button.textContent === 'Next') {
            button.disabled = !currentTour || currentTourStep >= currentTour.steps.length - 1;
        } else if (button.textContent === 'Previous') {
            button.disabled = !currentTour || currentTourStep <= 0;
        }
    });
}

// Search functionality
function initSearch() {
    const searchBox = document.getElementById('search-box');
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.id = 'search-results';
    
    // Position search results relative to search box
    searchBox.parentNode.style.position = 'relative';
    searchBox.parentNode.appendChild(searchResults);
    
    let searchTimeout;
    
    searchBox.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length < 2) {
            hideSearchResults();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    searchBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const results = document.querySelectorAll('.search-result-item');
            if (results.length > 0) {
                results[0].click();
            }
        } else if (e.key === 'Escape') {
            hideSearchResults();
        }
    });
    
    // Hide search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchBox.contains(e.target) && !searchResults.contains(e.target)) {
            hideSearchResults();
        }
    });
}

function performSearch(query) {
    const results = [];
    
    // Search places
    placesData.forEach(place => {
        if (place.names.some(name => name.toLowerCase().includes(query)) ||
            place.description.toLowerCase().includes(query) ||
            place.type.toLowerCase().includes(query)) {
            results.push({
                type: 'place',
                item: place,
                title: place.names[0],
                subtitle: `${place.type} in ${place.modernCountry}`
            });
        }
    });
    
    // Search people
    peopleData.forEach(person => {
        if (person.names.some(name => name.toLowerCase().includes(query)) ||
            person.roles.some(role => role.toLowerCase().includes(query)) ||
            person.notes.toLowerCase().includes(query)) {
            results.push({
                type: 'person',
                item: person,
                title: person.names[0],
                subtitle: person.roles.join(', ')
            });
        }
    });
    
    // Search passages
    passagesData.forEach(passage => {
        const passageText = `${passage.book} ${passage.chapter}:${passage.verses}`;
        if (passageText.toLowerCase().includes(query) ||
            passage.book.toLowerCase().includes(query)) {
            results.push({
                type: 'passage',
                item: passage,
                title: passageText,
                subtitle: `${passage.book} chapter ${passage.chapter}`
            });
        }
    });
    
    // Search events
    eventsData.forEach(event => {
        if (event.title.toLowerCase().includes(query) ||
            event.summary.toLowerCase().includes(query) ||
            event.type.toLowerCase().includes(query)) {
            results.push({
                type: 'event',
                item: event,
                title: event.title,
                subtitle: `${event.type} in ${event.dateRange.start} AD`
            });
        }
    });
    
    displaySearchResults(results.slice(0, 10)); // Limit to top 10 results
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
    } else {
        searchResults.innerHTML = results.map(result => `
            <div class="search-result-item" onclick="selectSearchResult('${result.type}', '${result.item.id}')">
                <div class="search-result-type">${result.type}</div>
                <div><strong>${result.title}</strong></div>
                <div style="font-size: 0.8em; color: #666;">${result.subtitle}</div>
            </div>
        `).join('');
    }
    
    searchResults.style.display = 'block';
}

function hideSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

function selectSearchResult(type, id) {
    hideSearchResults();
    
    if (type === 'place') {
        const place = placesData.find(p => p.id === id);
        if (place) {
            map.setView([place.coords.lat, place.coords.lng], 10);
            showPlaceCard(place);
        }
    } else if (type === 'person') {
        const person = peopleData.find(p => p.id === id);
        if (person) {
            showPersonDetails(person);
        }
    } else if (type === 'passage') {
        const passage = passagesData.find(p => p.id === id);
        if (passage) {
            showPassageDetails(passage);
        }
    } else if (type === 'event') {
        const event = eventsData.find(e => e.id === id);
        if (event) {
            showEventDetails(event);
        }
    }
    
    // Clear search box
    document.getElementById('search-box').value = '';
}

// Show person details in right sidebar
function showPersonDetails(person) {
    const contextPanel = document.getElementById('context-panel');
    
    // Find related events
    const relatedEvents = eventsData.filter(event => event.peopleIds.includes(person.id));
    const relatedPlaces = [...new Set(relatedEvents.map(event => event.placeId))]
        .map(placeId => placesData.find(place => place.id === placeId))
        .filter(place => place);
    
    contextPanel.innerHTML = `
        <div class="person-details">
            <h3>${person.names[0]}</h3>
            <div class="person-names">${person.names.length > 1 ? 'Also known as: ' + person.names.slice(1).join(', ') : ''}</div>
            <div class="person-roles">
                <strong>Roles:</strong> ${person.roles.join(', ')}
            </div>
            <p>${person.notes}</p>
            
            ${relatedPlaces.length > 0 ? `
                <div class="related-places">
                    <strong>Related Places:</strong> ${relatedPlaces.map(place => place.names[0]).join(', ')}
                </div>
            ` : ''}
            
            ${relatedEvents.length > 0 ? `
                <div class="related-events">
                    <strong>Related Events:</strong>
                    <ul>
                        ${relatedEvents.map(event => `<li>${event.title} (${event.dateRange.start} AD)</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div class="citations">
                <strong>Scripture References:</strong> ${person.citations.join(', ')}
            </div>
            
            <button class="deep-link-button" onclick="copyDeepLink('person', '${person.id}')">
                Copy Deep Link
            </button>
        </div>
    `;
}

// Show passage details in right sidebar
function showPassageDetails(passage) {
    const contextPanel = document.getElementById('context-panel');
    
    contextPanel.innerHTML = `
        <div class="passage-details">
            <h3>${passage.book} ${passage.chapter}:${passage.verses}</h3>
            <div class="passage-text">
                <p><em>Text placeholder - ${passage.textByTranslation[passage.translationDefault] || 'See full text online'}</em></p>
                <p><a href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(passage.book + ' ' + passage.chapter + ':' + passage.verses)}&version=${passage.translationDefault}" target="_blank">Read full text on Bible Gateway</a></p>
            </div>
            
            ${passage.crossrefs.length > 0 ? `
                <div class="cross-references">
                    <strong>Cross References:</strong> ${passage.crossrefs.join(', ')}
                </div>
            ` : ''}
            
            <button class="deep-link-button" onclick="copyDeepLink('passage', '${passage.id}')">
                Copy Deep Link
            </button>
        </div>
    `;
}

// Show event details in right sidebar
function showEventDetails(event) {
    const contextPanel = document.getElementById('context-panel');
    
    const place = placesData.find(p => p.id === event.placeId);
    const people = event.peopleIds.map(id => peopleData.find(p => p.id === id)).filter(p => p);
    
    contextPanel.innerHTML = `
        <div class="event-details">
            <h3>${event.title}</h3>
            <div class="event-meta">
                <strong>Type:</strong> ${event.type}<br>
                <strong>Date:</strong> ${event.dateRange.start}${event.dateRange.start !== event.dateRange.end ? '-' + event.dateRange.end : ''} AD<br>
                <strong>Location:</strong> ${place ? place.names[0] : 'Unknown'}
            </div>
            <p>${event.summary}</p>
            
            ${people.length > 0 ? `
                <div class="event-people">
                    <strong>People Involved:</strong> ${people.map(person => person.names[0]).join(', ')}
                </div>
            ` : ''}
            
            <div class="citations">
                <strong>Scripture References:</strong> ${event.citations.join(', ')}
            </div>
            
            <button class="deep-link-button" onclick="copyDeepLink('event', '${event.id}')">
                Copy Deep Link
            </button>
        </div>
    `;
}
function copyDeepLink(type, id) {
    const url = new URL(window.location);
    url.hash = `#${type}=${id}&lat=${map.getCenter().lat}&lng=${map.getCenter().lng}&zoom=${map.getZoom()}`;
    
    navigator.clipboard.writeText(url.toString()).then(() => {
        // Show temporary feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy link:', err);
    });
}

// Handle deep links on page load
function handleDeepLinks() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;
    
    const params = new URLSearchParams(hash);
    
    // Handle map view
    const lat = params.get('lat');
    const lng = params.get('lng');
    const zoom = params.get('zoom');
    
    if (lat && lng && zoom) {
        map.setView([parseFloat(lat), parseFloat(lng)], parseInt(zoom));
    }
    
    // Handle place selection
    const placeId = params.get('place');
    if (placeId) {
        const place = placesData.find(p => p.id === placeId);
        if (place) {
            showPlaceCard(place);
        }
    }
}

// Main application initialization
async function initApp() {
    try {
        // Initialize map first
        initMap();
        
        // Load all data
        console.log('Loading data...');
        placesData = await loadData('places');
        peopleData = await loadData('people');
        eventsData = await loadData('events');
        passagesData = await loadData('passages');
        journeysData = await loadData('journeys');
        routesData = await loadData('routes');
        toursData = await loadData('tours');
        
        console.log('Data loaded successfully');
        
        // Initialize UI components
        renderPlaces();
        renderRoutes();
        initFilters();
        initTours();
        initSearch();
        initAccessibilityFeatures();
        
        // Apply initial filters to show all data
        applyFilters();
        
        // Handle deep links
        handleDeepLinks();
        
        console.log('Application initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showError('Failed to initialize the application. Please refresh the page and try again.');
    }
}

// Theme toggle functionality
function initTheme() {
    // Apply saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Add theme toggle button (could be added to header)
    const themeToggle = document.createElement('button');
    themeToggle.textContent = 'Toggle Theme';
    themeToggle.style.position = 'absolute';
    themeToggle.style.top = '10px';
    themeToggle.style.right = '10px';
    themeToggle.style.zIndex = '1001';
    themeToggle.style.padding = '5px 10px';
    themeToggle.style.fontSize = '0.8em';
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    document.body.appendChild(themeToggle);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initApp();
});

// Handle browser back/forward buttons for deep links
window.addEventListener('hashchange', handleDeepLinks);


// Keyboard navigation support
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Escape key to close search results or end tour
        if (e.key === 'Escape') {
            hideSearchResults();
            if (currentTour) {
                pauseTour();
            }
        }
        
        // Arrow keys for tour navigation when tour is active
        if (currentTour) {
            if (e.key === 'ArrowLeft' && currentTourStep > 0) {
                e.preventDefault();
                prevTourStep();
            } else if (e.key === 'ArrowRight' && currentTourStep < currentTour.steps.length - 1) {
                e.preventDefault();
                nextTourStep();
            }
        }
        
        // Ctrl+F to focus search box
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            document.getElementById('search-box').focus();
        }
    });
}

// Export functionality
function exportMapData() {
    const exportData = {
        places: placesData,
        people: peopleData,
        events: eventsData,
        journeys: journeysData,
        routes: routesData,
        passages: passagesData,
        tours: toursData,
        currentView: {
            center: map.getCenter(),
            zoom: map.getZoom()
        },
        filters: currentFilters,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'pauls-journeys-export.json';
    link.click();
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor data loading performance
    const loadStartTime = performance.now();
    
    window.addEventListener('load', () => {
        const loadEndTime = performance.now();
        console.log(`Page load time: ${loadEndTime - loadStartTime}ms`);
        
        // Report performance metrics
        if ('performance' in window && 'getEntriesByType' in performance) {
            const navigation = performance.getEntriesByType('navigation')[0];
            console.log('Performance metrics:', {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                totalTime: navigation.loadEventEnd - navigation.fetchStart
            });
        }
    });
}

// Help system
function initHelpSystem() {
    const helpButton = document.getElementById('help-button');
    if (helpButton) {
        helpButton.addEventListener('click', showHelp);
    }
}

function showHelp() {
    const helpContent = `
        <div class="help-content">
            <h3>How to Use Paul's Journeys</h3>
            <div class="help-section">
                <h4>Navigation</h4>
                <ul>
                    <li><strong>Map:</strong> Click and drag to pan, scroll to zoom</li>
                    <li><strong>Markers:</strong> Click on blue markers to see place details</li>
                    <li><strong>Routes:</strong> Click on colored lines to see journey details</li>
                </ul>
            </div>
            <div class="help-section">
                <h4>Filtering</h4>
                <ul>
                    <li><strong>Timeline:</strong> Use slider or preset buttons to filter by date</li>
                    <li><strong>People:</strong> Check boxes to show events involving specific people</li>
                    <li><strong>Event Types:</strong> Filter by types of events (preaching, miracles, etc.)</li>
                </ul>
            </div>
            <div class="help-section">
                <h4>Search</h4>
                <ul>
                    <li>Type in the search box to find places, people, or passages</li>
                    <li>Click on search results to navigate to that location</li>
                    <li>Use <kbd>Ctrl+F</kbd> to quickly focus the search box</li>
                </ul>
            </div>
            <div class="help-section">
                <h4>Guided Tours</h4>
                <ul>
                    <li>Click "Start Tour" to begin a guided journey</li>
                    <li>Use Next/Previous buttons or arrow keys to navigate</li>
                    <li>Press <kbd>Escape</kbd> to end the tour</li>
                </ul>
            </div>
            <div class="help-section">
                <h4>Keyboard Shortcuts</h4>
                <ul>
                    <li><kbd>Ctrl+F</kbd> - Focus search box</li>
                    <li><kbd>←/→</kbd> - Navigate tour steps</li>
                    <li><kbd>Escape</kbd> - Close search results or end tour</li>
                </ul>
            </div>
            <button onclick="hideHelp()" style="margin-top: 15px;">Close Help</button>
        </div>
    `;
    
    const contextPanel = document.getElementById('context-panel');
    contextPanel.innerHTML = helpContent;
}

function hideHelp() {
    const contextPanel = document.getElementById('context-panel');
    contextPanel.innerHTML = `
        <h2>Details</h2>
        <p>Click on a map marker or select an item from the left sidebar to see details here.</p>
    `;
}

// Initialize all accessibility and performance features
function initAccessibilityFeatures() {
    initKeyboardNavigation();
    initPerformanceMonitoring();
    initHelpSystem();
    
    // Add skip links for screen readers
    const skipLink = document.createElement('a');
    skipLink.href = '#map';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.addEventListener('focus', () => {
        skipLink.classList.remove('sr-only');
    });
    skipLink.addEventListener('blur', () => {
        skipLink.classList.add('sr-only');
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Announce dynamic content changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'announcer';
    document.body.appendChild(announcer);
}

function announceToScreenReader(message) {
    const announcer = document.getElementById('announcer');
    if (announcer) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
}

