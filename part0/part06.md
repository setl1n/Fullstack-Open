```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Submission triggers submit event
    Note right of browser: Event handler prevents default of new GET request upon trigger
    Note right of browser: Event handler create new note, adds new note to notes list
    Note right of browser: Event handler rerenders the notes
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
```

