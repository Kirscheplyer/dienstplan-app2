import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from "@clerk/clerk-react";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

const ADMIN_ID = "user_30NpYU323qGA3LO4JedrBWRQXXP";

function RedirectByRole() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id === ADMIN_ID) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  return null;
}

export default function App() {
  return (
    <>
      <SignedOut>
        <div style={{ padding: "2rem" }}>
          <h2>Bitte einloggen</h2>
          <SignInButton />
        </div>
      </SignedOut>

      <SignedIn>
        <RedirectByRole />
        <UserButton />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </SignedIn>
    </>
  );
}
