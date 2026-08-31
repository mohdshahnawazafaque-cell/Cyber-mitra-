const fs = require('fs');
let code = fs.readFileSync('src/components/services/ServiceCard.tsx', 'utf8');

// We need to replace all `<button ... onClick={() => onOpenLink(url, title, type)} ...> ... </button>`
// with `<a href={url} target="_blank" rel="noopener noreferrer" onClick={() => onOpenLink(url, title, type)} ...> ... </a>`

// A generic regex to catch these.
// Example:
// <button
//   onClick={() => onOpenLink(links.newApply!, title, 'New Apply')}
//   className="..."
// >

code = code.replace(/<button(\s+onClick=\{\(\) => onOpenLink\(([^,]+), title, '[^']+'\)\}[\s\S]*?)>([\s\S]*?)<\/button>/g, (match, attrs, urlVar, innerContent) => {
    // attrs contains the onClick and className.
    // We add href={urlVar} target="_blank" rel="noopener noreferrer"
    let newAttrs = attrs.replace(/onClick=\{[^}]+\}/, `onClick={(e) => { e.stopPropagation(); onOpenLink(${urlVar}, title, 'Logged'); }}`);
    return `<a href={${urlVar}} target="_blank" rel="noopener noreferrer"${newAttrs}>${innerContent}</a>`;
});

fs.writeFileSync('src/components/services/ServiceCard.tsx', code);
console.log("Patched ServiceCard.tsx");
