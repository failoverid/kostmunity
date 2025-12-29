/**
 * Generate App Icons
 * 
 * Requirements:
 * - npm install sharp
 * - Put source logo (1024x1024) as assets/images/logo-source.png
 * 
 * Run: node generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets', 'images');
const SOURCE_LOGO = path.join(__dirname, 'assets', 'kostmunity-logo.png');

// Check if sharp is installed
try {
    require.resolve('sharp');
} catch (e) {
    console.error('❌ Sharp not installed. Run: npm install sharp');
    process.exit(1);
}

// Check if source logo exists
if (!fs.existsSync(SOURCE_LOGO)) {
    console.error('❌ Source logo not found!');
    console.error(`   Please put your 1024x1024 logo at: ${SOURCE_LOGO}`);
    process.exit(1);
}

async function generateIcons() {
    console.log('🎨 Generating app icons...\n');

    try {
        // 1. Main icon (1024x1024)
        console.log('📱 Generating icon.png (1024x1024)...');
        await sharp(SOURCE_LOGO)
            .resize(1024, 1024)
            .toFile(path.join(ASSETS_DIR, 'icon.png'));

        // 2. Android adaptive icon foreground (1024x1024)
        console.log('🤖 Generating android-icon-foreground.png (1024x1024)...');
        await sharp(SOURCE_LOGO)
            .resize(1024, 1024)
            .toFile(path.join(ASSETS_DIR, 'android-icon-foreground.png'));

        // 3. Android adaptive icon background (solid color)
        console.log('🎨 Generating android-icon-background.png (1024x1024)...');
        await sharp({
            create: {
                width: 1024,
                height: 1024,
                channels: 4,
                background: { r: 253, g: 249, b: 237, alpha: 1 } // #FDF9ED
            }
        })
            .png()
            .toFile(path.join(ASSETS_DIR, 'android-icon-background.png'));

        // 4. Android monochrome icon (convert to grayscale)
        console.log('⚫ Generating android-icon-monochrome.png (1024x1024)...');
        await sharp(SOURCE_LOGO)
            .resize(1024, 1024)
            .grayscale()
            .toFile(path.join(ASSETS_DIR, 'android-icon-monochrome.png'));

        // 5. Splash icon (400x400)
        console.log('💦 Generating splash-icon.png (400x400)...');
        await sharp(SOURCE_LOGO)
            .resize(400, 400)
            .toFile(path.join(ASSETS_DIR, 'splash-icon.png'));

        // 6. Favicon (48x48)
        console.log('🌐 Generating favicon.png (48x48)...');
        await sharp(SOURCE_LOGO)
            .resize(48, 48)
            .toFile(path.join(ASSETS_DIR, 'favicon.png'));

        console.log('\n✅ All icons generated successfully!');
        console.log('\nGenerated files:');
        console.log('  ✓ icon.png (1024x1024)');
        console.log('  ✓ android-icon-foreground.png (1024x1024)');
        console.log('  ✓ android-icon-background.png (1024x1024)');
        console.log('  ✓ android-icon-monochrome.png (1024x1024)');
        console.log('  ✓ splash-icon.png (400x400)');
        console.log('  ✓ favicon.png (48x48)');
        console.log('\n🚀 Ready to rebuild app!');

    } catch (error) {
        console.error('❌ Error generating icons:', error);
        process.exit(1);
    }
}

generateIcons();
