/* ══════════════════════════════════════════════════
   POCKETSCAN AI · SCRIPT v4
   Instant splash · Full i18n EN/HI/TA
   Claude API chat · Scan-aware context
══════════════════════════════════════════════════ */
'use strict';

/* ─── DOM ─────────────────────────────────────── */
const $ = id => document.getElementById(id);
const splash        = $('splash');
const fileInput     = $('fileInput');
const uploadZone    = $('uploadZone');
const uploadInner   = $('uploadInner');
const uploadPreview = $('uploadPreview');
const previewImg    = $('previewImg');
const removeImg     = $('removeImg');
const analyzeBtn    = $('analyzeBtn');
const scanLoading   = $('scanLoading');
const resultCard    = $('resultCard');
const resultDisease = $('resultDisease');
const resultStatus  = $('resultStatus');
const confFill      = $('confFill');
const confVal       = $('confVal');
const resultNote    = $('resultNote');
const translatedNote= $('translatedNote');
const translatedText= $('translatedText');
const translatedLangLabel = $('translatedLangLabel');
const voiceBtn      = $('voiceBtn');
const speakLabel    = $('speakLabel');
const langSelect    = $('langSelect');
const waveform      = $('waveform');
const chatWindow    = $('chatWindow');
const chatInput     = $('chatInput');
const sendBtn       = $('sendBtn');
const charCount     = $('charCount');
const clearChatBtn  = $('clearChatBtn');
const quickChips    = $('quickChips');
const aiThinking    = $('aiThinking');

/* ─── STATE ──────────────────────────────────── */
let currentResult   = null;
let isSpeaking      = false;
let isAiTyping      = false;
let chatHistory     = [];
let currentLang     = 'en';

