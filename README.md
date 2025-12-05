# Montis Uzbekistan Website

A modern, multilingual corporate website for Montis Uzbekistan - an international trade and engineering company specializing in the import, export, and integrated supply of production equipment and technological lines.

## 🌐 Features

- **Multilingual Support**: Available in three languages:
  - Russian (RU)
  - English (EN)
  - Uzbek (UZ)
- **Responsive Design**: Fully responsive layout that works on all devices
- **Smooth Animations**: Elegant page transitions and fade-in effects
- **Modern UI/UX**: Clean, professional design with dark theme
- **Mobile Navigation**: Hamburger menu with drawer navigation for mobile devices

## 📁 Project Structure

```
Montis-REbuilding/
├── index.html              # Home page
├── about.html              # About Us page
├── catalog.html            # Product catalog
├── services.html           # Services overview
├── services-list.html      # Detailed services list
├── equipment.html          # Equipment listing
├── projects.html           # Projects showcase
├── projections.html        # Projections page
├── assets/
│   └── images/
│       ├── logo.png        # Company logo
│       └── company.png     # Company image
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   └── main.js            # JavaScript functionality
└── lang/
    └── lang.json          # Multi-language translations
```

## 🚀 Getting Started

### Prerequisites

No special prerequisites are needed! This is a static website that can be opened directly in a web browser.

### Installation

1. Clone or download this repository
2. Open `index.html` in a web browser

Or use a local development server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 💻 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with smooth transitions
- **Vanilla JavaScript**: No frameworks required
- **Chart.js**: For data visualization (loaded via CDN)
- **Google Fonts**: Inter font family
- **JSON**: For multi-language support

## 📄 Pages

- **Home** (`index.html`): Hero section, featured tenders, and company overview
- **About** (`about.html`): Company information, mission, values, and experience
- **Catalog** (`catalog.html`): Product catalog and equipment categories
- **Services** (`services.html`): Overview of services offered
- **Services List** (`services-list.html`): Detailed list of all services
- **Equipment** (`equipment.html`): Equipment and technology listings
- **Projects** (`projects.html`): Showcase of turnkey projects

## 🌍 Language Switching

The website features a language switcher in the header that allows users to switch between:
- Russian (RU)
- English (EN)
- Uzbek (UZ)

Language preferences are stored in browser localStorage for persistence across sessions.

## 🎨 Customization

### Adding/Modifying Translations

Edit `lang/lang.json` to add or modify translations. The file uses a nested JSON structure with language codes as top-level keys.

### Styling

Main styles are in `css/style.css`. The website uses a dark theme with customizable color variables.

### Adding New Pages

1. Create a new HTML file following the structure of existing pages
2. Include the same header, navigation, and footer structure
3. Add translations to `lang/lang.json` for any new content

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

All rights reserved. © SHN-DESIGN

## 📧 Contact

For more information about Montis Uzbekistan:
- **Address**: Tashkent, Buyuk Ipak Yuli Street, 2
- **Phone**: +998 (20) 000-10-82
- **Email**: montisred0gmail.com

## 🔧 Development Notes

- The website uses vanilla JavaScript with no build process required
- All translations are loaded from `lang/lang.json` via fetch API
- Smooth page transitions are implemented using CSS and JavaScript
- Mobile menu uses a drawer/overlay pattern for better UX

