/**
 * Real client-side browser canvas utilities for high-performance Cyber Cafe photo & document processing.
 */

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

export const getBase64SizeKB = (base64String: string): number => {
  const padding = base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0;
  const base64Length = base64String.length - (base64String.indexOf(',') + 1);
  const sizeInBytes = (base64Length * 3) / 4 - padding;
  return Math.round((sizeInBytes / 1024) * 10) / 10;
};

export const resizeImage = async (
  dataUrl: string,
  width: number,
  height: number,
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  quality = 0.92
): Promise<string> => {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL(mimeType, quality);
};

export const cropImage = async (
  dataUrl: string,
  crop: CropArea,
  mimeType: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality = 0.95
): Promise<string> => {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(crop.width));
  canvas.height = Math.max(1, Math.round(crop.height));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    img,
    Math.round(crop.x),
    Math.round(crop.y),
    Math.round(crop.width),
    Math.round(crop.height),
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.toDataURL(mimeType, quality);
};

export const rotateImage = async (
  dataUrl: string,
  angleDegrees: number,
  mimeType: 'image/jpeg' | 'image/png' = 'image/jpeg'
): Promise<string> => {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  const radians = (angleDegrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  canvas.width = Math.round(img.width * cos + img.height * sin);
  canvas.height = Math.round(img.width * sin + img.height * cos);

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  return canvas.toDataURL(mimeType, 0.95);
};

/**
 * Compresses an image to be strictly under/close to target KB limit
 * utilizing multi-pass binary search on JPEG quality and dimension scaling.
 */
export const compressToTargetKB = async (
  dataUrl: string,
  targetKB: number,
  mimeType: 'image/jpeg' | 'image/webp' = 'image/jpeg'
): Promise<{ dataUrl: string; finalKB: number; width: number; height: number }> => {
  const img = await loadImage(dataUrl);
  let currentWidth = img.width;
  let currentHeight = img.height;

  let minQuality = 0.05;
  let maxQuality = 0.98;
  let bestResult = dataUrl;
  let bestSize = getBase64SizeKB(bestResult);

  // If already below target and quality is reasonable, keep or slightly compress
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  for (let pass = 0; pass < 3; pass++) {
    canvas.width = currentWidth;
    canvas.height = currentHeight;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw white background for transparent PNGs converted to JPEG
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Binary search on quality
    minQuality = 0.05;
    maxQuality = 0.98;
    for (let i = 0; i < 8; i++) {
      const q = (minQuality + maxQuality) / 2;
      const trial = canvas.toDataURL(mimeType, q);
      const sizeKB = getBase64SizeKB(trial);

      if (sizeKB <= targetKB) {
        bestResult = trial;
        bestSize = sizeKB;
        minQuality = q; // try to get better quality while still under target
      } else {
        maxQuality = q; // reduce quality
      }
    }

    if (bestSize <= targetKB) {
      break;
    }

    // If still over targetKB, downscale dimensions by 20%
    currentWidth = Math.round(currentWidth * 0.8);
    currentHeight = Math.round(currentHeight * 0.8);
    if (currentWidth < 120 || currentHeight < 120) break;
  }

  return {
    dataUrl: bestResult,
    finalKB: bestSize,
    width: currentWidth,
    height: currentHeight,
  };
};

/**
 * Signature Enhancer: converts shadowed, mobile phone camera signatures
 * into clean, high-contrast monochrome signature for government portal upload.
 */
export const enhanceSignature = async (
  dataUrl: string,
  threshold = 140,
  contrast = 1.3
): Promise<string> => {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Compute adaptive luminance and threshold
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Grayscale luminance
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Apply contrast
    gray = (gray - 128) * contrast + 128;

    // Thresholding
    if (gray > threshold) {
      // Background white
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else {
      // Dark ink
      const darkVal = Math.max(0, Math.round(gray * 0.5));
      data[i] = darkVal;
      data[i + 1] = darkVal;
      data[i + 2] = darkVal;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.95);
};

/**
 * Passport Photo Sheet Maker: creates a 4x6 inch or A4 sheet with exact grid of passport photos,
 * cutting guidelines, thin borders, and optional name/date stamp.
 */
export interface PassportSheetConfig {
  paperSize: '4x6' | 'A4';
  cols: number;
  rows: number;
  totalPhotos?: number;
  alignTop?: boolean;
  showCutLines: boolean;
  showBorders: boolean;
  stampName?: string;
  stampDate?: string;
  bgColor?: string; // e.g. white or light blue
}

export const generatePassportPhotoSheet = async (
  photoDataUrl: string,
  config: PassportSheetConfig
): Promise<string> => {
  const photo = await loadImage(photoDataUrl);

  // Dimensions in DPI (300 DPI for high quality photo print)
  // 4x6 inches = 1200 x 1800 px (or 1800 x 1200 landscape)
  // A4 = 2480 x 3508 px
  let sheetWidth = 1800;
  let sheetHeight = 1200;

  if (config.paperSize === 'A4') {
    sheetWidth = 2480;
    sheetHeight = 3508;
  }

  const canvas = document.createElement('canvas');
  canvas.width = sheetWidth;
  canvas.height = sheetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Fill pure white paper
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sheetWidth, sheetHeight);

  const cols = config.cols;
  const rows = config.rows;
  const maxPhotos = config.totalPhotos || cols * rows;

  const marginX = Math.round(sheetWidth * 0.04);
  const marginY = Math.round(sheetHeight * 0.04);
  const availableWidth = sheetWidth - marginX * 2;
  const availableHeight = sheetHeight - marginY * 2;

  const cellWidth = availableWidth / cols;
  const cellHeight = availableHeight / rows;

  // Standard Passport Size: 3.5cm x 4.5cm
  // At 300 DPI, 3.5cm = (3.5 / 2.54) * 300 = 413 px
  // 4.5cm = (4.5 / 2.54) * 300 = 531 px
  let photoW = 413;
  let photoH = 531;

  // If the cell is too small, shrink to fit the cell while maintaining ratio
  const targetRatio = 3.5 / 4.5;
  if (photoW > cellWidth * 0.95) {
    photoW = cellWidth * 0.95;
    photoH = photoW / targetRatio;
  }
  if (photoH > cellHeight * 0.95) {
    photoH = cellHeight * 0.95;
    photoW = photoH * targetRatio;
  }

  let photosDrawn = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (photosDrawn >= maxPhotos) break;

      const centerX = marginX + c * cellWidth + cellWidth / 2;
      let centerY = marginY + r * cellHeight + cellHeight / 2;
      
      if (config.alignTop) {
        // Pack items at the top instead of distributing across the whole page height
        // Using a 20px gap ensures 6 rows (30 photos) fit perfectly on an A4 sheet.
        const topPadding = marginY + 40;
        const rowSpacing = photoH + 20;
        centerY = topPadding + r * rowSpacing + photoH / 2;
      }

      const x = centerX - photoW / 2;
      const y = centerY - photoH / 2;

      // Draw optional background color tint if specified
      if (config.bgColor && config.bgColor !== '#ffffff') {
        ctx.fillStyle = config.bgColor;
        ctx.fillRect(x, y, photoW, photoH);
      }

      // Draw photo
      ctx.drawImage(photo, x, y, photoW, photoH);
      
      photosDrawn++;

      // Optional thin black border
      if (config.showBorders) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, photoW, photoH);
      }

      // Optional stamp with Name & Date at bottom of photo
      if (config.stampName || config.stampDate) {
        const stampHeight = Math.round(photoH * 0.16);
        const stampY = y + photoH - stampHeight;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.fillRect(x, stampY, photoW, stampHeight);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, stampY, photoW, stampHeight);

        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const fontSize = Math.round(stampHeight * 0.38);
        ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;

        if (config.stampName && config.stampDate) {
          ctx.fillText(config.stampName, centerX, stampY + stampHeight * 0.32, photoW * 0.95);
          ctx.font = `normal ${Math.round(fontSize * 0.85)}px sans-serif`;
          ctx.fillText(`DOB/Date: ${config.stampDate}`, centerX, stampY + stampHeight * 0.75, photoW * 0.95);
        } else if (config.stampName) {
          ctx.fillText(config.stampName, centerX, stampY + stampHeight * 0.5, photoW * 0.95);
        } else if (config.stampDate) {
          ctx.fillText(`Date: ${config.stampDate}`, centerX, stampY + stampHeight * 0.5, photoW * 0.95);
        }
      }

      // Optional cutting guidelines (dashed marks)
      if (config.showCutLines) {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        // Draw a clear dashed cut-box around each photo with a 3px padding
        // This makes it extremely easy to cut straight lines with scissors
        ctx.strokeRect(x - 3, y - 3, photoW + 6, photoH + 6);
        ctx.setLineDash([]);
      }
    }
  }

  return canvas.toDataURL('image/jpeg', 0.96);
};

