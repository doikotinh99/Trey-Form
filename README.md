# HVAC Forms Template Set

A high-performance, responsive, zero-framework, multi-page printable HVAC form suite built with pure HTML5, CSS3, and vanilla JavaScript.

---

## 1. Project Structure

```
trey-form/
├── index.html              # Markup only + <link>/<script> tags
├── css/
│   ├── variables.css       # :root custom properties (colors, fonts, spacing, themes)
│   ├── base.css            # Reset, body, typography, utilities
│   ├── layout.css          # Grid, containers, navbar, toolbar, page wrapper
│   ├── components.css      # Buttons, cards, tables, forms, badges, alerts, tabs
│   ├── pages.css           # Page/section-specific styles (sheets, bindings, specs, photos)
│   └── print.css           # All @media print rules and @page definitions
├── js/
│   ├── config.js           # Constants, themes, labels, static lists (FORMS, COLS, TERMS)
│   ├── data.js             # Sample data generator / data access (no DOM code)
│   ├── templates.js        # Functions that return HTML strings (B, IMG, REP, card, BODY)
│   ├── render.js           # DOM rendering, data binding, and window.HVAC public API
│   ├── events.js           # Event listeners (delegated where possible) and print flows
│   └── main.js             # App start, wires components and triggers initial render()
├── assets/
│   └── images/             # Product equipment images, inspection photos, signature
└── README.md               # Structure, load order, how to add a page/theme
```

---

## 2. Load Order & Architecture

### CSS Cascade Order
CSS files must be loaded in the exact cascade sequence below:
1. `css/variables.css`: Defines `:root` variables (`--brand`, `--accent`, `--bs-border`, etc.).
2. `css/base.css`: Applies box-sizing reset, baseline fonts, heading sizing, and typography utilities.
3. `css/layout.css`: Establishes grid system (`.row`, `.col-*`), toolbar chrome, and page wrappers.
4. `css/components.css`: Styles interactive UI controls (buttons, inputs, cards, tables, tabs).
5. `css/pages.css`: Configures document sheets (`.sheet`), equipment card structures, and data tags.
6. `css/print.css`: Overrides layout with `@media print` rules, `@page` margins, and break rules.

### JavaScript Dependency Order
Scripts are loaded using classic `<script defer>` in strict dependency order:
1. `js/config.js`: Initializes `THEMES`, `FORMS`, `COLS`, `TERMS`.
2. `js/data.js`: Declares `sampleFor(k)` for data generation.
3. `js/templates.js`: Declares template builders (`B()`, `IMG()`, `REP()`, `BODY`) dependent on `config.js`.
4. `js/render.js`: Initializes the rendering and data-binding engine (`bind()`, `render()`, `window.HVAC`).
5. `js/events.js`: Binds interactive UI events and print workflow handlers.
6. `js/main.js`: Populates UI selects and executes the initial `render()`.

> **Note on `file://` Compatibility**: No ES Modules (`type="module"`) or bundlers are required. The project works seamlessly by opening `index.html` directly from the local file system.

---

## 3. Developer Guide: How to Extend

### How to Add a New Form Template
1. Open `js/config.js` and append your form key and display name to `FORMS`:
   ```javascript
   FORMS.push(["my-new-form", "My New Form Title"]);
   ```
2. Open `js/templates.js` and define the form layout inside the `BODY` object:
   ```javascript
   BODY["my-new-form"] = () => parties() + `<h5 class="mt-3">Custom Section</h5>...`;
   ```
3. Open `js/data.js` and add any necessary sample payload fields inside `sampleFor(k)`.

### How to Add a New Company Theme
1. Open `js/config.js` and add an entry to the `THEMES` dictionary:
   ```javascript
   THEMES["apex"] = {
       label: "Apex Comfort HVAC",
       brand: "#1e3a8a",
       accent: "#f59e0b",
       font: 'Inter, system-ui, sans-serif'
   };
   ```
2. The dropdown `#co` automatically updates and switches CSS variables `--brand`, `--accent`, and `--font` dynamically.

---

## 4. Public API

The project exposes a clean, lightweight public API on `window.HVAC`:
- `HVAC.render(sectionElement, dataObject, isPlaceholderMode)`: Binds a data object to a rendered form section.
- `HVAC.fields(formKey)`: Returns a sorted list of all database field paths present in a form template.
- `HVAC.forms`: Array of all available form definitions `[formKey, formTitle]`.
- `window.App`: Namespace containing shared modules and state (`cur`, `co`, `ph`).

---

## 5. View Modes: Link View vs Print / PDF View

The suite supports two distinct display presentations to balance visual appeal and ink-saving requirements:
1. **Link View (Full Color / Online)**:
   - Upper banner (`.doc-head`) utilizes the company's full brand color (`var(--brand)`) with clean white typography and vibrant accents.
   - Ideal for customer-facing web links, online proposal reviews, and digital portals.
2. **Print / PDF View (Ink-Saving / Clean)**:
   - Header switches to a clean white background with crisp typography and a minimalist bottom border.
   - Automatically triggered during printing/PDF export via `@media print`.
   - Can be previewed on screen via the toolbar's **View format** dropdown or directly via the `?view=print` URL parameter.
