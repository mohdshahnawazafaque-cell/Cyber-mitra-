import { jsPDF } from 'jspdf';
import { loadImage } from './imageUtils';

export interface ImagesToPdfConfig {
  orientation: 'p' | 'l';
  pageSize: 'a4' | 'letter';
  marginMm: number;
  quality: number;
}

export const createPdfFromImages = async (
  imageDataUrls: string[],
  config: ImagesToPdfConfig = {
    orientation: 'p',
    pageSize: 'a4',
    marginMm: 10,
    quality: 0.92,
  }
): Promise<jsPDF> => {
  const doc = new jsPDF({
    orientation: config.orientation,
    unit: 'mm',
    format: config.pageSize,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = config.marginMm;

  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;

  for (let i = 0; i < imageDataUrls.length; i++) {
    if (i > 0) {
      doc.addPage(config.pageSize, config.orientation);
    }

    const dataUrl = imageDataUrls[i];
    const img = await loadImage(dataUrl);

    const imgRatio = img.width / img.height;
    const printableRatio = printableWidth / printableHeight;

    let renderW = printableWidth;
    let renderH = renderW / imgRatio;

    if (renderH > printableHeight) {
      renderH = printableHeight;
      renderW = renderH * imgRatio;
    }

    const posX = margin + (printableWidth - renderW) / 2;
    const posY = margin + (printableHeight - renderH) / 2;

    doc.addImage(dataUrl, 'JPEG', posX, posY, renderW, renderH, undefined, 'FAST');
  }

  return doc;
};

export const createApplicationPdf = (
  title: string,
  recipient: string,
  subject: string,
  body: string,
  customerName: string,
  dateStr: string,
  attachedDocs: string[] = []
): jsPDF => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  let currentY = 22;

  // Header Title Border Box
  doc.setDrawColor(29, 78, 216); // blue-700
  doc.setFillColor(239, 246, 255); // blue-50
  doc.rect(margin, currentY, pageWidth - margin * 2, 12, 'FD');

  doc.setTextColor(29, 78, 216);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), pageWidth / 2, currentY + 8, { align: 'center' });

  currentY += 20;

  // Recipient
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  const recipientLines = doc.splitTextToSize(recipient, pageWidth - margin * 2);
  doc.text(recipientLines, margin, currentY);
  currentY += recipientLines.length * 5.5 + 4;

  // Subject
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - margin * 2, 8, 'F');
  doc.setTextColor(2, 6, 23);
  doc.setFont('helvetica', 'bold');
  doc.text(subject, margin + 3, currentY + 5.5);
  currentY += 14;

  // Body Text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const bodyLines = doc.splitTextToSize(body, pageWidth - margin * 2);
  doc.text(bodyLines, margin, currentY);
  currentY += bodyLines.length * 5.2 + 10;

  // Enclosures / Attached Documents
  if (attachedDocs.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Attached Documents / Sanlagnak:', margin, currentY);
    currentY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    attachedDocs.forEach((docName, idx) => {
      doc.text(`${idx + 1}. ${docName}`, margin + 4, currentY);
      currentY += 4.5;
    });
    currentY += 6;
  }

  // Footer Signature Section
  const footerY = Math.max(currentY + 10, 240);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);

  // Left Date & Place
  doc.text(`Date: ${dateStr || new Date().toLocaleDateString('en-IN')}`, margin, footerY);
  doc.text(`Place: __________________`, margin, footerY + 6);

  // Right Applicant Signature Box
  const rightX = pageWidth - margin - 50;
  doc.text('Applicant Signature:', rightX, footerY - 8);
  doc.setDrawColor(203, 213, 225);
  doc.line(rightX, footerY + 8, rightX + 45, footerY + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(`(${customerName || 'Applicant Name'})`, rightX, footerY + 13);

  // Bottom Portal Brand watermark note
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Generated via Cyber Cafe Mitra Portal (Jan Seva Kendra Utility) - Verified Standard Format',
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  return doc;
};
