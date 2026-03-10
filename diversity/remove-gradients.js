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

    // Pattern 1: Text gradients
    // text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 -> text-primary-600
    const textGradRegex = /text-transparent\s+bg-clip-text\s+bg-gradient-to-[a-z]{1,2}\s+from-[a-z]+(?:-\d+)?(?:\s+via-[a-z]+(?:-\d+)?(?:\/\d+)?)?(?:\s+to-[a-z]+(?:-\d+)?(?:\/\d+)?)?/g;
    content = content.replace(textGradRegex, "text-primary-600");

    // Pattern 2: Background gradients mapped to their primary weight
    // bg-gradient-to-r from-primary-400 to-amber-500 -> bg-primary-400
    const bgGradRegexWeight = /bg-gradient-to-[a-z]{1,2}\s+from-[a-z]+-(\d+)(?:\s+via-[a-z]+(?:-\d+)?(?:\/\d+)?)?(?:\s+to-[a-z]+(?:-\d+)?(?:\/\d+)?)?/g;
    content = content.replace(bgGradRegexWeight, (match, weight) => {
        return `bg-primary-${weight}`;
    });

    // Pattern 3: Background gradients without weight string (like from-white)
    const bgGradRegexNoWeight = /bg-gradient-to-[a-z]{1,2}\s+from-[a-z]+(?:\s+via-[a-z]+(?:-\d+)?(?:\/\d+)?)?(?:\s+to-[a-z]+(?:-\d+)?(?:\/\d+)?)?/g;
    content = content.replace(bgGradRegexNoWeight, "bg-primary-600");

    // Pattern 4: Dynamic template strings
    const dynamicRegex = /bg-gradient-to-[a-z]{1,2}\s+\$\{[^}]+\}/g;
    content = content.replace(dynamicRegex, "bg-primary-600");

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        console.log('Updated', file);
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