/* ══════════════════════════════════════════════════
   i18n — Full translations EN / HI / TA
══════════════════════════════════════════════════ */
const I18N = {
  en: {
    tagline:        'Medical Intelligence Platform',
    nav_scanner:    'Scanner',
    nav_history:    'History',
    nav_reports:    'Reports',
    eyebrow:        'AI · DIAGNOSTICS · REAL-TIME',
    h1_line1:       'Scan.',
    h1_line2:       'Detect.',
    h1_line3:       'Understand.',
    hero_desc:      'Upload any medical image — X-ray, MRI, CT, dermoscopy — and receive instant AI-powered diagnosis with confidence scoring and voice output in your language.',
    stat_accuracy:  'Accuracy',
    stat_diseases:  'Diseases',
    stat_scans:     'Scans Done',
    stat_speed:     'Avg Response',
    badge_scanner:  'SCANNER',
    scanner_title:  'Diagnostic Engine',
    upload_title:   'Drop your medical scan here',
    upload_hint:    'Supports X-Ray · MRI · CT · Dermoscopy · PNG · JPG · DICOM',
    btn_choose:     'Choose File',
    ready:          'Ready for analysis',
    btn_remove:     'Remove',
    btn_analyze:    'Run Neural Analysis',
    processing:     'Processing neural pathways…',
    diag_output:    'DIAGNOSIS OUTPUT',
    confidence:     'CONFIDENCE SCORE',
    btn_speak:      'Speak Result',
    badge_assistant:'ASSISTANT',
    assistant_title:'AI Consultant',
    thinking:       'Claude is thinking…',
    chat_placeholder:'Ask about symptoms, diagnoses, drugs, treatments…',
    disclaimer:     '⚠️ For informational purposes only. Always consult a licensed physician.',
    online:         'Neural Core Online',
    metrics_eyebrow:'PLATFORM INTELLIGENCE',
    metrics_title:  'Live Metrics',
    m_accuracy:     'Detection Accuracy',
    m_diseases:     'Diseases Covered',
    m_confidence:   'Avg AI Confidence',
    m_scans:        'Scans Processed',
    footer_note:    'For research & informational use only · Not a substitute for clinical diagnosis',
    chip_pneumonia: '🫁 Pneumonia symptoms',
    chip_retina:    '👁 Retinopathy stages',
    chip_melanoma:  '🔬 Melanoma ABCDE',
    chip_heart:     '❤️ Heart attack signs',
    chip_mri:       '🧲 How MRI works',
    chip_bp:        '💊 Hypertension drugs',
    chip_msg_pneumonia: 'What are the symptoms of pneumonia?',
    chip_msg_retina:    'Explain diabetic retinopathy stages',
    chip_msg_melanoma:  'How do I identify melanoma using ABCDE criteria?',
    chip_msg_heart:     'What are early warning signs of a heart attack?',
    chip_msg_mri:       'How does an MRI scan work?',
    chip_msg_bp:        'What medications are used for hypertension?',
    welcome_p1:     'Hello! I\'m your <strong>PocketScan AI</strong> medical consultant — powered by Claude. I can answer questions in <strong>English, Hindi, and Tamil</strong>.',
    welcome_p2:     'Ask me about symptoms, diagnoses, drugs, treatment plans, or scan results — in any language you prefer.',
    translated_hindi: 'Hindi Translation',
    translated_tamil: 'Tamil Translation',
  },

  hi: {
    tagline:        'चिकित्सा बुद्धिमत्ता मंच',
    nav_scanner:    'स्कैनर',
    nav_history:    'इतिहास',
    nav_reports:    'रिपोर्ट',
    eyebrow:        'AI · डायग्नोस्टिक्स · रियल-टाइम',
    h1_line1:       'स्कैन.',
    h1_line2:       'पहचानें.',
    h1_line3:       'समझें.',
    hero_desc:      'कोई भी मेडिकल इमेज अपलोड करें — X-Ray, MRI, CT — और तुरंत AI-आधारित निदान पाएं, अपनी भाषा में।',
    stat_accuracy:  'सटीकता',
    stat_diseases:  'बीमारियां',
    stat_scans:     'स्कैन हुए',
    stat_speed:     'औसत प्रतिक्रिया',
    badge_scanner:  'स्कैनर',
    scanner_title:  'डायग्नोस्टिक इंजन',
    upload_title:   'यहाँ अपना मेडिकल स्कैन डालें',
    upload_hint:    'X-Ray · MRI · CT · PNG · JPG · DICOM सपोर्टेड',
    btn_choose:     'फ़ाइल चुनें',
    ready:          'विश्लेषण के लिए तैयार',
    btn_remove:     'हटाएं',
    btn_analyze:    'AI विश्लेषण करें',
    processing:     'न्यूरल नेटवर्क प्रोसेसिंग…',
    diag_output:    'निदान परिणाम',
    confidence:     'आत्मविश्वास स्कोर',
    btn_speak:      'परिणाम सुनें',
    badge_assistant:'सहायक',
    assistant_title:'AI सलाहकार',
    thinking:       'Claude सोच रहा है…',
    chat_placeholder:'लक्षण, रोग, दवाएं, उपचार के बारे में पूछें…',
    disclaimer:     '⚠️ केवल जानकारी के लिए। हमेशा एक लाइसेंस प्राप्त चिकित्सक से परामर्श लें।',
    online:         'न्यूरल कोर ऑनलाइन',
    metrics_eyebrow:'प्लेटफ़ॉर्म डेटा',
    metrics_title:  'लाइव मेट्रिक्स',
    m_accuracy:     'पहचान सटीकता',
    m_diseases:     'कवर की गई बीमारियां',
    m_confidence:   'औसत AI विश्वास',
    m_scans:        'स्कैन प्रोसेस',
    footer_note:    'केवल शोध और जानकारी के लिए · नैदानिक निदान का विकल्प नहीं',
    chip_pneumonia: '🫁 निमोनिया लक्षण',
    chip_retina:    '👁 रेटिनोपैथी चरण',
    chip_melanoma:  '🔬 मेलानोमा ABCDE',
    chip_heart:     '❤️ हार्ट अटैक संकेत',
    chip_mri:       '🧲 MRI कैसे काम करता है',
    chip_bp:        '💊 उच्च रक्तचाप दवाएं',
    chip_msg_pneumonia: 'निमोनिया के क्या लक्षण हैं? हिंदी में बताएं।',
    chip_msg_retina:    'मधुमेह रेटिनोपैथी के चरण क्या हैं? हिंदी में समझाएं।',
    chip_msg_melanoma:  'ABCDE नियम से मेलानोमा कैसे पहचानें? हिंदी में बताएं।',
    chip_msg_heart:     'हार्ट अटैक के शुरुआती लक्षण क्या हैं? हिंदी में बताएं।',
    chip_msg_mri:       'MRI स्कैन कैसे काम करता है? हिंदी में समझाएं।',
    chip_msg_bp:        'उच्च रक्तचाप के लिए कौन सी दवाएं उपयोग होती हैं? हिंदी में बताएं।',
    welcome_p1:     'नमस्ते! मैं आपका <strong>PocketScan AI</strong> चिकित्सा सलाहकार हूँ — Claude द्वारा संचालित। मैं <strong>हिंदी, अंग्रेजी और तमिल</strong> में उत्तर दे सकता हूँ।',
    welcome_p2:     'लक्षण, निदान, दवाएं, उपचार या स्कैन परिणाम — किसी भी विषय पर अपनी भाषा में पूछें।',
    translated_hindi: 'हिंदी अनुवाद',
    translated_tamil: 'तमिल अनुवाद',
  },

  ta: {
    tagline:        'மருத்துவ புத்திசாலி தளம்',
    nav_scanner:    'ஸ்கேனர்',
    nav_history:    'வரலாறு',
    nav_reports:    'அறிக்கைகள்',
    eyebrow:        'AI · கண்டறிதல் · நேரடி',
    h1_line1:       'ஸ்கேன்.',
    h1_line2:       'கண்டறி.',
    h1_line3:       'புரிந்துகொள்.',
    hero_desc:      'எந்த மருத்துவ படத்தையும் பதிவேற்றவும் — X-Ray, MRI, CT — உங்கள் மொழியில் உடனடி AI நோய் கண்டறிதல் பெறுங்கள்.',
    stat_accuracy:  'துல்லியம்',
    stat_diseases:  'நோய்கள்',
    stat_scans:     'ஸ்கேன்கள்',
    stat_speed:     'சராசரி நேரம்',
    badge_scanner:  'ஸ்கேனர்',
    scanner_title:  'கண்டறிதல் இயந்திரம்',
    upload_title:   'உங்கள் மருத்துவ ஸ்கேனை இங்கே போடுங்கள்',
    upload_hint:    'X-Ray · MRI · CT · PNG · JPG · DICOM ஆதரவு',
    btn_choose:     'கோப்பு தேர்வு',
    ready:          'பகுப்பாய்வுக்கு தயார்',
    btn_remove:     'நீக்கு',
    btn_analyze:    'AI பகுப்பாய்வு செய்',
    processing:     'நரம்பியல் வழிகள் செயலில்…',
    diag_output:    'நோய் கண்டறிதல் வெளியீடு',
    confidence:     'நம்பிக்கை மதிப்பெண்',
    btn_speak:      'முடிவை கேளுங்கள்',
    badge_assistant:'உதவியாளர்',
    assistant_title:'AI ஆலோசகர்',
    thinking:       'Claude யோசிக்கிறது…',
    chat_placeholder:'அறிகுறிகள், நோய்கள், மருந்துகள் பற்றி கேளுங்கள்…',
    disclaimer:     '⚠️ தகவல் நோக்கங்களுக்கு மட்டுமே. எப்போதும் மருத்துவரிடம் ஆலோசிக்கவும்.',
    online:         'நரம்பியல் கோர் இணையத்தில்',
    metrics_eyebrow:'தளம் புள்ளிவிவரங்கள்',
    metrics_title:  'நேரடி அளவீடுகள்',
    m_accuracy:     'கண்டறிதல் துல்லியம்',
    m_diseases:     'நோய்கள் உள்ளடக்கியவை',
    m_confidence:   'சராசரி AI நம்பிக்கை',
    m_scans:        'ஸ்கேன்கள் செயலில்',
    footer_note:    'ஆராய்ச்சி மற்றும் தகவல் நோக்கங்களுக்கு மட்டுமே · மருத்துவ கண்டறிதலுக்கு மாற்று அல்ல',
    chip_pneumonia: '🫁 நிமோனியா அறிகுறிகள்',
    chip_retina:    '👁 விழித்திரை நோய் நிலைகள்',
    chip_melanoma:  '🔬 மெலனோமா ABCDE',
    chip_heart:     '❤️ மாரடைப்பு அறிகுறிகள்',
    chip_mri:       '🧲 MRI எப்படி செயல்படுகிறது',
    chip_bp:        '💊 உயர் ரத்த அழுத்த மருந்துகள்',
    chip_msg_pneumonia: 'நிமோனியாவின் அறிகுறிகள் என்ன? தமிழில் விளக்கவும்.',
    chip_msg_retina:    'நீரிழிவு விழித்திரை நோயின் நிலைகள் என்ன? தமிழில் விளக்கவும்.',
    chip_msg_melanoma:  'ABCDE முறையில் மெலனோமாவை எப்படி கண்டறிவது? தமிழில் சொல்லுங்கள்.',
    chip_msg_heart:     'மாரடைப்பின் ஆரம்ப அறிகுறிகள் என்ன? தமிழில் விளக்கவும்.',
    chip_msg_mri:       'MRI ஸ்கேன் எப்படி செயல்படுகிறது? தமிழில் விளக்கவும்.',
    chip_msg_bp:        'உயர் ரத்த அழுத்தத்திற்கு என்ன மருந்துகள் பயன்படுத்தப்படுகின்றன? தமிழில் சொல்லுங்கள்.',
    welcome_p1:     'வணக்கம்! நான் உங்கள் <strong>PocketScan AI</strong> மருத்துவ ஆலோசகர் — Claude மூலம். <strong>தமிழ், ஆங்கிலம் மற்றும் இந்தி</strong>யில் பதில் சொல்ல முடியும்.',
    welcome_p2:     'அறிகுறிகள், நோய்கள், மருந்துகள், சிகிச்சை திட்டங்கள் — உங்கள் மொழியில் கேளுங்கள்.',
    translated_hindi: 'இந்தி மொழிபெயர்ப்பு',
    translated_tamil: 'தமிழ் மொழிபெயர்ப்பு',
  }
};

