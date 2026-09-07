import React, { useState } from 'react';
import { ArrowRight, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LogoIcon } from '@/components/ui/LogoIcon';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="flex items-center justify-between h-16">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer">
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
            className="px-4 py-1.5 text-xs font-semibold rounded-full bg-white text-charcoal-900 shadow-sm transition-all"
          >
            Home
          </button>
          <a
            href="#workflow"
            className="px-4 py-1.5 text-xs font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors"
          >
            Split a Bill
          </a>
          <a
            href="#preview"
            className="px-4 py-1.5 text-xs font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors"
          >
            Try Demo
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 hover:bg-white/80 rounded-full transition-all border border-transparent hover:border-charcoal-200 shadow-none hover:shadow-sm"
          >
            Try Demo
          </button>
          <Button
            variant="primary"
            size="sm"
            className="text-xs font-bold px-4 py-2 bg-[#0D766E] hover:bg-[#0B615A]"
          >
            Start Splitting
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#0D766E] flex items-center justify-center text-white hover:bg-[#0B615A] transition-colors shadow-sm"
            aria-label="User profile"
          >
            <User className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex items-center gap-2">
          <Button variant="primary" size="sm" className="text-xs px-3 py-1.5 bg-[#0D766E]">
            Start
            <ArrowRight className="w-3 h-3" />
          </Button>
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
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-brand bg-brand-50 rounded-xl"
          >
            Home
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 rounded-xl"
          >
            Split a Bill
          </a>
          <a
            href="#preview"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 rounded-xl"
          >
            Try Demo
          </a>
          <div className="pt-2 border-t border-charcoal-100 flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center bg-[#0D766E]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Splitting
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
