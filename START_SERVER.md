# Lokalen Server starten

## Option 1: Python HTTP Server (Empfohlen)

```bash
# Im Projektverzeichnis
python3 -m http.server 8000
```

Dann öffnen Sie: **http://localhost:8000**

## Option 2: Node.js http-server

```bash
# Installation (einmalig)
npm install -g http-server

# Im Projektverzeichnis
http-server -p 8000
```

Dann öffnen Sie: **http://localhost:8000**

## Option 3: VS Code Live Server

1. Installieren Sie die Extension "Live Server" in VS Code
2. Rechtsklick auf `index.html` → "Open with Live Server"

## Option 4: PHP Built-in Server

```bash
# Im Projektverzeichnis
php -S localhost:8000
```

Dann öffnen Sie: **http://localhost:8000**

## Wichtig

- Die App muss über einen lokalen Server laufen (nicht direkt `file://`)
- Port 8000 ist Standard, Sie können auch einen anderen Port verwenden
- Stellen Sie sicher, dass der Server im Projektverzeichnis gestartet wird
