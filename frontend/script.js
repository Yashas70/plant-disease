// ---------- DOM references ----------
const fileInput = document.getElementById("leaf-input");
const dropZone = document.getElementById("drop-zone");
const previewImage = document.getElementById("preview-image");
const previewPlaceholder = document.getElementById("preview-placeholder");
const scanOverlayEl = document.getElementById("scan-overlay");

const analyzeBtn = document.getElementById("analyze-btn");
const statusText = document.getElementById("status-text");

const loadingIndicatorEl = document.getElementById("loading-indicator");
const emojiProgressEl = document.getElementById("emoji-progress");
const loadingTextEl = document.getElementById("loading-text");
const loadingSubTextEl = document.getElementById("loading-subtext");

const resultEmptyEl = document.getElementById("result-empty");
const emptyTextEl = document.getElementById("empty-text");

const resultContentEl = document.getElementById("result-content");
const diseaseNameEl = document.getElementById("disease-name");
const modelConfLabelEl = document.getElementById("model-conf-label");
const confidenceValueEl = document.getElementById("confidence-value");
const confidenceBadgeEl = document.getElementById("confidence-badge");
const confidenceExtraEl = document.getElementById("confidence-extra");

const fieldAdvisoryTitleEl = document.getElementById("field-advisory-title");
const fieldAdvisoryEl = document.getElementById("field-advisory");

const chemWarningEl = document.getElementById("chem-warning");

const recommendedTitleEl = document.getElementById("recommended-title");
const pesticideNameEl = document.getElementById("pesticide-name");
const pesticideInfoEl = document.getElementById("pesticide-info");
const pesticideImageEl = document.getElementById("pesticide-image");

const organicBadgeEl = document.getElementById("organic-badge");
const organicBadgeTextEl = document.getElementById("organic-badge-text");
const organicNoteEl = document.getElementById("organic-note");

const resultSectionTitleEl = document.getElementById("result-section-title");
const aiTagLabelEl = document.getElementById("ai-tag-label");

const downloadPdfBtn = document.getElementById("download-pdf");
const downloadPdfLabelEl = document.getElementById("download-pdf-label");

// Keep last prediction for PDF
let lastPrediction = null;

// Emoji state
let emojiTimer = null;

// ---------- LANGUAGE SUPPORT ----------
let currentLanguage = "en";

/**
 * All UI text except disease name.
 * (Pesticide brand names stay in English; "Pesticide:" label is translated)
 */
