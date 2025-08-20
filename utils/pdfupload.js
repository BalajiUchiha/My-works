// utils/uploadPdfToSupabase.j
import { supabase } from '../config/supabaseClient.js';

export const uploadPdfToSupabase = async (buffer, filename) => {
  const { data, error } = await supabase.storage
    .from('inspection-pdfs')
    .upload(filename, buffer,{
      contentType: 'application/pdf',
      upsert: true // overwrite if same filename exists
    });

  if (error) throw error;

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('inspection-pdfs')
    .getPublicUrl(filename);

  return publicUrlData.publicUrl;
};


export const uploadDocumentToSupabase = async (file) => {
  try {
    const { buffer, mimetype, originalname } = file;

    const filePath = `reports/${Date.now()}-${originalname}`;

    const { data, error } = await supabase.storage
      .from("report-docs")
      .upload(filePath, buffer, {
        contentType: mimetype,
      });

    if (error) {
      console.error("Supabase upload error:", error.message);
      throw new Error("Failed to upload document to Supabase");
    }

    const { data: publicUrlData } = supabase.storage
      .from("report-docs")
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl;

  } catch (err) {
    console.error("Supabase Buffer Upload Failed:", err.message);
    throw err;
  }
};
