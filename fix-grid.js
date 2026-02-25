const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // We are looking for <Grid ... xs={...} sm={...} md={...} lg={...} xl={...}>
    // This regex matches <Grid followed by any props, and converts xs=X sm=Y to size={{ xs: X, sm: Y }}

    // A simpler approach: find all occurrences of <Grid and replace the sizing props.
    content = content.replace(/<Grid([^>]*)(xs|sm|md|lg|xl)=\{(.*?)\}([^>]*)>/g, (match) => {
        // Extract all sizing props
        const sizingProps = {};
        const others = [];

        // Parse attributes
        const attrRegex = /([a-zA-Z0-9_]+)=(?:\{([^}]*)\}|"([^"]*)")/g;
        let attrMatch;
        let newMatch = match.replace(/^<Grid\s/, '').replace(/>$/, '').trim();

        const remainingProps = [];
        let sizeObj = [];

        // Quick and dirty manual replacement for typical items
        let transformed = match;
        const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
        let hasSize = false;
        let sizeParts = [];

        sizes.forEach(sz => {
            const regex = new RegExp(`${sz}={([^}]+)}`);
            const m = transformed.match(regex);
            if (m) {
                hasSize = true;
                sizeParts.push(`${sz}: ${m[1]}`);
                transformed = transformed.replace(m[0], '');
            } else {
                const regexStr = new RegExp(`${sz}="([^"]+)"`);
                const mStr = transformed.match(regexStr);
                if (mStr) {
                    hasSize = true;
                    sizeParts.push(`${sz}: ${mStr[1]}`);
                    transformed = transformed.replace(mStr[0], '');
                }
            }
        });

        if (hasSize) {
            // Clean up multiple spaces
            transformed = transformed.replace(/\s+/g, ' ');
            transformed = transformed.replace('<Grid ', `<Grid size={{ ${sizeParts.join(', ')} }} `);
            return transformed;
        }

        return match;
    });

    // Run it twice to catch multiple replacements if needed (though the above handles all in one go per tag)

    if (originalContent !== content) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed:', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    }
}

walkDir('./src');
