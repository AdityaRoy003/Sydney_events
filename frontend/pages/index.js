import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import Navbar from "../components/Navbar";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans animate-fade-in">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-slide-down">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-4">
            Sydney Events
          </h1>
          <p className="text-gray-600 text-lg">
            Discover the best local events, curated just for you.
          </p>
        </header>

        {events.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-xl text-gray-500">Loading events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events.map(ev => (
              <EventCard key={ev._id} event={ev} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