/* ── Apply i18n to all data-i18n elements ── */
function applyLang(lang) {
  currentLang = lang;
  const dict = I18N[lang] || I18N.en;
  document.documentElement.setAttribute('data-lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  // Update quick chips
  const chipKeys = ['chip_pneumonia','chip_retina','chip_melanoma','chip_heart','chip_mri','chip_bp'];
  document.querySelectorAll('.qchip').forEach((chip, i) => {
    const k = chip.dataset.key;
    if (dict[k]) chip.textContent = dict[k];
  });

  // Update welcome message
  const wm = $('welcomeMsg');
  if (wm) {
    wm.innerHTML = `<p>${dict.welcome_p1}</p><p style="margin-top:8px">${dict.welcome_p2}</p><time>Just now</time>`;
  }

  // Update lang switcher active state
  document.querySelectorAll('.ls-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.langSwitch === lang);
  });

  // Update nav active
  document.querySelectorAll('.hn-btn').forEach((btn, i) => {
    const keys = ['nav_scanner','nav_history','nav_reports'];
    if (dict[keys[i]]) btn.textContent = dict[keys[i]];
  });
}

/* ── Language switcher buttons ── */
document.querySelectorAll('.ls-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.langSwitch));
});

/* ══════════════════════════════════════════════════
   SPLASH — JS removes it immediately after CSS
   animation (CSS handles the 800ms animation,
   JS removes it from DOM after 1s so it never blocks)
══════════════════════════════════════════════════ */
setTimeout(() => {
  if (splash) {
    splash.style.display = 'none';
    // Trigger dashboard counter animation right after
    animateDashboard();
  }
}, 1050);

