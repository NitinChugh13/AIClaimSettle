const fs = require('fs');
const path = require('path');

const replacements = [
    { search: /support@claimsettle\.ai/g, replace: 'support@claimnova.in' },
    { search: /1800\s123\s4567/g, replace: '1800-NOVA-247' },
    { search: /UIIC/g, replace: 'SecureShield Insurance' },
    { search: /United India/g, replace: 'SecureShield Insurance' },
    { search: /Oriental Insurance/g, replace: 'PrimeCover General' },
    { search: /\bOIC\b/g, replace: 'PrimeCover General' },
    { search: /National Insurance/g, replace: 'BharatGuard Insurance' },
    { search: /\bNIC\b/g, replace: 'BharatGuard Insurance' },
    { search: /IRDAI Reg:/g, replace: 'Regulatory Ref:' },
    { search: /IRDAI/g, replace: 'IRDA' },
    { search: /ISO 27001/g, replace: 'DataSafe Certified (DS-27001)' },
    { search: /ClaimSettle AI/g, replace: 'ClaimNova' },
    { search: /ClaimSettle/g, replace: 'ClaimNova' },
    { search: /aisettle/gi, replace: 'claimnova' },
    { search: /claimsettle/gi, replace: 'claimnova' },
    { search: /File Claim/g, replace: '⚡ Launch Nova Strike' },
    { search: /Start Your Claim/g, replace: '⚡ Launch Nova Strike' },
    { search: /Track Existing Claim/g, replace: '📡 Track My Claim' },
    { search: /File a Claim/g, replace: '⚡ Launch Nova Strike' }
];

function processFile(fullPath) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    replacements.forEach(r => {
        if (r.search.test(content)) {
            content = content.replace(r.search, r.replace);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
    }
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!['node_modules', '.git', '.next', 'public', '.npm'].includes(file)) {
                walkDir(fullPath);
            }
        } else {
            if (['.tsx', '.ts', '.jsx', '.js', '.json', '.md', '.css', '.html'].includes(path.extname(fullPath))) {
                processFile(fullPath);
            }
        }
    });
}

walkDir(path.join(__dirname, 'src'));

if (fs.existsSync(path.join(__dirname, 'public'))) {
    const files = fs.readdirSync(path.join(__dirname, 'public'));
    files.forEach(f => {
        if (f.endsWith('.json') || f.endsWith('.md')) {
            processFile(path.join(__dirname, 'public', f));
        }
    });
}

['README.md', 'package.json'].forEach(file => {
    const fPath = path.join(__dirname, file);
    if (fs.existsSync(fPath)) processFile(fPath);
});
