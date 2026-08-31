const fs = require('fs');
let code = fs.readFileSync('src/data/initialTemplates.ts', 'utf8');

// Replace standard default values with empty strings
code = code.replace(/defaultValue: 'सदर'/g, "defaultValue: ''");
code = code.replace(/defaultValue: '48000'/g, "defaultValue: ''");
code = code.replace(/defaultValue: 'अड़तालीस हजार'/g, "defaultValue: ''");
code = code.replace(/defaultValue: 'छात्रवृत्ति एवं सरकारी योजना हेतु'/g, "defaultValue: ''");
code = code.replace(/defaultValue: 'शैक्षणिक प्रवेश एवं सरकारी अभिलेख हेतु'/g, "defaultValue: ''");
code = code.replace(/defaultValue: 'एस० बी० आई०'/g, "defaultValue: ''");
code = code.replace(/defaultValue: 'सदर बाजार'/g, "defaultValue: ''");
code = code.replace(/defaultValue: '12345678901'/g, "defaultValue: ''");
code = code.replace(/defaultValue: 'श्रीमान शाखा प्रबंधक महोदय'/g, "defaultValue: ''");
code = code.replace(/defaultValue: 'खाता चालू करने'/g, "defaultValue: ''");
code = code.replace(/defaultValue: 'जमीन पर अवैध कब्जे की शिकायत'/g, "defaultValue: ''");
code = code.replace(/defaultValue: 'विपक्षीगणों द्वारा प्रार्थी की पुश्तैनी जमीन\/रास्ते पर जबरन अवैध कब्जा करने का प्रयास किया जा रहा है और मना करने पर गाली-गलौज व जान से मारने की धमकी दे रहे हैं।'/g, "defaultValue: ''");
code = code.replace(/defaultValue: 'थाने स्तर पर न्याय न मिलने की शिकायत'/g, "defaultValue: ''");
code = code.replace(/defaultValue: 'प्रार्थी के साथ हुई उक्त घटना के संबंध में स्थानीय थाने\/विभाग में कई बार प्रार्थना पत्र दिया गया, लेकिन संबंधित अधिकारियों द्वारा कोई संतोषजनक कार्यवाही नहीं की जा रही है।'/g, "defaultValue: ''");

fs.writeFileSync('src/data/initialTemplates.ts', code);
console.log("Patched initialTemplates.ts");
