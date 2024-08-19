```mermaid
sequenceDiagram
    participant browser
    participant server
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Response(status: 201 created)
    deactivate server

    Note right of browser: spa.js adds the node to list, no page refresh
