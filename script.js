// ========== CURSOR GLOW ==========
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== MOBILE NAV ==========
function openMobileNav() {
    document.getElementById('mobileNav').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
    document.getElementById('mobileNav').classList.remove('open');
    document.body.style.overflow = '';
}

// ========== HERO CANVAS (Particles) ==========
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: 0, y: 0 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            const force = (120 - dist) / 120;
            this.x += (dx / dist) * force * 2;
            this.y += (dy / dist) * force * 2;
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 180, 216, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 180, 216, ${0.08 * (1 - dist / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ========== SCROLL REVEAL ==========
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ========== COUNTER ANIMATION ==========
function animateCounters() {
    const counters = document.querySelectorAll('[data-target]');
    counters.forEach(counter => {
        if (counter.dataset.animated) return;

        const rect = counter.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            counter.dataset.animated = 'true';
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const start = performance.now();

            function updateCounter(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            requestAnimationFrame(updateCounter);
        }
    });
}

window.addEventListener('scroll', animateCounters);
animateCounters();

// ========== QUIZ ==========
const quizData = [
    {
        question: "Qual tecnologia utiliza satélites e GPS para aplicar insumos de forma diferenciada em cada área da lavoura?",
        options: ["Biotecnologia", "Agricultura de Precisão", "Robótica Avançada", "Processamento de Imagens"],
        correct: 1,
        explanation: "A Agricultura de Precisão utiliza GPS, sensores e sistemas de informação geográfica para gerenciar a variabilidade espacial e temporal dos campos, aplicando insumos apenas onde e quando necessário."
    },
    {
        question: "O que significa IoT no contexto agrícola?",
        options: ["Integração de Organismos Transgênicos", "Internet of Things (Internet das Coisas)", "Índice de Oxidação do Solo", "Instrumentação Óptica de Terreno"],
        correct: 1,
        explanation: "IoT (Internet das Coisas) refere-se à rede de sensores e dispositivos conectados à internet que monitoram condições do solo, clima e plantações em tempo real."
    },
    {
        question: "Qual dessas é uma vantagem do uso de drones na agricultura?",
        options: ["Aumento do uso de água", "Maior tempo de colheita", "Mapeamento rápido e detecção de pragas", "Substituição total do trabalhador rural"],
        correct: 2,
        explanation: "Drones permitem mapear grandes áreas em minutos, identificar pragas, doenças e deficiências nutricionais através de câmeras multiespectrais, além de aplicar defensivos de forma pontual."
    },
    {
        question: "A inteligência artificial no agro pode ser usada para:",
        options: ["Substituir toda a mão de obra", "Prever safras e detectar doenças em plantas", "Eliminar a necessidade de fertilizantes", "Reduzir o tamanho das plantas"],
        correct: 1,
        explanation: "IA analisa grandes volumes de dados (clima, solo, imagens de satélite) para prever produtividade, identificar doenças precocemente e recomendar ações otimizadas para o produtor."
    },
    {
        question: "Qual país é líder mundial em tecnologia agrícola e serve de referência para o Brasil?",
        options: ["Índia", "Estados Unidos", "Japão", "Alemanha"],
        correct: 1,
        explanation: "Os Estados Unidos são pioneiros em agricultura de precisão e tecnologia agro, mas o Brasil vem se destacando cada vez mais, sendo líder em algumas áreas como biotecnologia tropical e agricultura digital."
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function initQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    document.getElementById('quizResult').classList.remove('show');
    document.getElementById('quizContent').style.display = 'block';
    renderProgress();
    renderQuestion();
}

function renderProgress() {
    const container = document.getElementById('quizProgress');
    container.innerHTML = '';
    quizData.forEach((_, i) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        if (i < currentQuestion) bar.classList.add('done');
        if (i === currentQuestion) bar.classList.add('active');
        container.appendChild(bar);
    });
}

function renderQuestion() {
    const q = quizData[currentQuestion];
    answered = false;
    document.getElementById('quizQuestion').textContent = `${currentQuestion + 1}. ${q.question}`;
    document.getElementById('quizFeedback').className = 'quiz-feedback';
    document.getElementById('quizFeedback').style.display = 'none';
    document.getElementById('quizNext').classList.remove('show');

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerHTML = `<span class="option-letter">${letters[i]}</span>${opt}`;
        btn.addEventListener('click', () => selectAnswer(i, btn));
        optionsContainer.appendChild(btn);
    });
}

function selectAnswer(index, btn) {
    if (answered) return;
    answered = true;

    const q = quizData[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(o => o.classList.add('disabled'));

    const feedback = document.getElementById('quizFeedback');

    if (index === q.correct) {
        btn.classList.add('correct');
        score++;
        feedback.className = 'quiz-feedback correct-fb show';
        feedback.innerHTML = `<strong>✓ Correto!</strong> ${q.explanation}`;
    } else {
        btn.classList.add('wrong');
        options[q.correct].classList.add('correct');
        feedback.className = 'quiz-feedback wrong-fb show';
        feedback.innerHTML = `<strong>✗ Incorreto.</strong> ${q.explanation}`;
    }

    if (currentQuestion < quizData.length - 1) {
        document.getElementById('quizNext').classList.add('show');
    } else {
        setTimeout(showResult, 1500);
    }
}

function nextQuestion() {
    currentQuestion++;
    renderProgress();
    renderQuestion();
}

function showResult() {
    document.getElementById('quizContent').style.display = 'none';
    const result = document.getElementById('quizResult');
    result.classList.add('show');
    document.getElementById('scoreNum').textContent = score;
    document.getElementById('scoreTotal').textContent = `/ ${quizData.length}`;

    const percent = (score / quizData.length) * 100;
    let title, text;
    if (percent === 100) {
        title = "Perfeito! 🎉";
        text = "Você é um expert em tecnologia no agro! Parabéns!";
    } else if (percent >= 60) {
        title = "Muito Bem! 👏";
        text = "Você tem um ótimo conhecimento sobre agro tecnologia.";
    } else {
        title = "Continue Aprendendo! 📚";
        text = "Revise o conteúdo e tente novamente para melhorar seu score!";
    }
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultText').textContent = text;

    showToast(`Você acertou ${score} de ${quizData.length} perguntas!`);
}

function restartQuiz() {
    initQuiz();
}

initQuiz();

// ========== TOAST ==========
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.innerHTML = `<iconify-icon icon="lucide:check-circle" style="font-size:20px;"></iconify-icon>${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.4s forwards';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ========== PARTICLE BURST ON CLICK ==========
document.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
        particle.style.setProperty('--ty', (Math.random() - 0.5) * 100 + 'px');
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 3000);
    }
});

// ========== SMOOTH SCROLL FOR ANCHORS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== TILT EFFECT ON CARDS ==========
document.querySelectorAll('.tech-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});