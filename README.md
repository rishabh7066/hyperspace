
# Predictive Sky-X 🛰️

Predictive Sky-X is an AI-powered disaster prediction and live weather monitoring platform for India, powered by Google Gemini and satellite analytics.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory (if not already present) and add your API keys:

   ```env
   # Google Gemini API Key (Required for AI Analysis)
   # Get it here: https://aistudio.google.com/
   VITE_API_KEY=your_gemini_key_here

   # Supabase (Optional - for Auth)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run Locally**
   Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

### Features
- **Live Weather Map:** Interactive Leaflet map with simulated satellite layers.
- **AI Analysis:** Real-time risk assessment using Google Gemini 1.5 Pro/Flash.
- **Disaster Alerts:** Flood, Cyclone, and Heatwave predictions.
- **Local Fallback:** Works with local storage if Supabase is not configured.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Maps:** Leaflet, React-Leaflet
- **AI:** Google GenAI SDK (`@google/genai`)
- **Data Viz:** Recharts