const UI_TEXT = {
  en: {
    resultTitle: "2. Result & Advice",
    aiTag: "AI RESULT",
    loading: "Analyzing leaf… Please wait",
    loadingSub: "AI detecting disease and confidence level",
    empty: 'Upload a leaf image and click "Analyze Leaf" to see results here.',
    modelConfLabel: "Model confidence:",
    chemWarning:
      "Chemical pesticide – use safety gear and follow local guidelines. Consult your local agricultural expert before spraying.",
    fieldAdvisoryTitle: "Field Advisory",
    fieldAdvisory:
      "This advisory is based on AI prediction. Confirm with your local agricultural officer before using chemicals.",
    recommendedTitle: "Recommended Pesticide",
    organicBadge: "Organic option available",
    pesticideLabelPrefix: "Pesticide: ",
    btnAnalyze: "🔍 Analyze Leaf",
    btnDownload: "📄 Download Farmer Report (English PDF)",
    confLow: "Low confidence – please verify with expert",
    confMed: "Medium confidence",
    confHigh: "High confidence",
    confExtraLow:
      "Model confidence is low. Try a clearer close-up photo of the diseased part from different angles.",
    confExtraMed:
      "Medium confidence. For better accuracy, ensure the diseased area fills most of the image.",
    confExtraHigh: "",
    statusReady: "Image ready. Click Analyze Leaf.",
    statusNone: "No image selected.",
    statusAnalyzing: "Analyzing leaf image, please wait…",
    statusError: "Error analyzing image.",
    statusDone: "Analysis complete ✓",
  },
  hi: {
    resultTitle: "2. परिणाम और सलाह",
    aiTag: "एआई परिणाम",
    loading: "पत्ता विश्लेषण हो रहा है… कृपया प्रतीक्षा करें",
    loadingSub: "एआई रोग और विश्वास स्तर का विश्लेषण कर रहा है",
    empty: 'पत्ते की फोटो अपलोड करें और "Analyze Leaf" पर क्लिक करें, परिणाम यहां दिखेंगे।',
    modelConfLabel: "मॉडल विश्वास स्तर:",
    chemWarning:
      "रासायनिक कीटनाशक का उपयोग करते समय सुरक्षा उपकरण पहनें और स्थानीय निर्देशों का पालन करें। छिड़काव से पहले स्थानीय कृषि विशेषज्ञ से सलाह लें।",
    fieldAdvisoryTitle: "मैदान सलाह",
    fieldAdvisory:
      "यह सलाह एआई अनुमान पर आधारित है। कोई भी रसायन उपयोग करने से पहले अपने स्थानीय कृषि अधिकारी से अवश्य पुष्टि करें।",
    recommendedTitle: "अनुशंसित कीटनाशक",
    organicBadge: "जैविक विकल्प उपलब्ध",
    pesticideLabelPrefix: "कीटनाशक: ",
    btnAnalyze: "🔍 पत्ता विश्लेषण करें",
    btnDownload: "📄 किसान रिपोर्ट डाउनलोड (अंग्रेज़ी PDF)",
    confLow: "कम विश्वास – कृपया विशेषज्ञ से पुष्टि करें",
    confMed: "मध्यम विश्वास",
    confHigh: "उच्च विश्वास",
    confExtraLow:
      "मॉडल का विश्वास स्तर कम है। पत्ते के रोगग्रस्त हिस्से की और साफ़ नज़दीकी फोटो लेकर पुनः प्रयास करें।",
    confExtraMed:
      "विश्वास स्तर मध्यम है। बेहतर सटीकता के लिए फोटो में पत्ते का रोगग्रस्त भाग ज़्यादातर हिस्सा भरे ऐसा रखें।",
    confExtraHigh: "",
    statusReady: "इमेज तैयार है। Analyze Leaf बटन दबाएं।",
    statusNone: "कोई इमेज चयनित नहीं है।",
    statusAnalyzing: "पत्ते की इमेज विश्लेषित हो रही है… कृपया प्रतीक्षा करें।",
    statusError: "इमेज विश्लेषण में त्रुटि।",
    statusDone: "विश्लेषण पूरा ✓",
  },
  kn: {
    resultTitle: "2. ಫಲಿತಾಂಶ ಮತ್ತು ಸಲಹೆ",
    aiTag: "ಎಐ ಫಲಿತಾಂಶ",
    loading: "ಎಲೆ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ… ದಯವಿಟ್ಟು ಕಾಯಿರಿ",
    loadingSub: "ಎಐ ರೋಗ ಮತ್ತು ವಿಶ್ವಾಸ ಮಟ್ಟ ಪರಿಶೀಲಿಸುತ್ತಿದೆ",
    empty: '"Analyze Leaf" ಒತ್ತಲು ಎಲೆಯ ಫೋಟೊ ಅಪ್ಲೋಡ್ ಮಾಡಿ, ಫಲಿತಾಂಶ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.',
    modelConfLabel: "ಮಾದರಿ ವಿಶ್ವಾಸ ಪ್ರಮಾಣ:",
    chemWarning:
      "ರಾಸಾಯನಿಕ ಕೀಟನಾಶಕ ಬಳಿಸುವಾಗ ಸುರಕ್ಷತಾ ಸಾಧನ (ಗ್ಲೌಸ್, ಮಾಸ್ಕ್) ಧರಿಸಿ ಮತ್ತು ಸ್ಥಳೀಯ ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಪಾಲಿಸಿ. ಸಿಂಪಡಣೆಯ ಮೊದಲು ಕೃಷಿ ತಜ್ಞರ ಸಲಹೆ ಪಡೆದುಕೊಳ್ಳಿ.",
    fieldAdvisoryTitle: "ಗದ್ದೆ ಸಲಹೆ",
    fieldAdvisory:
      "ಈ ಸಲಹೆ AI ಅಂದಾಜಿನ ಆಧಾರದ ಮೇಲೆ ಇದೆ. ಯಾವ ರಾಸಾಯನಿಕವನ್ನೂ ಬಳಸದ ಮೊದಲು ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    recommendedTitle: "ಶಿಫಾರಸು ಮಾಡಿದ ಕೀಟನಾಶಕ",
    organicBadge: "ಸಾವಯವ ಆಯ್ಕೆ ಲಭ್ಯ",
    pesticideLabelPrefix: "ಕೀಟನಾಶಕ: ",
    btnAnalyze: "🔍 ಎಲೆ ವಿಶ್ಲೇಷಿಸಿ",
    btnDownload: "📄 ರೈತರಿಗೆ ವರದಿ ಡೌನ್‌ಲೋಡ್ (English PDF)",
    confLow: "ಕಡಿಮೆ ವಿಶ್ವಾಸ – ತಜ್ಞರಿಂದ ದೃಢಪಡಿಸಿ",
    confMed: "ಮಧ್ಯಮ ವಿಶ್ವಾಸ",
    confHigh: "ಹೆಚ್ಚು ವಿಶ್ವಾಸ",
    confExtraLow:
      "ಮಾದರಿಯ ವಿಶ್ವಾಸ ಪ್ರಮಾಣ ಕಡಿಮೆ ಇದೆ. ರೋಗಗಸ್ತ ಭಾಗದ ಹೆಚ್ಚು ಸ್ಪಷ್ಟವಾದ ಸಮೀಪದ ಫೋಟೋ ತೆಗೆದು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    confExtraMed:
      "ವಿಶ್ವಾಸ ಮಟ್ಟ ಮಧ್ಯಮ. ಉತ್ತಮ ನಿಖರತೆಗಾಗಿ ಚಿತ್ರದಲ್ಲಿ ರೋಗಗಸ್ತ ಭಾಗ ಹೆಚ್ಚು ಭಾಗ ಹೊಂದಿರುವಂತೆ ತೆಗೆದುಕೊಳ್ಳಿ.",
    confExtraHigh: "",
    statusReady: "ಇಮೇಜ್ ಸಿದ್ಧವಾಗಿದೆ. Analyze Leaf ಒತ್ತಿ.",
    statusNone: "ಯಾವುದೇ ಇಮೇಜ್ ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ.",
    statusAnalyzing: "ಎಲೆಯ ಇಮೇಜ್ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ… ದಯವಿಟ್ಟು ಕಾಯಿರಿ.",
    statusError: "ಇಮೇಜ್ ವಿಶ್ಲೇಷಣೆಯಲ್ಲಿ ದೋಷ.",
    statusDone: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ ✓",
  },
  te: {
    resultTitle: "2. ఫలితం మరియు సలహా",
    aiTag: "AI ఫలితం",
    loading: "ఆకు విశ్లేషణ జరుగుతోంది… దయచేసి వేచి ఉండండి",
    loadingSub: "AI వ్యాధి మరియు నమ్మక స్థాయిని చూసుతోంది",
    empty: '"Analyze Leaf" పై క్లిక్ చేయడానికి ముందుగా ఆకు ఫోటోను అప్‌లోడ్ చేయండి, ఫలితం ఇక్కడ కనిపిస్తుంది.',
    modelConfLabel: "మోడల్ నమ్మక స్థాయి:",
    chemWarning:
      "రసాయన మందులు ఉపయోగించినప్పుడు రక్షణ పరికరాలు ధరించి స్థానిక మార్గదర్శకాలను పాటించండి. పిచికారీకి ముందు స్థానిక వ్యవసాయ విభాగం అధికారిని సంప్రదించండి.",
    fieldAdvisoryTitle: "క్షేత్ర సలహా",
    fieldAdvisory:
      "ఈ సలహా AI అంచనాపై ఆధారపడింది. ఏ రసాయన మందులు వినియోగించే ముందు మీ స్థానిక వ్యవసాయ అధికారిని సంప్రదించండి.",
    recommendedTitle: "సిఫార్సు చేసిన పురుగు మందు",
    organicBadge: "సేంద్రీయ ఎంపిక అందుబాటులో ఉంది",
    pesticideLabelPrefix: "పురుగు మందు: ",
    btnAnalyze: "🔍 ఆకును విశ్లేషించు",
    btnDownload: "📄 రైతు రిపోర్ట్ డౌన్‌లోడ్ (English PDF)",
    confLow: "తక్కువ నమ్మకం – దయచేసి నిపుణుడిని సంప్రదించండి",
    confMed: "మధ్యస్థ నమ్మకం",
    confHigh: "అధిక నమ్మకం",
    confExtraLow:
      "మోడల్ నమ్మక స్థాయి తక్కువగా ఉంది. వ్యాధి ఉన్న భాగం స్పష్టంగా కనిపించేలా దగ్గరగా ఫోటో తీసి మళ్లీ ప్రయత్నించండి.",
    confExtraMed:
      "నమ్మక స్థాయి మధ్యస్థంగా ఉంది. ఖచ్చితత్వం కోసం వ్యాధి భాగం ఎక్కువగా చిత్తరువులో ఉండేలా తీశారు.",
    confExtraHigh: "",
    statusReady: "చిత్రం సిద్ధంగా ఉంది. Analyze Leaf క్లిక్ చేయండి.",
    statusNone: "ఏ చిత్రం ఎంచుకోలేదు.",
    statusAnalyzing: "ఆకు చిత్రం విశ్లేషణలో ఉంది… దయచేసి వేచి ఉండండి.",
    statusError: "చిత్ర విశ్లేషణలో లోపం.",
    statusDone: "విశ్లేషణ పూర్తి అయింది ✓",
  },
  ta: {
    resultTitle: "2. முடிவு மற்றும் ஆலோசனை",
    aiTag: "ஏஐ முடிவு",
    loading: "இலை பகுப்பாய்வு நடைபெற்று வருகிறது… தயவுசெய்து காத்திருக்கவும்",
    loadingSub: "ஏஐ நோயையும் நம்பிக்கையும் கணக்கிடுகிறது",
    empty: '"Analyze Leaf" என்பதை அழுத்துவதற்கு முன் இலைப்புகைப்படத்தை பதிவேற்றவும், முடிவு இங்கே தோன்றும்.',
    modelConfLabel: "மாதிரியின் நம்பிக்கை அளவு:",
    chemWarning:
      "ரசாயன பூச்சிக்கொல்லிகளைப் பயன்படுத்தும் போது பாதுகாப்பு உபகரணங்களை அணிந்து, உள்ளூர் வழிகாட்டுதல்களைப் பின்பற்றவும். தெளிப்பதற்கு முன் வேளாண் அலுவலரை அணுகவும்.",
    fieldAdvisoryTitle: "பயிர் நில ஆலோசனை",
    fieldAdvisory:
      "இந்த ஆலோசனை செயற்கை நுண்ணறிவு கணிப்பின் அடிப்படையில் உள்ளது. எந்த இரசாயனத்தையும் பயன்படுத்தும் முன் உங்கள் உள்ளூர் வேளாண் அலுவலரிடம் உறுதி செய்து கொள்ளவும்.",
    recommendedTitle: "பரிந்துரைக்கப்பட்ட பூச்சிக்கொல்லி",
    organicBadge: "செயற்கை அல்லாத (ஆர்கானிக்) தேர்வு உள்ளது",
    pesticideLabelPrefix: "பூச்சிக்கொல்லி: ",
    btnAnalyze: "🔍 இலையை பகுப்பாய்வு செய்",
    btnDownload: "📄 விவசாயி அறிக்கை பதிவிறக்கம் (English PDF)",
    confLow: "குறைந்த நம்பிக்கை – நிபுணரிடம் உறுதி செய்யவும்",
    confMed: "மிதமான நம்பிக்கை",
    confHigh: "உயர் நம்பிக்கை",
    confExtraLow:
      "மாதிரியின் நம்பிக்கை அளவு குறைவாக உள்ளது. பாதிக்கப்பட்ட பகுதியின் தெளிவான நெருக்குப்படத்தை எடுத்து மீண்டும் முயற்சிக்கவும்.",
    confExtraMed:
      "நம்பிக்கை அளவு மிதமானது. சிறந்த துல்லியத்திற்காக பாதிப்பு பகுதி அதிகமாக உள்ளபடி புகைப்படம் எடுக்கவும்.",
    confExtraHigh: "",
    statusReady: "படம் தயார். Analyze Leaf பொத்தானை அழுத்தவும்.",
    statusNone: "எந்தப் படமும் தேர்ந்தெடுக்கப்படவில்லை.",
    statusAnalyzing: "இலைப் படம் பகுப்பாய்வு நடைபெறுகிறது… தயவுசெய்து காத்திருக்கவும்.",
    statusError: "படம் பகுப்பாய்வில் பிழை.",
    statusDone: "பகுப்பாய்வு முடிந்தது ✓",
  },
  mr: {
    resultTitle: "2. निकाल आणि सल्ला",
    aiTag: "एआय निकाल",
    loading: "पानाचे विश्लेषण सुरू आहे… कृपया थांबा",
    loadingSub: "एआय रोग आणि विश्वास पातळी तपासत आहे",
    empty: '"Analyze Leaf" क्लिक करण्यापूर्वी पानाचा फोटो अपलोड करा, निकाल येथे दिसेल.',
    modelConfLabel: "मॉडेल विश्वास पातळी:",
    chemWarning:
      "रासायनिक कीटकनाशक वापरताना सुरक्षात्मक उपकरणे वापरा आणि स्थानिक मार्गदर्शक तत्त्वांचे पालन करा. फवारणीपूर्वी स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या.",
    fieldAdvisoryTitle: "शेती सल्ला",
    fieldAdvisory:
      "ही सूचना एआयच्या अंदाजावर आधारित आहे. कोणतेही रसायन वापरण्यापूर्वी आपल्या स्थानिक कृषी अधिकाऱ्याकडून खात्री करून घ्या.",
    recommendedTitle: "शिफारस केलेले कीटकनाशक",
    organicBadge: "सेंद्रिय पर्याय उपलब्ध",
    pesticideLabelPrefix: "कीटकनाशक: ",
    btnAnalyze: "🔍 पान विश्लेषित करा",
    btnDownload: "📄 शेतकरी अहवाल डाउनलोड (English PDF)",
    confLow: "कमी विश्वास – कृपया तज्ज्ञांचा सल्ला घ्या",
    confMed: "मध्यम विश्वास",
    confHigh: "उच्च विश्वास",
    confExtraLow:
      "मॉडेलचा विश्वास स्तर कमी आहे. आजारग्रस्त भागाचा अधिक स्पष्ट नजीकचा फोटो काढून पुन्हा प्रयत्न करा.",
    confExtraMed:
      "विश्वास स्तर मध्यम आहे. अचूकतेसाठी फोटोमध्ये आजारग्रस्त भाग अधिक क्षेत्र व्यापेल याची काळजी घ्या.",
    confExtraHigh: "",
    statusReady: "फोटो तयार आहे. Analyze Leaf वर क्लिक करा.",
    statusNone: "कोणताही फोटो निवडलेला नाही.",
    statusAnalyzing: "पानाचा फोटो विश्लेषित होत आहे… कृपया थांबा.",
    statusError: "फोटो विश्लेषणात त्रुटी.",
    statusDone: "विश्लेषण पूर्ण झाले ✓",
  },
  bn: {
    resultTitle: "2. ফলাফল ও পরামর্শ",
    aiTag: "এআই ফলাফল",
    loading: "পাতা বিশ্লেষণ করা হচ্ছে… অনুগ্রহ করে অপেক্ষা করুন",
    loadingSub: "এআই রোগ ও আত্মবিশ্বাসের মাত্রা যাচাই করছে",
    empty: '"Analyze Leaf" ক্লিক করার আগে পাতার ছবি আপলোড করুন, ফলাফল এখানে দেখা যাবে।',
    modelConfLabel: "মডেলের আত্মবিশ্বাস:",
    chemWarning:
      "রাসায়নিক কীটনাশক ব্যবহার করার সময় সুরক্ষা সরঞ্জাম ব্যবহার করুন এবং স্থানীয় নিয়ম মেনে চলুন। স্প্রে করার আগে স্থানীয় কৃষি কর্মকর্তার পরামর্শ নিন।",
    fieldAdvisoryTitle: "ক্ষেত্র পরামর্শ",
    fieldAdvisory:
      "এই পরামর্শটি এআই-এর পূর্বাভাসের উপর ভিত্তি করে। কোনো রাসায়নিক ব্যবহার করার আগে আপনার স্থানীয় কৃষি কর্মকর্তার সঙ্গে অবশ্যই পরামর্শ করুন।",
    recommendedTitle: "প্রস্তাবিত কীটনাশক",
    organicBadge: "জৈব বিকল্প উপলভ্য",
    pesticideLabelPrefix: "কীটনাশক: ",
    btnAnalyze: "🔍 পাতা বিশ্লেষণ করুন",
    btnDownload: "📄 কৃষক প্রতিবেদন ডাউনলোড (English PDF)",
    confLow: "কম আত্মবিশ্বাস – অনুগ্রহ করে বিশেষজ্ঞের পরামর্শ নিন",
    confMed: "মাঝারি আত্মবিশ্বাস",
    confHigh: "উচ্চ আত্মবিশ্বাস",
    confExtraLow:
      "মডেলের আত্মবিশ্বাসের মাত্রা কম। রোগগ্রস্ত অংশের আরও পরিষ্কার ক্লোজ ফটো তুলে আবার চেষ্টা করুন।",
    confExtraMed:
      "আত্মবিশ্বাসের মাত্রা মাঝারি। ভালো নির্ভুলতার জন্য ছবিতে রোগগ্রস্ত অংশটি বেশিরভাগ অংশ জুড়ে থাকুক।",
    confExtraHigh: "",
    statusReady: "ছবি প্রস্তুত। Analyze Leaf ক্লিক করুন।",
    statusNone: "কোনো ছবি নির্বাচন করা হয়নি।",
    statusAnalyzing: "পাতার ছবি বিশ্লেষণ হচ্ছে… অনুগ্রহ করে অপেক্ষা করুন।",
    statusError: "ছবি বিশ্লেষণে ত্রুটি।",
    statusDone: "বিশ্লেষণ সম্পন্ন ✓",
  },
};

