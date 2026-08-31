const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

if (!css.includes('overflow-x: hidden;')) {
    css = css.replace('body {', 'html, body {\n  overflow-x: hidden;\n  width: 100%;\n}\n\nbody {');
    fs.writeFileSync('src/index.css', css);
    console.log("Added overflow-x: hidden to body in css");
} else {
    console.log("Already has overflow-x hidden");
}
