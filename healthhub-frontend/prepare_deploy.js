
const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            if (dirPath.endsWith('.js')) callback(dirPath);
        }
    });
}

const rootDir = path.join(__dirname, 'src');

walkDir(rootDir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace single/double quoted URLs
    // 'http://localhost:5000/api' -> (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api'
    content = content.replace(/(['"])http:\/\/localhost:5000/g, "(process.env.REACT_APP_API_URL || 'http://localhost:5000') + $1");

    // Replace backtick URLs
    // `http://localhost:5000/api` -> `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api`
    content = content.replace(/`http:\/\/localhost:5000/g, "`\${process.env.REACT_APP_API_URL || 'http://localhost:5000'}");

    if (content !== original) {
        console.log(`Updated: ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf8');
    }
});

console.log('✅ URL replacement complete. Ready for build.');
