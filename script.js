// --- DATOS DEL JUEGO (MÁXIMO 20 PREGUNTAS) ---
const QUESTIONS = [
    {
        q: "¿Qué autor de literatura gótica es famoso por su enfoque en el horror cósmico y Cthulhu?",
        a: "H.P. Lovecraft",
        options: ["Edgar Allan Poe", "Clive Barker", "Stephen King", "H.P. Lovecraft"],
        exp: "Howard Phillips Lovecraft es el padre del horror cósmico, donde la humanidad es insignificante frente a entidades y verdades cósmicas (como Cthulhu)."
    },
    {
        q: "¿Cuál es el nombre del pueblo maldito por la 'espiral' en la obra de Junji Ito, Uzumaki?",
        a: "Kurouzu-cho",
        options: ["Tomie-cho", "Amigara-cho", "Gyo-cho", "Kurouzu-cho"],
        exp: "Kurouzu-cho es el pueblo ficticio donde la gente se obsesiona y eventualmente se convierte en la forma espiral, el centro de la maldición de Uzumaki."
    },
    {
        q: "¿Qué demonio posee a la niña Regan MacNeil en la película 'El Exorcista'?",
        a: "Pazuzu",
        options: ["Beelzebub", "Asmodeo", "Pazuzu", "Baphomet"],
        exp: "Aunque la película no lo nombra, el demonio en 'El Exorcista' es Pazuzu, una deidad sumeria que es rey de los demonios del viento en la mitología."
    },
    {
        q: "¿Qué escritor de cómics de horror es el creador de 'The Sandman' y 'Hellblazer'?",
        a: "Neil Gaiman",
        options: ["Alan Moore", "Grant Morrison", "Neil Gaiman", "Garth Ennis"],
        exp: "Neil Gaiman es ampliamente reconocido por su trabajo en el género de horror y fantasía oscura, especialmente con su obra magna 'The Sandman'."
    },
    {
        q: "¿En qué novela de Stephen King la familia Torrance pasa el invierno en el Overlook Hotel?",
        a: "El Resplandor (The Shining)",
        options: ["It (Eso)", "Misery", "Carrie", "El Resplandor (The Shining)"],
        exp: "El Resplandor narra el descenso a la locura de Jack Torrance en el aislado y embrujado Overlook Hotel."
    },
    // Faltan 15 preguntas. ¡Añade más sobre cine, manga, comics y literatura de terror!
];

// --- VARIABLES DE ESTADO DEL JUEGO (Mismas del anterior) ---
let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let timer = 30; 
let timerInterval;

const lifelines = {
    '50/50': 3,
    'timer': 2,
    'reveal': 1
};

// --- ELEMENTOS DEL DOM (Mismos elementos, clases actualizadas) ---
const elements = {
    startScreen: document.getElementById('start-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultsScreen: document.getElementById('results-screen'),
    startBtn: document.getElementById('start-quiz-btn'),
    
    questionCounter: document.getElementById('question-counter'),
    scoreDisplay: document.getElementById('score-display'),
    timerDisplay: document.getElementById('timer-display'),
    questionText: document.getElementById('question-text'),
    answerButtons: document.getElementById('answer-buttons'),
    
    lifeline5050: document.getElementById('lifeline-50-50'),
    lifelineTimer: document.getElementById('lifeline-timer'),
    lifelineReveal: document.getElementById('lifeline-reveal'),
    
    feedbackModal: document.getElementById('feedback-modal'),
    feedbackStatus: document.getElementById('feedback-status'),
    correctAnswerText: document.querySelector('#correct-answer-text span'),
    explanationText: document.getElementById('explanation-text'),
    nextQuestionBtn: document.getElementById('next-question-btn'),
    
    finalScore: document.getElementById('final-score'),
    finalTier: document.getElementById('final-tier'),
    restartBtn: document.getElementById('restart-quiz-btn'),
    whatsappBtn: document.getElementById('whatsapp-share-btn')
};

// --- FUNCIONES DEL JUEGO ---

// Reutilizamos startTimer, showQuestion, handleAnswerSelection, updateLifelineDisplay, etc.
// Se incluye el código JS completo del script.js anterior (omito la repetición aquí por brevedad,
// pero se usarían las funciones startTimer, showQuestion, etc. tal como están).

function startTimer() {
    clearInterval(timerInterval);
    timer = 30; // Reset
    elements.timerDisplay.textContent = timer;
    elements.timerDisplay.classList.remove('timer-low');

    timerInterval = setInterval(() => {
        timer--;
        elements.timerDisplay.textContent = timer;
        
        if (timer <= 10) {
            elements.timerDisplay.classList.add('timer-low');
        } else {
            elements.timerDisplay.classList.remove('timer-low'); // Asegura que se quite si se usa +15s
        }

        if (timer <= 0) {
            clearInterval(timerInterval);
            handleAnswerSelection(null, false);
        }
    }, 1000);
}

function showQuestion() {
    if (currentQuestionIndex >= QUESTIONS.length) {
        return showResults();
    }
    
    const qData = QUESTIONS[currentQuestionIndex];
    
    // **Animación de Distorsión/Entrada**
    elements.quizScreen.style.transform = 'skewX(-2deg)';
    setTimeout(() => {
        elements.quizScreen.style.transform = 'skewX(0deg)';
    }, 200);

    elements.questionCounter.textContent = `[ARCHIVOS // ${currentQuestionIndex + 1}/${QUESTIONS.length}]`;
    elements.questionText.textContent = qData.q;
    elements.answerButtons.innerHTML = ''; 

    qData.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('answer-btn');
        button.onclick = () => handleAnswerSelection(option, true);
        elements.answerButtons.appendChild(button);
    });

    startTimer();
}

