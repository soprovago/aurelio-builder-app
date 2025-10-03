import React, { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import Dashboard from '../components/Dashboard';
import Editor from '../components/Editor';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user, logout } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleStartEditor = (template) => {
    setSelectedTemplate(template);
    setShowEditor(true);
  };

  const handleExitEditor = () => {
    setShowEditor(false);
    setSelectedTemplate(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Las rutas protegidas ya manejan la verificación del usuario

  if (showEditor) {
    return (
      <Editor 
        selectedTemplate={selectedTemplate}
        onExit={handleExitEditor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header con información del usuario y logout */}
      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff1b6d] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">{user.name || user.email}</p>
              <p className="text-gray-400 text-sm">Aurelio Builder</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <Dashboard onStartEditor={handleStartEditor} />
    </div>
  );
}

export default DashboardPage;