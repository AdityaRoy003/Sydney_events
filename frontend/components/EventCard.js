import { useState } from "react";
import TicketModal from "./TicketModal";

export default function EventCard({ event }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full border border-gray-100">
        {event.image && (
          <div className="relative h-48 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute top-0 right-0 m-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              {event.source}
            </div>
          </div>
        )}

        <div className="p-5 flex-grow flex flex-col">
          <div className="text-sm font-semibold text-blue-600 mb-1 uppercase tracking-wider">
            {event.date}
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight line-clamp-2">
            {event.title}
          </h3>

          <div className="flex items-center text-gray-500 mb-3 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.venue}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {event.description || "No description available."}
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full mt-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
          >
            GET TICKETS
          </button>
        </div>
      </div>

      <TicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={event}
      />
    </>
  );
}

