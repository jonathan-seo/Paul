# Data Schemas for Paul's Missionary Journeys Visualization

This document defines the strict JSON schemas for the data files used in this application. All data must conform to these structures for proper validation and functionality.

## `places.json`

Array of place objects. Each object represents a significant location.

```json
[
  {
    "id": "string",         // Unique identifier (e.g., "place.antioch-syria")
    "names": ["string"],    // Array of names, primary first
    "type": "string",       // Type of place (e.g., "city", "port", "island")
    "coords": {             // Geographic coordinates
      "lat": "number",      // Latitude
      "lng": "number"       // Longitude
    },
    "province": "string",   // Roman province (e.g., "Syria", "Judea")
    "modernCountry": "string",// Modern country (e.g., "Turkey", "Israel")
    "description": "string",// Brief description of the place's significance
    "citations": ["string"] // Array of scripture references related to the place
  }
]
```

## `people.json`

Array of people objects. Each object represents a key individual.

```json
[
  {
    "id": "string",         // Unique identifier (e.g., "person.paul")
    "names": ["string"],    // Array of names, primary first
    "roles": ["string"],    // Array of roles (e.g., "apostle", "missionary")
    "notes": "string",      // Brief biographical notes
    "citations": ["string"] // Array of scripture references related to the person
  }
]
```

## `passages.json`

Array of passage objects. Each object represents a scripture reference.

```json
[
  {
    "id": "string",         // Unique identifier (e.g., "pass.acts13_1_3")
    "book": "string",       // Book name (e.g., "Acts")
    "chapter": "number",    // Chapter number
    "verses": "string",     // Verse range (e.g., "1-3", "10")
    "translationDefault": "string", // Default translation (e.g., "ESV")
    "textByTranslation": {  // Object containing snippet by translation
      "ESV": "string"       // Placeholder snippet or empty string
    },
    "crossrefs": ["string"] // Array of related passage IDs
  }
]
```

## `events.json`

Array of event objects. Each object represents a significant event in Paul's journeys.

```json
[
  {
    "id": "string",         // Unique identifier (e.g., "evt.sending-from-antioch")
    "title": "string",      // Title of the event
    "type": "string",       // Type of event (e.g., "commissioning", "preaching", "miracle", "opposition", "council", "letter writing", "imprisonment", "voyage-leg", "trial", "vision", "companion")
    "placeId": "string",    // ID of the primary place associated with the event
    "dateRange": {          // Approximate date range of the event
      "start": "number",    // Start year (AD)
      "end": "number"       // End year (AD)
    },
    "peopleIds": ["string"], // Array of person IDs involved in the event
    "passageIds": ["string"], // Array of passage IDs related to the event
    "summary": "string",    // Brief summary of the event
    "citations": ["string"] // Array of scripture references for the event
  }
]
```

## `journeys.json`

Array of journey objects. Each object defines a missionary journey.

```json
[
  {
    "id": "string",         // Unique identifier (e.g., "journey.1")
    "label": "string",      // Display label for the journey
    "dateRange": {          // Date range of the journey
      "start": "number",    // Start year (AD)
      "end": "number"       // End year (AD)
    },
    "summary": "string",    // Brief summary of the journey
    "eventIds": ["string"], // Array of event IDs belonging to this journey
    "routeRef": "string"    // Reference to the corresponding route ID in routes.json
  }
]
```

## `routes.json`

Array of route objects. Each object defines the segments of a journey's route.

```json
[
  {
    "id": "string",         // Unique identifier (e.g., "route.journey1")
    "journeyId": "string",  // ID of the journey this route belongs to
    "segments": [           // Array of route segments
      {
        "from": "string",   // ID of the starting place for the segment
        "to": "string",     // ID of the ending place for the segment
        "approxDate": "number",// Approximate year of this segment
        "mode": "string",   // Mode of travel (e.g., "road", "ship")
        "notes": "string"   // Any specific notes for the segment
      }
    ]
  }
]
```

## `tours.json`

Array of tour objects. Each object defines a guided tour.

```json
[
  {
    "id": "string",         // Unique identifier (e.g., "tour.journey2")
    "title": "string",      // Title of the tour
    "steps": [              // Array of tour steps
      {
        "view": {           // Map view for this step
          "lat": "number",  // Latitude
          "lng": "number",  // Longitude
          "zoom": "number"  // Zoom level
        },
        "highlights": ["string"], // Array of place/route IDs to highlight
        "note": "string"    // Short note for the step
      }
    ]
  }
]
```


