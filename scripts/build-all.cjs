const { build } = require('vite');
const path = require('path');
const fs = require('fs');

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const distDir = path.resolve(rootDir, 'dist');
  const webDir = path.resolve(rootDir, 'web');
  const adminDir = path.resolve(rootDir, 'admin');

  console.log('🚀 [1/3] Building Web Frontend (thegyde.in)...');
  process.chdir(webDir);
  await build({
    configFile: path.resolve(webDir, 'vite.config.ts'),
  });

  console.log('🚀 [2/3] Building Admin Dashboard (thegyde.in/admin)...');
  process.chdir(adminDir);
  await build({
    configFile: path.resolve(adminDir, 'vite.config.ts'),
  });

  console.log('📦 [3/3] Packaging into unified distribution folder (dist)...');
  process.chdir(rootDir);

  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  // Copy web build to dist root
  fs.cpSync(path.resolve(webDir, 'dist'), distDir, { recursive: true });

  // Copy admin build to dist/admin
  fs.cpSync(path.resolve(adminDir, 'dist'), path.join(distDir, 'admin'), { recursive: true });

  console.log('✅ Build completed successfully! Unified structure:');
  console.log('   - /             -> dist/index.html (Web Frontend)');
  console.log('   - /admin        -> dist/admin/index.html (Admin Portal)');
}

main().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