/* ══════════════════════════════════════════════════
   FILE UPLOAD
══════════════════════════════════════════════════ */
uploadZone.addEventListener('click', e => {
  if (removeImg.contains(e.target)) return;
  if (!uploadPreview.style.display || uploadPreview.style.display === 'none') fileInput.click();
});
fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });
removeImg.addEventListener('click', e => { e.stopPropagation(); clearFile(); });
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault(); uploadZone.classList.remove('drag-over');
  const f = e.dataTransfer.files[0];
  if (f && f.type.startsWith('image/')) loadFile(f);
});

function loadFile(file) {
  const r = new FileReader();
  r.onload = ev => {
    previewImg.src = ev.target.result;
    uploadInner.style.display   = 'none';
    uploadPreview.style.display = 'flex';
    analyzeBtn.disabled = false;
    resultCard.style.display = 'none';
    currentResult = null;
    stopSpeech();
  };
  r.readAsDataURL(file);
}

function clearFile() {
  previewImg.src = '';
  uploadPreview.style.display = 'none';
  uploadInner.style.display   = 'flex';
  analyzeBtn.disabled = true;
  fileInput.value = '';
  currentResult = null;
  stopSpeech();
  resultCard.style.display  = 'none';
  scanLoading.style.display = 'none';
}