function applyLanguageTexts() {
  const t = UI_TEXT[currentLanguage] || UI_TEXT.en;

  resultSectionTitleEl.textContent = t.resultTitle;
  aiTagLabelEl.textContent = t.aiTag;
  loadingTextEl.textContent = t.loading;
  loadingSubTextEl.textContent = t.loadingSub;
  emptyTextEl.textContent = t.empty;
  modelConfLabelEl.textContent = t.modelConfLabel + " ";
  chemWarningEl.textContent = t.chemWarning;
  fieldAdvisoryTitleEl.textContent = t.fieldAdvisoryTitle;
  fieldAdvisoryEl.textContent = t.fieldAdvisory;
  recommendedTitleEl.textContent = t.recommendedTitle;
  organicBadgeTextEl.textContent = t.organicBadge;
  downloadPdfLabelEl.textContent = t.btnDownload;
  analyzeBtn.textContent = t.btnAnalyze;
}

// language button handlers
document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentLanguage = btn.dataset.lang;
    document
      .querySelectorAll(".lang-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyLanguageTexts();
  });
});

// initial texts
applyLanguageTexts();

// ---------- Preview ----------
function showPreview(file) {
  if (!file) {
    previewImage.style.display = "none";
    previewPlaceholder.style.display = "flex";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewImage.style.display = "block";
    previewPlaceholder.style.display = "none";
  };
  reader.readAsDataURL(file);
}

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  const t = UI_TEXT[currentLanguage] || UI_TEXT.en;
  showPreview(file);
  statusText.textContent = file ? t.statusReady : t.statusNone;
});

