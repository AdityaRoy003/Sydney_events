import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontFamily: "Arial, sans-serif",
      background: "linear-gradient(135deg, #2196F3, #21CBF3)",
      color: "white",
      animation: "fadeIn 1s ease"
    }}>
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          color: "white",
          display: "flex",
          alignItems: "center"
        }}
      >
        ← Back
      </button>

      <h1 style={{
        marginBottom: "20px",
        fontSize: "2.5rem",
        animation: "slideDown 0.8s ease"
      }}>
        Welcome to Sydney Events Admin
      </h1>
      <p style={{ marginBottom: "20px", fontSize: "1.2rem" }}>
        Please sign in with Google to continue
      </p>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: "12px 24px",
          backgroundColor: "#fff",
          color: "#4285F4",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "transform 0.3s ease, box-shadow 0.3s ease"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
