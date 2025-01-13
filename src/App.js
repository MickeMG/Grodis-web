import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/images/unnamed.webp',
    '/images/unnamed (1).webp',
    '/images/unnamed (2).webp',
    '/images/unnamed (3).webp',
    '/images/unnamed (4).webp',
    '/images/unnamed (5).webp'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

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
      <nav className="fixed w-full z-50 bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6 flex justify-center items-start">
          <div className="flex-1 flex justify-between items-start">
            <div className="flex-1" />
            <div className="flex items-start gap-0">
              <img 
                src="/images/logo.png" 
                alt="Grodis logo" 
                className="h-32 w-auto drop-shadow-xl -mb-16 mt-[-20px]"
              />
              <p className="text-4xl text-white/90 tracking-wide drop-shadow-lg mt-4 font-kidzone -ml-4">
                Grodis - Interaktiva sagor i en magisk värld!
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <a 
                href="https://play.google.com/store/apps/details?id=com.grodis.storys"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                <img 
                  src="/images/google-play-badge.png" 
                  alt="Hämta på Google Play" 
                  className="h-16 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
          </div>
        </section>

        {/* Intro Section med varm orange platta */}
        <section className="w-full bg-gradient-to-r from-orange-900/70 via-orange-800/70 to-orange-900/70 backdrop-blur-md py-24 shadow-2xl">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="flex items-center justify-center">
              <div className="w-[45%] pr-[7px]">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-white drop-shadow-xl text-right tracking-tight"
                >
                  Låt barnen bli<br />huvudpersoner i<br />magiska sagor!
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-white/90 leading-relaxed drop-shadow-lg text-right tracking-wide"
                >
                  Nu kan du och ditt barn skapa magiska äventyr tillsammans med den charmiga grodan Grodis! 
                  Varje saga är ett unikt äventyr där ditt barn blir huvudpersonen och får ta egna beslut som formar berättelsen. 
                  Upptäck en värld av fantasi, skratt och läsglädje - perfekt för mysiga lässtunder tillsammans.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative h-[500px] w-[55%] pl-[7px]"
              >
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="absolute left-[20%] top-1/2 w-80 h-[500px] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-black/20 border border-white/30"
                    initial={{ 
                      y: "-50%",
                      rotate: (index - currentImageIndex) * 5,
                      scale: 1 - Math.abs(index - currentImageIndex) * 0.1,
                      zIndex: images.length - Math.abs(index - currentImageIndex)
                    }}
                    animate={{ 
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
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  title: "Interaktiva äventyr",
                  description: "Välj mellan hundratals spännande storys som tar er med på äventyr under havet, i rymden eller i sagoskogen.",
                  image: "/images/sub.webp"
                },
                {
                  title: "Bli sagans hjälte",
                  description: "Barn älskar att vara i centrum av berättelsen! Barnets namn vävs in i sagan och styr handlingen genom egna val och beslut.",
                  image: "/images/air.webp"
                },
                {
                  title: "Utvecklande läsning",
                  description: "Genom interaktiva val och personliga berättelser utvecklar barnen både sin fantasi och läsförmåga.",
                  image: "/images/det.webp"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="backdrop-blur-md bg-black/20 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/30 hover:bg-black/30 group"
                >
                  {feature.image && (
                    <div className="mb-6 rounded-xl overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-300">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-xl tracking-tight">{feature.title}</h3>
                  <p className="text-gray-200 leading-relaxed drop-shadow-lg tracking-wide">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-white py-24 bg-black/40 backdrop-blur-md mt-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              <div>
                <h4 className="text-xl font-semibold mb-6 text-white drop-shadow-lg font-kidzone">Kontakt</h4>
                <p className="text-gray-300 tracking-wide">info@grodis.app</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-6 text-white drop-shadow-lg font-kidzone">Följ oss</h4>
                <div className="space-x-6">
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 tracking-wide">Instagram</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 tracking-wide">Facebook</a>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-6 text-white drop-shadow-lg font-kidzone">Ladda ner appen</h4>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.grodis.storys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-90 transition-all duration-300 transform hover:scale-105 inline-block"
                >
                  <img 
                    src="/images/google-play-badge.png" 
                    alt="Hämta på Google Play" 
                    className="h-14 w-auto drop-shadow-lg"
                  />
                </a>
              </div>
            </div>
            <div className="border-t border-white/20 mt-16 pt-12 text-center text-gray-300">
              <p className="tracking-wide mb-4">&copy; 2024 Grodis. Alla rättigheter förbehållna.</p>
              <a 
                href="#/privacy-policy" 
                className="text-gray-300 hover:text-white transition-colors duration-300 tracking-wide underline"
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