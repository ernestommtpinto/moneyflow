import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Menu,
  Target,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/moneyflow.png';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: CreditCard },
  { to: '/budgets', label: 'Budgets', icon: Target },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/goals', label: 'Goals', icon: Target },
];

function Sidebar({ onNavigate, onClose, showCloseButton = false }) {
  const { user, logout } = useAuth();
  const initial = (user?.displayName || user?.email || 'U')
    .charAt(0)
    .toUpperCase();

  return (
    <aside className="h-full bg-white/95 backdrop-blur border-r border-slate-200 px-4 py-6 flex flex-col">
      <div className="mb-8 flex items-center justify-between px-4">
        <NavLink to="/dashboard" onClick={onNavigate} className="inline-flex items-center">
          <img
            src={logo}
            alt="MoneyFlow"
            className="w-40 h-auto lg:w-44"
          />
        </NavLink>

        {showCloseButton && (
          <button
            onClick={onClose}
            className="lg:hidden rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="space-y-1">
        {links.map(link => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-emerald-50 p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white grid place-items-center font-bold text-indigo-700 shadow-sm">
              {initial}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user?.displayName || 'User'}
              </p>

              <p className="text-xs text-slate-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm border transition hover:bg-slate-50 cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-72">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm cursor-pointer"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu overlay"
          />

          <div className="relative h-full w-80 max-w-[85vw] shadow-2xl">
            <Sidebar
              onNavigate={() => setMobileOpen(false)}
              onClose={() => setMobileOpen(false)}
              showCloseButton
            />
          </div>
        </div>
      )}

      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden rounded-2xl border bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>

              <NavLink to="/dashboard" className="lg:hidden inline-flex items-center">
                <img
                  src={logo}
                  alt="MoneyFlow"
                  className="w-36 h-auto"
                />
              </NavLink>

              <div className="hidden sm:block lg:block">
                <p className="text-sm text-slate-500">
                  Welcome back
                </p>

                <h2 className="font-bold leading-tight">
                  {user?.displayName || user?.email}
                </h2>
              </div>
            </div>
          </div>
        </header>

        <section className="p-4 sm:p-6 xl:p-8 max-w-7xl mx-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
