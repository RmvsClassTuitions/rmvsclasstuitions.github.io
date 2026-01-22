let allQuestions = [];

async function loadQuiz() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allQuestions = await response.json();
        
        // START WITH SCIENCE BY DEFAULT
        renderQuiz('science');

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('quiz-container').innerHTML = "<p style='color:red; text-align:center;'>Error loading questions. Please check if questions.json file exists and has correct syntax.</p>";
    }
}

function filterSubject(subject) {
    // 1. Highlight Active Button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase() === subject) {
            btn.classList.add('active');
        }
    });

    // 2. Load Questions
    renderQuiz(subject);
}

function renderQuiz(subject) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ""; 

    // Filter questions based on subject tag
    const filteredQuestions = allQuestions.filter(q => q.subject === subject);

    if(filteredQuestions.length === 0) {
        quizContainer.innerHTML = "<p style='text-align:center; padding:20px; color:#888;'>No questions found for " + subject.toUpperCase() + ". Add them in questions.json</p>";
        document.getElementById('submit-btn').style.display = 'none';
        return;
    }

    document.getElementById('submit-btn').style.display = 'block';

    filteredQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-block');
        questionDiv.id = `q-block-${index}`;
        
        // Chapter Tag
        const chapterTag = `<span style="background:#e9ecef; color:#555; font-size:0.7rem; padding:3px 8px; border-radius:4px; font-weight:bold; margin-bottom:8px; display:inline-block;">${q.chapter ? q.chapter.toUpperCase() : 'GENERAL'}</span>`;

        questionDiv.innerHTML = `
            ${chapterTag}
            <h3>${index + 1}. ${q.question}</h3>
            <div class="options">
                ${q.options.map(option => `
                    <label>
                        <input type="radio" name="question${index}" value="${option}">
                        ${option}
                    </label>
                `).join('')}
            </div>
            <div class="explanation" id="explanation-${index}" style="display:none;">
                <strong>Explanation:</strong> ${q.explanation}
            </div>
        `;
        quizContainer.appendChild(questionDiv);
    });

    document.getElementById('submit-btn').onclick = () => calculateScore(filteredQuestions);
}

function calculateScore(questions) {
    let score = 0;
    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        const explanationDiv = document.getElementById(`explanation-${index}`);
        const block = document.getElementById(`q-block-${index}`);
        explanationDiv.style.display = 'block';

        if (selected && selected.value === q.answer) {
            score++;
            block.style.border = "2px solid #00ff00"; 
            explanationDiv.style.color = "#0077b6";
        } else {
            block.style.border = "2px solid #ff0055"; 
            explanationDiv.style.color = "#d00000";
        }
        document.querySelectorAll(`input[name="question${index}"]`).forEach(i => i.disabled = true);
    });

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<h2>Status Report</h2><p style="font-size:1.2rem">Score: <strong>${score} / ${questions.length}</strong></p><button onclick="location.reload()" style="margin-top:10px; padding:10px 20px; border:none; background:#333; color:#fff; cursor:pointer; border-radius:5px;">Restart</button>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('submit-btn').style.display = 'none';
}
loadQuiz();
