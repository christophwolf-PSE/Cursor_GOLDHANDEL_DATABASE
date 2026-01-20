# Goldankauf Prozess-Management System

Eine moderne, responsive Web-App zur Verwaltung des vollständigen Prozesses des Goldankaufs (Doré Gold Bars oder gestempeltes Tafelgold/Hallmark) aus afrikanischen Ländern bis zur Raffination auf 999,9, Zahlung und Abholung in Pforzheim.

## Features

- ✅ **Geschäftsverwaltung (CRUD)**: Erstellen, Bearbeiten, Löschen von Geschäften mit automatischer Geschäftsnummer (G-0001, G-0002, ...)
- ✅ **Prozessschritte**: Fortlaufend nummerierte Schritte mit Status-Tracking (Open/Blocked/Done/Verified)
- ✅ **Template-System**: Master-Ablaufschema als Template, automatische Instanziierung bei Geschäftserstellung
- ✅ **Dokumentenmanagement**: Upload von PDF, JPG, PNG, DOCX, XLSX in Supabase Storage
- ✅ **Risiko-Register**: Verwaltung von Risiken mit Kategorien, Schweregrad, Wahrscheinlichkeit
- ✅ **Audit-Trail**: Vollständige Nachverfolgung aller Änderungen
- ✅ **Export-Funktionen**: CSV, Excel (.xlsx), PDF, Word (.docx) Export
- ✅ **Moderne UI**: Responsive Design, Dark Mode, Stepper/Timeline, Badges
- ✅ **Authentifizierung**: Supabase Auth mit Email/Password

## Technologie-Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript (keine Frameworks)
- **Backend**: Supabase (PostgreSQL, Storage, Auth)
- **Icons**: Tabler Icons (via CDN)
- **Export-Libraries**: 
  - SheetJS (Excel)
  - jsPDF + autotable (PDF)
  - Native Browser APIs (CSV, Word)

## Voraussetzungen

