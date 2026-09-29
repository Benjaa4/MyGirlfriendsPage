import { useState, useEffect } from 'react';
import { Mail, X } from 'lucide-react';
import { cartasApi } from '../lib/supabase';

export const CartasView = () => {
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCarta, setSelectedCarta] = useState(null);

  useEffect(() => {
    const fetchCartas = async () => {
      try {
        const data = await cartasApi.getCartas();
        setCartas(data || []);
      } catch (error) {
        console.error('Error fetching cartas:', error);
        setCartas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCartas();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <header className="mb-10 text-center pt-6">
        <Mail size={24} className="text-accent mx-auto mb-4" strokeWidth={1.5} />
        <h1 className="text-xl font-sans font-light text-text-main">Cartas</h1>
        <p className="text-[13px] text-text-main/50 mt-1 font-light tracking-wide">Palabras guardadas con cariño</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-12 text-text-main/40 text-sm font-light">Cargando...</div>
      ) : cartas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-60">
          <p className="font-sans font-light text-[14px] text-text-main/70 text-center italic">El jardín está esperando su primera carta.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cartas.map((carta) => (
            <div 
              key={carta.id}
              onClick={() => setSelectedCarta(carta)}
              className="bg-[#FDFBF7]/40 backdrop-blur-md rounded-3xl p-8 cursor-pointer hover:shadow-md transition-all duration-300 shadow-sm flex flex-col justify-between border border-[#6B1D2F]/10"
            >
              <h2 className="font-sans font-light text-xl text-text-main leading-tight">{carta.titulo}</h2>
              <p className="text-[11px] text-text-main/40 mt-4 uppercase tracking-[0.15em]">
                {new Date(carta.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Lectura */}
      {selectedCarta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/80 backdrop-blur-sm transition-opacity">
          <div className="bg-[#FDFBF7]/80 backdrop-blur-xl rounded-3xl w-full max-w-sm max-h-[85dvh] flex flex-col shadow-2xl relative border border-[#6B1D2F]/10">
            <div className="p-8 pb-4 relative shrink-0">
              <button 
                onClick={() => setSelectedCarta(null)}
                className="absolute top-2 right-2 text-text-main/40 hover:text-accent transition-colors bg-base/50 rounded-full p-2 z-10"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent/60 mb-4 text-center mt-2">
                {new Date(selectedCarta.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h2 className="text-3xl font-sans font-light text-text-main text-center leading-tight">{selectedCarta.titulo}</h2>
            </div>
            <div className="p-8 pt-4 overflow-y-auto custom-scrollbar flex-1">
              <div className="font-sans font-light text-text-main/70 leading-[2] text-[15px] whitespace-pre-wrap pr-2">
                {selectedCarta.contenido}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