function handleAnswerSelection(selectedOption, clicked) {
    clearInterval(timerInterval); 
    const qData = QUESTIONS[currentQuestionIndex];
    const isCorrect = selectedOption === qData.a;

    Array.from(elements.answerButtons.children).forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === qData.a) {
            btn.classList.add('correct');
        } else if (clicked && btn.textContent === selectedOption) {
            btn.classList.add('wrong');
        }
    });

    if (isCorrect) {
        score += 10;
        streak++;
        elements.scoreDisplay.textContent = `PUNTOS: ${score}`;
        
        if (streak % 5 === 0 && streak > 0) {
             lifelines['50/50']++;
             updateLifelineDisplay(elements.lifeline5050, '50/50');
             alert(`¡CONOCIMIENTO PROHIBIDO! Racha de ${streak}. Recibes +1 uso de MITAD/MITAD.`);
        }

        showFeedback(true, qData);
    } else {
        streak = 0;
        showFeedback(false, qData);
    }
}

function showFeedback(isCorrect, qData) {
    elements.feedbackModal.classList.remove('hidden');
    
    if (isCorrect) {
        elements.feedbackStatus.textContent = '[ESTADO: MEMORIA RECUPERADA]';
        elements.feedbackStatus.style.color = 'var(--accent-red)';
    } else {
        elements.feedbackStatus.textContent = '[ESTADO: LOCURA INDUCIDA]';
        elements.feedbackStatus.style.color = 'var(--font-color)';
        elements.feedbackStatus.style.textShadow = '0 0 5px var(--font-color)';
    }

    elements.correctAnswerText.textContent = qData.a;
    elements.explanationText.textContent = qData.exp;
}

function nextQuestion() {
    elements.feedbackModal.classList.add('hidden');
    currentQuestionIndex++;
    showQuestion();
}

function updateLifelineDisplay(element, key) {
    element.querySelector('.uses-count').textContent = lifelines[key];
    if (lifelines[key] === 0) {
        element.setAttribute('data-uses', 0);
        element.disabled = true;
    } else {
        element.setAttribute('data-uses', lifelines[key]);
        element.disabled = false;
    }
}

// --- LÓGICA DE AYUDAS (Mismo funcionamiento, solo cambia la clase CSS de desactivación) ---
function handleLifeline5050() {
    if (lifelines['50/50'] <= 0) return;
    
    lifelines['50/50']--;
    updateLifelineDisplay(elements.lifeline5050, '50/50');
    
    const qData = QUESTIONS[currentQuestionIndex];
    const correctAns = qData.a;
    const incorrectOptions = qData.options.filter(opt => opt !== correctAns);
    
    const optionsToEliminate = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    Array.from(elements.answerButtons.children).forEach(btn => {
        if (optionsToEliminate.includes(btn.textContent)) {
            btn.disabled = true;
        }
    });
}

function handleLifelineTimer() {
    if (lifelines['timer'] <= 0) return;
    
    lifelines['timer']--;
    updateLifelineDisplay(elements.lifelineTimer, 'timer');

    timer += 15;
    elements.timerDisplay.classList.remove('timer-low');
}

