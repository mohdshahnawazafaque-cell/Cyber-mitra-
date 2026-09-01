const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /if \(actionType !== 'External'\) \{([\s\S]*?)\}/,
  `if (true) {
      const win = window.open(url, '_blank');
      if (!win) {
        alert(isHindi ? 'पॉप-अप ब्लॉक है! कृपया अपने ब्राउज़र में पॉप-अप चालू करें या नए टैब में पोर्टल खोलें।' : 'Popup blocked! Please allow popups or open this portal in a new tab.');
      }
    }`
);

fs.writeFileSync('src/App.tsx', code);
