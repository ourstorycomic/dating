import sys
import re

with open(r"d:\dating\components\templates\birthday-1\components.tsx", "r", encoding="utf-8") as f:
    components_content = f.read()

# Replace CameraRig
camera_rig_replacement = """export function CameraRig({
  enabled = true, musicActive, phase, celebrationZoom, giftZoomInside, vintageElapsed,
}: {
  enabled?: boolean; musicActive: boolean; phase: BirthdayPhase; celebrationZoom: boolean; giftZoomInside: boolean; vintageElapsed: number;
}) {
  const { camera } = useThree();
  const lookY = useRef(0.55);
  const lookX = useRef(0.0);

  useFrame((state, delta) => {
    if (!enabled) return;
    const targetCameraPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3(0, lookY.current, 0);
    let lerpSpeed = 1.2; let lookLerpSpeed = 1.5;

    if (phase === "dark") {
      targetCameraPos.set(0, 0.35, 2.65); lookY.current = 0.02; lookX.current = 0;
    } else if (phase === "music" || phase === "decorate-popup") {
      targetCameraPos.set(0, musicActive ? 0.35 : 1.25, musicActive ? 3.85 : 5.25);
      lookY.current = musicActive ? -0.25 : 0.05; lookX.current = 0;
    } else if (phase === "cake-messages") {
      targetCameraPos.set(0, 1.2, 9.0); lookY.current = 0.5; lookX.current = 0;
    } else if (phase === "match-ignite") {
      // HẠ CAMERA XUỐNG ĐỂ ĐẨY NẾN LÊN CAO HƠN TRONG KHUNG HÌNH
      targetCameraPos.set(0, -0.2, 2.5); lookY.current = -0.32; lookX.current = 0;
    } else if (phase === "wish-record") {
      targetCameraPos.set(0, -0.2, 2.2); lookY.current = -0.32; lookX.current = 0;
    } else if (phase === "celebration") {
      if (celebrationZoom) {
        targetCameraPos.set(1.5, -1.0, 3.0); lookY.current = -1.2; lookX.current = 1.8;
        lerpSpeed = 2.0; lookLerpSpeed = 2.0;
      } else {
        targetCameraPos.set(0, 0.5, 7.5); lookY.current = -0.5; lookX.current = 0;
        lerpSpeed = 2.0; lookLerpSpeed = 2.0;
      }
    } else if (phase === "gift-reveal") {
      targetCameraPos.set(1.5, -1.0, 3.0);
      camera.position.lerp(targetCameraPos, delta * 4);
      camera.lookAt(1.8, -1.2, 1.0); 
      return; 
    } else if (phase === "vintage-gallery") {
      const t = Math.min(1, vintageElapsed / 15.0); const xPos = -1.5 + t * 15.5; 
      camera.position.set(xPos, vintageElapsed > 25.0 ? 0.9 + Math.min(1, (vintageElapsed - 25.0) / 4.0) * 5.0 : 0.9, 3.0);
      camera.lookAt(xPos, vintageElapsed > 25.0 ? 0.9 + Math.min(1, (vintageElapsed - 25.0) / 4.0) * 5.0 : 0.9, 0); return;
    }
    
    targetLookAt.set(lookX.current, lookY.current, 0);
    camera.position.lerp(targetCameraPos, delta * lerpSpeed);
    const currentLookAt = new THREE.Vector3(); camera.getWorldDirection(currentLookAt);
    currentLookAt.add(camera.position).lerp(targetLookAt, delta * lookLerpSpeed); camera.lookAt(currentLookAt);
  });
  return null;
}"""
components_content = re.sub(r"export function CameraRig\(.*?\n}\n", camera_rig_replacement + "\n", components_content, flags=re.DOTALL)


