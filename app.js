/* ============================================================
   HABLALIBRE — app.js (Completo e Inteligente)
   ============================================================ */

'use strict';

// ============================================================
// ESTADO GLOBAL
// ============================================================
const APP = {
    currentSection: 'inicio',
    selectedEmotion: null,
    chatHistory: [],
    chartsInitialized: false,
    proFilter: 'todos',
    resourceFilter: 'todos',
    // MEMORIA DE IA
    conversationStage: 'init',
    lastTopic: null
};

// ============================================================
// LÓGICA DE CONVERSACIÓN INTELIGENTE (IA)
// ============================================================
function simularRespuestaIA(mensajeUsuario) {
    const msg = mensajeUsuario.toLowerCase();
    // NUEVA LÓGICA: Si ya hay historial, no saludar como si fuera la primera vez
    if (APP.chatHistory.length > 0 && (msg.includes("hola") || msg.includes("buenas"))) {
        return "¡Hola de nuevo! ¿En qué más puedo ayudarte con tu búsqueda?";
    }

    // 1. Cierre / Reinicio
    if (msg.includes("gracias") || msg.includes("listo") || msg.includes("chau")) {
        APP.conversationStage = 'init';
        return "¡De nada! Estoy acá siempre que me necesites. ¿Querés que sigamos hablando de otra cosa o preferís ver algún recurso?";
    }

    // 2. Estado Inicial
    if (APP.conversationStage === 'init') {
        if (msg.includes("hola") || msg.includes("buenas")) {
            APP.conversationStage = 'listening';
            return "¡Hola! Soy tu asistente de HablaLibre. Te escucho, ¿qué es lo que te tiene dando vueltas en la cabeza hoy?";
        }
    }

    // 3. Detección de Temas con memoria
    if (msg.includes("triste") || msg.includes("solo") || msg.includes("mal") || msg.includes("llorar")) {
        APP.lastTopic = 'tristeza';
        APP.conversationStage = 'advising';
        return "Entiendo. La tristeza a veces se siente pesada. ¿Hace cuánto te sentís así? ¿Hubo algo puntual que te haya hecho sentir así hoy?";
    }
    else if (msg.includes("ansiedad") || msg.includes("nervios") || msg.includes("examen")) {
        APP.lastTopic = 'ansiedad';
        APP.conversationStage = 'advising';
        return "La ansiedad puede ser abrumadora. ¿Sentís que es algo puntual por un examen o es una sensación general de nervios?";
    }

    // 4. Memoria de Conversación
    if (APP.conversationStage === 'advising' && msg.length > 5) {
        return `Gracias por contarme eso. Es importante poner en palabras lo que sentimos. Basado en lo que me decís sobre ${APP.lastTopic || 'esto'}, te recomiendo revisar la sección de Recursos. ¿Querés que te guíe a alguna técnica específica?`;
    }

    return "Te escucho. Contame un poco más, ¿cómo te hace sentir eso?";
}

// ============================================================
// LÓGICA DE ANÁLISIS DE SITUACIÓN
// ============================================================
async function analyzeSituation() {
    const text = document.getElementById('situation-text').value.trim();
    if (text.length < 10) {
        showToast('✍️ Escribí un poco más para que pueda ayudarte mejor.');
        return;
    }

    // ... (tu código de loading y estado de botón) ...

    try {
        // Opción A: Si quieres usar IA real (Claude), mantén el fetch.
        // Opción B: Si quieres que sea instantáneo y sin errores, usa la lógica local:
        const data = analizarSituacion(text);
        renderAnalysisResult(data);
    } catch (err) {
        // Fallback
        renderAnalysisResult(analizarSituacion(text));
    }
}