/* ══════════════════════════════════════════════════
   DIAGNOSES DATA (with HI + TA translations)
══════════════════════════════════════════════════ */
const DIAGNOSES = [
  {
    disease:    { en:'Bacterial Pneumonia', hi:'जीवाणु निमोनिया', ta:'பாக்டீரியா நிமோனியா' },
    confidence: 92.4, status:'HIGH RISK', sc:'#f59e0b',
    note:       { en:'Bilateral infiltrates detected in lower lung fields. Immediate clinical correlation and chest CT recommended. Consider broad-spectrum antibiotics pending culture results.',
                  hi:'फेफड़ों के निचले भागों में द्विपक्षीय घुसपैठ पाई गई। तत्काल नैदानिक सहसंबंध और छाती CT अनुशंसित है। कल्चर परिणाम आने तक ब्रॉड-स्पेक्ट्रम एंटीबायोटिक्स पर विचार करें।',
                  ta:'நுரையீரலின் கீழ் பகுதிகளில் இருபுற ஊடுருவல் கண்டறியப்பட்டது. உடனடி மருத்துவ மதிப்பீடு மற்றும் மார்பு CT பரிந்துரைக்கப்படுகிறது.' }
  },
  {
    disease:    { en:'Diabetic Retinopathy', hi:'मधुमेह रेटिनोपैथी', ta:'நீரிழிவு விழித்திரை நோய்' },
    confidence: 88.7, status:'MODERATE RISK', sc:'#f97316',
    note:       { en:'Microaneurysms and soft exudates visible in posterior pole. NPDR Grade II. Ophthalmology referral recommended within 4 weeks.',
                  hi:'पश्च ध्रुव में माइक्रोएन्यूरिज्म और नरम एक्सयूडेट दिखाई दे रहे हैं। NPDR ग्रेड II। 4 सप्ताह के भीतर नेत्र विज्ञान रेफरल अनुशंसित।',
                  ta:'கண்ணின் பின்புற துருவத்தில் மைக்ரோஆனெரிஸம்கள் மற்றும் வெளியேற்றங்கள் தெரிகின்றன. 4 வாரங்களுக்குள் கண் நிபுணரிடம் செல்லவும்.' }
  },
  {
    disease:    { en:'Seborrheic Keratosis', hi:'सेबोरहिक केराटोसिस (सौम्य त्वचा घाव)', ta:'செபோரியிக் கெரட்டோசிஸ் (தோல் புண்)' },
    confidence: 96.1, status:'LOW RISK', sc:'#10b981',
    note:       { en:'Morphological features consistent with benign seborrheic keratosis. No malignant indicators. Annual dermatological check-up recommended.',
                  hi:'रूपात्मक विशेषताएं सौम्य सेबोरहिक केराटोसिस के अनुरूप हैं। कोई कैंसरकारी संकेत नहीं। वार्षिक त्वचा जांच की सलाह।',
                  ta:'வடிவமைப்பு அம்சங்கள் தீங்கற்ற தோல் நோயை உறுதிப்படுத்துகின்றன. தீங்கான அறிகுறிகள் இல்லை. ஆண்டுதோறும் தோல் பரிசோதனை பரிந்துரைக்கப்படுகிறது.' }
  },
  {
    disease:    { en:'Early-Stage Melanoma', hi:'प्रारंभिक मेलानोमा (त्वचा कैंसर)', ta:'ஆரம்ப கட்ட மெலனோமா (தோல் புற்றுநோய்)' },
    confidence: 84.3, status:'CRITICAL', sc:'#f43f5e',
    note:       { en:'Asymmetric pigmentation with irregular borders identified. ABCDE criteria positive. Urgent dermatology biopsy referral required within 48 hours.',
                  hi:'असममित वर्णक और अनियमित सीमाएं पहचानी गई हैं। ABCDE मानदंड सकारात्मक। 48 घंटे के भीतर त्वचा विज्ञान बायोप्सी रेफरल जरूरी।',
                  ta:'சமச்சீரற்ற நிறமிழப்பு மற்றும் ஒழுங்கற்ற விளிம்புகள் கண்டறியப்பட்டுள்ளன. ABCDE அளவுகோல் நேர்மறை. 48 மணி நேரத்திற்குள் தோல் நிபுணரை அவசரமாக சந்திக்கவும்.' }
  },
  {
    disease:    { en:'No Anomaly Detected', hi:'कोई असामान्यता नहीं पाई गई', ta:'எந்த நோயும் கண்டறியப்படவில்லை' },
    confidence: 98.2, status:'CLEAR', sc:'#00f0ff',
    note:       { en:'No pathological findings detected. Tissue density and morphology within normal clinical parameters. Routine follow-up as per clinical guidelines.',
                  hi:'कोई रोग संबंधी निष्कर्ष नहीं पाया गया। ऊतक घनत्व और आकारिकी सामान्य नैदानिक सीमाओं के भीतर है। नियमित अनुवर्ती कार्रवाई करें।',
                  ta:'எந்த நோயியல் கண்டுபிடிப்புகளும் கண்டறியப்படவில்லை. திசு அடர்த்தி மற்றும் வடிவமைப்பு சாதாரண நிலைகளில் உள்ளன. வழக்கமான பின்தொடர்தல் தொடரவும்.' }
  },
];

