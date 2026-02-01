import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { GlobalProvider, useGlobalContext } from './context/GlobalContext'
import AdminLayout from './components/admin/AdminLayout.jsx' // We will create this next
import ErrorBoundary from './components/ErrorBoundary';

function MainApp() {
  const { currentUser, darkMode, toggleTheme, logout } = useGlobalContext()
  const [currentView, setCurrentView] = useState('dashboard') // 'dashboard' | 'admin' 

  // Derived state to check if we should show Admin Portal
  const showAdmin = currentView === 'admin' && currentUser?.role === 'ADMIN'

  return (
    <div className={`h-screen w-screen overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-slate-900'}`}>
      {!currentUser ? (
        <Login
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
      ) : showAdmin ? (
        // Placeholder for Admin Layout until created
        <AdminLayout
          onNavigateBack={() => setCurrentView('dashboard')}
          onLogout={logout}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
      ) : (
        <Dashboard
          onLogout={logout}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          currentView={currentView}
          onNavigateAdmin={() => setCurrentView('admin')}
          userRole={currentUser.role}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <GlobalProvider>
        <MainApp />
      </GlobalProvider>
    </ErrorBoundary>
  )
}

export default App