// Drag & drop
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  const t = UI_TEXT[currentLanguage] || UI_TEXT.en;

  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0];
    fileInput.files = e.dataTransfer.files;
    showPreview(file);
    statusText.textContent = t.statusReady;
  }
});

// ---------- Loading effects ----------
function startLoadingEffects() {
  const frames = ["🍃📡🔍", "🍃🔍", "🍃🧠"];
  let idx = 0;
  if (emojiProgressEl) {
    emojiProgressEl.textContent = frames[0];
  }
  if (emojiTimer) clearInterval(emojiTimer);
  emojiTimer = setInterval(() => {
    idx = (idx + 1) % frames.length;
    if (emojiProgressEl) {
      emojiProgressEl.textContent = frames[idx];
    }
  }, 500);

  if (scanOverlayEl) {
    scanOverlayEl.classList.add("scan-active");
  }
}

function stopLoadingEffects() {
  if (emojiTimer) {
    clearInterval(emojiTimer);
    emojiTimer = null;
  }
  if (emojiProgressEl) {
    emojiProgressEl.textContent = "🍃";
  }
  if (scanOverlayEl) {
    scanOverlayEl.classList.remove("scan-active");
  }
}

// ---------- Analyze Leaf ----------
async function analyzeLeaf() {
  const file = fileInput.files[0];
  const t = UI_TEXT[currentLanguage] || UI_TEXT.en;

  if (!file) {
    alert("Please choose a leaf image first.");
    return;
  }

  analyzeBtn.disabled = true;
  statusText.textContent = t.statusAnalyzing;

  loadingIndicatorEl.classList.remove("hidden");
  resultContentEl.classList.add("hidden");
  resultEmptyEl.classList.add("hidden");
  startLoadingEffects();

  const formData = new FormData();
  formData.append("leafImage", file);
  formData.append("language", currentLanguage); // informational only

  try {
    const response = await fetch("/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Prediction error:", data);
      alert("Error analyzing image: " + (data.error || "Server error"));
      statusText.textContent = t.statusError;
      return;
    }

    lastPrediction = data;

    resultEmptyEl.classList.add("hidden");
    resultContentEl.classList.remove("hidden");

    // Disease display (ONLY thing kept in English)
    diseaseNameEl.textContent = data.nice_label
      ? data.nice_label
      : data.predicted_label;

    // Confidence
    const conf =
      typeof data.confidence === "number"
        ? data.confidence
        : Number(data.confidence) || 0;
    confidenceValueEl.textContent = conf.toFixed(1) + "%";

    confidenceBadgeEl.classList.remove("conf-low", "conf-med", "conf-high", "hidden");

    if (conf < 40) {
      confidenceBadgeEl.textContent = t.confLow;
      confidenceBadgeEl.classList.add("conf-low");
      confidenceExtraEl.textContent = t.confExtraLow;
    } else if (conf < 70) {
      confidenceBadgeEl.textContent = t.confMed;
      confidenceBadgeEl.classList.add("conf-med");
      confidenceExtraEl.textContent = t.confExtraMed;
    } else {
      confidenceBadgeEl.textContent = t.confHigh;
      confidenceBadgeEl.classList.add("conf-high");
      confidenceExtraEl.textContent = t.confExtraHigh;
    }

    // Field advisory (language-specific)
    fieldAdvisoryEl.textContent = t.fieldAdvisory;

    // ---------- Pesticide info ----------
    let pesticideName = data.pesticide_name;
    let pesticideInfo = data.pesticide_info;

    if (!pesticideName || !pesticideName.trim()) {
      pesticideName = "General Fungicide (Safe Option)";
    }

    if (!pesticideInfo || !pesticideInfo.trim()) {
      pesticideInfo =
        "Dose: 2 g per liter\n" +
        "Interval: Every 10–12 days\n" +
        "Safety: Wear gloves and mask.\n" +
        "Organic: Neem oil 3 ml per liter as preventive spray.";
    }

    // translate label "Pesticide:" but keep brand in English
    pesticideNameEl.textContent = (t.pesticideLabelPrefix || "Pesticide: ") + pesticideName;
    pesticideInfoEl.textContent = pesticideInfo; // still English details (per disease)

    // Pesticide image
    if (data.pesticide_image) {
      pesticideImageEl.src =
        "/static/" + data.pesticide_image.toString().replace(/^\/+/, "");
    } else {
      pesticideImageEl.src = "/static/default_pesticide.png";
    }

    // Organic badge + note (note remains in English short text from backend)
    if (data.organic_option) {
      organicBadgeEl.classList.remove("hidden");
      organicNoteEl.textContent = data.organic_note_en || "";
    } else {
      organicBadgeEl.classList.add("hidden");
      organicNoteEl.textContent = "";
    }

    statusText.textContent = t.statusDone;
  } catch (err) {
    console.error(err);
    alert("Error contacting server. Check console for details.");
    statusText.textContent = t.statusError;
  } finally {
    analyzeBtn.disabled = false;
    loadingIndicatorEl.classList.add("hidden");
    stopLoadingEffects();
    analyzeBtn.textContent = t.btnAnalyze;
  }
}

analyzeBtn.addEventListener("click", analyzeLeaf);

// ---------- PDF Download (English only) ----------
downloadPdfBtn.addEventListener("click", () => {
  if (!lastPrediction) {
    alert("Please analyze a leaf first.");
    return;
  }

  const params = new URLSearchParams({
    label: lastPrediction.predicted_label || "",
    confidence: String(lastPrediction.confidence || ""),
  });

  window.open("/download_report?" + params.toString(), "_blank");
});