/* ══════════════════════════════════════════════════
   ANALYSIS
══════════════════════════════════════════════════ */
analyzeBtn.addEventListener('click', () => {
  if (analyzeBtn.disabled) return;
  resultCard.style.display  = 'none';
  scanLoading.style.display = 'flex';
  analyzeBtn.disabled = true;
  stopSpeech();

  setTimeout(() => {
    const r = DIAGNOSES[Math.floor(Math.random() * DIAGNOSES.length)];
    currentResult = r;

    scanLoading.style.display = 'none';
    resultCard.style.display  = 'flex';
    analyzeBtn.disabled = false;

    const lang = currentLang;
    resultDisease.textContent   = r.disease[lang] || r.disease.en;
    resultNote.textContent      = r.note[lang]    || r.note.en;
    resultStatus.textContent    = r.status;
    resultStatus.style.color       = r.sc;
    resultStatus.style.background  = r.sc + '1a';
    resultStatus.style.borderColor = r.sc + '44';

    // Show translated note if non-English
    if (lang !== 'en') {
      translatedNote.style.display = 'block';
      // Show the English version as a "translation" reference
      translatedText.textContent = r.note.en;
      translatedLangLabel.textContent = 'English Reference';
    } else {
      // Show Hindi translation as bonus
      translatedNote.style.display = 'block';
      translatedText.textContent = r.note.hi;
      translatedLangLabel.textContent = I18N[lang].translated_hindi || 'Hindi Translation';
    }

    setTimeout(() => {
      confFill.style.width = r.confidence + '%';
      confVal.textContent  = r.confidence + '%';
    }, 120);

    // AI chat context
    const diseaseName = r.disease.en;
    const noteEn = r.note.en;
    chatHistory.push({ role:'user', content:`[SCAN RESULT] PocketScan AI detected: **${diseaseName}** at **${r.confidence}% confidence**. Status: ${r.status}. Note: ${noteEn}` });

    const replyPrompt = lang === 'hi'
      ? `स्कैन का परिणाम है: ${r.disease.hi} (${r.confidence}% विश्वास, ${r.status})। कृपया इस स्थिति का हिंदी में संक्षिप्त नैदानिक सारांश दें — इसका क्या अर्थ है, रोगी को क्या जानना चाहिए, और अनुशंसित अगले कदम क्या हैं।`
      : lang === 'ta'
      ? `ஸ்கேன் முடிவு: ${r.disease.ta} (${r.confidence}% நம்பிக்கை, ${r.status})। தமிழில் சுருக்கமான மருத்துவ சுருக்கத்தை அளிக்கவும் — இதன் அர்த்தம் என்ன, நோயாளி என்ன தெரிந்துகொள்ள வேண்டும், அடுத்த நடவடிக்கைகள் என்ன என்று விளக்கவும்.`
      : `Scan complete: ${diseaseName} (${r.confidence}% confidence, ${r.status}). Provide a concise clinical summary — what it means, what the patient/doctor should know, and recommended next steps.`;

    setAiTyping(true);
    callClaude(replyPrompt)
      .then(reply => {
        setAiTyping(false);
        chatHistory.push({ role:'assistant', content:reply });
        appendBot(renderMarkdown(reply));
      })
      .catch(() => {
        setAiTyping(false);
        appendBot(`🔬 <strong>${r.disease[lang] || r.disease.en}</strong> — ${r.confidence}% confidence. ${r.note[lang] || r.note.en}`);
      });
  }, 2400 + Math.random() * 1000);
});

/* ══════════════════════════════════════════════════
   CLAUDE API
══════════════════════════════════════════════════ */
const SYSTEM_PROMPT = `You are PocketScan AI's Medical Consultant — a highly knowledgeable, empathetic clinical AI assistant.

CRITICAL: Detect and respond in the SAME language the user writes in.
- If the user writes in Hindi (हिंदी), respond entirely in Hindi.
- If the user writes in Tamil (தமிழ்), respond entirely in Tamil.
- If the user writes in English, respond in English.
- Mix of languages → respond in the dominant language.

Capabilities:
- Deep knowledge of all medical specialties: internal medicine, radiology, pathology, pharmacology, surgery, neurology, oncology, cardiology, dermatology
- Clinical guidelines: WHO, AHA, NICE, ACC
- Diagnostic criteria, differentials, treatment protocols, drug interactions
- Accessible explanations for rural patients (use simple language when needed)

Style rules:
- Use **bold** for diagnoses and drug names
- Use bullet points (- item) for symptom lists
- Use #### headings for sections in long answers
- Always add a brief disclaimer at the end about consulting a physician
- Be warm, direct, and clear — like a trusted local doctor
- Never refuse medical questions`;

