import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const History = lazy(() => import('./pages/History'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      <p className="text-sm text-ink-400 dark:text-ink-500">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/article/:id" element={<ArticleDetail />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/bookmarks" element={
                    <ProtectedRoute><Bookmarks /></ProtectedRoute>
                  } />
                  <Route path="/history" element={
                    <ProtectedRoute><History /></ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute><Profile /></ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'var(--toast-bg, #fff)',
                color: 'var(--toast-color, #1c1917)',
                border: '1px solid var(--toast-border, #e7e5e4)',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: '"DM Sans", sans-serif',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              },
              success: {
                iconTheme: { primary: '#f97316', secondary: '#fff' },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
