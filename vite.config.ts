import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// Plugin to copy non-module JS files to dist (Vite skips <script> tags without type="module")
// Also replaces process.env.GEMINI_API_KEY with actual value since Vite won't process these
function copyNonModuleScripts(envVars: Record<string, string>): Plugin {
  return {
    name: 'copy-non-module-scripts',
    closeBundle() {
      const rootDir = __dirname;
      const distDir = path.join(rootDir, 'dist');
      const dirs = ['js', 'tamil-nadu', 'heritageai'];

      // Env var replacements to apply in copied JS files
      const replacements: [RegExp, string][] = [
        [/process\.env\.GEMINI_API_KEY/g, JSON.stringify(envVars.GEMINI_API_KEY || '')],
        [/process\.env\.API_KEY/g, JSON.stringify(envVars.GEMINI_API_KEY || '')],
      ];

      function copyJsRecursive(dir: string) {
        const fullDir = path.join(rootDir, dir);
        if (!fs.existsSync(fullDir)) return;
        const entries = fs.readdirSync(fullDir);
        for (const entry of entries) {
          const srcPath = path.join(fullDir, entry);
          const stat = fs.statSync(srcPath);
          if (stat.isDirectory()) {
            copyJsRecursive(path.join(dir, entry));
          } else if (entry.endsWith('.js')) {
            const destPath = path.join(distDir, dir, entry);
            // Don't overwrite files Vite already bundled
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(path.dirname(destPath), { recursive: true });
              // Read, replace env vars, then write
              let content = fs.readFileSync(srcPath, 'utf-8');
              for (const [pattern, value] of replacements) {
                content = content.replace(pattern, value);
              }
              fs.writeFileSync(destPath, content, 'utf-8');
            }
          }
        }
      }

      for (const dir of dirs) {
        copyJsRecursive(dir);
      }
      console.log('✅ Copied non-module JS files to dist (with env var injection)');
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Function to recursively find HTML files
    function findHtmlFiles(dir: string, baseDir = dir): string[] {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      
      list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat && stat.isDirectory()) {
          // Skip certain directories
          if (['node_modules', 'dist', 'backend', '.git', '.vercel', 'public'].includes(file)) {
            return;
          }
          results = results.concat(findHtmlFiles(filePath, baseDir));
        } else if (file.endsWith('.html') && !file.startsWith('test-')) {
          const relativePath = path.relative(baseDir, filePath);
          results.push(relativePath);
        }
      });
      
      return results;
    }
    
    // Find all HTML files and create input object
    const htmlFiles = findHtmlFiles(__dirname);
    const input = Object.fromEntries(
      htmlFiles.map(file => [
        file.replace(/\.html$/, '').replace(/[\\/]/g, '-'),
        path.resolve(__dirname, file)
      ])
    );
    
    return {
      base: '/',
      publicDir: 'public',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), copyNonModuleScripts(env)],
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            login: path.resolve(__dirname, 'login.html'),
            signup: path.resolve(__dirname, 'signup.html'),
            preferences: path.resolve(__dirname, 'preferences.html'),
            // Tamil Nadu pages
            'tamil-nadu': path.resolve(__dirname, 'tamil-nadu/index.html'),
            'tamil-nadu-chettinad': path.resolve(__dirname, 'tamil-nadu/chettinad/index.html'),
            'tamil-nadu-chidambaram': path.resolve(__dirname, 'tamil-nadu/chidambaram/index.html'),
            'tamil-nadu-darasuram': path.resolve(__dirname, 'tamil-nadu/darasuram/index.html'),
            'tamil-nadu-fort-st-george': path.resolve(__dirname, 'tamil-nadu/fort-st-george/index.html'),
            'tamil-nadu-gangaikonda': path.resolve(__dirname, 'tamil-nadu/gangaikonda-cholapuram/index.html'),
            'tamil-nadu-gingee': path.resolve(__dirname, 'tamil-nadu/gingee-fort/index.html'),
            'tamil-nadu-kanchipuram': path.resolve(__dirname, 'tamil-nadu/kanchipuram/index.html'),
            'tamil-nadu-kanyakumari': path.resolve(__dirname, 'tamil-nadu/kanyakumari/index.html'),
            'tamil-nadu-keeladi': path.resolve(__dirname, 'tamil-nadu/keeladi/index.html'),
            'tamil-nadu-madurai': path.resolve(__dirname, 'tamil-nadu/madurai/index.html'),
            'tamil-nadu-mahabalipuram': path.resolve(__dirname, 'tamil-nadu/mahabalipuram/index.html'),
            'tamil-nadu-nilgiris': path.resolve(__dirname, 'tamil-nadu/nilgiris-ooty/index.html'),
            'tamil-nadu-palani': path.resolve(__dirname, 'tamil-nadu/palani/index.html'),
            'tamil-nadu-rameswaram': path.resolve(__dirname, 'tamil-nadu/rameswaram/index.html'),
            'tamil-nadu-rockfort': path.resolve(__dirname, 'tamil-nadu/rockfort-tiruchirappalli/index.html'),
            'tamil-nadu-srirangam': path.resolve(__dirname, 'tamil-nadu/srirangam/index.html'),
            'tamil-nadu-srivilliputhur': path.resolve(__dirname, 'tamil-nadu/srivilliputhur/index.html'),
            'tamil-nadu-thanjavur': path.resolve(__dirname, 'tamil-nadu/thanjavur/index.html'),
            'tamil-nadu-thiruchendur': path.resolve(__dirname, 'tamil-nadu/thiruchendur/index.html'),
            'tamil-nadu-tiruvannamalai': path.resolve(__dirname, 'tamil-nadu/tiruvannamalai/index.html'),
            'tamil-nadu-vellore': path.resolve(__dirname, 'tamil-nadu/vellore-fort/index.html'),
            // Heritage AI
            'heritage-ai': path.resolve(__dirname, 'heritageai/heritage-ai.html'),
          }
        },
        copyPublicDir: true
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