async function callClaude(userMsg) {
  const msgs = [...chatHistory];
  if (!msgs.length || msgs[msgs.length-1].role !== 'user') {
    msgs.push({ role:'user', content: userMsg });
  }
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      model:'claude-sonnet-4-20250514',
      max_tokens:1000,
      system:SYSTEM_PROMPT,
      messages:msgs
    })
  });
  if (!resp.ok) { const e = await resp.json().catch(()=>({})); throw new Error(e.error?.message || `API ${resp.status}`); }
  const data = await resp.json();
  return data.content?.map(b=>b.type==='text'?b.text:'').join('') || '';
}

/* ══════════════════════════════════════════════════
   VOICE
══════════════════════════════════════════════════ */
voiceBtn.addEventListener('click', () => {
  if (!currentResult) return;
  if (isSpeaking) { stopSpeech(); return; }
  const lang = langSelect.value;
  const note = currentResult.note;
  const disease = currentResult.disease;
  let text;
  if (lang === 'hi-IN') {
    text = `पॉकेटस्कैन AI ने पाया: ${disease.hi}। विश्वास: ${currentResult.confidence} प्रतिशत। ${note.hi}`;
  } else if (lang === 'ta-IN') {
    text = `PocketScan AI கண்டறிந்தது: ${disease.ta}। நம்பிக்கை: ${currentResult.confidence} சதவீதம்। ${note.ta}`;
  } else {
    text = `PocketScan AI detected ${disease.en} with ${currentResult.confidence} percent confidence. ${note.en}`;
  }
  speak(text, lang);
});

function speak(text, lang) {
  if (!window.speechSynthesis) { alert('Speech synthesis not supported.'); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = 0.88; u.pitch = 1; u.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find(x=>x.lang===lang) || voices.find(x=>x.lang.startsWith(lang.split('-')[0]));
  if (v) u.voice = v;
  u.onstart = () => { isSpeaking=true; voiceBtn.classList.add('speaking'); if(speakLabel) speakLabel.textContent='Stop'; waveform.style.display='flex'; };
  u.onend = u.onerror = resetVoice;
  window.speechSynthesis.speak(u);
}
function stopSpeech() { if(window.speechSynthesis) window.speechSynthesis.cancel(); resetVoice(); }
function resetVoice() {
  isSpeaking=false; voiceBtn.classList.remove('speaking');
  const dict = I18N[currentLang]||I18N.en;
  if(speakLabel) speakLabel.textContent = dict.btn_speak || 'Speak Result';
  waveform.style.display='none';
}
if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged = ()=>window.speechSynthesis.getVoices();

/* ══════════════════════════════════════════════════
   MARKDOWN RENDERER
══════════════════════════════════════════════════ */
function renderMarkdown(text) {
  if (!text) return '';
  let h = text
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,'<em>$1</em>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/^####\s+(.+)$/gm,'<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm,'<h4>$1</h4>')
    .replace(/^---+$/gm,'<hr>')
    .replace(/^[\-\*]\s+(.+)$/gm,'<li>$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm,'<li>$1</li>');
  h = h.replace(/(<li>.*<\/li>\n?)+/gs, m=>`<ul>${m}</ul>`);
  h = h.split(/\n{2,}/).map(b=>{
    b=b.trim(); if(!b) return '';
    if(b.startsWith('<h4>')||b.startsWith('<ul>')||b.startsWith('<hr>')||b.startsWith('<li>')) return b;
    return `<p>${b.replace(/\n/g,'<br>')}</p>`;
  }).join('\n');
  h = h.replace(/<p>(⚠️[^<]+)<\/p>/g,'<div class="md-warn">$1</div>');
  h = h.replace(/<p>((?:Note|Disclaimer|Warning|Important|सूचना|குறிப்பு):.*?)<\/p>/gi,'<div class="md-warn">⚠️ $1</div>');
  return h;
}

/* ══════════════════════════════════════════════════
   CHAT
══════════════════════════════════════════════════ */
const nowStr = () => new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function appendUser(text) {
  const el = document.createElement('div');
  el.className='cmsg user';
  el.innerHTML=`<div class="cmsg-ava user">U</div><div class="cmsg-bub user"><p>${escHtml(text)}</p><time>${nowStr()}</time></div>`;
  chatWindow.appendChild(el); scrollChat();
}

function appendBot(html) {
  const el = document.createElement('div');
  el.className='cmsg bot';
  el.innerHTML=`<div class="cmsg-ava bot"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M4.22 4.22l2.12 2.12m11.32 11.32 2.12 2.12M2 12h3m14 0h3M4.22 19.78l2.12-2.12m11.32-11.32 2.12-2.12"/></svg></div><div class="cmsg-bub bot">${html}<time>${nowStr()}</time></div>`;
  chatWindow.appendChild(el); scrollChat();
}

function appendError(msg) {
  appendBot(`<p style="color:#fca5a5">⚠️ ${escHtml(msg)}</p>`);
}

function setAiTyping(on) {
  isAiTyping=on;
  aiThinking.style.display = on?'flex':'none';
  sendBtn.disabled=on;
  if(on) scrollChat();
}
function scrollChat(){requestAnimationFrame(()=>{chatWindow.scrollTop=chatWindow.scrollHeight;})}

async function sendMessage(rawText) {
  const text=(rawText||chatInput.value).trim();
  if(!text||isAiTyping) return;
  if(quickChips) quickChips.style.display='none';
  chatInput.value=''; updateCharCount();
  appendUser(text);
  chatHistory.push({role:'user',content:text});
  setAiTyping(true);
  try {
    const reply = await callClaude(text);
    chatHistory.push({role:'assistant',content:reply});
    setAiTyping(false);
    appendBot(renderMarkdown(reply));
  } catch(err) {
    setAiTyping(false);
    appendError(`Cannot reach AI: ${err.message}`);
  }
}

sendBtn.addEventListener('click',()=>sendMessage());
chatInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}});

