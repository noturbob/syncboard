import React from 'react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-accent-dark/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tight text-accent">
          <span className="text-highlight">Sync</span>Board
        </div>
        <div className="hidden md:flex space-x-6 text-sm font-medium text-subtle">
          <a href="#features" className="hover:text-accent transition">Features</a>
          <a href="#testimonials" className="hover:text-accent transition">Testimonials</a>
          <a href="#pricing" className="hover:text-accent transition">Pricing</a>
          <a href="#contact" className="hover:text-accent transition">Contact</a>
        </div>
        <a href="/signup" className="bg-accent-dark hover:bg-accent text-white font-semibold py-2 px-4 rounded-lg transition shadow-md shadow-accent-dark/30">
          Start Free Trial
        </a>
      </nav>
    </header>
  );
};

export default Navbar;