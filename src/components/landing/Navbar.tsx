import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LogoIcon } from '@/components/ui/LogoIcon';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isSplit = location.pathname === '/split';

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="flex items-center justify-between h-16">
        {/* Left: Brand Logo & Tagline */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] border border-[#A7F3D0]/70 flex items-center justify-center text-[#0D766E] shadow-sm">
            <LogoIcon className="w-5 h-5 text-[#0D766E]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-charcoal-900 tracking-tight leading-none">
              Split The Bill
            </span>
            <span className="text-[9px] font-bold tracking-widest text-charcoal-500 uppercase mt-1">
              SCAN IT. SPLIT IT. DONE.
            </span>
          </div>
        </div>

        {/* Center: Segmented Nav Pill (Desktop) */}
        <nav className="hidden md:flex items-center bg-[#E5EBF2]/80 p-1 rounded-full border border-charcoal-200/80 shadow-[inset_0_1px_2px_0_rgba(15,23,42,0.04)]">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              isHome
                ? 'bg-white text-charcoal-900 shadow-sm'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigate('/split')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              isSplit
                ? 'bg-white text-charcoal-900 shadow-sm'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Split a Bill
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {isHome && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/split')}
              className="text-xs font-bold px-4 py-2 bg-[#0D766E] hover:bg-[#0B615A]"
            >
              Start Splitting
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex items-center gap-2">
          {isHome && (
            <Button
              variant="primary"
              size="sm"
              className="text-xs px-3 py-1.5 bg-[#0D766E]"
              onClick={() => navigate('/split')}
            >
              Start
              <ArrowRight className="w-3 h-3" />
            </Button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-charcoal-600 hover:bg-charcoal-200/50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 p-4 bg-white rounded-2xl shadow-soft border border-charcoal-200 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              navigate('/');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-xl ${
              isHome ? 'text-brand bg-brand-50' : 'text-charcoal-700 hover:bg-charcoal-50'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => {
              navigate('/split');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-xl ${
              isSplit ? 'text-brand bg-brand-50' : 'text-charcoal-700 hover:bg-charcoal-50'
            }`}
          >
            Split a Bill
          </button>
          {isHome && (
            <div className="pt-2 border-t border-charcoal-100 flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center bg-[#0D766E]"
                onClick={() => {
                  navigate('/split');
                  setMobileMenuOpen(false);
                }}
              >
                Start Splitting
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
