import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { useFavorites } from "./hooks/useFavorites";
import "./App.css";

function NavBar() {
  const { count } = useFavorites();
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand">IDX Exchange</Link>
        <nav>
          <Link to="/favorites" className="nav-link">♥ Favorites ({count})</Link>
        </nav>
      </div>
    </header>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <ErrorBoundary key={location.pathname}>
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route
          path="*"
          element={
            <p className="status">
              Page not found. <Link to="/">Back to listings</Link>
            </p>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <AppRoutes />
    </BrowserRouter>
  );
}