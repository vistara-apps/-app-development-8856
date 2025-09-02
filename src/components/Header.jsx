import React from 'react'
import { Dna, Sparkles } from 'lucide-react'

function Header() {
  return (
    <header className="glass-effect sticky top-0 z-50 px-6 py-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Dna className="w-8 h-8 text-white" />
              <Sparkles className="w-4 h-4 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TraitSniffer</h1>
              <p className="text-sm text-white/80">Uncover hidden traits in your DNA</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white/80 hover:text-white transition-colors">How it works</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">About</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Privacy</a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header