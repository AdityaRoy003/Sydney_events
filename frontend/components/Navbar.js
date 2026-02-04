import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/me", { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <nav className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex justify-center gap-8 shadow-md animate-fade-in sticky top-0 z-50">
      <Link href="/" className="font-bold hover:text-blue-100 transition-colors">
        Home
      </Link>

      {user ? (
        <>
          <Link href="/dashboard" className="font-bold hover:text-blue-100 transition-colors">
            Dashboard
          </Link>
          <a href="http://localhost:5000/auth/logout" className="font-bold hover:text-blue-100 transition-colors">
            Logout
          </a>
        </>
      ) : (
        <Link href="/login" className="font-bold hover:text-blue-100 transition-colors">
          Login
        </Link>
      )}
    </nav>
  );
}
