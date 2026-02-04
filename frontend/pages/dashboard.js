import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Sydney");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check login state first
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    axios.get(`${API_URL}/me`, { withCredentials: true })
      .then(() => {
        setAuthorized(true);
        setLoading(false);
        // Fetch events only if logged in
        axios.get(`${API_URL}/events`, { withCredentials: true })
          .then(res => setEvents(res.data));
      })
      .catch(() => {
        setAuthorized(false);
        setLoading(false);
        router.push("/login"); // redirect if not logged in
      });
  }, [router]);

  const filteredEvents = events.filter(ev => {
    const matchesCity = ev.city?.toLowerCase() === city.toLowerCase();
    const matchesSearch =
      ev.title?.toLowerCase().includes(search.toLowerCase()) ||
      ev.venue?.toLowerCase().includes(search.toLowerCase()) ||
      ev.description?.toLowerCase().includes(search.toLowerCase());

    const eventDate = new Date(ev.date);
    const matchesDate =
      (!startDate || eventDate >= new Date(startDate)) &&
      (!endDate || eventDate <= new Date(endDate));

    return matchesCity && matchesSearch && matchesDate;
  });

  const importEvent = async (e, id) => {
    e.stopPropagation(); // Prevent row click
    const note = window.prompt("Enter import notes (optional):");
    if (note === null) return; // Cancelled

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    await axios.post(`${API_URL}/import`, { eventId: id, importNotes: note }, { withCredentials: true });
    setEvents(events.map(ev => ev._id === id ? { ...ev, status: "imported" } : ev));
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-xl">Loading...</p></div>;
  if (!authorized) return null; // redirect handled above

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center transition-colors"
          >
            ← Back to Home
          </button>
          <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
          <div className="w-24"></div> {/* Spacer for center alignment */}
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Sydney">Sydney</option>
              <option value="Melbourne">Melbourne</option>
              <option value="Brisbane">Brisbane</option>
            </select>
          </div>

          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by title, venue..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table View */}
          <div className="flex-grow bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map(ev => (
                  <tr
                    key={ev._id}
                    onClick={() => setSelectedEvent(ev)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ev.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ev.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(ev.status)}`}>
                        {ev.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={(e) => importEvent(e, ev._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition duration-150 ease-in-out transform hover:scale-105"
                      >
                        Import
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Preview Panel */}
          {selectedEvent && (
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow h-fit sticky top-8 animate-slide-in">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-blue-600 pr-8">{selectedEvent.title}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3 text-gray-600">
                <p><strong className="text-gray-800">Date:</strong> {selectedEvent.date}</p>
                <p><strong className="text-gray-800">Venue:</strong> {selectedEvent.venue}</p>
                <p><strong className="text-gray-800">Description:</strong> {selectedEvent.description}</p>
                <p><strong className="text-gray-800">Source:</strong> {selectedEvent.source}</p>
                <a
                  href={selectedEvent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                >
                  View Original Event
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper for status colors
function getStatusColorClass(status) {
  switch (status) {
    case "new": return "bg-green-100 text-green-800";
    case "updated": return "bg-yellow-100 text-yellow-800";
    case "inactive": return "bg-gray-100 text-gray-800";
    case "imported": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
}
