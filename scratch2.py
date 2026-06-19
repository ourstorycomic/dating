import re

with open('components/templates/dating-1/Experience.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Props
props_start = content.find('export function WillYouDateMeExperience({')
props_end = content.find('}) {', props_start)

old_props = content[props_start:props_end]
new_props = old_props.replace(
    'questionTitle = "Xin chào xinh đẹp...",',
    'questionTitle = "Xin chào {recipientName} xinh đẹp...",'
)

# Insert new props before `hideNavigation = false,`
new_props_addition = """  questionImage,
  successImage,
  locationImage,
  datetimeImage,
  foodImage,
  drinkImage,
  clickSfxUrl = "/dating-1/vfx/touch.mp3",
  swooshSfxUrl = "/dating-1/vfx/swoosh.mp3",
  yaySfxUrl = "/dating-1/vfx/yay.mp3",
"""
new_props = new_props.replace('  hideNavigation = false,', new_props_addition + '  hideNavigation = false,')

content = content[:props_start] + new_props + content[props_end:]

# Update Type definition
type_start = content.find('}: {', props_start)
type_end = content.find('}) {', type_start)

old_type = content[type_start:type_end]
new_type_addition = """  questionImage?: string;
  successImage?: string;
  locationImage?: string;
  datetimeImage?: string;
  foodImage?: string;
  drinkImage?: string;
  clickSfxUrl?: string;
  swooshSfxUrl?: string;
  yaySfxUrl?: string;
"""
new_type = old_type.replace('  hideNavigation?: boolean;', new_type_addition + '  hideNavigation?: boolean;')

content = content[:type_start] + new_type + content[type_end:]

# 2. Add Hooks and resolved variables
hooks_injection = """
  const displayQuestionTitle = questionTitle.replace("{recipientName}", recipientName);
  const displayFinalMessage = finalMessage + (senderName ? `\\n\\nThương mến,\\n${senderName}` : "");

  const clickAudioRef = useRef<HTMLAudioElement>(null);
  const swooshAudioRef = useRef<HTMLAudioElement>(null);
  const yayAudioRef = useRef<HTMLAudioElement>(null);

  const playClick = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  };

  const playSwoosh = () => {
    if (swooshAudioRef.current) {
      swooshAudioRef.current.currentTime = 0;
      swooshAudioRef.current.play().catch(() => {});
    }
  };

  const playYay = () => {
    if (yayAudioRef.current) {
      yayAudioRef.current.currentTime = 0;
      yayAudioRef.current.play().catch(() => {});
    }
  };
"""

state_start = content.find('const [stage, setStage] = useState')
content = content[:state_start] + hooks_injection + content[state_start:]

# 3. Audio tags
audio_tags = """
      {generalAudioUrl && (
        <audio ref={audioRef} src={generalAudioUrl} loop preload="auto" />
      )}
      {clickSfxUrl && <audio ref={clickAudioRef} src={clickSfxUrl} preload="auto" />}
      {swooshSfxUrl && <audio ref={swooshAudioRef} src={swooshSfxUrl} preload="auto" />}
      {yaySfxUrl && <audio ref={yayAudioRef} src={yaySfxUrl} preload="auto" />}
"""
content = content.replace(
    '{generalAudioUrl && (\n        <audio ref={audioRef} src={generalAudioUrl} loop preload="auto" />\n      )}',
    audio_tags.strip()
)

# 4. Play sounds
content = content.replace(
    'setTimeout(() => { isMoving.current = false; }, 100);',
    'setTimeout(() => { isMoving.current = false; }, 100);\n    playSwoosh();'
)

content = content.replace(
    'setBurstTriggers(c => c + 1);',
    'setBurstTriggers(c => c + 1);\n    playYay();'
)

content = content.replace(
    'return { ...prev, [category]: current.filter((i) => i !== item) };',
    'playClick();\n        return { ...prev, [category]: current.filter((i) => i !== item) };'
)
content = content.replace(
    'return { ...prev, [category]: [...current, item] };',
    'playClick();\n      return { ...prev, [category]: [...current, item] };'
)

# 5. Image replacements
def replace_emoji(content, old_div, img_prop, alt_text):
    new_div = f"""{{ {img_prop} ? (
              <img src={{{img_prop}}} alt="{alt_text}" className="mb-4 h-24 w-24 object-cover mx-auto rounded-2xl animate-bounce shadow-md" />
            ) : (
              {old_div}
            )}}"""
    return content.replace(old_div, new_div)

content = replace_emoji(content, '<div className="mb-4 text-5xl animate-bounce">🥺</div>', 'questionImage', 'question')
content = replace_emoji(content, '<div className="mb-4 text-6xl">🥰</div>', 'successImage', 'success')
content = replace_emoji(content, '<div className="mb-2 text-4xl">🛵</div>', 'locationImage', 'location')
content = replace_emoji(content, '<div className="mb-2 text-4xl">⏰</div>', 'datetimeImage', 'datetime')
content = replace_emoji(content, '<div className="mb-2 text-4xl">🍕</div>', 'foodImage', 'food')
content = replace_emoji(content, '<div className="mb-2 text-4xl">🧋</div>', 'drinkImage', 'drink')

# 6. Replace titles
content = content.replace('{questionTitle}', '{displayQuestionTitle}')

# 7. Add playClick to date/time picker
content = content.replace(
    'onSelect={d => setSelections(s => ({ ...s, date: d }))}',
    'onSelect={d => { setSelections(s => ({ ...s, date: d })); playClick(); }}'
)
content = content.replace(
    'onSelect={t => setSelections(s => ({ ...s, time: t }))}',
    'onSelect={t => { setSelections(s => ({ ...s, time: t })); playClick(); }}'
)

# 8. Date Pass Ticket
ticket_html = """{stage === "completion" && (
          <motion.div
            key="completion"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 mx-auto w-full max-w-md"
          >
            <div className="relative mx-auto w-full rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col border border-pink-200">
              {/* Ticket Header */}
              <div className="bg-pink-500 text-white p-6 text-center border-b-4 border-dashed border-white relative">
                 <h2 className="text-3xl font-black tracking-widest uppercase drop-shadow-md">Date Pass</h2>
                 <p className="text-pink-100 font-medium text-sm mt-1 uppercase tracking-widest">Admit Two</p>
                 <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full" style={{ backgroundColor }}></div>
                 <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full" style={{ backgroundColor }}></div>
              </div>
              {/* Ticket Body */}
              <div className="p-6 bg-white relative">
                 <h3 className="text-2xl font-bold mb-2 text-center" style={{ color: accentColor }}>{finalTitle}</h3>
                 <p className="text-sm text-gray-600 mb-6 text-center whitespace-pre-wrap">{displayFinalMessage}</p>
                 
                 <div className="space-y-4 mb-6 bg-pink-50/50 p-5 rounded-xl border border-pink-100">
                    <div className="flex justify-between items-center border-b border-pink-100 pb-3">
                      <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Thời gian</span>
                      <span className="text-sm font-black text-gray-700">{selections.time || "??:??"} • {selections.date || "??/??/????"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-pink-100 pb-3">
                      <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Địa điểm</span>
                      <span className="text-sm font-bold text-gray-700 text-right">{selections.location.length ? selections.location.join(", ") : "Tùy chọn"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-pink-100 pb-3">
                      <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Món ăn</span>
                      <span className="text-sm font-bold text-gray-700 text-right">{selections.food.length ? selections.food.join(", ") : "Tùy chọn"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Nước uống</span>
                      <span className="text-sm font-bold text-gray-700 text-right">{selections.drink.length ? selections.drink.join(", ") : "Tùy chọn"}</span>
                    </div>
                 </div>

                 {/* QR Code Placeholder */}
                 <div className="flex justify-center items-center pt-2">
                    <div className="w-24 h-24 bg-white border-[3px] border-pink-200 rounded-xl flex items-center justify-center p-1.5 shadow-sm">
                      <svg className="w-full h-full text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm-2 3h3v3h-3v-3zm3 3h3v3h-3v-3zm-5-3h3v3h-3v-3zm0-3h3v3h-3v-3zm-3 6h3v3h-3v-3zm0-6h3v3h-3v-3z" />
                      </svg>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}"""

old_completion = """{stage === "completion" && (
          <motion.div
            key="completion"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 mx-auto w-full max-w-md rounded-[2rem] border border-white/60 bg-white/70 p-8 text-center shadow-[0_12px_40px_rgba(255,192,203,0.5)] backdrop-blur-md"
          >
            <div className="mb-6 text-7xl animate-bounce">💖</div>
            <h1 className="text-4xl font-extrabold drop-shadow-sm" style={{ color: accentColor }}>{finalTitle}</h1>
            <div className="mx-auto my-6 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
            <p className="text-xl font-semibold text-gray-700">{finalMessage}</p>
          </motion.div>
        )}"""

content = content.replace(old_completion, ticket_html)

with open('components/templates/dating-1/Experience.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates applied.")
