import { motion } from 'framer-motion';

function PrivacyPolicy() {
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

      {/* Main Content */}
      <div className="relative z-10 pt-12 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto max-w-3xl px-6"
        >
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Integritetspolicy för Grodis</h1>
            <p className="text-gray-300 mb-6">Senast uppdaterad: 2024-11-25</p>
            <p className="text-gray-200 mb-8 leading-relaxed">Din integritet är viktig för oss. Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar dina personuppgifter.</p>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">1. Information vi samlar in</h2>
              <ul className="list-disc list-inside text-gray-200 space-y-2">
                <li>E-postadress: För att skapa och hantera ditt konto</li>
                <li>Användarnamn: För personlig interaktion i appen</li>
                <li>Betalningsinformation: Hanteras säkert av Google Pay och Apple Pay, vi lagrar ingen betalningsinformation</li>
                <li>Användarval: Dina val i berättelserna för att skapa personliga upplevelser</li>
                <li>Favoriter: Sparade favoritberättelser</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">2. Hur vi använder informationen</h2>
              <ul className="list-disc list-inside text-gray-200 space-y-2">
                <li>För att skapa och leverera personliga berättelser</li>
                <li>För att hantera ditt konto och flugor</li>
                <li>För att förbättra appen och användarupplevelsen</li>
                <li>För att kommunicera viktiga uppdateringar</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">3. Delning av information</h2>
              <p className="text-gray-200 mb-4">Vi delar ALDRIG din personliga information med tredje part, förutom:</p>
              <ul className="list-disc list-inside text-gray-200 space-y-2">
                <li>Google Pay och Apple Pay: För säker betalningshantering</li>
                <li>Claude AI: För berättelsegeneration (ingen personlig data delas)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">4. Datasäkerhet</h2>
              <ul className="list-disc list-inside text-gray-200 space-y-2">
                <li>All data lagras säkert i AWS</li>
                <li>Krypterad kommunikation via HTTPS</li>
                <li>Säker autentisering med JWT-tokens</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">5. Dina rättigheter</h2>
              <p className="text-gray-200 mb-4">Du har rätt att:</p>
              <ul className="list-disc list-inside text-gray-200 space-y-2">
                <li>Se din lagrade information</li>
                <li>Begära radering av ditt konto</li>
                <li>Exportera din data</li>
                <li>Ändra dina uppgifter</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">6. Barns integritet</h2>
              <p className="text-gray-200">Appen är barnvänlig och samlar endast in nödvändig information för funktionalitet. Föräldrar kan när som helst begära information om eller radering av barnets data.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">7. Kontakta oss</h2>
              <p className="text-gray-200">Vid frågor om din integritet, kontakta oss på <a href="mailto:info@grodis.app" className="underline hover:text-white transition-colors">info@grodis.app</a></p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">8. Ändringar i policyn</h2>
              <p className="text-gray-200">Vi meddelar dig om väsentliga ändringar i denna policy via appen eller e-post.</p>
            </section>

            <p className="text-gray-200 mt-8 pt-8 border-t border-white/20">Genom att använda Grodis godkänner du denna integritetspolicy.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PrivacyPolicy; 