/**
 * ID Card Front & Back Side-by-Side Printable Sheet (CR80 Standard size 85.6mm x 53.98mm)
 */
export const generateIdCardSheet = async (
  frontDataUrl: string,
  backDataUrl?: string
): Promise<string> => {
  const frontImg = await loadImage(frontDataUrl);
  const backImg = backDataUrl ? await loadImage(backDataUrl) : null;

  // A4 sheet at 300 DPI: 2480 x 3508 px
  const canvas = document.createElement('canvas');
  canvas.width = 2480;
  canvas.height = 1754; // A4 landscape half or standard
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Standard CR80 ID Card dimensions at 300 DPI: 85.6mm x 53.98mm => 1011 x 638 px
  const cardW = 1011;
  const cardH = 638;
  const gap = 80;

  if (backImg) {
    const totalW = cardW * 2 + gap;
    const startX = (canvas.width - totalW) / 2;
    const startY = (canvas.height - cardH) / 2;

    // Front Card
    ctx.drawImage(frontImg, startX, startY, cardW, cardH);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, cardW, cardH);

    // Back Card
    ctx.drawImage(backImg, startX + cardW + gap, startY, cardW, cardH);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX + cardW + gap, startY, cardW, cardH);

    // Guide text
    ctx.fillStyle = '#64748b';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Front Side (85.6mm × 53.98mm)', startX + cardW / 2, startY - 20);
    ctx.fillText('Back Side (85.6mm × 53.98mm)', startX + cardW + gap + cardW / 2, startY - 20);
  } else {
    // Single card centered
    const startX = (canvas.width - cardW) / 2;
    const startY = (canvas.height - cardH) / 2;
    ctx.drawImage(frontImg, startX, startY, cardW, cardH);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, cardW, cardH);
  }

  return canvas.toDataURL('image/jpeg', 0.96);
};
