import path from 'path';
import ejs from 'ejs';
import pdf from 'pdf-creator-node';

export const generateInspectionPDF = async (report) => {
  try {
    // 1️⃣ Load EJS Template
    const templatePath = path.resolve('./views/pre_inspection.ejs');
    const html = await ejs.renderFile(templatePath, { report });

    // 2️⃣ PDF Options
    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm',
    };

    // 3️⃣ Create PDF Document
    const document = {
      html,
      data: { report },
      type: 'buffer' // Return buffer instead of file path
    };

    // 4️⃣ Generate PDF Buffer
    const pdfBuffer = await pdf.create(document, options);

    // 5️⃣ Return to controller (to upload to Cloudinary etc.)
    return pdfBuffer;
    console.log('PDF Generated Successfully!');

  } catch (err) {
    console.error('Ammu broke her nail on PDF logic 💔', err);
    throw err;
  }
};
export const generateimggallery=async (report) => {
  try {
    const templatePath = path.resolve('./views/post_2.ejs');
    const html = await ejs.renderFile(templatePath, { report, appMeta });

    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm'
    };

    const document = {
      html,
      data: { report },
      type: 'buffer'
    };

    const pdfBuffer = await pdf.create(document, options);
    return pdfBuffer;

  } catch (err) {
    console.error('💔 PDF generation error:', err);
    throw err;
  }
};

export const generatePostShipmentPDF = async (report) => {
  try {
    const templatePath = path.resolve('./views/post_inspection.ejs');
    const html = await ejs.renderFile(templatePath, {report});

    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm'
    };

    const document = {
      html,
      data: { report },
      type: 'buffer'
    };

    const pdfBuffer = await pdf.create(document, options);
    return pdfBuffer;

  } catch (err) {
    console.error('💔 PDF generation error:', err);
    throw err;
  }
};