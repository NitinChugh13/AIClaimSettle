const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');
const lines = content.split('\n');

// Stack to track open tags
const stack = [];
let problems = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Skip comments
  if (line.trim().startsWith('//')) continue;
  
  // Find opening JSX tags (but not self-closing)
  const openPattern = /<(Box|Container|Grid|AppBar|Drawer|Tooltip|Card|Typography|Paper|Chip|Link|Divider|Button|TextField|FormControl|Select|MenuItem|Dialog|DialogTitle|DialogContent|DialogActions|Snackbar|Alert|CircularProgress|LinearProgress|Skeleton|Badge|Chip|Avatar|Breadcrumbs|Stepper|Step|StepLabel)\s[^/]*?>/g;
  let match;
  while ((match = openPattern.exec(line))) {
    if (!line.substring(match.index + match[0].length, match.index + match[0].length + 5).includes('/>')) {
      stack.push({ tag: match[1], line: i + 1 });
    }
  }
  
  // Also check for self-closing opening tags (just < without >)
  const simpleLikeOpen = /<(Box|Container|Grid)[\s*>]/g;
  while ((match = simpleLikeOpen.exec(line))) {
    const afterTag = line.substring(match.index + match[0].length - 1);
    if (!afterTag.match(/^[^>]*\/>/)) {  // not self-closing
      // This is a proper opening tag
    }
  }
  
  // Find closing JSX tags
  const closePattern = /<\/(Box|Container|Grid|AppBar|Drawer|Tooltip|Card|Typography|Paper|Chip|Link|Divider|Button|TextField|FormControl|Select|MenuItem|Dialog|DialogTitle|DialogContent|DialogActions|Snackbar|Alert|CircularProgress|LinearProgress|Skeleton|Badge|Avatar|Breadcrumbs|Stepper|Step|StepLabel)>/g;
  while ((match = closePattern.exec(line))) {
    if (stack.length > 0 && stack[stack.length - 1].tag === match[1]) {
      stack.pop();
    } else {
      problems.push(`Closing </${match[1]}> at line ${i + 1} has no matching opening tag`);
    }
  }
}

console.log(`\nTotal unclosed tags: ${stack.length}`);
if (stack.length > 0 && stack.length < 30) {
  console.log('\nUnclosed tags:');
  stack.forEach(s => console.log(`  - <${s.tag}> opened at line ${s.line}`));
}

if (problems.length > 0) {
  console.log('\nExtra closing tags:');
  problems.forEach(p => console.log(`  - ${p}`));
}
