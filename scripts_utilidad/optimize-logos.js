const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeLogos() {
  const publicDir = path.join(__dirname, 'public');

  const logos = [
    { input: 'logo-navbar-black.png', output: 'logo-navbar-black-optimized.png' },
    { input: 'logo-navbar-white.png', output: 'logo-navbar-white-optimized.png' }
  ];

  for (const logo of logos) {
    const inputPath = path.join(publicDir, logo.input);
    const outputPath = path.join(publicDir, logo.output);

    try {
      const inputStats = fs.statSync(inputPath);
      console.log(`\nOptimizing ${logo.input}...`);
      console.log(`Original size: ${(inputStats.size / 1024).toFixed(2)} KB`);

      await sharp(inputPath)
        .resize(400, null, { // Width 400px, auto height
          fit: 'inside',
          withoutEnlargement: true
        })
        .png({
          quality: 90,
          compressionLevel: 9,
          palette: true
        })
        .toFile(outputPath);

      const outputStats = fs.statSync(outputPath);
      console.log(`Optimized size: ${(outputStats.size / 1024).toFixed(2)} KB`);
      console.log(`Savings: ${((1 - outputStats.size / inputStats.size) * 100).toFixed(2)}%`);
      console.log(`✅ Saved to ${logo.output}`);
    } catch (error) {
      console.error(`❌ Error optimizing ${logo.input}:`, error.message);
    }
  }

  console.log('\n✅ Logo optimization complete!');
}

optimizeLogos().catch(console.error);
