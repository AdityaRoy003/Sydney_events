# Sydney Events Web App

MERN + Next.js application for managing and displaying Sydney events.  
Includes:
- Event scraping + MongoDB storage
- Subscription system with email + consent
- Google OAuth login for admin dashboard
- Protected dashboard with filters, status tagging, and import workflow
- Advanced UI styling and animations
- Optional Streamlit integration for analytics

---

## 🚀 Tech Stack
- **Frontend**: Next.js (React), Material‑UI, CSS animations
- **Backend**: Node.js, Express, Passport.js (Google OAuth)
- **Database**: MongoDB (Mongoose models)
- **Extras**: Cron jobs for auto scraping, Streamlit (Python) for analytics

---

## 📂 Project Structure
components/      # Reusable React components (Navbar, EventCard)
pages/           # Next.js  routes (index.js, dashboard.js, login.js)
styles/          # Global CSS (animations, layout)
backend/         # Node.js  server, models, scraper, auth

Code

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
2. Install dependencies
Frontend:

bash
cd frontend
npm install
Backend:

bash
cd backend
npm install
3. Environment variables
Create a .env file in backend/:

env
MONGO_URI=mongodb://127.0.0.1:27017/sydney-events
SESSION_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
4. Run backend
bash
cd backend
node server.js
5. Run frontend
bash
cd frontend
npm run dev
Frontend runs at http://localhost:3000  
Backend runs at http://localhost:5000
