
export const saveToGoogleSheets = async (data: any) => {
  const savedUrl = localStorage.getItem('educapro_custom_url');
  // URL de respaldo por si el usuario no ha configurado la suya
  const FALLBACK_URL = "https://script.google.com/macros/s/AKfycbzyGUVjpA2aKHhNAzHe0YvFeuFU7SjL3qkjp4YNBrYXDpdffgF6tDsdt2HGqo1ZJndzOw/exec";
  
  const finalUrl = (savedUrl && savedUrl.trim().includes('/exec')) ? savedUrl.trim() : FALLBACK_URL;

  try {
    const payload = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    });
    
    // Usamos text/plain y no-cors para saltarnos las restricciones de seguridad de Google Apps Script
    // El navegador enviará el dato "a ciegas", lo cual es suficiente para que Google lo reciba.
    await fetch(finalUrl, {
      method: "POST",
      mode: "no-cors", 
      cache: "no-cache",
      headers: {
        "Content-Type": "text/plain",
      },
      body: payload
    });
    
    console.log("✅ Datos enviados (Modo Silencioso)");
    return true;
  } catch (error) {
    console.error("❌ Error físico de red:", error);
    return false;
  }
};