# Replace CandleSequence
candle_sequence_replacement = """export function CandleSequence({ phase, age, onCandleLit, onWishRecorded, recipientName, onGiftOpen }: { phase: BirthdayPhase; age: number; onCandleLit: () => void; onWishRecorded: (audioUrl: string) => void; recipientName?: string; onGiftOpen?: () => void; }) {
  const [holding, setHolding] = useState(false); const [nearWick, setNearWick] = useState(false);
  const [lit, setLit] = useState(false); const [matchLit, setMatchLit] = useState(false);
  const [strikeCount, setStrikeCount] = useState(0); const [wishTimeLeft, setWishTimeLeft] = useState(10);
  const [showHelper, setShowHelper] = useState(false);

  const litProgressRef = useRef(0); const fireScaleRef = useRef(0);
  const candleFireRef = useRef<THREE.Group>(null);
  const candleGroup = useRef<THREE.Group>(null);
  
  const strikeTime = useRef(0); const lastMatchX = useRef(0);
  const sparkGroup = useRef<THREE.Group>(null); const matchFireRef = useRef<THREE.Group>(null);
  const matchFireScaleRef = useRef(0); const flickStartTime = useRef(0);
  const matchboxWrap = useRef<THREE.Group>(null);
  const matchGroup = useRef<THREE.Group>(null);
  
  // KÉO HỘP DIÊM SANG TRÁI VÀ QUE DIÊM SANG PHẢI (X = 0.45) CHO RỘNG RÃI
  const MATCHBOX_WORLD_POS = new THREE.Vector3(-0.35, -0.12, 1.1);
  const matchWorld = useRef(new THREE.Vector3(0.45, -0.12, 1.3)); 

  const audioContextRef = useRef<AudioContext | null>(null); const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null); const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => { const helperTimer = setTimeout(() => setShowHelper(true), 1000); return () => clearTimeout(helperTimer); }, []);
  useEffect(() => {
    if (phase === "wish-record" && isRecording) {
      const interval = setInterval(() => { setWishTimeLeft((t) => { if (t <= 1) { clearInterval(interval); stopRecordingAndBlow(); return 0; } return t - 1; }); }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase, isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); streamRef.current = stream;
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)(); audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser(); const source = audioCtx.createMediaStreamSource(stream); source.connect(analyser); analyser.fftSize = 256;
      chunksRef.current = []; const recorder = new MediaRecorder(stream); recorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data.size > 0) chunksRef.current.push(event.data); };
      recorder.onstop = () => { const blob = new Blob(chunksRef.current, { type: "audio/webm" }); const reader = new FileReader(); reader.onloadend = () => { onWishRecorded(String(reader.result)); }; reader.readAsDataURL(blob); };
      recorder.start(); setIsRecording(true);
      let blowFrames = 0;
      const checkVolume = () => {
        if (!recorder || recorder.state !== "recording") return;
        const dataArray = new Uint8Array(analyser.frequencyBinCount); analyser.getByteFrequencyData(dataArray);
        let sum = 0; for (let i = 0; i < analyser.frequencyBinCount; i++) sum += dataArray[i];
        const avg = sum / analyser.frequencyBinCount;
        const waveBar = document.getElementById("record-wave-indicator"); if (waveBar) waveBar.style.height = `${Math.min(100, Math.max(10, avg * 1.2))}px`;
        if (avg > 72) blowFrames++; else blowFrames = 0;
        if (blowFrames > 12) stopRecordingAndBlow(); else requestAnimationFrame(checkVolume);
      }; checkVolume();
    } catch (err) { setIsRecording(true); }
  };

  const stopRecordingAndBlow = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") recorderRef.current.stop(); else onWishRecorded("");
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop()); if (audioContextRef.current && audioContextRef.current.state !== "closed") audioContextRef.current.close(); setIsRecording(false);
  };

  useFrame((state, delta) => {
    let targetRotZ = 0; let targetRotX = 0; let isFlicking = false; let flyT = 0;
    if (lit && flickStartTime.current > 0) {
      const elapsed = performance.now() - flickStartTime.current;
      if (elapsed < 800) { isFlicking = true; targetRotZ = matchWorld.current.x < 0 ? -0.4 : 0.4; targetRotX = Math.sin(elapsed/1000 * 15) * 0.6; } 
      else { flickStartTime.current = -performance.now(); setHolding(false); }
    } else if (lit && flickStartTime.current < 0) flyT = (performance.now() - (-flickStartTime.current)) / 1000;

    if (!isFlicking) {
      if (!matchLit && holding && phase === "match-ignite") {
        if (Math.abs(MATCHBOX_WORLD_POS.y - matchWorld.current.y) < 0.6 && Math.abs(MATCHBOX_WORLD_POS.x - matchWorld.current.x) < 1.0) {
          targetRotZ = 0.8;
          if (lastMatchX.current < -0.3 && matchWorld.current.x >= -0.3 && performance.now() - strikeTime.current > 350) {
            strikeTime.current = performance.now(); setStrikeCount((c) => { const next = c + 1; if (next >= 3) setMatchLit(true); return next; });
          }
        } else targetRotZ = matchWorld.current.x < 0 ? -0.4 : 0.4;
      } else if (holding || nearWick) targetRotZ = matchWorld.current.x < 0 ? -0.4 : 0.4;
    }
    lastMatchX.current = matchWorld.current.x;

    if (matchGroup.current) {
      if (!holding && !isFlicking) {
        if (lit && flickStartTime.current < 0) {
          matchWorld.current.x = THREE.MathUtils.lerp(matchWorld.current.x, 5.0, delta * 3);
          matchWorld.current.y = THREE.MathUtils.lerp(matchWorld.current.y, -3.0, delta * 3); targetRotZ += delta * 4;
        } else matchWorld.current.lerp(new THREE.Vector3(0.45, -0.12 + Math.sin(state.clock.elapsedTime * 2.5) * 0.02, 1.3), delta * 4);
      }
      matchGroup.current.position.lerp(matchWorld.current, delta * 18);
      matchGroup.current.rotation.z = THREE.MathUtils.lerp(matchGroup.current.rotation.z, targetRotZ, delta * 10);
      matchGroup.current.rotation.x = THREE.MathUtils.lerp(matchGroup.current.rotation.x, targetRotX, delta * 10);
    }

    if (sparkGroup.current) {
      const sparkAge = performance.now() - strikeTime.current;
      if (sparkAge < 500 && strikeCount > 0 && !matchLit) { sparkGroup.current.scale.setScalar(1 - Math.pow(sparkAge / 500, 2)); sparkGroup.current.visible = true; } 
      else sparkGroup.current.visible = false;
    }

    if (matchboxWrap.current && lit && flickStartTime.current < 0) {
      matchboxWrap.current.position.x = THREE.MathUtils.lerp(matchboxWrap.current.position.x, -5.0, delta * 3);
      matchboxWrap.current.position.y = THREE.MathUtils.lerp(matchboxWrap.current.position.y, -3.0, delta * 3);
      matchboxWrap.current.rotation.z -= delta * 4;
    }

    if (matchFireRef.current) matchFireRef.current.scale.setScalar(Math.max(0.001, 0.45 * (matchLit && !isFlicking && !lit ? (matchFireScaleRef.current = Math.min(1, matchFireScaleRef.current + delta * 3.5)) : (matchFireScaleRef.current = Math.max(0, matchFireScaleRef.current - delta * 5.0)))));
    
    fireScaleRef.current = lit ? Math.min(1, fireScaleRef.current + delta / 2.0) : Math.max(0, fireScaleRef.current - delta * 3.0);
    if (candleFireRef.current) candleFireRef.current.scale.setScalar(Math.max(0.001, fireScaleRef.current * 0.8));

    setNearWick(Math.hypot(matchWorld.current.x, matchWorld.current.y - (-0.12)) < 0.25);
    if (holding && matchLit && nearWick && phase === "match-ignite" && !lit) {
      litProgressRef.current = Math.min(1, litProgressRef.current + delta / 1.5); 
      if (litProgressRef.current >= 1) { setLit(true); flickStartTime.current = performance.now(); onCandleLit(); setTimeout(() => { startRecording(); }, 2200); }
    }

    if (phase === "celebration" && candleGroup.current) {
      candleGroup.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <ambientLight color="#000000" intensity={0} />

      <group ref={matchboxWrap} position={[-0.35, -0.12, 1.1]} visible={phase === "match-ignite"}>
        <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.3}><MatchboxModel scale={0.6} /><BoxMagicDust /></Float>
      </group>

      <group visible={phase === "match-ignite" || phase === "wish-record" || phase === "celebration" || phase === "gift-reveal"}>
        <group ref={candleGroup} position={[0, -1.82, 0]}>
          
          <group position={[0, 1.22, 0]}>
            <NormalizedModel desiredHeight={2.0} url={MODELS.candle} />
            <group ref={candleFireRef} position={[0, 0.48, 0]} scale={0.001}><AnimatedFire lockRotation scale={0.5} /></group>
            {lit && <pointLight color="#ffbd6f" distance={4} intensity={4} position={[0, 0.6, 0.1]} />}
          </group>

          {/* CÚ CHỐT: Dùng && để XÓA SỔ HOÀN TOÀN Bánh và Hộp quà, ngăn chặn 100% việc Click nhầm */}
          {(phase === "celebration" || phase === "gift-reveal") && (
            <group>
              <BirthdayBanner name={recipientName || ""} visible={phase === "celebration"} position={[0, 4.5, 0]} />
              <NormalizedModel desiredHeight={2.85} position={[0, 0, 0]} url={MODELS.cake} />
              <NumberCandle age={age} lit={lit} position={[0, 0.82, 0.4]} scale={0.9} />
              <CelebrationEffects />
              <GiftFinale onOpen={onGiftOpen || (() => {})} opening={phase === "gift-reveal"} position={[1.8, 0.0, 1.0]} />
            </group>
          )}

        </group>
      </group>

      {phase === "match-ignite" && !lit && (
        <mesh position={[0, -0.1, 1.2]} onPointerDown={(e) => { e.stopPropagation(); setHolding(true); matchWorld.current.copy(e.point); }} onPointerMove={(e) => { if (!holding) return; e.stopPropagation(); matchWorld.current.copy(e.point); }} onPointerUp={() => setHolding(false)}>
          <planeGeometry args={[100, 100]} /><meshBasicMaterial visible={false} />
        </mesh>
      )}

      <group ref={matchGroup} position={[0.6, -0.1, 1.2]} visible={phase === "match-ignite"}>
        <MatchstickModel scale={0.6} position={[0, 0, 0]} />
        {!matchLit && <MatchMagicDust />}
        <group ref={matchFireRef} position={[0, 0, 0]} scale={0.001}><AnimatedFire scale={0.3} /></group>
        {matchLit && (<pointLight color="#ffbd6f" distance={4.5} intensity={nearWick ? 8.0 : 6.0} position={[0, 0, 0]} />)}

        <group ref={sparkGroup} position={[0, 0, 0]} visible={false}>
          <mesh position={[0.05, 0, 0]}><sphereGeometry args={[0.04]}/><meshBasicMaterial color="#ffcc00"/></mesh>
          <mesh position={[-0.05, 0.05, 0]}><sphereGeometry args={[0.03]}/><meshBasicMaterial color="#ffaa00"/></mesh>
          <pointLight color="#ffcc00" distance={2.5} intensity={5.0} />
        </group>

        {!holding && !matchLit && showHelper && (
          <Html center position={[-0.25, 0.08, 0]} zIndexRange={[80, 70]}>
            <motion.div animate={{ rotate: [-2, 2, -2], scale: [1, 1.04, 1] }} className="pointer-events-none whitespace-nowrap bg-transparent text-center text-[14px] font-black leading-tight text-[#ffd84d]" transition={{ duration: 1.3, repeat: Infinity }}>
              Quẹt diêm 3 lần<br/>để thắp nến nhé! {strikeCount > 0 && `(${strikeCount}/3)`}
            </motion.div>
          </Html>
        )}
      </group>

      {(phase === "match-ignite" || phase === "wish-record" || phase === "celebration") && (
        <Html fullscreen zIndexRange={[80, 70]}>
          <div className="pointer-events-none fixed inset-0" style={{ zIndex: 9999 }}>
            <svg className="w-full h-full">
              <defs>
                <mask id="flame-hole">
                  <rect width="100%" height="100%" fill="white" />
                  <motion.circle
                    cx="50%" cy="40%" /* Đẩy tâm sáng lên 40% cho khớp nến cao */
                    fill="black"
                    initial={{ r: "3vmax" }}
                    animate={{ 
                      r: (phase === "celebration" || phase === "gift-reveal") ? "150vmax" : "3vmax" 
                    }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="black" mask="url(#flame-hole)" />
            </svg>
          </div>
        </Html>
      )}

      {phase === "wish-record" && isRecording && (
        <Html fullscreen zIndexRange={[90, 80]}>
           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 right-0 top-[12%] flex flex-col items-center text-center w-full">
            <div className="whitespace-nowrap text-4xl font-black text-[#ffd84d]">Hãy ước...</div>
            <div className="mt-3 flex items-center justify-center gap-2 text-lg font-bold text-white/90">
              <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff7fc7] opacity-75"></span><span className="relative inline-flex h-3 w-3 rounded-full bg-[#ff38aa]"></span></span>
              Đang ghi âm điều ước ({wishTimeLeft}s)
            </div>
            <div className="mt-6 h-16 w-36"><div id="record-wave-indicator" className="w-2.5 bg-gradient-to-t from-pink-500 to-yellow-400 rounded-full transition-all duration-75" style={{ height: '15px' }} /></div>
            <button onClick={stopRecordingAndBlow} className="mt-6 px-8 py-3.5 border-2 border-white/40 bg-pink-600/60 text-white font-extrabold uppercase rounded-full tracking-wider shadow-lg backdrop-blur-md text-sm pointer-events-auto">Thổi nến & Gửi điều ước ✨</button>
          </motion.div>
        </Html>
      )}
    </>
  );
}"""
components_content = re.sub(r"export function CandleSequence\(.*?\n}\n", candle_sequence_replacement + "\n", components_content, flags=re.DOTALL)

with open(r"d:\dating\components\templates\birthday-1\components.tsx", "w", encoding="utf-8") as f:
    f.write(components_content)
