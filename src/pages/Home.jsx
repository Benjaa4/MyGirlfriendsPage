import { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, MessageCircle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingPetal = ({ x, y, id, onComplete }) => {
  return (
    <motion.svg
      initial={{ opacity: 1, y, x, scale: 0.5, rotate: 0 }}
      animate={{ 
        opacity: 0, 
        y: y - 100, 
        x: x + (Math.random() * 40 - 20),
        scale: 1,
        rotate: Math.random() * 90 - 45
      }}
      transition={{ duration: 2, ease: "easeOut" }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute pointer-events-none z-10"
      width="24" height="24" viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      {/* Simple single-line leaf/petal shape */}
      <path d="M12 2C12 2 18 6 18 12C18 18 12 22 12 22C12 22 6 18 6 12C6 6 12 2 12 2Z" className="text-accent/40" />
    </motion.svg>
  );
};

const FlowerGarden = ({ messages }) => {
  const [activeMessage, setActiveMessage] = useState(null);

  const nodes = messages.length > 0 
    ? messages.map((m, i) => ({ 
        ...m, 
        cx: [80, 280, 120][i % 3] || 200, 
        cy: [150, 300, 500][i % 3] || 400 
      }))
    : [];

  const handleNodeClick = (e, id) => {
    e.stopPropagation(); // Evitar crear un pétalo cuando se toca un nodo
    setActiveMessage(activeMessage === id ? null : id);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full max-w-full">
      <svg className="w-full h-full max-w-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" fill="none" style={{ maxWidth: '100%' }}>
        {/* Tallo Principal */}
        <motion.path
          d="M 200 800 Q 180 600 250 400 T 150 200 Q 120 100 180 0"
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          className="opacity-20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        {/* Rama 1 */}
        <motion.path
          d="M 250 400 Q 300 350 280 300"
          stroke="var(--color-accent-light)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          className="opacity-20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
        />
        {/* Rama 2 */}
        <motion.path
          d="M 215 500 Q 150 480 120 500"
          stroke="var(--color-accent-light)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          className="opacity-20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1, ease: "easeOut" }}
        />
        {/* Rama 3 */}
        <motion.path
          d="M 160 250 Q 80 200 80 150"
          stroke="var(--color-accent-light)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          className="opacity-20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 2, ease: "easeOut" }}
        />
        
        {/* Nodos Interactivos */}
        <AnimatePresence>
          {nodes.map((node, index) => (
            <g key={`node-${node.id}`} className="pointer-events-auto cursor-pointer" onClick={(e) => handleNodeClick(e, node.id)}>
              <motion.circle
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: 4, opacity: 0.5 }}
                transition={{ delay: 2.5 + (index * 0.2), duration: 1 }}
                cx={Math.min(Math.max(node.cx, 40), 360)}
                cy={node.cy}
                fill="var(--color-accent)"
                className="hover:opacity-100 transition-opacity"
              />
              <motion.circle
                initial={{ r: 0 }}
                animate={{ r: 16 }}
                cx={Math.min(Math.max(node.cx, 40), 360)}
                cy={node.cy}
                fill="transparent"
              />
            </g>
          ))}
        </AnimatePresence>
      </svg>

      {/* Cápsulas de mensajes */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`absolute bg-[#FDFBF7]/40 backdrop-blur-xl border border-[#6B1D2F]/15 px-6 py-3 rounded-full shadow-lg pointer-events-auto max-w-[80vw] ${nodes.find(n => n.id === activeMessage).cx > 200 ? 'origin-bottom-right' : 'origin-bottom-left'}`}
            style={{
              top: `calc(${(nodes.find(n => n.id === activeMessage).cy / 800) * 100}% - 50px)`,
              ...(nodes.find(n => n.id === activeMessage).cx > 200
                ? { right: `clamp(1rem, ${100 - (Math.min(Math.max(nodes.find(n => n.id === activeMessage).cx, 40), 360) / 400) * 100}%, calc(100vw - 1rem))` }
                : { left: `clamp(1rem, ${(Math.min(Math.max(nodes.find(n => n.id === activeMessage).cx, 40), 360) / 400) * 100}%, calc(100vw - 1rem))` }
              )
            }}
          >
            <p className="font-sans font-light text-[13px] text-text-main/90 whitespace-nowrap overflow-hidden text-ellipsis">
              {nodes.find(n => n.id === activeMessage)?.mensaje || ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const HomeView = () => {
  const [time, setTime] = useState({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [petals, setPetals] = useState([]);
  const [notitas, setNotitas] = useState([]);
  const [flowerMessages, setFlowerMessages] = useState([]);
  const [openNotitasGroup, setOpenNotitasGroup] = useState(false);
  const [isAnniversary, setIsAnniversary] = useState(false);
  const [anniversaryMessage, setAnniversaryMessage] = useState("¡Feliz mes! Otro mes juntos creando recuerdos.");
  const [showAnniversaryModal, setShowAnniversaryModal] = useState(false);
  
  const constraintsRef = useRef(null);

  useEffect(() => {
    import('../lib/supabase').then(({ notitasApi, floresApi, settingsApi }) => {
      notitasApi.getNotitas().then(data => {
        setNotitas(data || []);
      }).catch(err => {
        console.error('Error fetching notitas:', err);
        setNotitas([]);
      });

      floresApi.getFlores().then(data => {
        setFlowerMessages(data || []);
      }).catch(err => {
        console.error('Error fetching flores:', err);
        setFlowerMessages([]);
      });

      settingsApi.getSettings().then(data => {
        let baseDate = new Date('2024-01-01T00:00:00');
        if (data && data.fecha_inicio_noviazgo) {
          // Parse ignoring timezone to keep local date
          const [year, month, day] = data.fecha_inicio_noviazgo.split('T')[0].split('-');
          baseDate = new Date(year, month - 1, day);
        }
        if (data && data.monthly_anniversary_message) {
          setAnniversaryMessage(data.monthly_anniversary_message);
        }
        
        const updateTimer = () => {
          const now = new Date();
          
          // Check anniversary logic
          const isSameDay = now.getDate() === baseDate.getDate();
          if (isSameDay) {
            setIsAnniversary(true);
          } else {
            setIsAnniversary(false);
          }

          let years = now.getFullYear() - baseDate.getFullYear();
          let months = now.getMonth() - baseDate.getMonth();
          let days = now.getDate() - baseDate.getDate();

          if (days < 0) {
            months--;
            // Obtener cuántos días tuvo el mes anterior
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
          }

          if (months < 0) {
            years--;
            months += 12;
          }
          
          // Evitar años negativos en caso de que la fecha sea futura (por si acaso)
          if (years < 0) {
            years = 0;
            months = 0;
            days = 0;
          }

          let diffMs = now - baseDate;
          if (diffMs < 0) diffMs = 0;

          const seconds = Math.floor((diffMs / 1000) % 60);
          const minutes = Math.floor((diffMs / 1000 / 60) % 60);
          const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

          setTime({ years, months, days, hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
      }).catch(err => {
        console.error('Error fetching settings:', err);
      });
    }).catch(err => {
        console.error('Error importing supabase:', err);
        setNotitas([]);
    });
  }, []);

  const handleInteraction = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('.pointer-events-auto') || e.target.closest('.notitas-scroll')) return;
    
    let x, y;
    if (e.type === 'touchstart') {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      x = touch.clientX - rect.left - 12;
      y = touch.clientY - rect.top - 12;
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      x = e.clientX - rect.left - 12;
      y = e.clientY - rect.top - 12;
    }

    x = Math.min(Math.max(x, 20), window.innerWidth - 44);

    const newPetal = { id: Date.now() + Math.random(), x, y };
    setPetals(prev => [...prev, newPetal]);
  }, []);

  const removePetal = useCallback((id) => {
    setPetals(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <div 
      ref={constraintsRef}
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center text-center select-none"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <FlowerGarden messages={flowerMessages} />

      <AnimatePresence>
        {petals.map(petal => (
          <FloatingPetal 
            key={petal.id} 
            id={petal.id} 
            x={petal.x} 
            y={petal.y} 
            onComplete={removePetal} 
          />
        ))}
      </AnimatePresence>

      <motion.div 
        drag 
        dragConstraints={constraintsRef}
        dragElastic={0.5}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
        className="relative z-20 rounded-full px-6 py-3 bg-[#FDFBF7]/40 backdrop-blur-xl border border-[#6B1D2F]/15 shadow-sm mt-10 pointer-events-auto cursor-grab active:cursor-grabbing flex items-center justify-center gap-3"
      >
        <Heart size={14} className="text-accent/80" strokeWidth={1.5} />
        <span className="font-sans font-light text-[13px] tracking-wide text-text-main/90">
          {time.years > 0 && `${time.years}A `}
          {time.months > 0 && `${time.months}M `}
          {time.days > 0 && `${time.days}D`}
          {(time.years === 0 && time.months === 0 && time.days === 0) && '0D '}
          <span className="mx-2 opacity-40">·</span>
          {time.hours.toString().padStart(2, '0')}h {time.minutes.toString().padStart(2, '0')}m
        </span>
      </motion.div>

      {/* Píldora Aniversario */}
      <AnimatePresence>
        {isAnniversary && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            drag 
            dragConstraints={constraintsRef}
            dragElastic={0.5}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
            onTap={() => setShowAnniversaryModal(true)}
            className="relative z-20 rounded-full px-6 py-3 bg-[#8B263E]/20 backdrop-blur-md border border-[#8B263E]/40 shadow-sm mt-4 pointer-events-auto cursor-grab active:cursor-grabbing flex items-center justify-center gap-2"
          >
            <Sparkles size={14} className="text-accent/80" strokeWidth={1.5} />
            <span className="font-sans font-medium text-[13px] tracking-wide text-accent">
              ¡Feliz mes!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Anniversary Modal */}
      <AnimatePresence>
        {showAnniversaryModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-base/80 backdrop-blur-md pointer-events-auto"
          >
            <div className="bg-[#FDFBF7]/40 backdrop-blur-xl rounded-3xl w-full max-w-sm max-h-[85dvh] flex flex-col overflow-hidden shadow-2xl relative border border-[#8B263E]/20">
              <div className="p-8 pb-4 relative shrink-0">
                <button 
                  onClick={() => setShowAnniversaryModal(false)}
                  className="absolute top-2 right-2 text-text-main/40 hover:text-accent transition-colors bg-[#FDFBF7]/80 rounded-full p-2 z-10"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
                <div className="flex justify-center mb-2">
                  <Sparkles size={24} className="text-accent/80" strokeWidth={1.5} />
                </div>
                <h3 className="font-sans font-light text-center text-accent tracking-widest text-[11px] uppercase mt-2">Feliz Aniversario</h3>
              </div>
              <div className="overflow-y-auto custom-scrollbar flex-1 pb-8 px-8 flex items-center justify-center">
                <p className="font-sans font-light text-[15px] text-text-main/90 text-center leading-relaxed italic">
                  "{anniversaryMessage}"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notitas Flotantes */}
      {notitas.length === 0 && (
        <div className="relative z-20 flex flex-col items-center mt-6 w-full pointer-events-none opacity-60">
          <div className="pointer-events-auto rounded-full px-6 py-3 bg-[#FDFBF7]/20 backdrop-blur-md border border-[#6B1D2F]/10 shadow-sm flex items-center gap-2">
            <MessageCircle size={14} className="text-accent/60" strokeWidth={1.5} />
            <p className="font-sans font-light text-[13px] text-text-main/70 italic">
              Aún no hay notitas hoy.
            </p>
          </div>
        </div>
      )}

      {notitas.length > 0 && notitas.length <= 2 && (
        <div className="relative z-20 flex flex-col items-center gap-3 mt-6 w-full pointer-events-none">
          {notitas.map((notita, idx) => (
            <motion.div 
              key={notita.id}
              drag 
              dragConstraints={constraintsRef}
              dragElastic={0.5}
              dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
              className="pointer-events-auto cursor-grab active:cursor-grabbing w-auto max-w-[80%] rounded-full px-6 py-3 bg-[#FDFBF7]/40 backdrop-blur-xl border border-[#6B1D2F]/15 shadow-sm"
            >
              <p className="font-sans font-light text-[13px] text-text-main/90 text-center truncate">
                "{notita.text}"
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {notitas.length > 2 && (
        <>
          <div className="relative z-20 flex flex-col items-center mt-6 w-full pointer-events-none">
            <motion.div 
              drag 
              dragConstraints={constraintsRef}
              dragElastic={0.5}
              dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
              onTap={() => setOpenNotitasGroup(true)}
              className="pointer-events-auto cursor-grab active:cursor-grabbing rounded-full px-6 py-3 bg-[#FDFBF7]/40 backdrop-blur-xl border border-[#6B1D2F]/15 shadow-sm flex items-center gap-2"
            >
              <MessageCircle size={14} className="text-accent/80" strokeWidth={1.5} />
              <p className="font-sans font-light text-[13px] text-text-main/90">
                Notas del día ({notitas.length})
              </p>
            </motion.div>
          </div>

          <AnimatePresence>
            {openNotitasGroup && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-base/80 backdrop-blur-md"
              >
                <div className="bg-[#FDFBF7]/40 backdrop-blur-xl rounded-3xl w-full max-w-sm max-h-[85dvh] flex flex-col overflow-hidden shadow-2xl relative border border-[#6B1D2F]/10">
                  <div className="p-8 pb-4 relative shrink-0">
                    <button 
                      onClick={() => setOpenNotitasGroup(false)}
                      className="absolute top-2 right-2 text-text-main/40 hover:text-accent transition-colors bg-[#FDFBF7]/80 rounded-full p-2 z-10"
                    >
                      <X size={18} strokeWidth={1.5} />
                    </button>
                    <h3 className="font-sans font-light text-center text-accent tracking-widest text-[11px] uppercase mt-2">Mensajes Efímeros</h3>
                  </div>
                  <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-8 pt-2 px-8">
                    {notitas.map((notita) => (
                      <div 
                        key={notita.id} 
                        className="snap-center shrink-0 w-64 max-h-[60vh] p-6 bg-[#FDFBF7]/60 backdrop-blur-md border border-[#6B1D2F]/10 rounded-3xl shadow-sm flex flex-col"
                      >
                        <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 w-full flex items-center justify-center">
                          <p className="font-sans font-light text-[15px] text-text-main/90 text-center leading-relaxed italic w-full">
                            "{notita.text}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

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