function handleLifelineReveal() {
    if (lifelines['reveal'] <= 0) return;
    
    lifelines['reveal']--;
    updateLifelineDisplay(elements.lifelineReveal, 'reveal');
    
    const qData = QUESTIONS[currentQuestionIndex];
    
    Array.from(elements.answerButtons.children).forEach(btn => {
        if (btn.textContent === qData.a) {
            btn.style.boxShadow = '0 0 20px var(--accent-red)';
            btn.style.border = '3px solid var(--accent-red)';
        }
    });
    
    elements.lifelineReveal.disabled = true; 
}

// --- PANTALLA DE RESULTADOS Y WHATSAPP (Temas actualizados) ---

function getTier(finalScore) {
    const totalPoints = QUESTIONS.length * 10;
    const percentage = (finalScore / totalPoints) * 100;
    
    if (percentage >= 90) return { tier: "ELDER GOD", color: 'var(--accent-red)' }; // Lovecraft
    if (percentage >= 70) return { tier: "MAESTRO DEL CÓMIC MALDITO", color: 'var(--font-color)' }; // Junji Ito/Gaiman
    if (percentage >= 50) return { tier: "INVESTIGADOR OCULTO", color: '#FF7F50' }; // Halloween/Pulp
    return { tier: "VÍCTIMA INOCENTE", color: '#AAAAAA' }; // Gutterpunk/Novato
}

function showResults() {
    elements.quizScreen.classList.remove('active');
    elements.quizScreen.classList.add('hidden');
    elements.resultsScreen.classList.remove('hidden');
    elements.resultsScreen.classList.add('active');

    const result = getTier(score);
    
    elements.finalScore.textContent = score;
    elements.finalTier.textContent = result.tier;
    elements.finalTier.style.color = result.color;
    elements.finalTier.style.textShadow = `0 0 10px ${result.color}`;
}

function sendWhatsAppResult() {
    const TEACHER_PHONE = '5493816490060'; 
    const result = getTier(score);

    const message = `¡Informe de Pesadilla!
Docente, he completado el Test de Terror.

Puntuación de Estabilidad Mental: ${score}
Mi Rango Cósmico: ${result.tier}

El horror me ha marcado.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${TEACHER_PHONE}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}

// --- INICIO DEL JUEGO / RESET ---
function initializeGame() {
    currentQuestionIndex = 0;
    score = 0;
    streak = 0;
    timer = 30;
    lifelines['50/50'] = 3;
    lifelines['timer'] = 2;
    lifelines['reveal'] = 1;

    elements.scoreDisplay.textContent = 'PUNTOS: 0';
    elements.timerDisplay.textContent = '00';
    clearInterval(timerInterval);

    // Actualizar displays de ayudas
    updateLifelineDisplay(elements.lifeline5050, '50/50');
    updateLifelineDisplay(elements.lifelineTimer, 'timer');
    updateLifelineDisplay(elements.lifelineReveal, 'reveal');
    elements.lifelineReveal.style.boxShadow = 'none';

    // Transición de pantallas
    elements.resultsScreen.classList.remove('active');
    elements.resultsScreen.classList.add('hidden');
    elements.quizScreen.classList.remove('active');
    elements.quizScreen.classList.add('hidden');
    elements.startScreen.classList.remove('hidden');
    elements.startScreen.classList.add('active');
}

// --- LISTENERS DE EVENTOS ---

elements.startBtn.addEventListener('click', () => {
    // Implementa la animación de salida brusca del CSS
    elements.startScreen.style.transform = 'skewX(5deg) translateX(-100%)'; 
    elements.startScreen.style.opacity = '0';
    
    setTimeout(() => {
        elements.startScreen.classList.remove('active');
        elements.startScreen.classList.add('hidden');
        elements.quizScreen.classList.remove('hidden');
        elements.quizScreen.classList.add('active');
        showQuestion();
    }, 500);
});

elements.nextQuestionBtn.addEventListener('click', nextQuestion);
elements.lifeline5050.addEventListener('click', handleLifeline5050);
elements.lifelineTimer.addEventListener('click', handleLifelineTimer);
elements.lifelineReveal.addEventListener('click', handleLifelineReveal);
elements.restartBtn.addEventListener('click', initializeGame);
elements.whatsappBtn.addEventListener('click', sendWhatsAppResult);


document.addEventListener('DOMContentLoaded', initializeGame);

