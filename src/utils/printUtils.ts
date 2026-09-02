export const printElement = (element: HTMLElement, extraStyles: string = '') => {
  if (!element) return;
  
  const previous = document.getElementById('temp-print-container');
  if (previous) previous.remove();
  const previousStyle = document.getElementById('temp-print-style');
  if (previousStyle) previousStyle.remove();

  const printContainer = document.createElement('div');
  printContainer.id = 'temp-print-container';
  
  // Clone element to preserve original
  const clone = element.cloneNode(true) as HTMLElement;
  printContainer.appendChild(clone);
  document.body.appendChild(printContainer);
  
  const style = document.createElement('style');
  style.id = 'temp-print-style';
  style.innerHTML = `
    @media print {
      body > *:not(#temp-print-container) { display: none !important; }
      #temp-print-container {
        display: block !important; position: absolute; left: 0; top: 0; width: 100%;
        background: white; margin: 0; padding: 0;
      }
      #temp-print-container > div {
        border: none !important; box-shadow: none !important; padding: 10mm !important;
        margin: 0 !important; width: 100% !important; max-width: none !important;
      }
      ${extraStyles}
    }
    @media screen { #temp-print-container { display: none !important; } }
  `;
  document.head.appendChild(style);
  
  window.print();
  
  setTimeout(() => {
    if (document.body.contains(printContainer)) document.body.removeChild(printContainer);
    if (document.head.contains(style)) document.head.removeChild(style);
  }, 1000);
};