- Node.js (optional, nur für lokalen Server)
- Supabase Account (kostenlos verfügbar auf [supabase.com](https://supabase.com))
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)

## Setup-Anleitung

### 1. Supabase Projekt erstellen

1. Gehen Sie zu [https://app.supabase.com](https://app.supabase.com)
2. Erstellen Sie ein neues Projekt
3. Notieren Sie sich:
   - **Project URL** (z.B. `https://xxxxx.supabase.co`)
   - **anon/public key** (unter Settings → API)

### 2. Datenbank-Migration ausführen

1. Öffnen Sie das Supabase Dashboard
2. Gehen Sie zu **SQL Editor**
3. Kopieren Sie den gesamten Inhalt von `migrations.sql`
4. Führen Sie das SQL-Script aus

### 3. Storage Bucket erstellen

1. Gehen Sie zu **Storage** im Supabase Dashboard
2. Erstellen Sie einen neuen Bucket:
   - **Name**: `deal-documents`
   - **Public**: `false` (privat)
   - **Allowed MIME types**: 
     - `application/pdf`
     - `image/jpeg`
     - `image/png`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

### 4. Supabase Credentials eintragen

1. Öffnen Sie `supabase.js`
2. Ersetzen Sie die Platzhalter:
   ```javascript
   const SUPABASE_URL = 'IHR_SUPABASE_URL'; // z.B. 'https://xxxxx.supabase.co'
   const SUPABASE_ANON_KEY = 'IHR_SUPABASE_ANON_KEY'; // Ihr anon/public key
   ```

### 5. Lokalen Server starten

Da die App ES6-Module verwendet, benötigen Sie einen lokalen Server. Wählen Sie eine der folgenden Optionen:

#### Option A: Python HTTP Server (Python 3)

```bash
# Im Projektverzeichnis
python3 -m http.server 8000
```

Dann öffnen Sie: `http://localhost:8000`

#### Option B: Node.js http-server

```bash
# Installation (einmalig)
npm install -g http-server

# Im Projektverzeichnis
http-server -p 8000
```

Dann öffnen Sie: `http://localhost:8000`

#### Option C: VS Code Live Server

1. Installieren Sie die Extension "Live Server" in VS Code
2. Rechtsklick auf `index.html` → "Open with Live Server"

#### Option D: PHP Built-in Server

```bash
# Im Projektverzeichnis
php -S localhost:8000
```

Dann öffnen Sie: `http://localhost:8000`

### 6. Ersten Benutzer erstellen

1. Öffnen Sie die App im Browser
2. Klicken Sie auf "Sign Up" (oder verwenden Sie das Supabase Dashboard)
3. Erstellen Sie einen Account mit Email/Password

**Hinweis**: Für Admin-Rechte müssen Sie die User-Metadaten im Supabase Dashboard anpassen oder eine `user_roles` Tabelle implementieren. Aktuell wird geprüft, ob die Email auf `@admin.local` endet.

## Projektstruktur

```
.
├── index.html          # Haupt-HTML-Datei
├── styles.css          # Styling mit Dark Mode
├── app.js              # Hauptlogik (Auth, CRUD, UI)
├── supabase.js         # Supabase Client Setup
├── exports.js          # Export-Funktionen (CSV, Excel, PDF, Word)
├── migrations.sql      # Datenbank-Schema + Seed-Daten
└── README.md           # Diese Datei
```

## Verwendung

### Geschäft erstellen

1. Klicken Sie auf "Neues Geschäft"
2. Füllen Sie die Felder aus:
   - **Land**: Herkunftsland des Goldes
   - **Route**: Transportroute (optional)
   - **Ware**: Doré oder Hallmark
   - **Stempelalter**: Nur bei Hallmark (<=5 Jahre oder >5 Jahre)
3. Das System erstellt automatisch:
   - Geschäftsnummer (G-0001, G-0002, ...)
   - Alle Prozessschritte basierend auf dem Template
   - Bei Hallmark >5 Jahre wird automatisch der Schritt "Re-Identifizierung" eingefügt

### Prozessschritte verwalten

1. Öffnen Sie ein Geschäft
2. Klicken Sie auf den Tab "Prozess"
3. Klicken Sie auf einen Schritt, um Details anzuzeigen
4. **Als erledigt markieren**: Schritt als "Done" setzen
5. **Verifizieren**: Nur für Admins, setzt Status auf "Verified"
6. **Blockieren**: Schritt blockieren mit Grund
7. **Dokumente hochladen**: Drag & Drop oder Klick

### Dokumente verwalten

1. Tab "Dokumente" öffnen
2. Dokumente werden nach Schritt gruppiert angezeigt
3. Upload erfolgt pro Schritt im Prozess-Tab
4. Download über den Download-Button

### Risiken verwalten

1. Tab "Risiken" öffnen
2. "Risiko hinzufügen" klicken
3. Kategorie, Beschreibung, Schweregrad (1-5), Wahrscheinlichkeit (1-5) eingeben
4. Risiko-Score wird automatisch berechnet (Schweregrad × Wahrscheinlichkeit)

### Export

1. In der Geschäfts-Detail-Ansicht auf "Export" klicken
2. Format wählen (CSV, Excel, PDF, Word)
3. Inhalt auswählen:
   - Prozessschritte
   - Risiko-Register
   - Dokumentindex
4. Export starten

## Prozessschritte (Template)

Das System enthält 19 vordefinierte Prozessschritte:

1. Kontaktanbahnung Seller/Intermediaries
2. Buyer-Placement
3. KYC/AML/Sanktions-/Embargoprüfung
4. Chain-of-Custody Dokumentation
5. SPA-Erstellung/Signatur
6. Re-Identifizierung (nur bei Hallmark >5 Jahre)
7. Vorab-Dokumente 72h vor Versand
8. Lufttransport (versichert, Zollversiegelung)
9. Zollbereich Frankfurt/Main: Vorprüfung
10. Sicherheitslogistik
11. Ankunft Pforzheim: Annahmebestätigung
12. Fire Assay + optional Second Assay
13. Verbindlicher Assay Report
14. Preisfestlegung (LBMA Fixing Bezug)
15. Zahlung innerhalb vertraglicher Frist
16. Ownership Transfer
17. Raffination zu 999,9
18. Lagerung/Abholung Buyer
19. Abschlussdokumentation

## Sicherheit & Compliance

- **Row Level Security (RLS)**: Aktiviert auf allen Tabellen
- **Authentifizierung**: Supabase Auth erforderlich
- **RBAC**: Basis-Implementierung (Admin vs. User)
- **Audit-Log**: Alle Änderungen werden protokolliert
- **Dokumenten-Sicherheit**: Private Storage-Buckets

**Wichtig**: Diese App ist ein Verwaltungstool und ermöglicht keine Umgehung von Zoll-, Steuer- oder AML-Vorschriften. Alle Prozesse müssen den geltenden Gesetzen entsprechen.

## Anpassungen

### Admin-Rechte konfigurieren

In `supabase.js` können Sie die `isAdmin()` Funktion anpassen:

```javascript
export async function isAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Option 1: Email-basiert
    return user.email?.endsWith('@admin.local');
    
    // Option 2: User-Metadaten
    return user.user_metadata?.role === 'admin';
    
    // Option 3: Eigene user_roles Tabelle
    // const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
    // return data?.role === 'admin';
}
```

### Template anpassen

Das Prozess-Template kann in `migrations.sql` angepasst werden. Nach Änderungen müssen Sie:
1. Die `template_steps` Tabelle aktualisieren
2. Neue Geschäfte verwenden das aktualisierte Template

## Troubleshooting

### "CORS Error" beim Laden

- Stellen Sie sicher, dass Sie einen lokalen Server verwenden (nicht `file://`)
- Überprüfen Sie die Supabase URL und Keys

### "Storage bucket not found"

- Erstellen Sie den Bucket `deal-documents` im Supabase Dashboard
- Überprüfen Sie die Bucket-Berechtigungen

### "Authentication failed"

- Überprüfen Sie die Supabase Credentials in `supabase.js`
- Stellen Sie sicher, dass Auth in Supabase aktiviert ist

### Export funktioniert nicht

- Überprüfen Sie, ob die CDN-Links in `index.html` erreichbar sind
- Bei Word-Export: Browser kann Warnung anzeigen (normal bei HTML-basiertem Export)

## Support

Bei Fragen oder Problemen:
1. Überprüfen Sie die Browser-Konsole (F12) auf Fehler
2. Überprüfen Sie die Supabase Logs im Dashboard
3. Stellen Sie sicher, dass alle Schritte der Setup-Anleitung befolgt wurden

## Lizenz

Dieses Projekt ist für den internen Gebrauch bestimmt.

## Changelog

### Version 1.0.0
- Initiale Version
- CRUD für Geschäfte
- Prozessschritte mit Template-System
- Dokumentenmanagement
- Risiko-Register
- Audit-Trail
- Export-Funktionen (CSV, Excel, PDF, Word)
- Dark Mode
- Responsive Design
