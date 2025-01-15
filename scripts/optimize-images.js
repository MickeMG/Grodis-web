const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'public/images/stories';
const outputDirMobile = 'public/images/stories/mobile';
const outputDirDesktop = 'public/images/stories/desktop';

// Skapa output-mappar om de inte finns
if (!fs.existsSync(outputDirMobile)) {
    fs.mkdirSync(outputDirMobile, { recursive: true });
}
if (!fs.existsSync(outputDirDesktop)) {
    fs.mkdirSync(outputDirDesktop, { recursive: true });
}

// Läs alla PNG-filer i input-mappen
fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Kunde inte läsa mappen:', err);
        return;
    }

    files.filter(file => file.endsWith('.png')).forEach(file => {
        const inputPath = path.join(inputDir, file);
        const outputNameMobile = path.join(outputDirMobile, file.replace('.png', '.webp'));
        const outputNameDesktop = path.join(outputDirDesktop, file.replace('.png', '.webp'));

        // Optimera för mobil (mindre storlek)
        sharp(inputPath)
            .resize(320, null, { 
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .webp({ quality: 80 })
            .toFile(outputNameMobile)
            .then(() => console.log(`Optimerad mobil version: ${outputNameMobile}`))
            .catch(err => console.error(`Fel vid optimering av ${file} för mobil:`, err));

        // Optimera för desktop (större storlek)
        sharp(inputPath)
            .resize(400, null, { 
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .webp({ quality: 85 })
            .toFile(outputNameDesktop)
            .then(() => console.log(`Optimerad desktop version: ${outputNameDesktop}`))
            .catch(err => console.error(`Fel vid optimering av ${file} för desktop:`, err));
    });
}); 