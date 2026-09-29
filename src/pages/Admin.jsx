import { useState, useEffect, useRef } from 'react';
import { Lock, FileText, Image as ImageIcon, Save, Trash2, Upload, Plus, MessageCircle, Flower, Settings, Pencil } from 'lucide-react';
import { supabase, cartasApi, fotosApi, notitasApi, floresApi, settingsApi } from '../lib/supabase';

export const AdminPanel = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('cartas');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError('Credenciales incorrectas');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-text-main/50 font-light text-sm">Cargando...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <Lock size={40} className="text-accent mb-6" strokeWidth={1.5} />
        <h1 className="text-xl font-sans font-light text-text-main mb-8">Acceso Privado</h1>
        <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm rounded-3xl outline-none focus:border-accent transition-colors shadow-sm font-sans font-light text-sm"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm rounded-3xl outline-none focus:border-accent transition-colors shadow-sm font-sans font-light text-sm"
          />
          {authError && <p className="text-xs text-accent mt-1">{authError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-accent text-white text-[15px] rounded-3xl font-medium tracking-wide hover:bg-accent-light transition-colors shadow-sm"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="px-8 py-10 border-b border-text-main/5 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-sans font-light text-text-main">Administración</h1>
          <p className="text-[13px] opacity-50 mt-1 font-light">Gestiona el contenido del jardín.</p>
        </div>
        <button onClick={handleLogout} className="text-text-main/40 hover:text-accent transition-colors p-2 bg-[#FDFBF7]/50 rounded-full backdrop-blur-md border border-[#6B1D2F]/5">
          <Lock size={18} strokeWidth={1.5} />
        </button>
      </header>

      <div className="flex bg-[#FDFBF7]/40 backdrop-blur-md border-b border-[#6B1D2F]/10 shadow-sm overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('cartas')}
          className={`py-4 px-6 text-[13px] min-w-max font-medium flex items-center justify-center gap-2 ${activeTab === 'cartas' ? 'text-accent border-b-2 border-accent' : 'opacity-40 hover:opacity-70'}`}
        >
          <FileText size={16} strokeWidth={1.5} /> Cartas
        </button>
        <button
          onClick={() => setActiveTab('fotos')}
          className={`py-4 px-6 text-[13px] min-w-max font-medium flex items-center justify-center gap-2 ${activeTab === 'fotos' ? 'text-accent border-b-2 border-accent' : 'opacity-40 hover:opacity-70'}`}
        >
          <ImageIcon size={16} strokeWidth={1.5} /> Galería
        </button>
        <button
          onClick={() => setActiveTab('notitas')}
          className={`py-4 px-6 text-[13px] min-w-max font-medium flex items-center justify-center gap-2 ${activeTab === 'notitas' ? 'text-accent border-b-2 border-accent' : 'opacity-40 hover:opacity-70'}`}
        >
          <MessageCircle size={16} strokeWidth={1.5} /> Notitas
        </button>
        <button
          onClick={() => setActiveTab('flores')}
          className={`py-4 px-6 text-[13px] min-w-max font-medium flex items-center justify-center gap-2 ${activeTab === 'flores' ? 'text-accent border-b-2 border-accent' : 'opacity-40 hover:opacity-70'}`}
        >
          <Flower size={16} strokeWidth={1.5} /> Flores
        </button>
        <button
          onClick={() => setActiveTab('ajustes')}
          className={`py-4 px-6 text-[13px] min-w-max font-medium flex items-center justify-center gap-2 ${activeTab === 'ajustes' ? 'text-accent border-b-2 border-accent' : 'opacity-40 hover:opacity-70'}`}
        >
          <Settings size={16} strokeWidth={1.5} /> Ajustes
        </button>
      </div>

      <main className="p-8">
        {activeTab === 'cartas' && <CartasAdmin />}
        {activeTab === 'fotos' && <FotosAdmin />}
        {activeTab === 'notitas' && <NotitasAdmin />}
        {activeTab === 'flores' && <FloresAdmin />}
        {activeTab === 'ajustes' && <SettingsAdmin />}
      </main>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const CartasAdmin = () => {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fecha, setFecha] = useState('');
  const [status, setStatus] = useState('draft');

  useEffect(() => { cartasApi.getCartas().then(setItems).catch(console.error); }, []);

  const handleEdit = (item) => {
    setEditId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setFecha(item.fecha ? item.fecha.split('T')[0] : '');
    setStatus(item.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!title || !content || !fecha) return alert("Completa todos los campos");
    try {
      const payload = {
        title,
        content,
        fecha: new Date(fecha).toISOString(),
        status
      };
      if (editId) payload.id = editId;

      await cartasApi.saveCarta(payload);
      alert(editId ? "Carta actualizada correctamente" : "Carta guardada correctamente");
      setEditId(null);
      setTitle('');
      setContent('');
      setFecha('');
      setStatus('draft');
      const updated = await cartasApi.getCartas();
      setItems(updated);
    } catch (error) {
      console.error("Error Supabase:", error);
      alert("Error guardando carta");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas borrar esta carta?')) {
      try {
        await cartasApi.deleteCarta(id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error Supabase:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm p-6 rounded-3xl">
        <h2 className="text-lg font-sans font-light flex items-center gap-2 mb-2">
          {editId ? <Pencil size={18} className="text-accent" strokeWidth={1.5} /> : <Plus size={18} className="text-accent" strokeWidth={1.5} />} 
          {editId ? "Editar Carta" : "Nueva Carta"}
        </h2>
        <input 
          type="text" 
          placeholder="Título" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-5 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl outline-none focus:border-accent transition-colors font-medium text-sm"
        />
        <textarea 
          placeholder="Escribe el contenido aquí..." 
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-5 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl outline-none focus:border-accent transition-colors resize-none font-sans font-light text-sm leading-relaxed custom-scrollbar"
        />
        <div className="flex gap-3">
          <input 
            type="date" 
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="flex-1 px-4 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl outline-none focus:border-accent transition-colors text-[13px]"
          />
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 px-4 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl outline-none focus:border-accent transition-colors text-[13px]"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
        </div>
        <div className="flex gap-2 mt-2">
          {editId && (
            <button onClick={() => { setEditId(null); setTitle(''); setContent(''); setFecha(''); setStatus('draft'); }} className="py-4 px-6 bg-transparent text-text-main/60 text-[15px] rounded-3xl font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-[#6B1D2F]/5 transition-colors shadow-sm">
              Cancelar
            </button>
          )}
          <button onClick={handleSave} className="flex-1 py-4 bg-accent text-white text-[15px] rounded-3xl font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-accent-light transition-colors shadow-sm">
            <Save size={18} strokeWidth={1.5} /> {editId ? "Actualizar Carta" : "Guardar Carta"}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-[11px] font-medium opacity-40 mb-4 uppercase tracking-[0.15em] ml-2">Cartas Existentes</h3>
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-[13px] text-text-main/50 italic px-2">Aún no hay cartas guardadas.</p>
          ) : items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-5 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm rounded-3xl">
              <div>
                <p className="font-sans font-medium text-[15px]">{item.title}</p>
                <p className="text-[11px] opacity-40 mt-1 uppercase tracking-wider">{new Date(item.fecha).toLocaleDateString()} - {item.status}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(item)} className="text-text-main/40 hover:text-accent p-3 transition-colors">
                  <Pencil size={16} strokeWidth={1.5} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-text-main/40 hover:text-accent p-3 transition-colors">
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FotosAdmin = () => {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [file, setFile] = useState(null);
  const [existingUrl, setExistingUrl] = useState('');
  const [description, setDescription] = useState('');
  const [fecha, setFecha] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { fotosApi.getFotos().then(setItems).catch(console.error); }, []);

  const handleFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setExistingUrl(item.url);
    setDescription(item.description || '');
    setFecha(item.fecha ? item.fecha.split('T')[0] : '');
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if ((!file && !editId) || !fecha) return alert("Selecciona un archivo y una fecha");
    setUploading(true);
    try {
      let url = existingUrl;
      if (file) {
        url = await fotosApi.uploadFile(file, 'galeria');
      }
      const payload = {
        url,
        description,
        fecha: new Date(fecha).toISOString()
      };
      if (editId) payload.id = editId;

      await fotosApi.saveFoto(payload);
      alert(editId ? "Archivo actualizado correctamente" : "Archivo guardado correctamente");
      setEditId(null);
      setFile(null);
      setExistingUrl('');
      setDescription('');
      setFecha('');
      const updated = await fotosApi.getFotos();
      setItems(updated);
    } catch (error) {
      console.error("Error Supabase:", error);
      alert("Error guardando archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, url) => {
    if (window.confirm('¿Seguro que deseas borrar este archivo?')) {
      try {
        await fotosApi.deleteFoto(id, url);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error Supabase:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm p-6 rounded-3xl">
        <h2 className="text-lg font-sans font-light flex items-center gap-2 mb-2">
          {editId ? <Pencil size={18} className="text-accent" strokeWidth={1.5} /> : <Upload size={18} className="text-accent" strokeWidth={1.5} />} 
          {editId ? "Editar Archivo" : "Subir Archivo"}
        </h2>
        
        <div 
          onClick={handleFileClick}
          className="border border-dashed border-[#6B1D2F]/20 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent/40 transition-colors bg-[#FDFBF7]/40 backdrop-blur-md shadow-sm"
        >
          <Upload size={28} className="text-accent mb-3 opacity-80" strokeWidth={1.5} />
          <p className="text-[13px] font-medium">{file ? file.name : existingUrl ? "Toca para reemplazar el archivo actual" : "Toca para seleccionar un archivo"}</p>
          <p className="text-[11px] opacity-40 mt-1">Imágenes o videos (max 10MB)</p>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
            accept="image/*,video/*" 
          />
        </div>

        <input 
          type="text" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Pie de foto / Descripción" 
          className="w-full px-5 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl outline-none focus:border-accent transition-colors text-[13px]"
        />
        <input 
          type="date" 
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full px-5 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl outline-none focus:border-accent transition-colors text-[13px]"
        />
        <div className="flex gap-2 mt-2">
          {editId && (
            <button onClick={() => { setEditId(null); setFile(null); setExistingUrl(''); setDescription(''); setFecha(''); }} className="py-4 px-6 bg-transparent text-text-main/60 text-[15px] rounded-3xl font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-[#6B1D2F]/5 transition-colors shadow-sm" disabled={uploading}>
              Cancelar
            </button>
          )}
          <button 
            onClick={handleSave} 
            disabled={uploading}
            className="flex-1 py-4 bg-accent text-white text-[15px] rounded-3xl font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-accent-light transition-colors shadow-sm disabled:opacity-50"
          >
            <Save size={18} strokeWidth={1.5} /> {uploading ? "Guardando..." : (editId ? "Actualizar Galería" : "Guardar en Galería")}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-[11px] font-medium opacity-40 mb-4 uppercase tracking-[0.15em] ml-2">Archivos Recientes</h3>
        <div className="grid grid-cols-2 gap-4">
          {items.length === 0 ? (
            <p className="text-[13px] text-text-main/50 italic px-2 col-span-2">Aún no hay archivos en fotos.</p>
          ) : items.map((item) => (
            <div key={item.id} className="relative aspect-[4/5] bg-[#FDFBF7]/40 backdrop-blur-md rounded-3xl overflow-hidden flex items-center justify-center border border-[#6B1D2F]/10 shadow-sm group">
              <img src={item.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(item)} className="bg-[#FDFBF7]/80 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm p-2 rounded-full text-text-main/60 hover:text-accent transition-colors">
                  <Pencil size={16} strokeWidth={1.5} />
                </button>
                <button onClick={() => handleDelete(item.id, item.url)} className="bg-[#FDFBF7]/80 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm p-2 rounded-full text-text-main/60 hover:text-accent transition-colors">
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NotitasAdmin = () => {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [text, setText] = useState('');

  useEffect(() => { notitasApi.getNotitas().then(setItems).catch(console.error); }, []);

  const handleEdit = (item) => {
    setEditId(item.id);
    setText(item.text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!text) return alert("La notita no puede estar vacía");
    try {
      const payload = {
        text,
        fecha: new Date().toISOString()
      };
      if (editId) payload.id = editId;
      await notitasApi.saveNotita(payload);
      alert(editId ? "Notita actualizada correctamente" : "Notita guardada correctamente");
      setEditId(null);
      setText('');
      const updated = await notitasApi.getNotitas();
      setItems(updated);
    } catch (error) {
      console.error("Error Supabase:", error);
      alert("Error guardando notita");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas borrar esta notita?')) {
      try {
        await notitasApi.deleteNotita(id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error Supabase:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm p-6 rounded-3xl">
        <h2 className="text-lg font-sans font-light flex items-center gap-2 mb-2">
          {editId ? <Pencil size={18} className="text-accent" strokeWidth={1.5} /> : <MessageCircle size={18} className="text-accent" strokeWidth={1.5} />} 
          {editId ? "Editar Notita" : "Nueva Notita"}
        </h2>
        <textarea 
          placeholder="Escribe algo rápido... (máx 150 carácteres)" 
          rows={3}
          maxLength={150}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-5 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl outline-none focus:border-accent transition-colors resize-none font-sans font-light text-sm leading-relaxed custom-scrollbar"
        />
        <div className="flex gap-2 mt-2">
          {editId && (
            <button onClick={() => { setEditId(null); setText(''); }} className="py-4 px-6 bg-transparent text-text-main/60 text-[15px] rounded-3xl font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-[#6B1D2F]/5 transition-colors shadow-sm">
              Cancelar
            </button>
          )}
          <button onClick={handleSave} className="flex-1 py-4 bg-accent text-white text-[15px] rounded-3xl font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-accent-light transition-colors shadow-sm">
            <Save size={18} strokeWidth={1.5} /> {editId ? "Actualizar Notita" : "Guardar Notita"}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-[11px] font-medium opacity-40 mb-4 uppercase tracking-[0.15em] ml-2">Notitas Activas</h3>
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-[13px] text-text-main/50 italic px-2">Aún no hay notitas.</p>
          ) : items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-5 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm rounded-3xl">
              <p className="font-sans font-light text-[14px] text-text-main/80 w-4/5 truncate">
                "{item.text}"
              </p>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleEdit(item)} className="text-text-main/40 hover:text-accent p-3 transition-colors">
                  <Pencil size={16} strokeWidth={1.5} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-text-main/40 hover:text-accent p-3 transition-colors">
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FloresAdmin = () => {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [color, setColor] = useState('#8B263E'); // Default Bordó
  const [fecha, setFecha] = useState('');

  useEffect(() => { floresApi.getFlores().then(setItems).catch(console.error); }, []);

  const handleEdit = (item) => {
    setEditId(item.id);
    setMensaje(item.mensaje);
    setColor(item.color || '#8B263E');
    setFecha(item.fecha ? item.fecha.split('T')[0] : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!mensaje || !fecha) return alert("Completa el mensaje y la fecha");
    try {
      const payload = {
        mensaje,
        color,
        fecha: new Date(fecha).toISOString()
      };
      if (editId) {
        payload.id = editId;
      }
      await floresApi.saveFlor(payload);
      alert(editId ? "Flor actualizada correctamente" : "Flor guardada correctamente");
      setEditId(null);
      setMensaje('');
      setColor('#8B263E');
      setFecha('');
      const updated = await floresApi.getFlores();
      setItems(updated);
    } catch (error) {
      console.error("Error Supabase:", error);
      alert("Error guardando flor");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas borrar esta flor?')) {
      try {
        await floresApi.deleteFlor(id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error Supabase:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm p-6 rounded-3xl">
        <h2 className="text-lg font-sans font-light flex items-center gap-2 mb-2">
          {editId ? <Pencil size={18} className="text-accent" strokeWidth={1.5} /> : <Flower size={18} className="text-accent" strokeWidth={1.5} />} 
          {editId ? "Editar Flor" : "Nueva Flor"}
        </h2>
        <textarea 
          placeholder="Mensaje de la flor (ej. Eres mi paz)..." 
          rows={3}
          maxLength={150}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="w-full px-5 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl outline-none focus:border-accent transition-colors resize-none font-sans font-light text-sm leading-relaxed custom-scrollbar"
        />
        <div className="flex gap-3">
          <select 
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 px-4 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl outline-none focus:border-accent transition-colors text-[13px]"
          >
            <option value="#8B263E">Bordó Clásico</option>
            <option value="#9B364E">Granate Claro</option>
            <option value="#5B1626">Vino Oscuro</option>
            <option value="#D4BBA5">Beige / Crema</option>
          </select>
          <input 
            type="date" 
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="flex-1 px-4 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl outline-none focus:border-accent transition-colors text-[13px]"
          />
        </div>
        <div className="flex gap-2 mt-2">
          {editId && (
            <button onClick={() => { setEditId(null); setMensaje(''); setColor('#8B263E'); setFecha(''); }} className="py-4 px-6 bg-transparent text-text-main/60 text-[15px] rounded-3xl font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-[#6B1D2F]/5 transition-colors shadow-sm">
              Cancelar
            </button>
          )}
          <button onClick={handleSave} className="flex-1 py-4 bg-accent text-white text-[15px] rounded-3xl font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-accent-light transition-colors shadow-sm">
            <Save size={18} strokeWidth={1.5} /> {editId ? "Actualizar Flor" : "Guardar Flor"}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-[11px] font-medium opacity-40 mb-4 uppercase tracking-[0.15em] ml-2">Flores Plantadas</h3>
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-[13px] text-text-main/50 italic px-2">No hay flores en el jardín.</p>
          ) : items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-5 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm rounded-3xl">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full shadow-sm border border-[#6B1D2F]/20" style={{ backgroundColor: item.color || '#8B263E' }}></div>
                <div className="flex flex-col">
                  <p className="font-sans font-light text-[14px] text-text-main/80 truncate">
                    "{item.mensaje}"
                  </p>
                  {item.fecha && <p className="text-[11px] opacity-40 mt-1 uppercase tracking-wider">{new Date(item.fecha).toLocaleDateString()}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleEdit(item)} className="text-text-main/40 hover:text-accent p-3 transition-colors">
                  <Pencil size={16} strokeWidth={1.5} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-text-main/40 hover:text-accent p-3 transition-colors">
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



const SettingsAdmin = () => {
  const [fecha, setFecha] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    settingsApi.getSettings().then(data => {
      if (data) {
        if (data.fecha_inicio_noviazgo) {
          setFecha(data.fecha_inicio_noviazgo.split('T')[0]);
        }
        if (data.monthly_anniversary_message) {
          setMensaje(data.monthly_anniversary_message);
        }
      }
    }).catch(console.error);
  }, []);

  const handleSave = async () => {
    try {
      await settingsApi.updateSettings({ 
        fecha_inicio_noviazgo: new Date(fecha).toISOString(),
        monthly_anniversary_message: mensaje
      });
      alert("Configuración guardada correctamente");
    } catch(err) {
      alert("Error guardando ajustes");
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm p-6 rounded-3xl">
        <h2 className="text-lg font-sans font-light flex items-center gap-2 mb-2">
          <Settings size={18} className="text-accent" strokeWidth={1.5} /> Ajustes Globales
        </h2>
        <div className="space-y-2">
          <label className="text-[13px] font-medium opacity-60 ml-2">Fecha de Inicio de Noviazgo</label>
          <input 
            type="date" 
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full px-5 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl outline-none focus:border-accent transition-colors font-sans font-light text-[13px]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[13px] font-medium opacity-60 ml-2">Mensaje de Aniversario Mensual</label>
          <textarea 
            rows={3}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Ej: ¡Feliz mes mi amor! Gracias por tanto..."
            className="w-full px-5 py-4 bg-[#FDFBF7]/40 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl outline-none focus:border-accent transition-colors font-sans font-light text-[13px] resize-none custom-scrollbar"
          />
        </div>
        <button onClick={handleSave} className="w-full py-4 mt-2 bg-accent text-white text-[15px] rounded-3xl font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-accent-light transition-colors shadow-sm">
          <Save size={18} strokeWidth={1.5} /> Guardar Ajustes
        </button>
      </div>
    </div>
  );
};
