/* ── APP CONTROLLER LOGIC ── */

    /* ── STATIC DATA SELECTION ── */
        const PROG_LANGS = [
        {id: "java", label: "Java", icon: "ti-coffee", color: "#D85A30", bg: "#FAECE7" },
        {id: "python", label: "Python", icon: "ti-brand-python", color: "#378ADD", bg: "#E6F1FB" },
        {id: "javascript", label: "JavaScript", icon: "ti-brand-javascript", color: "#BA7517", bg: "#FAEEDA" },
        {id: "cpp", label: "C++", icon: "ti-code", color: "#534AB7", bg: "#EEEDFE" },
        {id: "csharp", label: "C#", icon: "ti-brand-csharp", color: "#1D9E75", bg: "#E1F5EE" },
        {id: "typescript", label: "TypeScript", icon: "ti-brand-typescript", color: "#185FA5", bg: "#E6F1FB" },
        {id: "go", label: "Go", icon: "ti-brand-golang", color: "#0F6E56", bg: "#E1F5EE" },
        {id: "rust", label: "Rust", icon: "ti-brand-rust", color: "#993C1D", bg: "#FAECE7" },
        {id: "kotlin", label: "Kotlin", icon: "ti-brand-kotlin", color: "#7F77DD", bg: "#EEEDFE" },
        {id: "swift", label: "Swift", icon: "ti-brand-swift", color: "#D85A30", bg: "#FAECE7" }
        ];

        const ROUNDS = [
        {id: 1, name: "Introduction", icon: "ti-user", color: "#7F77DD", desc: "Background & communication evaluation." },
        {id: 2, name: "Communication", icon: "ti-message-chatbot", color: "#1D9E75", desc: "English fluency & presentation quality." },
        {id: 3, name: "Technical Depth", icon: "ti-code", color: "#378ADD", desc: "Stack-specific challenges & core concepts." },
        {id: 4, name: "Problem Solving", icon: "ti-bulb", color: "#BA7517", desc: "Analytical reasoning & scenario evaluation." },
        {id: 5, name: "Behavioral Fits", icon: "ti-heart", color: "#D4537E", desc: "Conflict resolution, leadership & team sync." },
        {id: 6, name: "HR Round", icon: "ti-briefcase", color: "#888780", desc: "Expectations, values & carrier roadmap alignment." }
        ];

        const TESTIMONIALS = [
        {name: "Priya Sharma", role: "SDE at Amazon", text: "The voice-first interviewer felt extremely natural. It caught details from my project explanation and asked tough follow-ups. Unlocked my confidence!", score: "9.2/10" },
        {name: "Rahul Verma", role: "Backend Developer at Flipkart", text: "Having a dedicated Java tech round with circular readiness indicators and interactive dashboard metrics gave me exact benchmarks to prepare.", score: "8.7/10" },
        {name: "Sneha Patel", role: "Data Scientist at TCS", text: "The personalized learning roadmap week-by-week layout targeted my SQL weaknesses. Joined TCS 3 weeks later!", score: "8.4/10" }
        ];

        /* ── SIMULATED DATABASE CANDIDATES ── */
        let candidatesList = [
        {name: "Dharamsoth Jeshwanth", role: "Data Scientist", lang: "Python", score: 9.4, speechScore: 9.2, status: "Strong hire", notes: "Demonstrated exceptional technical mastery in Data Science models. Excellent communication flow with natural responses." },
        {name: "Amit Patel", role: "Frontend Developer", lang: "JavaScript", score: 8.2, speechScore: 8.0, status: "Hire", notes: "Good grasp of UI performance optimization, clean code metrics." },
        {name: "Sarah Jenkins", role: "Backend Developer", lang: "Go", score: 8.9, speechScore: 8.5, status: "Hire", notes: "Strong systems architecture knowledge, well-spoken in scaling protocols." },
        {name: "Jeshwanth D", role: "Software Engineer", lang: "Java", score: 7.8, speechScore: 7.4, status: "Consider", notes: "Requires brush up on concurrency metrics and JVM profiling strategies." }
        ];

        /* ── STATE VARIABLES ── */
        let candidate = null;
        let currentRound = 0;
        let messages = [];
        let scores = {"Introduction": 9.0, "Communication": 9.2, "Technical Depth": 9.5, "Problem Solving": 9.4, "Behavioral Fits": 9.6, "HR Round": 9.4 };
        let selectedLang = "python";
        let isVoiceMode = true;
        let isSpeaking = false;
        let isListening = false;
        let isThinking = false;
        let voiceVolume = 1.0;
        let voiceRate = 0.9;
        let speakInterval = null;
        let roundQuestionQueue = [];
        let currentRoundQuestionIndex = 0;
        let lastAskedQuestion = null;
        let roundScoresByRound = [[], [], [], [], [], []];
        const QUESTIONS_PER_ROUND = [10, 10, 10, 10, 10, 10];
        const MAX_ROUNDS = ROUNDS.length;

        // Voice Visualizer state
        let canvas, ctx, waveAnimationId;
        let waveOffset = 0;

        // Simulated recordings player
        let playbackInterval = null;
        let isPlayingRecording = false;
        let playbackDuration = 14; // seconds
        let playbackCurrent = 0;

        // Chart instances
        let chartRadar = null, chartBar = null, chartConfidence = null, chartTrend = null;

        // Answer evaluation tracking
        let roundAnswers = [];
        let roundScores = []; // Track score for each round

        // ── PREMIUM VOICE & RECORDING STATE ──
        let mediaRecorder = null;
        let recordedChunks = [];
        let isRecording = false;
        let useElevenLabs = false;
        let elevenLabsApiKey = localStorage.getItem('elevenLabsApiKey') || '';
        let voiceCharacterId = 'Rachel'; // Natural female voice
        let transcriptionText = '';
        let confidenceScore = 0;
        let recordedAudioUrl = null;
        let sessionStartTime = null;

    /* ── INIT HANDLERS ── */
    window.addEventListener("DOMContentLoaded", () => {
            buildThemeFromSystem();
        renderLandingContent();
        initCanvasWave();
        initSpeechSynthesis();
        loadSettings();
        loadUserPreferences();
        updateRecruiterPanel();
    });

        function toggleTheme() {
      const current = document.documentElement.getAttribute("data-theme");
        const target = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", target);
        document.getElementById("theme-icon").className = target === "dark" ? "ti ti-sun" : "ti ti-moon";

        // Reload charts with appropriate dark/light theme adjustments
        if (document.getElementById("screen-candidate").classList.contains("active")) {
            loadDashboardCharts();
      }
    }

        function buildThemeFromSystem() {
            document.documentElement.setAttribute("data-theme", "dark");
        document.getElementById("theme-icon").className = "ti ti-sun";
    }

    // ── LOAD USER PREFERENCES ON STARTUP ──
    function loadUserPreferences() {
        elevenLabsApiKey = localStorage.getItem('elevenLabsApiKey') || '';
        useElevenLabs = elevenLabsApiKey.length > 0;
        voiceVolume = parseFloat(localStorage.getItem('voiceVolume') || 1.0);
        voiceRate = parseFloat(localStorage.getItem('voiceRate') || 0.9);
        
        // Update UI with saved values
        const volControl = document.getElementById("voice-volume");
        const rateControl = document.getElementById("voice-rate");
        if (volControl) volControl.value = voiceVolume;
        if (rateControl) rateControl.value = voiceRate;
    }

        function renderLandingContent() {
      // Lang grid
      const targetGrid = document.getElementById("landing-lang-grid");
      targetGrid.innerHTML = PROG_LANGS.map(l => `
        <div class="lang-card glass-card" onclick="selectLangFromLanding('${l.id}')">
            <div class="lang-icon-box" style="background: ${l.bg}"><i class="ti ${l.icon}" style="font-size: 24px; color: ${l.color};"></i></div>
            <div class="lang-label">${l.label}</div>
        </div>
        `).join("");

        // Registration lang grid
        const regGrid = document.getElementById("register-lang-grid");
      regGrid.innerHTML = PROG_LANGS.map(l => `
        <button type="button" class="lang-card glass-card ${l.id === selectedLang ? 'active' : ''}" id="reg-lang-${l.id}" onclick="selectLanguage('${l.id}')" style="padding: 10px; width: 100%;">
            <div class="lang-icon-box" style="width: 32px; height: 32px; background: ${l.bg}; margin-bottom: 6px;"><i class="ti ${l.icon}" style="font-size: 16px; color: ${l.color};"></i></div>
            <div style="font-size: 11px; font-weight: 600;">${l.label}</div>
        </button>
        `).join("");

        // Testimonials Dots
        const dotsBox = document.getElementById("testi-dots");
      dotsBox.innerHTML = TESTIMONIALS.map((_, i) => `
        <div class="testi-dot ${i === 0 ? 'active' : ''}" onclick="showTestimonial(${i})"></div>
        `).join("");
    }

        let activeTestiIndex = 0;
        function showTestimonial(idx) {
            activeTestiIndex = idx;
        const t = TESTIMONIALS[idx];
        document.getElementById("testi-text").textContent = t.text;
        document.getElementById("testi-avatar").textContent = t.name[0];
        document.getElementById("testi-name").textContent = t.name;
        document.getElementById("testi-role").textContent = t.role;
        document.getElementById("testi-score").textContent = t.score;

        const dots = document.querySelectorAll(".testi-dot");
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    }

    // Auto rotate testimonials
    setInterval(() => {
            let target = (activeTestiIndex + 1) % TESTIMONIALS.length;
        showTestimonial(target);
    }, 5000);

        function selectLangFromLanding(id) {
            selectedLang = id;
        showScreen('register');
        selectLanguage(id);
    }

        function selectLanguage(id) {
            selectedLang = id;
      PROG_LANGS.forEach(l => {
        const btn = document.getElementById(`reg-lang-${l.id}`);
        if (btn) btn.classList.toggle("active", l.id === id);
      });
        validateRegistrationForm();
    }

        /* ── REGISTRATION LOGIC ── */
        const regInputs = ["reg-name", "reg-email", "reg-exp", "reg-role"];
    regInputs.forEach(id => {
            document.getElementById(id).addEventListener("input", validateRegistrationForm);
        document.getElementById(id).addEventListener("change", validateRegistrationForm);
    });

        function validateRegistrationForm() {
      const name = document.getElementById("reg-name").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const exp = document.getElementById("reg-exp").value;
        const role = document.getElementById("reg-role").value;

        const btn = document.getElementById("btn-submit-registration");
        const isValid = name && email && exp && role && selectedLang;
        btn.disabled = !isValid;
    }

        function submitRegistration() {
            candidate = {
                name: document.getElementById("reg-name").value.trim(),
                email: document.getElementById("reg-email").value.trim(),
                phone: document.getElementById("reg-phone").value.trim() || "+91 9032987347",
                experience: document.getElementById("reg-exp").value,
                role: document.getElementById("reg-role").value,
                skills: document.getElementById("reg-skills").value || "React, Node.js, Python",
                education: document.getElementById("reg-edu").value || "CMR Engineering College",
                lang: selectedLang
            };

        currentRound = 0;
        messages = [];

        // Open Interview Screen
        showScreen('interview');
        startInterviewSession();
    }

        /* ── SCREEN ROUTER ── */
        function showScreen(screenId) {
            document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
        document.getElementById(`screen-${screenId}`).classList.add("active");

      document.querySelectorAll(".nav-link").forEach(l => {
            l.classList.toggle("active", l.id === `link-${screenId}`);
      });

        if (screenId === 'candidate' && candidate) {
            updateCandidateDashboardUI();
      }
    }

        /* ── DYNAMIC AVATAR & VOICE WAVE ── */
        function initCanvasWave() {
            canvas = document.getElementById("canvas-wave");
        ctx = canvas.getContext("2d");

        function resize() {
            canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
        window.addEventListener("resize", resize);
        resize();

        // Start wave rendering loop
        drawWave();
    }

        function drawWave() {
            waveAnimationId = requestAnimationFrame(drawWave);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let linesCount = 3;
        let amp = 5;
        let speed = 0.05;

        if (isSpeaking) {
            amp = 18;
        speed = 0.15;
      } else if (isListening) {
            amp = 12;
        speed = 0.08;
      } else if (isThinking) {
            amp = 2;
        speed = 0.02;
      }

        waveOffset += speed;

        for (let i = 0; i < linesCount; i++) {
            ctx.beginPath();
        ctx.lineWidth = i === 0 ? 2 : 1;

        // Dynamic colors matching states
        if (isSpeaking) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${1.0 - i * 0.3})`;
        } else if (isListening) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${1.0 - i * 0.3})`;
        } else if (isThinking) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${1.0 - i * 0.3})`;
        } else {
            ctx.strokeStyle = `rgba(156, 163, 175, ${0.4 - i * 0.1})`;
        }

        let yCenter = canvas.height / 2;
        for (let x = 0; x < canvas.width; x++) {
            let y = yCenter + Math.sin(x * 0.015 + waveOffset + i * 0.5) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

        function setAvatarState(state) {
            isSpeaking = state === 'speaking';
        isListening = state === 'listening';
        isThinking = state === 'thinking';

        const container = document.getElementById("avatar-container");
        container.className = "avatar-svg-container " + state;

        const badge = document.getElementById("interview-status-badge");
        badge.className = "avatar-status-badge status-" + state;
        document.getElementById("interview-status-text").textContent = state.charAt(0).toUpperCase() + state.slice(1);

        if (isSpeaking) {
            startAvatarSpeakingAnimation();
      } else {
            stopAvatarSpeakingAnimation();
      }
    }

        function startAvatarSpeakingAnimation() {
      const mouth = document.getElementById("mouth-path");
        if (!mouth) return;
        if (speakInterval) clearInterval(speakInterval);
      
      speakInterval = setInterval(() => {
        const shapes = [
        "M 46 59 Q 50 63 54 59",
        "M 46 59 Q 50 65 54 59",
        "M 46 59 Q 50 61 54 59",
        "M 46 59 Q 50 59 54 59"
        ];
        mouth.setAttribute("d", shapes[Math.floor(Math.random() * shapes.length)]);
      }, 100);
    }

        function stopAvatarSpeakingAnimation() {
      if (speakInterval) clearInterval(speakInterval);
        const mouth = document.getElementById("mouth-path");
        if (mouth) mouth.setAttribute("d", "M 46 58 Q 50 61 54 58"); // happy closed curve
    }

        /* ── PREMIUM SPEECH SYNTHESIS ENGINE ── */
        let synth, recognition;
        let isRecognitionActive = false;

        function initSpeechSynthesis() {
      if ('speechSynthesis' in window) {
            synth = window.speechSynthesis;
            // Request voices list
            synth.onvoiceschanged = () => synth.getVoices();
      }
    }

        function updateAudioConfig() {
            voiceVolume = parseFloat(document.getElementById("voice-volume")?.value || 1.0);
        voiceRate = parseFloat(document.getElementById("voice-rate")?.value || 0.9);
        
        // Save preferences
        localStorage.setItem('voiceVolume', voiceVolume);
        localStorage.setItem('voiceRate', voiceRate);
    }

        // ── ELEVENLABS PREMIUM TTS ──
        async function speakWithElevenLabs(text, callback) {
            try {
                const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/Rachel', {
            method: 'POST',
            headers: {
                'xi-api-key': elevenLabsApiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text.replace(/\[.*?\]/g, "").trim(),
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.75,
                    similarity_boost: 0.85
                }
            })
        });

        if (!response.ok) throw new Error('ElevenLabs API error');

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        setAvatarState('speaking');
        
        audio.onended = () => {
            setAvatarState('ready');
            if (callback) callback();
        };
        
        audio.onerror = () => {
            console.warn('Audio playback failed, falling back to Web Speech');
            speakWithWebSpeech(text, callback);
        };
        
        audio.play().catch(e => {
            console.error('Play error:', e);
            speakWithWebSpeech(text, callback);
        });

    } catch (error) {
        console.warn('ElevenLabs unavailable, using Web Speech:', error);
        speakWithWebSpeech(text, callback);
    }
        }

        // ── WEB SPEECH API FALLBACK (IMPROVED) ──
        function speakWithWebSpeech(text, callback) {
            if (!synth) {
        if (callback) callback();
        return;
      }

        synth.cancel();
        setAvatarState('speaking');

        const clean = text.replace(/\[.*?\]/g, "").trim();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.volume = voiceVolume;
        utterance.rate = voiceRate;
        utterance.pitch = 1.2; // Premium female pitch

        // Multi-priority voice selection for natural female voice
        const voices = synth.getVoices();
        const voicePriority = [
            v => v.name === "Google UK English Female",
        v => v.name === "Google US English Female",
        v => v.name.includes("Microsoft Zira"),
        v => v.name.includes("Microsoft Aria"),
        v => v.name.includes("Microsoft Jenny"),
        v => v.name === "Samantha",
        v => v.name.includes("female"),
        v => v.lang === "en-US",
        v => v.lang.startsWith("en")
        ];

        let selectedVoice = null;
        for (let priorityFn of voicePriority) {
            selectedVoice = voices.find(priorityFn);
        if (selectedVoice) break;
      }
        if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onend = () => {
            setAvatarState('ready');
        if (callback) callback();
      };

      utterance.onerror = (e) => {
            console.error('Speech error:', e);
        setAvatarState('ready');
        if (callback) callback();
      };

        synth.speak(utterance);
    }

        // ── UNIFIED SPEAK FUNCTION ──
        function speakText(text, callback) {
            if (useElevenLabs && elevenLabsApiKey) {
        speakWithElevenLabs(text, callback);
    } else {
        speakWithWebSpeech(text, callback);
    }
    }

        function toggleMicrophone() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            alert("Speech Recognition not supported in this browser. Please type your responses.");
        return;
      }

        if (isRecognitionActive) {
            recognition.stop();
        return;
      }

        recognition = new SR();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.continuous = false;
        let finalTranscript = '';
        let interimTranscript = '';

      recognition.onstart = () => {
            isRecognitionActive = true;
        isListening = true;
        setAvatarState('listening');
        document.getElementById("btn-mic-toggle")?.classList.add("recording");
        document.getElementById("mic-btn-icon").className = "ti ti-microphone-off";

        // Start recording candidate's audio
        startAudioRecording();

        // Interrupt AI speech if candidate speaks
        if (synth && synth.speaking) {
            synth.cancel();
        setAvatarState('listening');
        }

        // Show transcription in real-time
        const inputBox = document.getElementById("interview-input");
        if (inputBox) {
            inputBox.placeholder = "Listening...";
            inputBox.style.borderColor = "var(--blue)";
        }
      };

      recognition.onresult = (e) => {
        interimTranscript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
            finalTranscript += transcript + ' ';
        } else {
            interimTranscript += transcript;
        }
      }

        // Update real-time transcription display
        transcriptionText = finalTranscript + interimTranscript;
        updateTranscriptionDisplay(transcriptionText);
        document.getElementById("interview-input").value = transcriptionText;
        
        // Calculate confidence score
        if (e.results.length > 0) {
            confidenceScore = Math.round(e.results[e.results.length - 1][0].confidence * 100);
            const confIndicator = document.getElementById("confidence-indicator");
            if (confIndicator) {
                confIndicator.textContent = `${confidenceScore}%`;
                confIndicator.style.color = confidenceScore > 80 ? 'var(--green)' : confidenceScore > 60 ? 'var(--amber)' : 'var(--red)';
            }
        }
      };

      recognition.onend = () => {
            isRecognitionActive = false;
        isListening = false;
        document.getElementById("btn-mic-toggle")?.classList.remove("recording");
        document.getElementById("mic-btn-icon").className = "ti ti-microphone";
        setAvatarState('ready');

        // Stop audio recording
        stopAudioRecording();

        const inputBox = document.getElementById("interview-input");
        if (inputBox) {
            inputBox.placeholder = "Type or press mic...";
            inputBox.style.borderColor = "var(--border)";
        }

        // Auto-submit voice input
        const val = document.getElementById("interview-input").value.trim();
        if (val) {
            setTimeout(submitMessage, 600);
        }
      };

      recognition.onerror = () => {
            isRecognitionActive = false;
        document.getElementById("btn-mic-toggle")?.classList.remove("recording");
        document.getElementById("mic-btn-icon").className = "ti ti-microphone";
        setAvatarState('ready');
        stopAudioRecording();
      };

        recognition.start();
    }

    // ── AUDIO RECORDING FUNCTIONS ──
    async function startAudioRecording() {
        try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        mediaRecorder = new MediaRecorder(stream);
        recordedChunks = [];
        isRecording = true;

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) recordedChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(recordedChunks, {type: 'audio/webm'});
            recordedAudioUrl = URL.createObjectURL(audioBlob);
        };

        mediaRecorder.start();
    } catch (error) {
        console.error('Failed to access microphone:', error);
    }
    }

    function stopAudioRecording() {
        if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    }

    // ── UPDATE TRANSCRIPTION DISPLAY ──
    function updateTranscriptionDisplay(text) {
        const display = document.getElementById("transcription-display");
        if (display) {
            display.textContent = text || "Ready...";
            display.title = text; // Full text on hover
        }
    }

        function toggleVoiceMode() {
            isVoiceMode = !isVoiceMode;
        const statusEl = document.getElementById("voice-mode-status");
        statusEl.textContent = isVoiceMode ? "ACTIVE" : "MUTED";
        statusEl.style.color = isVoiceMode ? "var(--purple)" : "var(--text-secondary)";

        const switchBtn = document.querySelector(".voice-control-box button");
        if (isVoiceMode) {
            switchBtn.innerHTML = `<i class="ti ti-keyboard"></i> Switch to Text-First Mode`;
      } else {
            switchBtn.innerHTML = `<i class="ti ti-microphone"></i> Switch to Voice-First Mode`;
        if (synth) synth.cancel();
      }
    }

        /* ── INTERVIEW SESSION CONTROLLER ── */
        async function startInterviewSession() {
      // Initialize session
        sessionStartTime = new Date();
        recordedChunks = [];
        updateTranscriptionDisplay("Interview started...");
        
      // Build rounds indicators
      const indicators = document.getElementById("round-indicators");
      indicators.innerHTML = ROUNDS.map((r, i) => `
        <div class="round-dot-indicator" id="ind-round-${i}">${i + 1}</div>
        `).join("");

        currentRound = 0;
        messages = [];
        roundAnswers = [];
        roundScores = [];
        roundScoresByRound = [[], [], [], [], [], []];
        currentRoundQuestionIndex = 0;
        roundQuestionQueue = buildRoundQuestionQueue(candidate.lang, currentRound);
        updateRoundIndicators();

        const welcomeGreeting = `Hello ${candidate.name}. Thank you for joining today's session. I'm Alex, your recruiter for the ${candidate.role} role.`;
        addChatMessage('assistant', welcomeGreeting);

        const firstQuestion = askNextQuestionInCurrentRound();
        addChatMessage('assistant', firstQuestion);
        if (isVoiceMode) {
            speakText(`${welcomeGreeting} ${firstQuestion}`, () => {
                setTimeout(toggleMicrophone, 500);
            });
      }
    }

        function updateRoundIndicators() {
            ROUNDS.forEach((r, i) => {
                const ind = document.getElementById(`ind-round-${i}`);
                if (!ind) return;
                ind.className = "round-dot-indicator";
                if (i === currentRound) ind.classList.add("active");
                else if (i < currentRound) ind.classList.add("done");
            });

        const activeR = ROUNDS[currentRound];
        document.getElementById("round-title-display").textContent = `Round ${currentRound + 1}: ${activeR.name}`;
        document.getElementById("round-desc-display").textContent = activeR.desc;

        const pct = (currentRound / ROUNDS.length) * 100;
        document.getElementById("interview-progress-fill").style.width = `${pct}%`;
    }

        function addChatMessage(role, text) {
      const stream = document.getElementById("message-stream");
        const row = document.createElement("div");
        row.className = `msg-row ${role === 'assistant' ? 'bot' : 'user'}`;

        const icon = role === 'assistant' ? 'ti-robot' : 'ti-user';
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit' });

        row.innerHTML = `
        <div class="msg-icon"><i class="ti ${icon}"></i></div>
        <div>
            <div class="msg-bubble">${text}</div>
            <div class="msg-time">${time}</div>
        </div>
        `;
        stream.appendChild(row);
        stream.scrollTop = stream.scrollHeight;

        messages.push({role, content: text });
    }

        function handleInputKey(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
        submitMessage();
      }
    }

        function submitMessage() {
      const inputEl = document.getElementById("interview-input");
        const text = inputEl.value.trim();
        if (!text) return;

        inputEl.value = "";
        addChatMessage('user', text);

        // Trigger thinking state
        setAvatarState('thinking');
        showTypingIndicator();

      setTimeout(() => {
            removeTypingIndicator();
        processAIResponse(text);
      }, 1500);
    }

        function showTypingIndicator() {
      const stream = document.getElementById("message-stream");
        const typingRow = document.createElement("div");
        typingRow.className = "msg-row bot";
        typingRow.id = "typing-indicator-row";
        typingRow.innerHTML = `
        <div class="msg-icon"><i class="ti ti-robot"></i></div>
        <div class="msg-bubble" style="padding: 8px 12px;">
            <div class="typing-box">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
        `;
        stream.appendChild(typingRow);
        stream.scrollTop = stream.scrollHeight;
    }

        function removeTypingIndicator() {
      const el = document.getElementById("typing-indicator-row");
        if (el) el.remove();
    }

        async function processAIResponse(candidateAnswer) {
      // Evaluate the answer
      const evaluation = evaluateAnswer(candidateAnswer, currentRound, candidate.lang, lastAskedQuestion);
        roundScores.push(evaluation.score);
        roundScoresByRound[currentRound].push(evaluation.score);
        roundAnswers.push({round: currentRound, answer: candidateAnswer, score: evaluation.score, feedback: evaluation.feedback, question: lastAskedQuestion?.q || null });

        // Check if API key is present
        const apiKey = localStorage.getItem("recruiter_api_key");
        let nextQuestion = "";

        if (apiKey) {
        // Run custom Anthropic fetch call
        try {
          const sys = `You are Alex, a senior recruiter. Candidate: ${candidate.name}, Role: ${candidate.role}, Language: ${candidate.lang}. Round target: ${ROUNDS[currentRound].name}. RULE: respond in 3 sentences max. After 3 dialogs, prompt to change round. ${evaluation.feedback}`;
        const proxy = localStorage.getItem("recruiter_proxy_url") || "https://api.anthropic.com/v1/messages";

        const response = await fetch(proxy, {
            method: "POST",
        headers: {
            "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
            },
        body: JSON.stringify({
            model: "claude-3-haiku-20240307",
        max_tokens: 250,
        system: sys,
              messages: messages.map(m => ({role: m.role, content: m.content }))
            })
          });
        const data = await response.json();
        nextQuestion = data.content[0].text;
        } catch (err) {
            console.warn("Claude API failed, falling back to simulator");
        nextQuestion = getSimulatorResponse(candidateAnswer, evaluation);
        }
      } else {
            nextQuestion = getSimulatorResponse(candidateAnswer, evaluation);
      }

        setAvatarState('ready');
        addChatMessage('assistant', nextQuestion);

        if (isVoiceMode) {
            speakText(nextQuestion, () => {
                if (currentRound < ROUNDS.length) {
                    setTimeout(toggleMicrophone, 500);
                }
            });
      }
    }

        /* ── ANSWER EVALUATION SYSTEM ── */
        function getSimulatorQuestions(lang) {
      const db = {
            python: [
        {q: "What is the difference between lists and tuples in Python? When would you use one over the other?", keywords: ["immutable", "mutable", "hashable", "performance", "memory"], topic: "Data Structures" },
        {q: "Explain how decorators work in Python and provide a real-world use case.", keywords: ["wrapper", "function", "closure", "metadata", "syntax sugar"], topic: "Advanced Python" },
        {q: "How does Python's GIL (Global Interpreter Lock) affect multi-threading?", keywords: ["GIL", "thread", "CPU-bound", "I/O-bound", "multiprocessing"], topic: "Concurrency" },
        {q: "Describe the SOLID principles and how you've applied them in Python projects.", keywords: ["single", "open", "liskov", "interface", "dependency"], topic: "Design Patterns" },
        {q: "What is a generator and how does it differ from a list in terms of memory usage?", keywords: ["yield", "lazy evaluation", "memory", "iterator", "infinite"], topic: "Iterators" },
        {q: "Explain async/await in Python and when you would use it.", keywords: ["async", "await", "coroutine", "event loop", "non-blocking"], topic: "Asynchronous" },
        {q: "How would you optimize a slow database query in a Python application?", keywords: ["indexing", "caching", "batch", "lazy loading", "N+1"], topic: "Performance" },
        {q: "What are context managers in Python and why are they important?", keywords: ["__enter__", "__exit__", "with", "resource", "cleanup"], topic: "Resource Management" }
        ],
        java: [
        {q: "What is the difference between interface default methods and abstract classes in Java 8+?", keywords: ["default", "abstract", "inheritance", "interface"], topic: "OOP" },
        {q: "Explain the Java memory model including heap, stack, and garbage collection.", keywords: ["heap", "stack", "GC", "memory", "reference"], topic: "Memory Management" },
        {q: "How would you optimize a multi-threaded application in Java? Discuss thread pools and synchronization.", keywords: ["ExecutorService", "lock", "synchronized", "volatile", "ThreadPool"], topic: "Concurrency" },
        {q: "What is the difference between checked and unchecked exceptions? When would you use each?", keywords: ["checked", "unchecked", "Exception", "RuntimeException", "throws"], topic: "Exception Handling" },
        {q: "Describe the Java Stream API and how it improves functional programming.", keywords: ["Stream", "lambda", "filter", "map", "reduce"], topic: "Functional" },
        {q: "How does dependency injection improve Java application architecture?", keywords: ["DI", "Spring", "loose coupling", "testability", "inversion"], topic: "Design Patterns" },
        {q: "Explain the concept of microservices and how you'd build one in Java.", keywords: ["REST", "service", "independent", "API", "Spring Boot"], topic: "Architecture" },
        {q: "What are transaction properties (ACID) and how do you ensure them in database operations?", keywords: ["Atomicity", "Consistency", "Isolation", "Durability", "transaction"], topic: "Database" }
        ],
        javascript: [
        {q: "Explain the concept of closures in JavaScript and provide a practical use case.", keywords: ["closure", "scope", "lexical", "function", "variable"], topic: "Scope" },
        {q: "What is event delegation and why is it important in performance optimization?", keywords: ["event delegation", "bubbling", "listener", "memory", "DOM"], topic: "DOM" },
        {q: "Describe the differences between Promises, async/await, and callbacks.", keywords: ["Promise", "async", "await", "callback", "then", "catch"], topic: "Asynchronous" },
        {q: "How does JavaScript's prototype-based inheritance work?", keywords: ["prototype", "constructor", "inheritance", "chain", "__proto__"], topic: "OOP" },
        {q: "What is hoisting and how does it affect var, let, and const?", keywords: ["hoisting", "var", "let", "const", "TDZ", "temporal dead zone"], topic: "Variables" },
        {q: "Explain the event loop and how it handles asynchronous operations.", keywords: ["event loop", "callback queue", "microtask", "macrotask", "stack"], topic: "Runtime" },
        {q: "How would you prevent memory leaks in a long-running JavaScript application?", keywords: ["leak", "reference", "cleanup", "detach", "garbage"], topic: "Memory" },
        {q: "What are WeakMap and WeakSet, and when would you use them?", keywords: ["WeakMap", "WeakSet", "garbage", "reference", "memory"], topic: "Advanced" }
        ],
        cpp: [
        {q: "Explain RAII (Resource Acquisition Is Initialization) and how it improves C++ code.", keywords: ["RAII", "resource", "constructor", "destructor", "safety"], topic: "Memory Management" },
        {q: "What is move semantics and how does it differ from copy semantics?", keywords: ["move", "rvalue", "copy", "temporary", "efficiency"], topic: "Modern C++" },
        {q: "Describe template metaprogramming and when you'd use it.", keywords: ["template", "compile-time", "generic", "specialization", "TMP"], topic: "Advanced" },
        {q: "How do you manage memory in C++? Discuss smart pointers vs raw pointers.", keywords: ["smart pointer", "unique_ptr", "shared_ptr", "leak", "ownership"], topic: "Memory" },
        {q: "Explain the difference between stack and heap allocation and their performance implications.", keywords: ["stack", "heap", "allocation", "speed", "lifetime"], topic: "Memory" }
        ],
        csharp: [
        {q: "What are delegates and events in C#, and how do they work?", keywords: ["delegate", "event", "callback", "subscription", "action"], topic: "OOP" },
        {q: "Explain async/await in C# and the Task Parallel Library.", keywords: ["async", "await", "Task", "parallel", "threading"], topic: "Asynchronous" },
        {q: "What is LINQ and how does it improve data querying in C#?", keywords: ["LINQ", "query", "lambda", "IEnumerable", "deferred"], topic: "Queries" }
        ],
        typescript: [
        {q: "Explain generics in TypeScript and provide practical use cases.", keywords: ["generic", "type parameter", "constraint", "extends", "utility type"], topic: "Advanced" },
        {q: "What are decorators in TypeScript and how are they used?", keywords: ["decorator", "metadata", "class", "method", "parameter"], topic: "Advanced" }
        ]
      };
        return db[lang] || db["python"];
    }

        function getRandomizedQuestion(round, lang) {
      const allQuestions = getSimulatorQuestions(lang);
        // Pick a random question from the pool for variety each session
        const randomIdx = Math.floor(Math.random() * allQuestions.length);
        return allQuestions[randomIdx];
    }

        function shuffleArray(array) {
      const copy = array.slice();
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
        return copy;
    }

        function buildRoundQuestionQueue(lang, roundIndex) {
      const allQuestions = getRoundQuestions(lang, roundIndex);
        const count = QUESTIONS_PER_ROUND[roundIndex] || 10;
        const candidates = shuffleArray(allQuestions);
        return candidates.slice(0, Math.min(count, candidates.length));
    }

        function getRoundQuestions(lang, roundIndex) {
      const languageSpecificTech = {
            python: [
        {q: "Explain Python list comprehensions and give an example use case.", keywords: ["comprehension", "list", "concise", "iteration", "syntax"], topic: "Data Structures" },
        {q: "How do decorators work in Python and where would you use them?", keywords: ["decorator", "wrapper", "function", "closure", "metadata"], topic: "Advanced Python" },
        {q: "Describe the differences between threading and multiprocessing in Python.", keywords: ["threading", "multiprocessing", "GIL", "CPU-bound", "I/O-bound"], topic: "Concurrency" },
        {q: "What is a Python generator and how does lazy evaluation help performance?", keywords: ["generator", "yield", "lazy", "iterator", "memory"], topic: "Iterators" },
        {q: "Explain Python's garbage collection and reference counting.", keywords: ["garbage collection", "reference counting", "cycle", "memory", "cleanup"], topic: "Memory Management" },
        {q: "When would you use a dictionary versus a list in Python?", keywords: ["dictionary", "list", "lookup", "key", "order"], topic: "Data Structures" },
        {q: "How do you implement exception handling in Python for resilient applications?", keywords: ["try", "except", "finally", "exception", "error"], topic: "Error Handling" },
        {q: "What is a context manager and why is it useful in Python?", keywords: ["context manager", "with", "__enter__", "__exit__", "resource"], topic: "Resource Management" },
        {q: "What are Python type hints and how do they improve code quality?", keywords: ["type hint", "typing", "static", "annotation", "mypy"], topic: "Maintainability" },
        {q: "Explain the differences between Python 2 and Python 3 for string handling.", keywords: ["Python 2", "Python 3", "unicode", "bytes", "str"], topic: "Compatibility" }
        ],
        java: [
        {q: "Explain the difference between an interface and an abstract class in Java.", keywords: ["interface", "abstract class", "inheritance", "implements", "extends"], topic: "OOP" },
        {q: "How does the Java garbage collector work and what are young/old generations?", keywords: ["garbage collector", "heap", "young generation", "old generation", "GC"], topic: "Memory" },
        {q: "Describe how Java streams improve collection processing.", keywords: ["Stream", "lambda", "filter", "map", "reduce"], topic: "Functional Programming" },
        {q: "What is the difference between synchronized and ReentrantLock in Java?", keywords: ["synchronized", "ReentrantLock", "mutex", "thread", "lock"], topic: "Concurrency" },
        {q: "Explain final, finally, and finalize in Java.", keywords: ["final", "finally", "finalize", "cleanup", "exception"], topic: "Language Features" },
        {q: "How does Java handle checked versus unchecked exceptions?", keywords: ["checked", "unchecked", "Exception", "RuntimeException", "throws"], topic: "Exception Handling" },
        {q: "What is the Java memory model and why is volatile important?", keywords: ["memory model", "volatile", "visibility", "atomic", "thread"], topic: "Concurrency" },
        {q: "Describe dependency injection and how it improves testability.", keywords: ["dependency injection", "Spring", "loose coupling", "testability", "inversion"], topic: "Architecture" },
        {q: "Explain the role of the Java ClassLoader.", keywords: ["ClassLoader", "classpath", "loading", "runtime", "namespace"], topic: "JVM" },
        {q: "How do you use Optional in Java to avoid null pointer errors?", keywords: ["Optional", "null", "stream", "ifPresent", "orElse"], topic: "Best Practices" }
        ],
        javascript: [
        {q: "Explain how closures work in JavaScript and give a use case.", keywords: ["closure", "scope", "lexical", "function", "variable"], topic: "Scope" },
        {q: "What is event delegation and why is it useful?", keywords: ["event delegation", "bubbling", "listener", "DOM", "performance"], topic: "DOM" },
        {q: "Describe the differences between callbacks, promises, and async/await.", keywords: ["callback", "Promise", "async", "await", "then"], topic: "Asynchronous" },
        {q: "How does prototype-based inheritance work in JavaScript?", keywords: ["prototype", "inheritance", "constructor", "__proto__", "chain"], topic: "OOP" },
        {q: "What is hoisting and how do var, let, and const differ?", keywords: ["hoisting", "var", "let", "const", "TDZ"], topic: "Variables" },
        {q: "Explain the JavaScript event loop and microtask queue.", keywords: ["event loop", "microtask", "macrotask", "callback queue", "stack"], topic: "Runtime" },
        {q: "How would you avoid memory leaks in a single page application?", keywords: ["memory leak", "event listener", "detach", "reference", "cleanup"], topic: "Performance" },
        {q: "What are weak maps and weak sets used for?", keywords: ["WeakMap", "WeakSet", "garbage", "reference", "memory"], topic: "Advanced" },
        {q: "Give an example of array destructuring and its benefit.", keywords: ["destructuring", "array", "syntax", "assignment", "spread"], topic: "Syntax" },
        {q: "How do you create a module in modern JavaScript?", keywords: ["module", "export", "import", "ES6", "bundle"], topic: "Modularity" }
        ],
        cpp: [
        {q: "Explain RAII and why it is useful in C++.", keywords: ["RAII", "resource", "constructor", "destructor", "safety"], topic: "Memory Management" },
        {q: "How do move semantics differ from copy semantics?", keywords: ["move", "copy", "rvalue", "lvalue", "efficiency"], topic: "Modern C++" },
        {q: "Describe the differences between unique_ptr and shared_ptr.", keywords: ["unique_ptr", "shared_ptr", "ownership", "reference count", "memory"], topic: "Smart Pointers" },
        {q: "What is template specialization and why would you use it?", keywords: ["template", "specialization", "compile-time", "generic", "type"], topic: "Templates" },
        {q: "How does stack allocation differ from heap allocation in C++?", keywords: ["stack", "heap", "allocation", "lifetime", "speed"], topic: "Memory" },
        {q: "What are the advantages of constexpr functions?", keywords: ["constexpr", "compile-time", "optimization", "constant", "evaluation"], topic: "Performance" },
        {q: "Explain how exception safety works in C++.", keywords: ["exception", "try", "catch", "strong guarantee", "rollback"], topic: "Error Handling" },
        {q: "What is the rule of five in C++?", keywords: ["rule of five", "copy constructor", "move constructor", "assignment", "destructor"], topic: "Best Practices" },
        {q: "How do you prevent memory leaks when using raw pointers?", keywords: ["raw pointer", "delete", "ownership", "smart pointer", "leak"], topic: "Memory Management" },
        {q: "What is the difference between const and constexpr in C++?", keywords: ["const", "constexpr", "compile-time", "constant", "expression"], topic: "Language Features" }
        ]
      };

        const genericQueues = {
            0: [
        {q: "Tell me about a project you led and what the outcome was.", topic: "Leadership" },
        {q: `What motivated you to pursue this role?`, topic: "Motivation" },
        {q: "How would you describe your current tech strengths?", topic: "Strengths" },
        {q: "What is one challenge from your resume that you are proud of?", topic: "Accomplishment" },
        {q: "Why are you interested in this position at our company?", topic: "Fit" },
        {q: "Describe your experience working with distributed teams.", topic: "Collaboration" },
        {q: "How do you keep your technical skills current?", topic: "Learning" },
        {q: "What is the biggest technical problem you solved recently?", topic: "Problem Solving" },
        {q: "Tell me about a time you had to learn a new tool or language quickly.", topic: "Adaptability" },
        {q: "How do you prioritize your work when multiple deadlines overlap?", topic: "Organization" }
        ],
        1: [
        {q: "How do you explain a complex technical concept to a non-technical audience?", topic: "Clarity" },
        {q: "Describe a time you received feedback and how you responded.", topic: "Communication" },
        {q: "What techniques do you use to ensure your written communication is clear?", topic: "Written" },
        {q: "How do you manage communication with remote teammates?", topic: "Remote Work" },
        {q: "Give an example of how you kept stakeholders updated on progress.", topic: "Stakeholder" },
        {q: "When would you choose a short answer over a detailed explanation?", topic: "Audience" },
        {q: "How do you handle ambiguous requirements in a conversation?", topic: "Clarification" },
        {q: "Tell me how you would summarize your work in a short elevator pitch.", topic: "Pitch" },
        {q: "How do you stay calm when asked an unexpected question?", topic: "Composure" },
        {q: "What do you do to avoid misunderstandings in teamwork?", topic: "Alignment" }
        ],
        3: [
        {q: "How would you design a caching layer for a high-traffic application?", topic: "Architecture" },
        {q: "Describe the steps to debug a slow API response.", topic: "Debugging" },
        {q: "What would you consider when designing a fault-tolerant system?", topic: "Reliability" },
        {q: "How do you choose between vertical and horizontal scaling?", topic: "Scaling" },
        {q: "How would you approach estimating the effort for a new feature?", topic: "Planning" },
        {q: "Describe how you analyze performance bottlenecks.", topic: "Optimization" },
        {q: "What is your approach to solving a problem with incomplete data?", topic: "Research" },
        {q: "How do you verify a solution before implementation?", topic: "Validation" },
        {q: "Describe a time you changed an approach after new information arrived.", topic: "Adaptability" },
        {q: "What tradeoffs do you weigh when choosing a design pattern?", topic: "Design" }
        ],
        4: [
        {q: "Tell me about a time you worked through a difficult team conflict.", topic: "Conflict" },
        {q: "How do you support teammates when they are struggling?", topic: "Support" },
        {q: "Describe a time you took ownership of a mistake.", topic: "Accountability" },
        {q: "How do you keep morale high in your team?", topic: "Leadership" },
        {q: "What do you do when priorities change mid-project?", topic: "Adaptation" },
        {q: "How do you build trust with a new team?", topic: "Relationships" },
        {q: "Tell me about feedback you gave that improved a team result.", topic: "Coaching" },
        {q: "How do you stay motivated during a long project?", topic: "Perseverance" },
        {q: "Describe a time you disagreed respectfully with a colleague.", topic: "Respect" },
        {q: "What do you do to support diversity of thought in a group?", topic: "Inclusion" }
        ],
        5: [
        {q: "What are your salary expectations for this role?", topic: "Compensation" },
        {q: "Where do you see yourself in five years?", topic: "Career" },
        {q: "What type of company culture brings out your best work?", topic: "Culture" },
        {q: "How do you prioritize learning and growth on the job?", topic: "Growth" },
        {q: "What makes a good manager in your view?", topic: "Management" },
        {q: "How do you decide whether a role is the right fit for you?", topic: "Fit" },
        {q: "What kinds of projects excite you most?", topic: "Interest" },
        {q: "How do you balance ambition with realistic goals?", topic: "Planning" },
        {q: "Describe the kind of feedback you find most helpful.", topic: "Coaching" },
        {q: "What matters most to you when evaluating a new job opportunity?", topic: "Decision" }
        ]
      };

        if (roundIndex === 2) {
        return languageSpecificTech[lang] || languageSpecificTech.python;
      }
        if (roundIndex === 3) {
        return genericQueues[3];
      }
        return genericQueues[roundIndex] || genericQueues[0];
    }

        function askNextQuestionInCurrentRound() {
      if (!roundQuestionQueue || currentRoundQuestionIndex >= roundQuestionQueue.length) {
        return moveToNextRoundAndAsk();
      }

        const nextQuestion = roundQuestionQueue[currentRoundQuestionIndex];
        currentRoundQuestionIndex += 1;
        lastAskedQuestion = nextQuestion;
        const progress = `${currentRoundQuestionIndex}/${roundQuestionQueue.length}`;
        const prefix = currentRoundQuestionIndex === roundQuestionQueue.length ? "Final question for this round" : "Next question";
        const message = `${prefix} (${progress}) in ${ROUNDS[currentRound].name}: ${nextQuestion.q}`;
        return message;
    }

        function moveToNextRoundAndAsk() {
            currentRound += 1;
      if (currentRound >= MAX_ROUNDS) {
        const completionEl = document.getElementById("message-stream");
        const banner = document.createElement("div");
        banner.className = "interview-complete-banner";
        banner.innerHTML = `
        <h3 style="color: var(--green); font-size:16px; font-weight:700; margin-bottom:8px;"><i class="ti ti-check-all"></i> Interview Session Finalised</h3>
        <button class="btn-primary" onclick="finishInterviewAndShowScores()">Generate Evaluation Report</button>
        `;
        completionEl.appendChild(banner);
        completionEl.scrollTop = completionEl.scrollHeight;
        return `Thank you for completing the interview, ${candidate.name}. Let’s generate your personalized evaluation report now.`;
      }

        currentRoundQuestionIndex = 0;
        roundQuestionQueue = buildRoundQuestionQueue(candidate.lang, currentRound);
        updateRoundIndicators();
        const opening = `Moving on to Round ${currentRound + 1}: ${ROUNDS[currentRound].name}. ${ROUNDS[currentRound].desc}`;
        const next = askNextQuestionInCurrentRound();
        return `${opening} ${next}`;
    }

        function evaluateAnswer(answer, roundIndex, lang, question = null) {
      const answerLower = answer.toLowerCase();
        let score = 5; // Base score
        let feedback = "";

        if (roundIndex === 0) {
        // Introduction round - check for key elements
        const hasBackground = answerLower.includes("experience") || answerLower.includes("years") || answerLower.includes("background");
        const hasRoleClarity = answerLower.includes("engineer") || answerLower.includes("developer") || answerLower.includes("scientist");
        const hasProjects = answerLower.includes("project") || answerLower.includes("built") || answerLower.includes("developed");

        score = 5;
        if (hasBackground) score += 1.5;
        if (hasRoleClarity) score += 1.5;
        if (hasProjects) score += 1.5;
        if (answer.length > 150) score += 0.5; // Good elaboration

        feedback = `Candidate introduced ${hasBackground ? 'with background context' : 'without clear background'}, ${hasRoleClarity ? 'clear role' : 'unclear role'}, and ${hasProjects ? 'mentioned projects' : 'no project mentions'}.`;
      }
        else if (roundIndex === 1) {
        // Communication round
        const isCoherent = answer.length > 100;
        const usesTechnicalTerms = /\b(architecture|design|pattern|framework|API|interface)\b/i.test(answer);
        const hasExamples = /\b(for example|e\.g|such as|instance)\b/i.test(answer);

        score = 5;
        if (isCoherent) score += 2;
        if (usesTechnicalTerms) score += 1.5;
        if (hasExamples) score += 1;
        if (answer.length > 200) score += 0.5;

        feedback = `Communication quality: ${isCoherent ? 'coherent and well-structured' : 'needs more structure'}, ${usesTechnicalTerms ? 'uses technical terminology' : 'lacks technical terms'}.`;
      }
        else if (roundIndex === 2) {
        // Technical Depth round
        const questionData = question || getRandomizedQuestion(roundIndex, lang);
        const matchingKeywords = (questionData?.keywords || []).filter(kw => answerLower.includes(kw.toLowerCase())).length;
        const keywordCoverage = questionData && questionData.keywords.length ? (matchingKeywords / questionData.keywords.length) * 100 : 0;

        score = 5;
        if (matchingKeywords >= 2) score += 2;
        if (matchingKeywords >= 3) score += 1;
        if (answer.length > 200) score += 0.5;

        feedback = `Technical answer covered ${matchingKeywords}/${questionData?.keywords?.length || 0} key concepts in ${questionData?.topic || 'technical depth'}.`;
      }
        else if (roundIndex === 3) {
        // Problem Solving
        const hasLogic = /\b(algorithm|approach|steps|first|then|logic)\b/i.test(answer);
        const hasTradeoffs = /\b(tradeoff|trade-off|versus|instead|better|worse|performance|memory)\b/i.test(answer);
        const isDetailed = answer.length > 150;

        score = 5;
        if (hasLogic) score += 1.5;
        if (hasTradeoffs) score += 1.5;
        if (isDetailed) score += 1;

        feedback = `Problem-solving: ${hasLogic ? 'clear logic' : 'logic unclear'}, ${hasTradeoffs ? 'considered tradeoffs' : 'no tradeoff analysis'}.`;
      }
        else if (roundIndex === 4) {
        // Behavioral
        const hasConflictResolution = /\b(resolved|discussed|communicated|understood|perspective|agree|disagree)\b/i.test(answer);
        const hasTeamwork = /\b(team|collaborated|together|worked|support|help)\b/i.test(answer);
        const hasGrowth = /\b(learned|improved|better|growth|develop|skill)\b/i.test(answer);

        score = 5;
        if (hasConflictResolution) score += 1.5;
        if (hasTeamwork) score += 1.5;
        if (hasGrowth) score += 1;

        feedback = `Behavioral competency: ${hasConflictResolution ? 'shows conflict resolution' : 'lacks conflict examples'}, ${hasTeamwork ? 'emphasizes teamwork' : 'individual focus'}.`;
      }
        else if (roundIndex === 5) {
        // HR Round
        const isRealistic = answer.length > 80;
        const hasClearExpectations = /\b(salary|growth|learn|challenge|opportunity|company|culture|values)\b/i.test(answer);
        const hasFutureVision = /\b(year|future|goal|aspiration|lead|senior|architect)\b/i.test(answer);

        score = 5;
        if (isRealistic) score += 1.5;
        if (hasClearExpectations) score += 1.5;
        if (hasFutureVision) score += 1;

        feedback = `HR round: ${hasClearExpectations ? 'clear expectations' : 'vague expectations'}, ${hasFutureVision ? 'has future vision' : 'no clear vision'}.`;
      }

        // Cap score at 10
        score = Math.min(10, Math.max(0, score));
        score = parseFloat(score.toFixed(1));

        return {score, feedback, answerText: answer };
    }

        /* ── INTELLIGENT SIMULATOR & CLAUDE FALLBACK ── */

        function getSimulatorResponse(ans, evaluation) {
            let response = "";
        let feedback = evaluation.feedback || "";
      const scoreEmoji = evaluation.score >= 8 ? "✅" : evaluation.score >= 6 ? "👍" : "📋";

        if (currentRound < MAX_ROUNDS) {
        if (currentRoundQuestionIndex < roundQuestionQueue.length) {
            response = `${scoreEmoji} ${feedback} ${askNextQuestionInCurrentRound()}`;
        } else {
            response = `${scoreEmoji} ${feedback} ` + moveToNextRoundAndAsk();
        }
      } else {
            response = moveToNextRoundAndAsk();
      }

        return response;
    }

        function finishInterviewAndShowScores() {
      // Calculate scores based on actual round evaluations
      if (roundScores.length === 0) {
            scores = {
                "Introduction": 7.5,
                "Communication": 7.8,
                "Technical Depth": 7.5,
                "Problem Solving": 7.3,
                "Behavioral Fits": 7.6,
                "HR Round": 7.5
            };
      } else {
            scores = {};
        ROUNDS.forEach((round, idx) => {
          const roundScores = roundScoresByRound[idx] || [];
          const average = roundScores.length ? roundScores.reduce((sum, value) => sum + value, 0) / roundScores.length : 7.0;
        scores[round.name] = parseFloat(average.toFixed(1));
        });
      }

      // Add to Recruiter ranking database
      const avg = parseFloat((Object.values(scores).reduce((a,b)=>a+b,0)/6).toFixed(1));
        candidatesList.push({
            name: candidate.name,
        role: candidate.role,
        lang: PROG_LANGS.find(l=>l.id===candidate.lang).label,
        score: avg,
        speechScore: parseFloat((roundScores.length > 0 ? (roundScores.reduce((a,b)=>a+b,0)/roundScores.length) : (8.0 + Math.random() * 2)).toFixed(1)),
        status: avg >= 8.5 ? "Strong hire" : avg >= 7.5 ? "Hire" : "Consider",
        notes: `Candidate evaluated live. Performance evaluated on ${roundScores.length} rounds. Technical focus: ${candidate.lang}.`
      });

        // Update dashboards
        updateRecruiterPanel();
        showScreen('done');
    }

        /* ── CANDIDATE DASHBOARD CONTROLLER ── */
        function switchCandidateTab(tabId) {
      const tabs = ["overview", "analytics", "roadmap", "history"];
      tabs.forEach(t => {
            document.getElementById(`cand-tab-${t}`).style.display = t === tabId ? "block" : "none";
        document.getElementById(`btn-tab-cand-${t}`).classList.toggle("active", t === tabId);
      });

        if (tabId === 'analytics') {
            setTimeout(loadDashboardCharts, 100);
      }
    }

        function updateCandidateDashboardUI() {
            // Details
            document.getElementById("cand-header-name").textContent = candidate.name;
        document.getElementById("cand-header-meta").textContent = `${candidate.role} · ${candidate.education}`;
      
      const avgScore = parseFloat((Object.values(scores).reduce((a,b)=>a+b,0)/6).toFixed(1));

        // Score gauge
        document.getElementById("cand-score-value").textContent = avgScore;
        const offset = 283 - (avgScore / 10) * 283;
        document.getElementById("cand-score-gauge").style.strokeDashoffset = offset;

        // Readiness
        const readinessPct = Math.round((avgScore / 10) * 100);
        document.getElementById("cand-readiness-value").textContent = `${readinessPct}%`;
        document.getElementById("cand-readiness-gauge").style.strokeDashoffset = 283 - (readinessPct / 100) * 283;

        let rText = "Intermediate";
      if (readinessPct >= 90) rText = "Industry Ready";
      else if (readinessPct >= 80) rText = "Interview Ready";
        document.getElementById("cand-readiness-badge").textContent = rText;

      // Probability
      const probPct = Math.round((avgScore >= 8.5 ? 92 : avgScore >= 7.5 ? 78 : 55));
        document.getElementById("cand-prob-value").textContent = `${probPct}%`;
        document.getElementById("cand-prob-gauge").style.strokeDashoffset = 283 - (probPct / 100) * 283;

        let pText = "Highly Likely";
        if (probPct < 60) pText = "Needs Practice";
        document.getElementById("cand-prob-badge").textContent = pText;

        // Render Strengths
        const strengthsList = document.getElementById("cand-strengths-list");
        strengthsList.innerHTML = `
        <li>Strong grasp of design architectures, especially in ${candidate.lang}.</li>
        <li>Exceptional communication flow & fast articulation during problem rounds.</li>
        <li>Assertive decision making under behavioral conflict scenarios.</li>
        `;

        // Render Weaknesses
        const weaknessList = document.getElementById("cand-weakness-list");
        weaknessList.innerHTML = `
        <li>Provide concrete statistics/metrics when describing project output.</li>
        <li>Needs structured algorithms framing during scale architectures rounds.</li>
        `;

        // Roadmap
        const roadmapWeeks = document.getElementById("cand-roadmap-weeks");
        roadmapWeeks.innerHTML = [
        {week: 1, title: "Foundations & Vocabulary", tasks: [`Brush up core programming semantics in ${candidate.lang}.`, "Read 5 architecture patterns daily.", "Record 3 speaking mock answers."] },
        {week: 2, title: "Deep Stack Challenges", tasks: ["Implement 3 multi-threaded concurrency models.", "Solve 10 algorithm problems.", "Focus on rate limiting and caching setups."] },
        {week: 3, title: "Scenario mock sessions", tasks: ["Run 3 full-voice simulator interviews.", "Improve timing constraint handling.", "Detail project architectural charts."] },
        {week: 4, title: "Final Polish", tasks: ["Refactor GitHub portfolio readme.", "Practice negotiation vocabulary.", "Review behavioral matrices answers."] }
      ].map(w => `
        <div class="glass-card" style="padding: 1.25rem; display: flex; gap: 14px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: var(--purple-light); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--purple);">W${w.week}</div>
            <div>
                <h4 style="font-size:14px; font-weight:700; margin-bottom: 6px;">${w.title}</h4>
                <div style="font-size: 13px; color: var(--text-secondary); display:flex; flex-direction:column; gap:4px;">
                    ${w.tasks.map(t => `<div style="display:flex; align-items:center; gap:6px;"><i class="ti ti-circle-dot" style="color:var(--purple); font-size:12px;"></i> ${t}</div>`).join("")}
                </div>
            </div>
        </div>
        `).join("");

        // Badges
        const badgesBox = document.getElementById("cand-badges-list");
        badgesBox.innerHTML = [
        {label: "Eloquent Speaker", icon: "ti-speakerphone" },
        {label: "Code Craftsperson", icon: "ti-code" },
        {label: "Critical Thinker", icon: "ti-brain" },
        {label: "HR Ace", icon: "ti-briefcase" }
      ].map(b => `
        <div class="badge-item">
            <i class="ti ${b.icon} badge-icon"></i>
            <span>${b.label}</span>
        </div>
        `).join("");

        // History
        const histBody = document.getElementById("cand-history-table-body");
        histBody.innerHTML = `
        <tr>
            <td>#MOCK-4912</td>
            <td>Today</td>
            <td>${candidate.role}</td>
            <td>${PROG_LANGS.find(l => l.id === candidate.lang).label}</td>
            <td><strong>${avgScore}/10</strong></td>
            <td><span style="color: var(--green); font-weight:600;">Shortlisted</span></td>
        </tr>
        <tr>
            <td>#MOCK-3812</td>
            <td>2 weeks ago</td>
            <td>${candidate.role}</td>
            <td>${PROG_LANGS.find(l => l.id === candidate.lang).label}</td>
            <td><strong>8.1/10</strong></td>
            <td><span style="color: var(--blue); font-weight:600;">Cleared</span></td>
        </tr>
        `;
    }

        function loadDashboardCharts() {
      // Destroy previous
      if (chartRadar) chartRadar.destroy();
        if (chartBar) chartBar.destroy();
        if (chartConfidence) chartConfidence.destroy();
        if (chartTrend) chartTrend.destroy();

        const isDark = document.documentElement.getAttribute("data-theme") === 'dark';
        const labelColor = isDark ? '#9CA3AF' : '#4B5563';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

        const radarCtx = document.getElementById("chart-skills-radar").getContext("2d");
        chartRadar = new Chart(radarCtx, {
            type: 'radar',
        data: {
            labels: Object.keys(scores),
        datasets: [{
            label: 'Your Dimension Scores',
        data: Object.values(scores),
        backgroundColor: 'rgba(139, 92, 246, 0.25)',
        borderColor: '#8B5CF6',
        borderWidth: 2,
        pointBackgroundColor: '#8B5CF6'
          }]
        },
        options: {
            scales: {
            r: {
            angleLines: {color: gridColor },
        grid: {color: gridColor },
        pointLabels: {color: labelColor },
        suggestedMin: 5,
        suggestedMax: 10
            }
          },
        plugins: {legend: {display: false } }
        }
      });

        const barCtx = document.getElementById("chart-comm-bar").getContext("2d");
        chartBar = new Chart(barCtx, {
            type: 'bar',
        data: {
            labels: ['Grammar Semantics', 'Lexical Depth', 'Pace Matching', 'Confidence Tone'],
        datasets: [{
            data: [8.8, 9.2, 8.4, 9.0],
        backgroundColor: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B']
          }]
        },
        options: {
            scales: {
            y: {grid: {color: gridColor }, ticks: {color: labelColor } },
        x: {grid: {display: false }, ticks: {color: labelColor } }
          },
        plugins: {legend: {display: false } }
        }
      });

        const lineCtx = document.getElementById("chart-confidence-line").getContext("2d");
        chartConfidence = new Chart(lineCtx, {
            type: 'line',
        data: {
            labels: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
        datasets: [{
            label: 'Tone Confidence Level',
        data: [8.2, 8.5, 9.1, 9.0, 9.4, 9.3],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.35
          }]
        },
        options: {
            scales: {
            y: {grid: {color: gridColor }, ticks: {color: labelColor } },
        x: {grid: {display: false }, ticks: {color: labelColor } }
          }
        }
      });

        const trendCtx = document.getElementById("chart-trend-line").getContext("2d");
        chartTrend = new Chart(trendCtx, {
            type: 'line',
        data: {
            labels: ['Session 1', 'Session 2', 'Session 3', 'Current'],
        datasets: [{
            label: 'Overall Average Rating',
            data: [7.2, 7.8, 8.1, (Object.values(scores).reduce((a,b)=>a+b,0)/6).toFixed(1)],
        borderColor: '#3B82F6',
        tension: 0.1
          }]
        },
        options: {
            scales: {
            y: {grid: {color: gridColor }, ticks: {color: labelColor } },
        x: {grid: {display: false }, ticks: {color: labelColor } }
          }
        }
      });
    }

        function restartInterviewSession() {
            showScreen('register');
    }

        /* ── RECRUITER PORTAL CONTROLLER ── */
        function updateRecruiterPanel() {
      const tbody = document.getElementById("rec-candidates-tbody");
      tbody.innerHTML = candidatesList.sort((a,b) => b.score - a.score).map((c, i) => `
        <tr onclick="selectCandidateForNotes(${i})" style="cursor:pointer;">
            <td><strong>#${i + 1}</strong></td>
            <td>${c.name}</td>
            <td>${c.role}</td>
            <td>${c.lang}</td>
            <td>${c.speechScore}/10</td>
            <td><strong>${c.score}/10</strong></td>
            <td><span style="color: ${c.score >= 9.0 ? 'var(--green)' : c.score >= 8.0 ? 'var(--blue)' : 'var(--amber)'}; font-weight:600;">${c.status}</span></td>
        </tr>
        `).join("");

        // Default load top candidate in notes box
        selectCandidateForNotes(0);
    }

        let selectedRecCandidateIdx = 0;
        function selectCandidateForNotes(idx) {
            selectedRecCandidateIdx = idx;
        const c = candidatesList[idx];
        if (!c) return;

        document.getElementById("recruiter-notes").value = c.notes;
        document.getElementById("rec-resume-score").textContent = `${Math.round(80 + c.score * 1.8)}% (Excellent)`;
        document.getElementById("playing-track-title").textContent = `Round 1: Intro (${c.name.split(' ')[0]})`;
    }

        function saveRecruiterNotes() {
      const notesVal = document.getElementById("recruiter-notes").value.trim();
        if (candidatesList[selectedRecCandidateIdx]) {
            candidatesList[selectedRecCandidateIdx].notes = notesVal;
        alert("AI Recruiter Evaluation Notes saved successfully.");
      }
    }

        function filterCandidateTable() {
      const q = document.getElementById("candidate-search").value.toLowerCase();
        const rows = document.querySelectorAll("#rec-candidate-table tbody tr");
      rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        r.style.display = text.includes(q) ? "" : "none";
      });
    }

        /* ── SIMULATED VOICE RECORDING PLAYBACK ── */
        function toggleSimulatedPlayback() {
      if (isPlayingRecording) {
            pauseSimulatedPlayback();
      } else {
            startSimulatedPlayback();
      }
    }

        function startSimulatedPlayback() {
            isPlayingRecording = true;
        document.getElementById("playback-icon").className = "ti ti-player-pause-filled";

        const c = candidatesList[selectedRecCandidateIdx] || {name: "Dharamsoth" };
        const voiceLine = `Hello! I am ${c.name}, specializing in Java, Python, and Data Science models. Happy to be here today.`;

      // Play voice actual audio!
      speakText(voiceLine, () => {
            pauseSimulatedPlayback();
      });

      playbackInterval = setInterval(() => {
            playbackCurrent += 0.5;
        if (playbackCurrent >= playbackDuration) {
            playbackCurrent = playbackDuration;
        pauseSimulatedPlayback();
        }
        updatePlaybackProgressUI();
      }, 500);
    }

        function pauseSimulatedPlayback() {
            isPlayingRecording = false;
        document.getElementById("playback-icon").className = "ti ti-player-play-filled";
        if (playbackInterval) clearInterval(playbackInterval);
        if (synth) synth.cancel();
        setAvatarState('ready');
    }

        function updatePlaybackProgressUI() {
      const pct = (playbackCurrent / playbackDuration) * 100;
        document.getElementById("playback-progress-fill").style.width = `${pct}%`;

        const m = Math.floor(playbackCurrent / 60);
        const s = Math.floor(playbackCurrent % 60);
        document.getElementById("playing-track-time").textContent = `${m}:${s < 10 ? '0' : ''}${s} / 0:${playbackDuration}`;
    }

        function seekSimulatedPlayback(e) {
      const track = e.currentTarget;
        const pct = e.offsetX / track.clientWidth;
        playbackCurrent = pct * playbackDuration;
        updatePlaybackProgressUI();
    }

        function loadSimulatedTrack() {
      const type = document.getElementById("recording-select").value;
        const c = candidatesList[selectedRecCandidateIdx] || {name: "Dharamsoth" };

        if (type === 'intro') {
            playbackDuration = 14;
        document.getElementById("playing-track-title").textContent = `Round 1: Self Intro (${c.name.split(' ')[0]})`;
      } else if (type === 'tech') {
            playbackDuration = 32;
        document.getElementById("playing-track-title").textContent = `Round 3: Technical (${c.name.split(' ')[0]})`;
      } else {
            playbackDuration = 25;
        document.getElementById("playing-track-title").textContent = `Round 4: Architecture (${c.name.split(' ')[0]})`;
      }
        playbackCurrent = 0;
        pauseSimulatedPlayback();
        updatePlaybackProgressUI();
    }

        /* ── PDF REPORT EXPORT ── */
        function exportReportPDF() {
            window.print();
    }

        // ── EXPORT SESSION DATA ──
        function exportSessionData() {
            if (!candidate) {
                alert("No session to export");
                return;
            }

            const sessionData = {
                timestamp: sessionStartTime ? sessionStartTime.toISOString() : new Date().toISOString(),
                candidate: candidate,
                scores: scores,
                messages: messages,
                confidenceScore: confidenceScore,
                totalRounds: currentRound + 1,
                language: candidate.lang,
                voiceMode: isVoiceMode,
                premiumVoiceUsed: useElevenLabs
            };

            const json = JSON.stringify(sessionData, null, 2);
            const blob = new Blob([json], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `interview-${candidate.name.replace(/\s+/g, '-')}-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
    }

        // ── DOWNLOAD INTERVIEW TRANSCRIPT ──
        function downloadTranscript() {
            if (messages.length === 0) {
                alert("No conversation to download");
                return;
            }

            let transcript = `INTERVIEW TRANSCRIPT\n`;
            transcript += `Candidate: ${candidate.name}\n`;
            transcript += `Role: ${candidate.role}\n`;
            transcript += `Language: ${PROG_LANGS.find(l => l.id === candidate.lang)?.label || candidate.lang}\n`;
            transcript += `Date: ${sessionStartTime ? sessionStartTime.toLocaleString() : new Date().toLocaleString()}\n`;
            transcript += `\n${'='.repeat(60)}\n\n`;

            messages.forEach((msg, idx) => {
                transcript += `${msg.role.toUpperCase()}:\n${msg.content}\n\n`;
            });

            transcript += `${'='.repeat(60)}\n`;
            transcript += `OVERALL SCORE: ${(Object.values(scores).reduce((a,b)=>a+b,0)/6).toFixed(1)}/10\n`;
            Object.entries(scores).forEach(([key, val]) => {
                transcript += `${key}: ${val}/10\n`;
            });

            const blob = new Blob([transcript], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `transcript-${candidate.name.replace(/\s+/g, '-')}-${new Date().getTime()}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
    }

        // ── DOWNLOAD AUDIO RECORDING ──
        function downloadAudioRecording() {
            if (!recordedAudioUrl) {
                alert("No audio recording available yet");
                return;
            }

            const link = document.createElement('a');
            link.href = recordedAudioUrl;
            link.download = `voice-response-${new Date().getTime()}.webm`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    }

        // ── SAVE SESSION TO LOCAL STORAGE ──
        function saveSessionToHistory() {
            if (!candidate) return;

            const sessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
            const newSession = {
                id: Date.now(),
                timestamp: sessionStartTime ? sessionStartTime.toISOString() : new Date().toISOString(),
                candidateName: candidate.name,
                role: candidate.role,
                language: candidate.lang,
                score: (Object.values(scores).reduce((a,b)=>a+b,0)/6).toFixed(1),
                speechScore: scores['Communication'] || 0,
                status: scores['Communication'] >= 8.5 ? "Strong hire" : scores['Communication'] >= 7.5 ? "Hire" : "Consider",
                messageCount: messages.length
            };

            sessions.push(newSession);
            localStorage.setItem('interviewSessions', JSON.stringify(sessions));
            alert("Session saved to history!");
    }

        /* ── SETTINGS CONFIGURATION MODAL ── */
        function openSettings() {
            document.getElementById("settings-modal").style.display = "flex";
        document.getElementById("settings-api-key").value = localStorage.getItem("recruiter_api_key") || "";
        document.getElementById("settings-proxy-url").value = localStorage.getItem("recruiter_proxy_url") || "";
        document.getElementById("settings-elevenlabs-key").value = localStorage.getItem('elevenLabsApiKey') || "";
    }

        function closeSettings() {
            document.getElementById("settings-modal").style.display = "none";
    }

        function saveSettings() {
      const key = document.getElementById("settings-api-key").value.trim();
        const proxy = document.getElementById("settings-proxy-url").value.trim();
        const elevenKey = document.getElementById("settings-elevenlabs-key").value.trim();

        localStorage.setItem("recruiter_api_key", key);
        localStorage.setItem("recruiter_proxy_url", proxy);
        localStorage.setItem('elevenLabsApiKey', elevenKey);

        // Update global state
        elevenLabsApiKey = elevenKey;
        useElevenLabs = elevenKey.length > 0;

        closeSettings();
        alert(`Settings saved successfully!${useElevenLabs ? ' 🎤 Premium voice enabled!' : ' Using standard voice.'}`);
    }

