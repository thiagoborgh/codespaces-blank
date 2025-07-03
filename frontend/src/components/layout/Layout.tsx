import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../contexts/LayoutContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';
import {
  UserCircleIcon,
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  QueueListIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChevronRightIcon as ChevronRightBreadcrumb,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, collapsed }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Fila de Atendimento', href: '/queue', icon: QueueListIcon },
    { name: 'Pacientes', href: '/patients', icon: UsersIcon },
    { name: 'Agendamentos', href: '/appointments', icon: CalendarDaysIcon },
    { name: 'Consultas', href: '/consultations', icon: ClipboardDocumentListIcon },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 ${theme === 'hybrid' ? 'healthcare-sidebar' : 'bg-white'} shadow-lg transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          collapsed ? 'w-16' : 'w-64'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {!collapsed && <h1 className="text-xl font-bold text-gray-900">Saúde Simples</h1>}
            {collapsed && (
              <div className="flex items-center justify-center w-full">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* User info */}
          {!collapsed && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-center">
                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={`flex-1 ${collapsed ? 'p-2' : 'p-6'}`}>
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={`${theme === 'hybrid' ? 'healthcare-nav-item' : `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors`} ${
                        theme === 'hybrid' 
                          ? (isActive ? 'active' : '')
                          : (isActive
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
                      } ${collapsed ? 'justify-center px-2' : ''}`}
                      title={collapsed ? item.name : ''}
                    >
                      <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                      {!collapsed && item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className={`border-t border-gray-200 ${collapsed ? 'p-2' : 'p-6'}`}>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/settings"
                  onClick={onClose}
                  className={`flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 ${
                    collapsed ? 'justify-center px-2' : ''
                  }`}
                  title={collapsed ? 'Configurações' : ''}
                >
                  <Cog6ToothIcon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && 'Configurações'}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 ${
                    collapsed ? 'justify-center px-2' : ''
                  }`}
                  title={collapsed ? 'Sair' : ''}
                >
                  <ArrowRightStartOnRectangleIcon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && 'Sair'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed, toggleSidebar, isFullscreen, toggleFullscreen } = useLayout();
  const location = useLocation();

  // Função para gerar breadcrumb baseado na rota atual
  const getBreadcrumb = () => {
    const pathMap: { [key: string]: { name: string; href: string } } = {
      '/dashboard': { name: 'Início', href: '/dashboard' },
      '/patients': { name: 'Pacientes', href: '/patients' },
      '/queue': { name: 'Fila de Atendimento', href: '/queue' },
      '/appointments': { name: 'Agendamentos', href: '/appointments' },
      '/consultations': { name: 'Consultas', href: '/consultations' },
      '/settings': { name: 'Configurações', href: '/settings' },
    };

    const currentPath = location.pathname;
    const breadcrumbs = [];

    // Sempre adicionar "Início" como primeiro item
    if (currentPath !== '/dashboard') {
      breadcrumbs.push({ name: 'Início', href: '/dashboard', isActive: false });
    }

    // Adicionar página atual
    if (pathMap[currentPath]) {
      breadcrumbs.push({ ...pathMap[currentPath], isActive: true });
    }

    return breadcrumbs;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        collapsed={sidebarCollapsed}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Banner de desenvolvimento */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-400 text-yellow-800 px-4 py-2 text-sm font-medium text-center">
            🚀 Modo Desenvolvimento - Login automático ativado
          </div>
        )}
        
        {/* Header mobile e desktop */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Botão menu mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              
              {/* Botão collapse sidebar desktop */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:flex p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                title={sidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRightIcon className="h-5 w-5" />
                ) : (
                  <ChevronLeftIcon className="h-5 w-5" />
                )}
              </button>
              
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2">
                {getBreadcrumb().map((item, index) => (
                  <div key={item.href} className="flex items-center">
                    {index > 0 && (
                      <ChevronRightBreadcrumb className="h-4 w-4 text-gray-400 mx-2" />
                    )}
                    {item.isActive ? (
                      <span className="text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            
            {/* Controles do header */}
            <div className="flex items-center space-x-3">
              {/* Seletor de tema */}
              <ThemeToggle />
              
              {/* Botão fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                title={isFullscreen ? 'Sair da tela cheia' : 'Modo tela cheia'}
              >
                {isFullscreen ? (
                  <ArrowsPointingInIcon className="h-5 w-5" />
                ) : (
                  <ArrowsPointingOutIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
