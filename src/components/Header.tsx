import React from 'react';
import { Home } from 'lucide-react';

interface HeaderProps {
  currentView: 'today' | 'history' | 'balance';
  onViewChange: (view: 'today' | 'history' | 'balance') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Corvées Familiales</h1>
              <p className="text-sm text-gray-600 capitalize">{today}</p>
            </div>
          </div>

          <nav className="flex space-x-1">
            <button
              onClick={() => onViewChange('today')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'today'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => onViewChange('history')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'history'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Historique
            </button>
            <button
              onClick={() => onViewChange('balance')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'balance'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Équilibrage
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};