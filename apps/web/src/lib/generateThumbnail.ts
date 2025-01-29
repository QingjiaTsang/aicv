import { domToBlob } from 'modern-screenshot'

export const generateThumbnail = async (id: string) => {
  const resumeElement = document.getElementById("resume-preview")
  if (!resumeElement) {
    return
  }

  try {
    const blob = await domToBlob(resumeElement, {
      scale: 0.5,
      type: "image/png",
    });
    
    const file = new File([blob], `doc_${id}_${Date.now()}`, { type: "image/png" });
    return file;
  } catch (error) {
    console.error("Thumbnail generation failed", error);
  }
}