// ============================================================
// NAVEGACIÓN Y UI
// ============================================================
function navigateTo(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

    const section = document.getElementById(`section-${sectionId}`);
    if (section) section.classList.add('active');

    const navBtn = document.querySelector(`[data-section="${sectionId}"]`);
    if (navBtn) navBtn.classList.add('active');

    APP.currentSection = sectionId;

    if (sectionId === 'estadisticas' && !APP.chartsInitialized) {
        setTimeout(initCharts, 100);
        animateKPIs();
    }

    if (window.innerWidth <= 900) closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// (Aquí incluirías el resto de tus funciones originales de profesionales,
// recursos, chat, modales y el bloque document.addEventListener final)
// Nota: Solo he reemplazado la lógica de IA y análisis para integrarla al sistema completo.

// ============================================================
// DATOS — PROFESIONALES
// ============================================================
const PROFESSIONALS = [
    {
        id: 1,
        name: 'Lic. Valeria Romero',
        specialty: 'Psicóloga Clínica',
        category: 'psicologia',
        emoji: '👩‍⚕️',
        bg: '#eff6ff',
        tags: ['Adolescentes', 'Ansiedad', 'Autoestima'],
        status: 'available',
        availability: '🟢 Disponible ahora',
    },
    {
        id: 2,
        name: 'Lic. Jimena López',
        specialty: 'Trabajadora Social / ESI',
        category: 'social',
        emoji: '👩',
        bg: '#fdf4ff',
        tags: ['ESI', 'Conflictos', 'Vínculos'],
        status: 'available',
        availability: '🟢 Disponible ahora',
    },
    {
        id: 3,
        name: 'Lic. Martín Suárez',
        specialty: 'Psicólogo Educacional',
        category: 'psicologia',
        emoji: '👨‍⚕️',
        bg: '#f0fdf4',
        tags: ['Aprendizaje', 'TDAH', 'Bullying'],
        status: 'busy',
        availability: '🟡 Ocupado hoy',
    },
    {
        id: 4,
        name: 'Lic. Analía Torres',
        specialty: 'Pedagoga',
        category: 'pedagogia',
        emoji: '👩‍🏫',
        bg: '#fff7ed',
        tags: ['Aprendizaje', 'Dificultades', 'Orientación'],
        status: 'available',
        availability: '🟢 Disponible ahora',
    },
    {
        id: 5,
        name: 'Lic. Roberto Díaz',
        specialty: 'Psicólogo Social',
        category: 'psicologia',
        emoji: '👨',
        bg: '#fef2f2',
        tags: ['Grupos', 'Convivencia', 'Mediación'],
        status: 'unavailable',
        availability: '🔴 No disponible',
    },
    {
        id: 6,
        name: 'Lic. Sandra Medina',
        specialty: 'Trabajadora Social',
        category: 'social',
        emoji: '👩',
        bg: '#ecfdf5',
        tags: ['Familia', 'Vulnerabilidad', 'Redes'],
        status: 'busy',
        availability: '🟡 Ocupado hoy',
    },
];

// ============================================================
// DATOS — RECURSOS
// ============================================================
const RESOURCES = [
    {
        id: 1, category: 'estres',
        title: 'Técnicas de Respiración para el Estrés',
        desc: 'Ejercicios de respiración probados para calmar el sistema nervioso en momentos de tensión.',
        type: 'Video', typeIcon: '🎥', duration: '12 min',
        color: '#3b82f6',
    },
    {
        id: 2, category: 'ansiedad',
        title: 'Entendiendo la Ansiedad: Guía para Adolescentes',
        desc: 'Qué es la ansiedad, por qué la sentimos y cómo manejarla de forma saludable.',
        type: 'Guía', typeIcon: '📘', duration: '15 min',
        color: '#8b5cf6',
    },
    {
        id: 3, category: 'autoestima',
        title: 'Construyendo mi Autoestima',
        desc: 'Actividades prácticas para reconocer y valorar tus fortalezas.',
        type: 'Taller', typeIcon: '✨', duration: '20 min',
        color: '#f59e0b',
    },
    {
        id: 4, category: 'conflictos',
        title: 'Resolución Pacífica de Conflictos',
        desc: 'Herramientas para resolver diferencias sin violencia, con empatía y comunicación asertiva.',
        type: 'Guía', typeIcon: '🤝', duration: '10 min',
        color: '#10b981',
    },
    {
        id: 5, category: 'comunicacion',
        title: 'Cómo Expresar lo que Sentís',
        desc: 'Aprende a comunicar emociones de manera asertiva y sin herir a los demás.',
        type: 'Video', typeIcon: '🎥', duration: '8 min',
        color: '#ec4899',
    },
    {
        id: 6, category: 'convivencia',
        title: 'Convivencia Escolar Saludable',
        desc: 'Estrategias para llevarse bien con compañeros y construir un ambiente positivo.',
        type: 'Taller', typeIcon: '🏫', duration: '25 min',
        color: '#6366f1',
    },
    {
        id: 7, category: 'estres',
        title: 'Manejo del Tiempo para Estudiantes',
        desc: 'Técnicas de organización y gestión del tiempo para reducir el estrés académico.',
        type: 'Guía', typeIcon: '📋', duration: '18 min',
        color: '#3b82f6',
    },
    {
        id: 8, category: 'autoestima',
        title: 'Mindfulness para Adolescentes',
        desc: 'Prácticas de atención plena adaptadas para jóvenes. Calmar la mente, conectar con el presente.',
        type: 'Audio', typeIcon: '🎧', duration: '15 min',
        color: '#f59e0b',
    },
];

// ============================================================
// LÓGICA SIMULADA — ASISTENTE IA
// ============================================================
function simularRespuestaIA(mensajeUsuario) {
    const mensaje = mensajeUsuario.toLowerCase();

    if (mensaje.includes("hola") || mensaje.includes("buenas") || mensaje.includes("dia")) {
        return "¡Hola! Qué bueno que te conectaste. ¿Cómo estás hoy? Podés contarme lo que necesites.";
    }
    else if (mensaje.includes("profesional") || mensaje.includes("psicologo") || mensaje.includes("psicóloga") || mensaje.includes("info") || mensaje.includes("lic")) {
        return "Los profesionales externos están para acompañarte en temas más profundos. Tenemos psicólogos, pedagogos y trabajadores sociales. ¿Querés que te ayude a ver cómo pedir un turno o preferís contarme un poco qué te anda pasando?";
    }
    else if (mensaje.includes("triste") || mensaje.includes("mal") || mensaje.includes("llorar") || mensaje.includes("angustia")) {
        return "Lamento leer que te sentís así. Recordá que este es un espacio seguro y anónimo. A veces, hablar con el EOE o con alguien de confianza ayuda un montón a aliviar esa carga. ¿Pasó algo puntual hoy?";
    }
    else if (mensaje.includes("enojo") || mensaje.includes("bronca") || mensaje.includes("pelea") || mensaje.includes("odio")) {
        return "Es súper normal sentir bronca a veces. Respirar profundo ayuda a bajar un cambio antes de reaccionar. ¿Alguien en la escuela te hizo enojar o fue otra cosa?";
    }
    else if (mensaje.includes("ansiedad") || mensaje.includes("miedo") || mensaje.includes("nervios") || mensaje.includes("prueba") || mensaje.includes("examen")) {
        return "La ansiedad puede ser abrumadora, pero no estás solo/a. En la sección de 'Recursos' hay técnicas de respiración muy buenas. ¿Qué es lo que te está generando tantos nervios?";
    }
    else if (mensaje.includes("turno") || mensaje.includes("contacto") || mensaje.includes("hablar con alguien")) {
        return "¡Claro! Podés pedir un turno yendo a la sección 'Profesionales' en el menú de la izquierda, o podés mandar un mensaje al EOE desde su sección. ¿Te puedo ayudar con algo más mientras tanto?";
    }
    else {
        return "Entiendo lo que me decís. Contame un poco más, estoy acá para escucharte y acompañarte en lo que necesites.";
    }
}

// ============================================================
// LÓGICA SIMULADA — ANÁLISIS DE SITUACIÓN
// ============================================================
function analizarSituacionSimulada(textoUsuario) {
    const texto = textoUsuario.toLowerCase();

    let resultado = {
        emotion: "Variada",
        intensity: "Media",
        analysis: "Se detectan emociones complejas en lo que describís. Es un gran primer paso haberlo puesto en palabras.",
        resources: ["Comunicación asertiva", "Técnicas de regulación emocional"],
        recommendation: "Sería valioso hablar con alguien de confianza sobre lo que estás viviendo."
    };

    if (texto.includes("triste") || texto.includes("solo") || texto.includes("mal") || texto.includes("llorar")) {
        resultado.emotion = "Tristeza / Aislamiento";
        resultado.intensity = "Alta";
        resultado.analysis = "Tus palabras reflejan una carga de tristeza importante. Es completamente válido sentirse así y es clave no guardárselo.";
        resultado.resources = ["Entendiendo la tristeza", "Importancia de pedir ayuda"];
        resultado.recommendation = "Hablar con alguien del EOE o un profesional te puede ayudar mucho a procesar esto.";
    }
    else if (texto.includes("estres") || texto.includes("examen") || texto.includes("prueba") || texto.includes("colegio") || texto.includes("estudiar")) {
        resultado.emotion = "Estrés Académico";
        resultado.intensity = "Alta";
        resultado.analysis = "Se nota mucha presión relacionada con el rendimiento y el colegio. Acordate que una nota no define quién sos.";
        resultado.resources = ["Manejo del Tiempo para Estudiantes", "Técnicas de Respiración para el Estrés"];
        resultado.recommendation = "Intentá organizar tus tiempos y tomarte pausas. Podés probar un recurso de respiración de nuestra biblioteca ahora mismo.";
    }
    else if (texto.includes("pelea") || texto.includes("amigo") || texto.includes("compañero") || texto.includes("bronca") || texto.includes("enojo")) {
        resultado.emotion = "Conflicto / Enojo";
        resultado.intensity = "Media";
        resultado.analysis = "Parece que estás atravesando una situación de conflicto o frustración. El enojo nos avisa cuando algo nos parece injusto.";
        resultado.resources = ["Resolución Pacífica de Conflictos", "Cómo Expresar lo que Sentís"];
        resultado.recommendation = "Escribir o hablar antes de reaccionar es clave. El EOE te puede dar herramientas para manejar este conflicto escolar.";
    }
    else if (texto.includes("ansiedad") || texto.includes("miedo") || texto.includes("nervios") || texto.includes("panico")) {
        resultado.emotion = "Ansiedad";
        resultado.intensity = "Alta";
        resultado.analysis = "Se perciben señales de ansiedad. Cuando la mente va muy rápido, ayuda mucho volver a conectar con el cuerpo.";
        resultado.resources = ["Entendiendo la Ansiedad", "Mindfulness para Adolescentes"];
        resultado.recommendation = "Probá escuchar el audio de Mindfulness en la sección de recursos. Si la ansiedad sigue, considerá solicitar un turno con un profesional.";
    }

    return resultado;
}

// ============================================================
// NAVEGACIÓN
// ============================================================
function navigateTo(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

    const section = document.getElementById(`section-${sectionId}`);
    if (section) section.classList.add('active');

    const navBtn = document.querySelector(`[data-section="${sectionId}"]`);
    if (navBtn) navBtn.classList.add('active');

    APP.currentSection = sectionId;

    if (sectionId === 'estadisticas' && !APP.chartsInitialized) {
        setTimeout(initCharts, 100);
        animateKPIs();
    }

    if (window.innerWidth <= 900) {
        closeSidebar();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
}

// ============================================================
// EMOCIONES
// ============================================================
const EMOTION_MESSAGES = {
    'Feliz': 'Qué bueno escucharlo! 😊 Aprovechá esa energía positiva.',
    'Triste': 'Sentir tristeza es válido. Estamos acá para acompañarte.',
    'Ansioso': 'La ansiedad es difícil. Respirá profundo: estamos acá.',
    'Enojado': 'El enojo tiene un mensaje. Podemos ayudarte a procesarlo.',
    'Estresado': 'El estrés avisa que algo necesita atención. Hablemos.',
    'Confundido': 'Está bien no tener todo claro. Te podemos orientar.',
    'Cansado': 'Tu cuerpo y mente te hablan. Merecés descansar.',
    'Motivado': '¡Esa energía es increíble! Aprovechala al máximo. ❤️',
};

function selectEmotion(card, name, emoji, color) {
    document.querySelectorAll('.emotion-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    APP.selectedEmotion = { name, emoji };

    document.getElementById('today-emoji').textContent = emoji;

    const feedback = document.getElementById('emotion-feedback');
    document.getElementById('feedback-emoji').textContent = emoji;
    document.getElementById('feedback-title').textContent = `Registramos: ${name}`;
    document.getElementById('feedback-msg').textContent = EMOTION_MESSAGES[name] || '¡Registro guardado!';
    feedback.style.display = 'flex';

    setTimeout(() => {
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    showToast(`${emoji} Emoción registrada: ${name}`);
}

// ============================================================
// EXPRESAR SITUACIÓN
// ============================================================
function updateCharCount(textarea) {
    document.getElementById('char-count').textContent = `${textarea.value.length} / 1000`;
}

function updateCharCount2(textarea) {
    document.getElementById('char-count-2').textContent = `${textarea.value.length} / 500`;
}

function analyzeSituation() {
    const text = document.getElementById('situation-text').value.trim();
    if (!text || text.length < 10) {
        showToast('✍️ Escribí al menos un poco antes de analizar.');
        return;
    }

    const loading = document.getElementById('analysis-loading');
    const result = document.getElementById('analysis-result');
    const btn = document.getElementById('analyze-btn');

    loading.style.display = 'block';
    result.style.display = 'none';
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analizando...';

    // Simulamos el tiempo de procesamiento de una API (1.5 segundos)
    setTimeout(() => {
        const data = analizarSituacionSimulada(text);
        renderAnalysisResult(data);

        loading.style.display = 'none';
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Analizar situación';
    }, 1500);
}

function renderAnalysisResult(data) {
    const result = document.getElementById('analysis-result');
    const content = document.getElementById('result-content');

    content.innerHTML = `
        <div class="result-emotion-tag">
            <i class="fa-solid fa-face-smile-beam"></i>
            Emoción detectada: <strong>${escapeHtml(data.emotion || 'Variada')}</strong>
            ${data.intensity ? `· Intensidad: ${data.intensity}` : ''}
        </div>
        <div class="result-block">
            <h5><i class="fa-solid fa-brain" style="color:#3b82f6;margin-right:6px"></i>Análisis</h5>
            <p>${escapeHtml(data.analysis)}</p>
        </div>
        ${data.resources && data.resources.length ? `
        <div class="result-block">
            <h5><i class="fa-solid fa-book-open" style="color:#10b981;margin-right:6px"></i>Recursos recomendados</h5>
            <ul>${data.resources.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
        </div>` : ''}
        ${data.recommendation ? `
        <div class="result-block" style="background:#eff6ff;border:1px solid #bfdbfe">
            <h5><i class="fa-solid fa-lightbulb" style="color:#f59e0b;margin-right:6px"></i>Recomendación</h5>
            <p>${escapeHtml(data.recommendation)}</p>
        </div>` : ''}
    `;

    result.style.display = 'block';
    setTimeout(() => result.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    showToast('✅ Análisis completado');
}

// ============================================================
// CHAT — ASISTENTE IA
// ============================================================
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';

    appendChatMessage('user', text);
    APP.chatHistory.push({ role: 'user', content: text });

    const typing = document.getElementById('typing-indicator');
    typing.style.display = 'flex';
    scrollChatToBottom();

    // Simulamos que la IA está escribiendo y pensando
    setTimeout(() => {
        typing.style.display = 'none';

        const response = simularRespuestaIA(text);

        appendChatMessage('ai', response);
        APP.chatHistory.push({ role: 'assistant', content: response });

        scrollChatToBottom();
    }, 1500);
}

function appendChatMessage(sender, text) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;

    if (sender === 'user') {
        div.innerHTML = `
            <div class="user-avatar">VOS</div>
            <div class="msg-bubble">${escapeHtml(text)}</div>
        `;
    } else {
        div.innerHTML = `
            <div class="msg-avatar">
                <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="14" fill="url(#aiG${Date.now()})"/>
                    <path d="M9 14c0-2.8 2.2-5 5-5s5 2.2 5 5c0 1.7-.8 3.2-2.1 4.1L17 20H11l-.4-2.2C9.8 17.1 9 15.6 9 14z" fill="white"/>
                    <defs>
                        <linearGradient id="aiG${Date.now()}" x1="0" y1="0" x2="28" y2="28">
                            <stop stop-color="#3b82f6"/><stop offset="1" stop-color="#1e40af"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div class="msg-bubble">${formatChatText(escapeHtml(text))}</div>
        `;
    }

    container.appendChild(div);
    div.style.animation = 'sectionIn 0.3s ease';
    scrollChatToBottom();
}

function formatChatText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

function clearChat() {
    APP.chatHistory = [];
    const container = document.getElementById('chat-messages');
    container.innerHTML = `
        <div class="message ai-message">
            <div class="msg-avatar">
                <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="14" fill="url(#aiGClr)"/>
                    <path d="M9 14c0-2.8 2.2-5 5-5s5 2.2 5 5c0 1.7-.8 3.2-2.1 4.1L17 20H11l-.4-2.2C9.8 17.1 9 15.6 9 14z" fill="white"/>
                    <defs>
                        <linearGradient id="aiGClr" x1="0" y1="0" x2="28" y2="28">
                            <stop stop-color="#3b82f6"/><stop offset="1" stop-color="#1e40af"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div class="msg-bubble">
                <p>¡Hola! 👋 Soy el asistente de <strong>HablaLibre</strong>. Estoy acá para escucharte, acompañarte y ayudarte a entender cómo te sentís.</p>
                <p style="margin-top:8px">Podés contarme lo que te pasa con total confianza. ¿Por dónde querés empezar? 💙</p>
            </div>
        </div>
    `;
    showToast('🧹 Chat reiniciado');
}

function handleChatKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}

function autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function scrollChatToBottom() {
    const container = document.getElementById('chat-messages');
    setTimeout(() => container.scrollTop = container.scrollHeight, 50);
}

// ============================================================
// EOE
// ============================================================
function selectEoeOption(type) {
    document.querySelectorAll('.eoe-option').forEach(opt => opt.classList.remove('active'));
    const activeOpt = document.getElementById(`opt-${type}`);
    if (activeOpt) activeOpt.classList.add('active');
}

function submitEoeForm() {
    const motivo = document.getElementById('eoe-motivo').value;
    const mensaje = document.getElementById('eoe-mensaje').value.trim();

    if (!mensaje) {
        showToast('✍️ Escribí algo en el campo de mensaje.');
        return;
    }

    showSuccessModal(
        '¡Enviado al EOE! 🏫',
        `Tu mensaje sobre "${motivo}" fue enviado de forma segura al Equipo de Orientación Escolar. Te van a contactar pronto.`
    );

    document.getElementById('eoe-mensaje').value = '';
    document.getElementById('char-count-2').textContent = '0 / 500';
}

// ============================================================
// PROFESIONALES
// ============================================================
function renderProfessionals() {
    const grid = document.getElementById('pros-grid');
    const filtered = APP.proFilter === 'todos'
        ? PROFESSIONALS
        : PROFESSIONALS.filter(p => p.category === APP.proFilter);

    grid.innerHTML = filtered.map(pro => {
        const statusClass = { available: 'avail-green', busy: 'avail-yellow', unavailable: 'avail-red' }[pro.status];
        return `
        <div class="pro-card" data-category="${pro.category}">
            <div class="pro-card-top">
                <div class="pro-avatar" style="background:${pro.bg}">
                    <span style="font-size:26px">${pro.emoji}</span>
                    <span class="pro-status-dot" style="background:${
                        pro.status === 'available' ? '#22c55e' : pro.status === 'busy' ? '#f59e0b' : '#ef4444'
                    }"></span>
                </div>
                <div class="pro-info">
                    <h4>${pro.name}</h4>
                    <div class="pro-specialty">${pro.specialty}</div>
                </div>
            </div>
            <div class="pro-tags">
                ${pro.tags.map(t => `<span class="pro-tag">${t}</span>`).join('')}
            </div>
            <div class="pro-availability ${statusClass}">
                <span>${pro.availability}</span>
            </div>
            <div class="pro-actions">
                <button class="pro-btn-primary" onclick="contactPro('${pro.name}')">
                    <i class="fa-solid fa-comment-dots"></i> Contactar
                </button>
                <button class="pro-btn-secondary" onclick="bookPro('${pro.name}')">
                    <i class="fa-solid fa-calendar-plus"></i> Turno
                </button>
            </div>
        </div>
        `;
    }).join('');
}

function filterPros(category, btn) {
    APP.proFilter = category;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderProfessionals();
}

function contactPro(name) {
    navigateTo('asistente'); // Te lleva al chat

    // Le pasamos a la IA un contexto de quién es el profesional
    const mensajeContexto = `Hola, quiero información sobre ${name}.`;

    setTimeout(() => {
        // Mostramos el mensaje del usuario en el chat
        appendChatMessage('user', mensajeContexto);
        APP.chatHistory.push({ role: 'user', content: mensajeContexto });

        const typing = document.getElementById('typing-indicator');
        typing.style.display = 'flex';

        setTimeout(() => {
            typing.style.display = 'none';
            // Respuesta inteligente que incluye el nombre del profesional
            const resp = `¡Hola! Con gusto te cuento. ${name} es un profesional excelente en nuestro equipo. Se especializa en acompañar procesos escolares y brindar herramientas muy útiles. ¿Te gustaría que te ayude a coordinar un turno o preferís saber algo específico sobre su forma de trabajar?`;

            appendChatMessage('ai', resp);
            APP.chatHistory.push({ role: 'assistant', content: resp });
        }, 1000);
    }, 400);
}

function bookPro(name) {
    showSuccessModal(
        '¡Solicitud enviada! 📅',
        `Tu solicitud de turno con ${name} fue enviada. Te vamos a notificar cuando confirmen la fecha y horario.`
    );
}

// ============================================================
// RECURSOS
// ============================================================
function renderResources() {
    const grid = document.getElementById('recursos-grid');
    const filtered = APP.resourceFilter === 'todos'
        ? RESOURCES
        : RESOURCES.filter(r => r.category === APP.resourceFilter);

    grid.innerHTML = filtered.map(r => `
        <div class="recurso-card" onclick="openResource('${r.title}')">
            <div class="recurso-banner" style="background:${r.color}"></div>
            <div class="recurso-body">
                <div class="recurso-type" style="color:${r.color}">
                    <span>${r.typeIcon}</span> ${r.type}
                </div>
                <h4>${r.title}</h4>
                <p>${r.desc}</p>
                <div class="recurso-meta">
                    <span class="recurso-duration">
                        <i class="fa-solid fa-clock"></i> ${r.duration}
                    </span>
                    <span style="color:${r.color};font-weight:600;font-size:12px">
                        Ver más <i class="fa-solid fa-arrow-right"></i>
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function filterResources(category, btn) {
    APP.resourceFilter = category;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderResources();
}

function openResource(title) {
    showToast(`📖 Abriendo: ${title}`);
}

// ============================================================
// ESTADÍSTICAS — CHARTS
// ============================================================
function initCharts() {
    if (APP.chartsInitialized) return;
    APP.chartsInitialized = true;

    const chartDefaults = {
        plugins: {
            legend: {
                labels: {
                    font: { family: "'DM Sans', sans-serif", size: 12 },
                    color: '#475569',
                    usePointStyle: true,
                    pointStyleWidth: 8,
                }
            }
        },
    };

    const ctxEvolucion = document.getElementById('chart-evolucion');
    if (ctxEvolucion) {
        new Chart(ctxEvolucion, {
            type: 'line',
            data: {
                labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
                datasets: [
                    {
                        label: 'Bienestar General',
                        data: [55, 62, 58, 70, 65, 78, 72, 82],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59,130,246,0.08)',
                        borderWidth: 2.5,
                        pointBackgroundColor: '#3b82f6',
                        pointRadius: 5,
                        tension: 0.4,
                        fill: true,
                    },
                    {
                        label: 'Nivel de Estrés',
                        data: [70, 65, 72, 60, 68, 55, 58, 50],
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249,115,22,0.05)',
                        borderWidth: 2,
                        pointBackgroundColor: '#f97316',
                        pointRadius: 4,
                        tension: 0.4,
                        fill: true,
                    },
                    {
                        label: 'Motivación',
                        data: [45, 50, 48, 60, 58, 70, 68, 78],
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34,197,94,0.05)',
                        borderWidth: 2,
                        pointBackgroundColor: '#22c55e',
                        pointRadius: 4,
                        tension: 0.4,
                        fill: true,
                    }
                ]
            },
            options: {
                ...chartDefaults,
                responsive: true,
                scales: {
                    x: {
                        grid: { color: '#f1f5f9' },
                        ticks: { color: '#64748b', font: { family: "'DM Sans'" } }
                    },
                    y: {
                        beginAtZero: false,
                        min: 30, max: 100,
                        grid: { color: '#f1f5f9' },
                        ticks: { color: '#64748b', font: { family: "'DM Sans'" }, callback: v => v + '%' }
                    }
                }
            }
        });
    }

    const ctxEmociones = document.getElementById('chart-emociones');
    if (ctxEmociones) {
        new Chart(ctxEmociones, {
            type: 'doughnut',
            data: {
                labels: ['Ansioso 😰', 'Triste 😔', 'Feliz 😊', 'Estresado 😣', 'Motivado ❤️', 'Confundido 😕'],
                datasets: [{
                    data: [28, 22, 18, 16, 10, 6],
                    backgroundColor: ['#f59e0b', '#3b82f6', '#22c55e', '#f97316', '#ec4899', '#8b5cf6'],
                    borderWidth: 0,
                    hoverOffset: 8,
                }]
            },
            options: {
                ...chartDefaults,
                responsive: true,
                cutout: '65%',
                plugins: {
                    ...chartDefaults.plugins,
                    legend: {
                        ...chartDefaults.plugins.legend,
                        position: 'bottom',
                    }
                }
            }
        });
    }

    const ctxTemas = document.getElementById('chart-temas');
    if (ctxTemas) {
        new Chart(ctxTemas, {
            type: 'bar',
            data: {
                labels: ['Ansiedad', 'Estrés', 'Autoestima', 'Conflictos', 'Familia', 'Amistades'],
                datasets: [{
                    label: 'Consultas',
                    data: [340, 280, 220, 190, 160, 130],
                    backgroundColor: [
                        'rgba(59,130,246,0.8)',
                        'rgba(249,115,22,0.8)',
                        'rgba(245,158,11,0.8)',
                        'rgba(139,92,246,0.8)',
                        'rgba(236,72,153,0.8)',
                        'rgba(34,197,94,0.8)',
                    ],
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                ...chartDefaults,
                responsive: true,
                indexAxis: 'y',
                plugins: {
                    ...chartDefaults.plugins,
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: '#f1f5f9' },
                        ticks: { color: '#64748b', font: { family: "'DM Sans'" } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#475569', font: { family: "'DM Sans'", weight: '600' } }
                    }
                }
            }
        });
    }
}

function animateKPIs() {
    document.querySelectorAll('.kpi-num').forEach(el => {
        const target = parseInt(el.dataset.target || 0);
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.round(current).toLocaleString('es-AR');
        }, 16);
    });
}

// ============================================================
// MODALES
// ============================================================
function openEmergencyModal() {
    document.getElementById('emergency-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeEmergencyModal(e) {
    if (!e || e.target.classList.contains('modal-overlay') || !e.target.closest) {
        document.getElementById('emergency-modal').style.display = 'none';
        document.body.style.overflow = '';
    }
}

function showSuccessModal(title, msg) {
    document.getElementById('success-title').textContent = title;
    document.getElementById('success-msg').textContent = msg;
    document.getElementById('success-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal(e) {
    if (!e || e.target.classList.contains('modal-overlay')) {
        document.getElementById('success-modal').style.display = 'none';
        document.body.style.overflow = '';
    }
}

// ============================================================
// TOAST
// ============================================================
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-msg');
    msg.textContent = message;
    toast.style.display = 'flex';

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// ============================================================
// UTILIDADES
// ============================================================
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function initPeriodBtns() {
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    renderProfessionals();
    renderResources();
    initPeriodBtns();

    if (window.innerWidth <= 900) {
        document.getElementById('sidebar').classList.remove('open');
    }

    console.log('🟢 HablaLibre iniciado correctamente (Modo Simulación)');
});
