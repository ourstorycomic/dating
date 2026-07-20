const fs = require('fs');

let c = fs.readFileSync('components/templates/wedding-2/Experience.tsx', 'utf8');

const oldCal = `{monthDays.map(day => {
                const isWedding = day === dDate && parsedDDate.getMonth() + 1 === dMonth && parsedDDate.getFullYear() === dYear;
                return (
                  <div key={day} className="relative flex items-center justify-center py-2 text-[#5A5552] font-medium">
                    {day}
                    {isWedding && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring" }} className="absolute inset-0 border border-[#7A1F1F] rounded-full scale-125 opacity-80" />
                    )}
                  </div>
                );
              })}`;

const newCal = `{monthDays.map(day => {
                const isWedding = day === dDate && parsedDDate.getMonth() + 1 === dMonth && parsedDDate.getFullYear() === dYear;
                let tiecDay = 0, tiecMonth = 0, tiecYear = 0;
                const tiecToUse = (!hasTiecMungGai) ? tiecTrai : tiecGai;
                if (tiecToUse && tiecToUse.date) {
                  const [td, tm, ty] = tiecToUse.date.split("/");
                  tiecDay = parseInt(td); tiecMonth = parseInt(tm); tiecYear = parseInt(ty);
                }
                const isTiec = tiecDay === day && tiecMonth === dMonth && tiecYear === dYear;
                
                return (
                  <div key={day} className="relative flex justify-center items-center py-2 mx-auto w-7">
                    {isWedding && (
                      <motion.svg initial={{ scale: 0 }} whileInView={{ scale: 1.15 }} viewport={{ once: true }} transition={{ delay: 0.5, type: "spring" }} className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] text-[#7A1F1F]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </motion.svg>
                    )}
                    {isTiec && !isWedding && (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 0.9 }} viewport={{ once: true }} transition={{ delay: 0.6, type: "spring" }} className="absolute inset-0 border-[1.5px] border-dashed border-[#7A1F1F] rounded-full bg-[#7A1F1F]/5" />
                    )}
                    <span className={\`relative z-10 font-medium \${isWedding ? "text-[#FFFFFF] text-[11px]" : isTiec ? "text-[#7A1F1F]" : "text-[#5A5552]"}\`}>{day}</span>
                    {isTiec && isWedding && (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, type: "spring" }} className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full border border-[#7A1F1F] bg-[#FFFFFF] z-20" />
                    )}
                  </div>
                );
              })}`;

c = c.replace(oldCal, newCal);

const oldLegend = `<div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#7A1F1F]">
                <div className="w-3 h-3 rounded-full border border-[#7A1F1F] opacity-80"></div> Lễ Cưới
              </div>`;

const newLegend = `<div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#7A1F1F]">
                <svg className="w-4 h-4 text-[#7A1F1F]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Lễ Cưới
              </div>
              {(hasTiecMung || hasTiecMungGai) && (
                <div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#7A1F1F]">
                  <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-dashed border-[#7A1F1F] bg-[#7A1F1F]/5"></div> Tiệc Mừng
                </div>
              )}`;

c = c.replace(oldLegend, newLegend);

// Also fix the utf-8 issue if there is any "L? Cu?i"
c = c.replace(/L\? Cu\?i/g, "Lễ Cưới");

fs.writeFileSync('components/templates/wedding-2/Experience.tsx', c, 'utf8');
console.log("Patched calendar in wedding-2");
