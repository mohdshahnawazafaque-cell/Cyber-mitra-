const fs = require('fs');
const code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

const regex = /const upGeoData.*?=\s*(\{[\s\S]*?\n\});/m;
const match = code.match(regex);
if (match) {
  const dataStr = match[1];
  console.log("Found upGeoData string of length:", dataStr.length);
  try {
     const parsed = JSON.parse(dataStr);
     console.log("Keys count:", Object.keys(parsed).length);
  } catch (e) {
     console.error("Parse error:", e);
  }
} else {
  console.log("Not found");
}
