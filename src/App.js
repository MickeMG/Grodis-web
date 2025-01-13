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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/images/logo.png" 
              alt="Grodis logo" 
              className="h-16 w-auto"
            />
          </div>
          <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all border border-white/30">
            Prova gratis i 7 dagar
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <img 
              src="/images/logo.png" 
              alt="Grodis logo" 
              className="h-48 w-auto mx-auto mb-12"
            />
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white"
            >
              Bli huvudperson<br />i din egna magisska saga!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              I Grodis magiska värld skapar du dina egna äventyr. Barn älskar att vara huvudperson i sina egna sagor, 
              där varje berättelse är unik och formas av deras val. Barnets namn vävs in i historien och blir en del av det magiska äventyret.
            </motion.p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  title: "Interaktiva äventyr",
                  description: "Välj mellan hundratals spännande storys som tar dig med på magiska äventyr under havet, i rymden eller i sagoskogen.",
                  image: "/images/submarine-adventure.webp"
                },
                {
                  title: "Bli sagans hjälte",
                  description: "Barn älskar att vara i centrum av berättelsen! Barnets namn vävs in i sagan och styr handlingen genom egna val och beslut.",
                  image: "/images/airplane-adventure.webp"
                },
                {
                  title: "Utvecklande läsning",
                  description: "Genom interaktiva val och personliga berättelser utvecklar barnen både sin fantasi och läsförmåga.",
                  image: "/images/detective-hamster.webp"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="backdrop-blur-md bg-black/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-white/20"
                >
                  {feature.image && (
                    <div className="mb-6 rounded-xl overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-200 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all border border-white/30"
            >
              Ladda ner appen
            </motion.button>
          </div>
        </section>

        {/* Card Stack Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative h-[400px] mb-12 max-w-4xl mx-auto"
            >
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className="absolute left-1/2 top-1/2 w-64 h-96 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm bg-black/20 border border-white/20"
                  initial={{ 
                    x: "-50%", 
                    y: "-50%",
                    rotate: (index - currentImageIndex) * 5,
                    scale: 1 - Math.abs(index - currentImageIndex) * 0.1,
                    zIndex: images.length - Math.abs(index - currentImageIndex)
                  }}
                  animate={{ 
                    rotate: (index - currentImageIndex) * 5,
                    scale: 1 - Math.abs(index - currentImageIndex) * 0.1,
                    zIndex: images.length - Math.abs(index - currentImageIndex)
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    transformOrigin: "center center"
                  }}
                >
                  <img 
                    src={image} 
                    alt={`Story card ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/60 backdrop-blur-md text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <img 
                  src="/images/logo.png" 
                  alt="Grodis logo" 
                  className="h-20 w-auto mb-4"
                />
                <p className="text-gray-300">Interaktiva sagor där barnen blir huvudpersoner</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Kontakt</h4>
                <p className="text-gray-300">sagor@grodis.com</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Följ oss</h4>
                <div className="space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Ladda ner appen</h4>
                <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all border border-white/30">
                  Prova gratis
                </button>
              </div>
            </div>
            <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-300">
              <p>&copy; 2024 Grodis. Alla rättigheter förbehållna.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App; 