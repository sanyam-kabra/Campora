# Campora

Campora is a full-stack web application for discovering, reviewing, and sharing campgrounds. Users can create accounts, add new campgrounds, upload images, write reviews, and search for campgrounds by name or location with an interactive map.

## Technologies

- **Backend:** Node.js, Express
- **Templating Engine:** EJS
- **Database:** MongoDB with Mongoose
- **File Uploads & Hosting:** Cloudinary
- **Geolocation & Maps:** MapTiler (forward geocoding + interactive maps)
- **Styling:** Bootstrap 5 + custom CSS modules
- **Authentication:** Passport.js with local strategy
- **Validation:** Joi, Express-Validator, Mongoose schemas
- **Dev Tools:** dotenv, method-override, connect-flash

## Features

**User Authentication:**
- Register, login, and logout securely with hashed passwords.

**Campground Management:**
- Create, read, update, and delete campgrounds.
- Upload multiple images per campground, hosted on Cloudinary.
- Geocode campground location to attach coordinates for mapping.

**Review System:**
- Post reviews with star ratings and text.
- Edit/delete reviews (only by review authors).

**Search and Interactive Map:**
- Search campgrounds by name or location (case-insensitive).
- Geocode user search input and zoom the map to the appropriate area.

**Responsive Design:**
- Design suitable for both small and larger screens.
- Custom-page styling split into separate CSS files for modularity.

---

## Repository Structure

├── app.js # Main application entry point
├── /controllers # App controller logic (CRUD, search, geocoding)
├── /models # Mongoose schemas (Campground, Review, User)
├── /routes # Express routers (campgrounds, reviews, auth)
├── /views # EJS templates (partials, pages)
├── /public
│ ├── /css # Page-specific CSS (campground.css, auth.css, home.css)
│ └── /javascripts # Map and client-side JS
├── /utils # Schema, validation utilities
├── /seeds # Sample data and DB initialization
├── /uploads # Local temp file storage (Cloudinary integration)
├── package.json
└── README.md

---

## 🚧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanyam-kabra/Campora.git
   cd Campora
   npm install

2. **Create a .env file (see .env.example) with:**
    MAPTILER_API_KEY=your_maptiler_api_key
    CLOUDINARY_CLOUD_NAME=...
    CLOUDINARY_KEY=...
    CLOUDINARY_SECRET=...

3. **Seed the database(Optional)**
    node seeds/index.js

4. **Run app.js**
    nodemon app.js

---

## Usage Highlights

- Browse campgrounds on the homepage.
- Search by name/location to find specific campgrounds.
- On search, the map auto-zooms to the target area.
- Create new campground: add title, location, images, price, and description.
- Details page: view photos, map, reviews, and author info.
- Reviews: submit, edit, or delete reviews with ratings.
- Manage content: edit or delete campground (only if you're the author).
