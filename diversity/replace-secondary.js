const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

function processFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Replace purple-X and indigo-X with secondary-X
    content = content.replace(/purple-/g, 'secondary-');
    content = content.replace(/indigo-/g, 'secondary-');

    // Also replace any specific calls holding over from standard Tailwind colors
    // to ensure everything correctly hooks onto our new solid colors.
    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        console.log('Updated secondary colors in', file);
    }
}

const targetDirs = [
    path.join(__dirname, 'app'),
    path.join(__dirname, 'components')
];

for (const dir of targetDirs) {
    if (fs.existsSync(dir)) {
        processDirectory(dir);
    }
}
