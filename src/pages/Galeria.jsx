import { useState, useEffect } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { multimediaApi } from '../lib/supabase';

export const GaleriaView = () => {
  const [multimedia, setMultimedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchMultimedia = async () => {
      try {
        const data = await multimediaApi.getMultimedia();
        setMultimedia(data || []);
      } catch (error) {
        console.error('Error fetching multimedia:', error);
        setMultimedia([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMultimedia();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <header className="mb-10 text-center pt-6">
        <ImageIcon size={24} className="text-accent mx-auto mb-4" strokeWidth={1.5} />
        <h1 className="text-xl font-sans font-light text-text-main">Galería</h1>
        <p className="text-[13px] text-text-main/50 mt-1 font-light tracking-wide">Momentos capturados en el tiempo</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-12 text-text-main/40 text-sm font-light">Cargando...</div>
      ) : multimedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-60">
          <p className="font-sans font-light text-[14px] text-text-main/70 text-center italic">El álbum de recuerdos está vacío por ahora.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {multimedia.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl cursor-pointer group bg-[#FDFBF7]/40 backdrop-blur-md shadow-sm border border-[#6B1D2F]/10"
            >
              <img 
                src={item.url} 
                alt={item.descripcion || 'Recuerdo'} 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                <p className="text-white/90 text-[10px] tracking-[0.15em] uppercase font-medium truncate w-full">
                  {new Date(item.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Pantalla Completa */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base/98 backdrop-blur-xl transition-all duration-500">
          <button 
            onClick={() => setSelectedItem(null)}
            className="absolute top-8 right-8 text-text-main/50 hover:text-accent transition-colors z-10 bg-white/50 rounded-full p-3 backdrop-blur-md shadow-sm"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
          
          <div className="relative w-full max-w-lg max-h-[65vh] flex items-center justify-center p-6">
            <img 
              src={selectedItem.url} 
              alt={selectedItem.descripcion || 'Recuerdo'} 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
          
          <div className="w-full max-w-lg px-10 py-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent/60 mb-4">
              {new Date(selectedItem.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            {selectedItem.descripcion && (
              <p className="font-sans font-light text-text-main/80 text-[15px] leading-[1.8] italic">
                "{selectedItem.descripcion}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
