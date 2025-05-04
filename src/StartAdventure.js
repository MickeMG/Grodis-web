import React from 'react';

export default function StartAdventure() {
  return (
    <div className="min-h-screen relative">
      {/* Bakgrundsbild med overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/images/background.webp" 
          alt="Magical forest background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />
      </div>
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-gradient-to-r from-yellow-700/70 via-yellow-600/70 to-yellow-700/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-center items-start">
          <div className="flex-1 flex justify-between items-start">
            <div className="flex-1" />
            <div className="flex flex-col md:flex-row items-center gap-0">
              <img 
                src="/images/logo.png" 
                alt="Grodis logo" 
                className="h-16 md:h-24 w-auto"
              />
              <p className="text-2xl md:text-4xl text-white/90 tracking-wide drop-shadow-lg mt-2 md:mt-4 font-kidzone md:-ml-4 text-center md:text-left">
                Grodis - Interaktiva sagor i en magisk värld!
              </p>
            </div>
            <div className="flex-1" />
          </div>
        </div>
      </nav>
      {/* Nytt innehåll */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-40">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-xl mb-8 text-center">Välkommen till ditt läsäventyr!</h1>
        <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg text-center max-w-2xl mb-8">
          Här börjar resan. Snart kan du skapa din egen saga eller upptäcka magiska berättelser tillsammans med Grodis!
        </p>
      </div>
    </div>
  );
} 