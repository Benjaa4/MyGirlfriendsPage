import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
// Usar la Publishable Key en el frontend
const supabasePublishableKey = import.meta.env.VITE_PUBLISHABLE_KEY || 'placeholder_key';

// Evitar crasheo si la URL no tiene formato válido
const isValidUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');
export const supabase = isValidUrl 
  ? createClient(supabaseUrl, supabasePublishableKey) 
  : null;

// Helpers para Cartas
export const cartasApi = {
  async getCartas() {
    if (!supabase) throw new Error("Supabase no configurado");
    const { data, error } = await supabase.from('cartas').select('*').order('fecha', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  async saveCarta(carta) {
    if (!supabase) throw new Error("Supabase no configurado");
    const { data, error } = await supabase.from('cartas').upsert(carta).select();
    if (error) throw error;
    return data;
  },
  
  async deleteCarta(id) {
    if (!supabase) throw new Error("Supabase no configurado");
    const { error } = await supabase.from('cartas').delete().eq('id', id);
    if (error) throw error;
  }
};

// Helpers para Multimedia
export const multimediaApi = {
  async getMultimedia() {
    if (!supabase) throw new Error("Supabase no configurado");
    const { data, error } = await supabase.from('multimedia').select('*').order('fecha', { ascending: false });
    if (error) throw error;
    return data;
  },

  async uploadFile(file, folder = 'galeria') {
    if (!supabase) throw new Error("Supabase no configurado");
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('multimedia').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('multimedia').getPublicUrl(filePath);
    return data.publicUrl;
  },

  async saveMultimedia(multimediaItem) {
    if (!supabase) throw new Error("Supabase no configurado");
    const { data, error } = await supabase.from('multimedia').upsert(multimediaItem).select();
    if (error) throw error;
    return data;
  },

  async deleteMultimedia(id, fileUrl) {
    if (!supabase) throw new Error("Supabase no configurado");
    try {
      if (fileUrl) {
        const pathParts = fileUrl.split('/');
        const filePath = `${pathParts[pathParts.length - 2]}/${pathParts[pathParts.length - 1]}`;
        await supabase.storage.from('multimedia').remove([filePath]);
      }
    } catch (e) {
      console.error('Error al borrar el archivo del storage', e);
    }
    
    const { error } = await supabase.from('multimedia').delete().eq('id', id);
    if (error) throw error;
  }
};

// Helpers para Notitas
export const notitasApi = {
  async getNotitas() {
    if (!supabase) throw new Error("Supabase no configurado");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const { data, error } = await supabase
      .from('notitas')
      .select('*')
      .gte('fecha', yesterday.toISOString())
      .order('fecha', { ascending: false });
    if (error) throw error;
    return data;
  },

  async saveNotita(notita) {
    if (!supabase) throw new Error("Supabase no configurado");
    const { data, error } = await supabase.from('notitas').upsert(notita).select();
    if (error) throw error;
    return data;
  },

  async deleteNotita(id) {
    if (!supabase) throw new Error("Supabase no configurado");
    const { error } = await supabase.from('notitas').delete().eq('id', id);
    if (error) throw error;
  }
};

// Helpers para Mensajes del Jardín (Flores)
export const mensajesJardinApi = {
  async getMensajes() {
    if (!supabase) throw new Error("Supabase no configurado");
    const { data, error } = await supabase.from('mensajes_jardin').select('*').order('id', { ascending: true });
    if (error) throw error;
    return data;
  },

  async saveMensaje(mensaje) {
    if (!supabase) throw new Error("Supabase no configurado");
    const { data, error } = await supabase.from('mensajes_jardin').upsert(mensaje).select();
    if (error) throw error;
    return data;
  },

  async deleteMensaje(id) {
    if (!supabase) throw new Error("Supabase no configurado");
    const { error } = await supabase.from('mensajes_jardin').delete().eq('id', id);
    if (error) throw error;
  }
};

// Helpers para Settings (Configuración General)
export const settingsApi = {
  async getSettings() {
    if (!supabase) throw new Error("Supabase no configurado");
    const { data, error } = await supabase.from('settings').select('*').single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
    return data;
  },

  async updateSettings(settings) {
    if (!supabase) throw new Error("Supabase no configurado");
    // Asume que siempre hay 1 sola fila con id = 1
    const { data, error } = await supabase.from('settings').upsert({ id: 1, ...settings }).select();
    if (error) throw error;
    return data;
  }
};