/* Quick chips */
document.querySelectorAll('.qchip').forEach(chip=>{
  chip.addEventListener('click',()=>{
    const key = chip.dataset.key;
    const msgKey = 'chip_msg_' + key.replace('chip_','');
    const dict = I18N[currentLang]||I18N.en;
    const msg = dict[msgKey] || chip.textContent.replace(/^[^\w]*\s*/,'');
    sendMessage(msg);
  });
});

/* Clear chat */
clearChatBtn?.addEventListener('click',()=>{
  const dict=I18N[currentLang]||I18N.en;
  chatHistory=[];
  chatWindow.innerHTML=`<div class="cmsg bot"><div class="cmsg-ava bot"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M4.22 4.22l2.12 2.12m11.32 11.32 2.12 2.12M2 12h3m14 0h3M4.22 19.78l2.12-2.12m11.32-11.32 2.12-2.12"/></svg></div><div class="cmsg-bub bot" id="welcomeMsg"><p>${dict.welcome_p1}</p><p style="margin-top:8px">${dict.welcome_p2}</p><time>${nowStr()}</time></div></div>`;
  if(quickChips) quickChips.style.display='flex';
});

/* Char counter */
function updateCharCount(){
  const len=chatInput.value.length;
  if(charCount){charCount.textContent=`${len}/500`;charCount.className='cib-char'+(len>400?' warn':'')}
}
chatInput.addEventListener('input',updateCharCount);

/* ══════════════════════════════════════════════════
   DASHBOARD COUNTERS
══════════════════════════════════════════════════ */
function animateDashboard() {
  document.querySelectorAll('.mcard').forEach((card,i)=>{
    const target=parseFloat(card.dataset.target);
    const suffix=card.dataset.suffix;
    const isFloat=!Number.isInteger(target);
    const valEl=card.querySelector('.mcard-big');
    const barEl=card.querySelector('.mcard-bar');
    const dur=1800;
    const t0=performance.now()+i*80;
    const tick=t=>{
      if(t<t0){requestAnimationFrame(tick);return}
      const p=Math.min((t-t0)/dur,1);
      const e=1-Math.pow(1-p,3);
      valEl.textContent=isFloat?(target*e).toFixed(1)+suffix:Math.floor(target*e)+suffix;
      if(p<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const pStr=getComputedStyle(barEl).getPropertyValue('--p').trim()||'80%';
    setTimeout(()=>{barEl.style.width=pStr},i*120+200);
  });
}

/* ══════════════════════════════════════════════════
   MISC
══════════════════════════════════════════════════ */
previewImg.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&isSpeaking)stopSpeech();});
document.querySelectorAll('.hn-btn').forEach(btn=>{
  btn.addEventListener('click',function(){
    document.querySelectorAll('.hn-btn').forEach(b=>b.classList.remove('active'));
    this.classList.add('active');
  });
});