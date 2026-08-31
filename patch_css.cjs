const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

if (!css.includes('animate-marquee')) {
    const marqueeCSS = `

@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 25s linear infinite;
}
`;
    fs.appendFileSync('src/index.css', marqueeCSS);
    console.log("Added marquee to css");
} else {
    console.log("Already has marquee");
}
