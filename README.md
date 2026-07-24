# FlashBasket | Full-Stack Grocery Location Finder

FlashBasket is a premium quick-commerce grocery ordering website and Grocery Location Finder application inspired by modern shopping experiences. 

This project has been refactored into a clean full-stack architecture with a **React + Vite + Tailwind CSS** frontend and a **Node.js + Express** backend, securing Google Maps integrations and organizing services under SOLID principles.

## Features

- 📍 **Autocomplete Location Search**: Enter a location to search with real-time autocompleted suggestions from the Google Places API.
- 🗺️ **Interactive Google Maps**: Autocenters on search targets, displays user radius delivery zones, and plots nearby stores.
- 🏪 **Grocery Store Cards**: Show details for nearby stores, including rating, review count, vicinity address, distance (calculated on-demand), opening status, phone number, and directions.
- 🔍 **Deal & Product Storefront**: Pre-listed quick-delivery deals (milk, bananas, chips, etc.) with functional category sorting and instant search.
- 🛒 **Flash Cart & Checkout**: Interactive side drawer to add items, modify quantities, calculate totals, and checkout orders.
- 🌙 **Light / Dark Mode**: Class-based theme toggles for premium dark mode aesthetics.
- 🕒 **Recent Searches Cache**: Saves past geocoded queries in local storage for fast re-selection.

---

## Directory Structure

```
GROCERY/
├── frontend/                  # React + Vite + Tailwind Client
│   ├── public/                # Static assets (favicons, manifest)
│   └── src/
│       ├── assets/            # Project images, logo and icons
│       ├── components/        # Reusable modules (Navbar, SearchBar, Map, Cards, Loading)
│       ├── context/           # LocationContext global state manager
│       ├── hooks/             # Custom React Hooks (useLocation, useGoogleMaps)
│       ├── pages/             # Route pages (Home, Search, About, NotFound)
│       ├── services/          # API & Map helper endpoints (api, locationService, mapService)
│       └── utils/             # Constants, helper calculations and validators
│
├── backend/                   # Express.js Server
│   ├── config/                # Environment variable mappings
│   ├── controllers/           # API request controller logic
│   ├── middleware/            # Centralized Error Handlers and request body validators
│   ├── routes/                # Location search and order placement paths
│   └── services/              # Secure Google Maps API integrations
│
├── README.md                  # Documentation (this file)
└── package.json               # Root scripts to run concurrently
```

---

## Setup & Running Locally

### 1. Environment Variables

Create a `.env` file in the **root** folder (or copy `.env.example` to `.env`):

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
PORT=5000
```

> **Note**: Both frontend and backend load configurations dynamically. The frontend fetches the key from the backend securely via `/api/config`. If no key is set, the server runs in **offline demo mode** using mock location suggestions and randomized nearby grocery stores.

### 2. Install & Start

You can install all dependencies and run both servers concurrently using the root package runner:

1. **Install all dependencies** (for root, frontend, and backend):
   ```bash
   npm install
   npm run install:all
   ```

2. **Start the application** in development mode (launches both frontend on port 3000 and backend on port 5000):
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   - **Frontend App**: `http://localhost:3000`
   - **Backend Health**: `http://localhost:5000/api/health`

---

## Backend API Endpoints

- **GET `/api/health`**: Confirms server status, timestamp, and maps key configuration.
- **GET `/api/config`**: Serves maps key and delivery configuration parameters.
- **POST `/api/location/autocomplete`**: Returns autocomplete list suggestions for input queries.
- **POST `/api/location/search`**: Resolves place IDs or address strings to coordinate lat/lng.
- **POST `/api/location/nearby`**: Fetches nearby stores using latitude, longitude, and search radius.
- **GET `/api/location/details/:placeId`**: Fetches detailed info (phone number, website, reviews) on-demand.
- **POST `/api/orders`**: Places mock grocery orders.
- **GET `/api/orders`**: Lists active mock orders in-memory.
