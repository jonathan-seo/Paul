# Content Guide for Paul's Missionary Journeys Visualization

This guide provides instructions and best practices for adding and editing content (places, people, events, passages) in the application's data files. Adhering to these guidelines ensures consistency and accuracy.

## General Principles

*   **Accuracy:** All information should be historically and biblically accurate to the best of current scholarship.
*   **Conciseness:** Descriptions and summaries should be brief and to the point, providing essential information without excessive detail.
*   **Clarity:** Use clear and unambiguous language.
*   **Consistency:** Follow the naming conventions and data formats defined in `DATA_SCHEMA.md`.
*   **Citations:** Always provide scripture citations for events, places, and people where applicable.

## Adding Places (`places.json`)

When adding a new place:

*   **`id`**: Use a unique, lowercase, hyphen-separated ID prefixed with `place.` (e.g., `place.ephesus`).
*   **`names`**: Include the most common name first, followed by any alternate historical or modern names.
*   **`type`**: Categorize the place (e.g., `city`, `port`, `island`, `region`).
*   **`coords`**: Obtain accurate latitude (`lat`) and longitude (`lng`) coordinates. Use reliable sources like historical atlases or geographical databases.
*   **`province`**: Specify the Roman province the place belonged to during Paul's time.
*   **`modernCountry`**: Specify the modern country where the place is located today.
*   **`description`**: A brief sentence or two describing its significance in Paul's journeys or biblical history.
*   **`citations`**: List relevant scripture references where the place is mentioned.

**Example:**
```json
  {
    "id": "place.corinth",
    "names": ["Corinth"],
    "type": "city",
    "coords": { "lat": 37.9429, "lng": 22.9346 },
    "province": "Achaia",
    "modernCountry": "Greece",
    "description": "Paul stayed here for a year and a half, establishing a strong church.",
    "citations": ["Acts 18:1-18", "1 Corinthians 1:2"]
  }
```

## Adding People (`people.json`)

When adding a new person:

*   **`id`**: Use a unique, lowercase, hyphen-separated ID prefixed with `person.` (e.g., `person.priscilla`).
*   **`names`**: Include the most common name first, followed by any alternate names.
*   **`roles`**: List their key roles or relationships (e.g., `apostle`, `missionary`, `tentmaker`, `disciple`, `proconsul`).
*   **`notes`**: A brief biographical note, especially concerning their interaction with Paul.
*   **`citations`**: List relevant scripture references where the person is mentioned.

**Example:**
```json
  {
    "id": "person.apollos",
    "names": ["Apollos"],
    "roles": ["preacher", "teacher"],
    "notes": "An eloquent Jew from Alexandria who was instructed more accurately by Priscilla and Aquila.",
    "citations": ["Acts 18:24-28"]
  }
```

## Adding Passages (`passages.json`)

When adding a new scripture passage:

*   **`id`**: Use a unique, lowercase, hyphen-separated ID prefixed with `pass.` (e.g., `pass.acts17_16_34`).
*   **`book`**: Full name of the biblical book (e.g., `Acts`, `Romans`).
*   **`chapter`**: Chapter number.
*   **`verses`**: Verse or range of verses (e.g., `1-3`, `10`, `1-5, 7`).
*   **`translationDefault`**: Set to `ESV`.
*   **`textByTranslation`**: For `ESV`, use `"[placeholder snippet]"` or `""` for licensing safety. The application will link out to an online Bible for full text.
*   **`crossrefs`**: List IDs of other related passages if applicable.

**Example:**
```json
  {
    "id": "pass.acts20_17_38",
    "book": "Acts",
    "chapter": 20,
    "verses": "17-38",
    "translationDefault": "ESV",
    "textByTranslation": {
      "ESV": "[placeholder snippet]"
    },
    "crossrefs": []
  }
```

## Adding Events (`events.json`)

When adding a new event:

*   **`id`**: Use a unique, lowercase, hyphen-separated ID prefixed with `evt.` (e.g., `evt.ephesus-riot`).
*   **`title`**: A concise, descriptive title for the event.
*   **`type`**: Categorize the event. Use one of the following:
    *   `commissioning`
    *   `preaching`
    *   `miracle`
    *   `opposition`
    *   `council`
    *   `letter-writing`
    *   `imprisonment`
    *   `voyage-leg`
    *   `trial`
    *   `vision`
    *   `companion`
    *   `conversion`
*   **`placeId`**: The `id` of the primary place where the event occurred.
*   **`dateRange`**: Approximate start and end years (AD). If a single year, `start` and `end` should be the same. If uncertain, provide a reasonable range and note it in the `summary`.
*   **`peopleIds`**: List `id`s of all key people involved in the event.
*   **`passageIds`**: List `id`s of all relevant scripture passages that describe the event.
*   **`summary`**: A brief summary (1-2 sentences) of what happened during the event.
*   **`citations`**: List relevant scripture references for the event.

**Example:**
```json
  {
    "id": "evt.eutychus-raised",
    "title": "Eutychus Raised from the Dead",
    "type": "miracle",
    "placeId": "place.troas",
    "dateRange": { "start": 57, "end": 57 },
    "peopleIds": ["person.paul", "person.eutychus"],
    "passageIds": ["pass.acts20_7_12"],
    "summary": "Paul raises Eutychus from the dead after he falls from a window during Paul's long sermon.",
    "citations": ["Acts 20:7-12"]
  }
```

## Adding Journeys (`journeys.json`)

*   **`id`**: Unique ID (e.g., `journey.1`, `journey.rome-voyage`).
*   **`label`**: Display name (e.g., `First Missionary Journey`).
*   **`dateRange`**: Start and end years.
*   **`summary`**: Brief overview of the journey.
*   **`eventIds`**: List of `id`s of events that occurred during this journey, in chronological order.
*   **`routeRef`**: Reference to the corresponding route in `routes.json`.

## Adding Routes (`routes.json`)

*   **`id`**: Unique ID (e.g., `route.journey1`).
*   **`journeyId`**: The `id` of the journey this route belongs to.
*   **`segments`**: An array of objects, each defining a leg of the journey.
    *   **`from`**: `id` of the starting place.
    *   **`to`**: `id` of the ending place.
    *   **`approxDate`**: Approximate year of this segment.
    *   **`mode`**: `road` or `ship`.
    *   **`notes`**: Any specific details about this segment.

## Adding Tours (`tours.json`)

*   **`id`**: Unique ID (e.g., `tour.journey2`).
*   **`title`**: Display name for the tour.
*   **`steps`**: An array of objects, each defining a step in the tour.
    *   **`view`**: Map coordinates and zoom level for this step.
    *   **`highlights`**: Array of `id`s of places or routes to highlight for this step.
    *   **`note`**: A short descriptive note for the step.


