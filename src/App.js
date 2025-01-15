import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const images = [
    '/images/unnamed.webp',
    '/images/unnamed (1).webp',
    '/images/unnamed (2).webp',
    '/images/unnamed (3).webp',
    '/images/unnamed (4).webp',
    '/images/unnamed (5).webp'
  ];

  const stories = [
    'Björnen_och_skateboarden',
    'Den_ädle_riddaren',
    'Det_galaktiska_äventyret',
    'Drakvännen',
    'Ekorre_i_storstan',
    'Göteborgs_spårvagnsmysterium',
    'Hundbageriet',
    'Hundvalpen',
    'Katten_som_körde_taxi',
    'Kattpolisen',
    'Katt_Rock',
    'Pyramiderna',
    'Resan_till_framtiden',
    'Resan_till_Hawaii',
    'Råttan_Räddar_Staden',
    'Rösten_i_radion_',
    'Sjörövarskappet',
    'Skattsökarna_',
    'Soloflygningen_över_Atlanten',
    'Staden_i_trädet',
    'Stenålderssäventyret',
    'Storsjöodjurets_mysterium',
    'Tandtrollen_i_badrumsskåpet',
    'Teddybjörnen',
    'Trollkarlens_elev',
    'Trubbel_på_Mars',
    'Undervattensfärden',
    'Upptäcktsresan_inuti',
    'Vikingatiden',
    'Vilse_i_öknen',
    'Älvan',
    'Äventyret_i_Afrika',
    'Äventyret_i_Nerja',
    'Äventyret_i_Thailand'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStoryIndex((prevIndex) => 
        prevIndex === stories.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [stories.length]);

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

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
          </div>
        </section>

        {/* Intro Section med varm orange platta */}
        <section className="w-full relative py-12 md:py-24 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/70 via-orange-800/70 to-transparent backdrop-blur-md" 
               style={{
                 maskImage: 'linear-gradient(to right, black 60%, transparent)',
                 WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent)'
               }}
          />
          <div className="container mx-auto max-w-6xl px-4 md:px-6 relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
              <div className="w-full md:w-[40%]">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight text-white drop-shadow-xl text-center md:text-right tracking-tight"
                >
                  Låt barnen bli<br />huvudpersoner i magiska sagor!
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-lg text-center md:text-right tracking-wide"
                >
                  Nu kan du och ditt barn skapa magiska äventyr tillsammans med Grodis i telefonen eller läsplattan. Varje saga är ett unikt äventyr där ditt barn blir huvudpersonen och får ta egna beslut som formar berättelsen. Upptäck en värld av fantasi, skratt och läsglädje.
                </motion.p>
                <motion.a 
                  href="https://play.google.com/store/apps/details?id=com.grodis.storys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block hover:opacity-90 transition-all duration-300 transform hover:scale-105 float-none md:float-right mx-auto block md:inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <img 
                    src="/images/google-play-badge.png" 
                    alt="Hämta på Google Play" 
                    className="h-14 w-auto drop-shadow-lg"
                  />
                </motion.a>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative h-[484px] md:h-[604px] w-full md:w-[50%] mx-auto mt-8 md:mt-0"
              >
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="absolute left-1/2 md:left-[20%] top-1/2 w-[219px] md:w-[274px] h-[480px] md:h-[600px] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-black/20 border border-white/30"
                    initial={{ 
                      x: "-50%",
                      y: "-50%",
                      rotate: (index - currentImageIndex) * 5,
                      scale: 1 - Math.abs(index - currentImageIndex) * 0.1,
                      zIndex: images.length - Math.abs(index - currentImageIndex)
                    }}
                    animate={{ 
                      x: "-50%",
                      y: "-50%",
                      rotate: (index - currentImageIndex) * 5,
                      scale: 1 - Math.abs(index - currentImageIndex) * 0.1,
                      zIndex: images.length - Math.abs(index - currentImageIndex)
                    }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    style={{
                      transformOrigin: "center center"
                    }}
                  >
                    <img 
                      src={image} 
                      alt={`Story card ${index + 1}`}
                      className="w-[217px] md:w-[272px] h-[480px] md:h-[600px] object-contain m-[1px]"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 md:py-32">
          <div className="container mx-auto max-w-4xl px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Interaktiva äventyr */}
              <div className="bg-gradient-to-r from-yellow-700/70 via-yellow-600/70 to-yellow-700/70 backdrop-blur-sm rounded-xl p-6 md:p-8 hover:bg-gradient-to-r hover:from-yellow-700/80 hover:via-yellow-600/80 hover:to-yellow-700/80 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                <img 
                  src="/images/sub.webp" 
                  alt="Interaktiva äventyr" 
                  className="w-full aspect-square object-cover rounded-lg mb-4 md:mb-6"
                />
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 drop-shadow-lg">Interaktiva äventyr</h3>
                <p className="text-sm md:text-base text-gray-200 leading-relaxed drop-shadow-md">
                  Välj mellan hundratals spännande storys som tar er med på äventyr under havet, i rymden eller i sagoskogen.
                </p>
              </div>

              {/* Bli sagans hjälte */}
              <div className="bg-gradient-to-r from-yellow-700/70 via-yellow-600/70 to-yellow-700/70 backdrop-blur-sm rounded-xl p-6 md:p-8 hover:bg-gradient-to-r hover:from-yellow-700/80 hover:via-yellow-600/80 hover:to-yellow-700/80 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                <img 
                  src="/images/air.webp" 
                  alt="Bli sagans hjälte" 
                  className="w-full aspect-square object-cover rounded-lg mb-4 md:mb-6"
                />
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 drop-shadow-lg">Bli sagans hjälte</h3>
                <p className="text-sm md:text-base text-gray-200 leading-relaxed drop-shadow-md">
                  Ditt barn blir en del av sagan när namnet vävs in i berättelsen. Genom spännande val och beslut får barnet själv styra äventyrets riktning!
                </p>
              </div>

              {/* Utvecklande läsning */}
              <div className="bg-gradient-to-r from-yellow-700/70 via-yellow-600/70 to-yellow-700/70 backdrop-blur-sm rounded-xl p-6 md:p-8 hover:bg-gradient-to-r hover:from-yellow-700/80 hover:via-yellow-600/80 hover:to-yellow-700/80 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                <img 
                  src="/images/reading.webp" 
                  alt="Utvecklande läsning" 
                  className="w-full aspect-square object-cover rounded-lg mb-4 md:mb-6"
                  style={{ objectPosition: "top" }}
                />
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 drop-shadow-lg">Utvecklande läsning</h3>
                <p className="text-sm md:text-base text-gray-200 leading-relaxed drop-shadow-md">
                  Genom interaktiva val och personliga berättelser utvecklar barnen både sin fantasi och läsförmåga.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Cards Carousel Section */}
        <section className="w-full relative py-12 md:py-24 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-orange-900/70 via-orange-800/70 to-transparent backdrop-blur-md" 
               style={{
                 maskImage: 'linear-gradient(to left, black 60%, transparent)',
                 WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent)'
               }}
          />
          <div className="container mx-auto max-w-6xl relative">
            <div className="flex flex-col-reverse md:flex-row items-center">
              <div className="w-full md:w-[65%]">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative h-[400px] md:h-[500px] w-full mx-auto mt-8 md:mt-0"
                >
                  {stories.map((story, index) => {
                    // Beräkna avståndet från aktuellt kort
                    const distance = Math.abs(index - currentStoryIndex);
                    // Visa bara de 5 närmaste korten
                    if (distance > 2) return null;
                    
                    return (
                      <motion.div
                        key={story}
                        className={`absolute left-1/2 md:left-[60%] top-1/2 w-[322px] md:w-[402px] h-[482px] md:h-[602px] rounded-2xl ${index === currentStoryIndex ? 'shadow-[0_0_25px_rgba(0,0,0,0.7)]' : ''} overflow-hidden backdrop-blur-sm bg-black/20 border border-white/30`}
                        initial={{ 
                          x: "-50%",
                          y: "-50%",
                          rotate: 0,
                          scale: 0.95,
                          zIndex: index === currentStoryIndex ? stories.length : stories.length - distance
                        }}
                        animate={{ 
                          x: "-50%",
                          y: "-50%",
                          rotate: 0,
                          scale: index === currentStoryIndex ? 1 : 0.95,
                          zIndex: index === currentStoryIndex ? stories.length : stories.length - distance,
                          opacity: 1 - (distance * 0.3)
                        }}
                        transition={{ 
                          duration: 0.5,
                          ease: index === currentStoryIndex ? "easeOut" : "easeIn"
                        }}
                        style={{
                          transformOrigin: "center center",
                          willChange: "transform, opacity"
                        }}
                      >
                        <img 
                          src={`/images/stories/desktop/${story}.webp`}
                          srcSet={`/images/stories/mobile/${story}.webp 320w, /images/stories/desktop/${story}.webp 400w`}
                          sizes="(max-width: 768px) 320px, 400px"
                          alt={story.replace(/_/g, ' ')}
                          className="w-[320px] md:w-[400px] h-[480px] md:h-[600px] object-contain m-[1px]"
                          loading={distance === 0 ? "eager" : "lazy"}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              <div className="w-full md:w-[35%] px-4 md:px-0 mb-8 md:mb-0">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight text-white drop-shadow-xl text-center md:text-left tracking-tight"
                >
                  Upptäck Grodis<br />fantastiska äventyr.
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-lg text-center md:text-left tracking-wide"
                >
                  Utforska vårt växande bibliotek med hundratals interaktiva sagor! Nya äventyr tillkommer regelbundet så det finns alltid något spännande att upptäcka. Från rymdfärder till undervattensäventyr - varje saga är en ny chans att låta fantasin flöda.
                </motion.p>
                <motion.a 
                  href="https://play.google.com/store/apps/details?id=com.grodis.storys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block hover:opacity-90 transition-all duration-300 transform hover:scale-105 float-none md:float-left mx-auto block md:inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <img 
                    src="/images/google-play-badge.png" 
                    alt="Hämta på Google Play" 
                    className="h-14 w-auto drop-shadow-lg"
                  />
                </motion.a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-white py-4 bg-gradient-to-r from-yellow-700/70 via-yellow-600/70 to-yellow-700/70 backdrop-blur-md mt-8">
          <div className="container mx-auto max-w-4xl px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-2">
              <div className="text-center md:text-left">
                <h4 className="text-xl font-semibold mb-2 text-white drop-shadow-lg">Kontakt</h4>
                <p className="text-gray-300 tracking-wide">info@grodis.app</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-2 text-white drop-shadow-lg">Följ Grodis</h4>
                <div>
                  <a href="https://www.facebook.com/profile.php?id=61572057778646" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 tracking-wide">Facebook</a>
                </div>
              </div>
              <div className="text-center md:text-right">
                <h4 className="text-xl font-semibold mb-2 text-white drop-shadow-lg">Ladda ner appen</h4>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.grodis.storys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-90 transition-all duration-300 transform hover:scale-105 inline-block"
                >
                  <img 
                    src="/images/google-play-badge.png" 
                    alt="Hämta på Google Play" 
                    className="h-12 w-auto drop-shadow-lg mx-auto md:ml-auto md:mr-0"
                  />
                </a>
              </div>
            </div>
            <div className="border-t border-white/20 mt-6 pt-4 text-center text-gray-300">
              <p className="tracking-wide mb-2 text-sm md:text-base">&copy; 2024 Grodis. Alla rättigheter förbehållna.</p>
              <a 
                href="#/privacy-policy" 
                className="text-sm md:text-base text-gray-300 hover:text-white transition-colors duration-300 tracking-wide underline"
              >
                Integritetspolicy
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App; 