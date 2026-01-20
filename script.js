async function loadQuiz() {
    try {
        const response = await fetch('questions.json');
        const questions = await response.json();
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = ""; 

        questions.forEach((q, index) => {
            const imageHTML = q.image ? `<img src="${q.image}" class="quiz-image">` : '';
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-block');
            questionDiv.id = `q-block-${index}`;
            
            questionDiv.innerHTML = `
                <h3>${index + 1}. ${q.question}</h3>
                ${imageHTML}
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

        document.getElementById('submit-btn').onclick = () => calculateScore(questions);
    } catch (error) {
        document.getElementById('quiz-container').innerHTML = "<p style='color:red'>Error loading questions. Check JSON file.</p>";
    }
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
            explanationDiv.style.color = "#fff";
        } else {
            block.style.border = "2px solid #ff0055"; 
            explanationDiv.style.color = "#fff";
        }
        document.querySelectorAll(`input[name="question${index}"]`).forEach(i => i.disabled = true);
    });

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<h2>Status Report</h2><p style="font-size:1.2rem">Accuracy: <strong>${score} / ${questions.length}</strong></p><button onclick="location.reload()" style="margin-top:10px">Re-Initialize</button>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('submit-btn').style.display = 'none';
}
loadQuiz();
