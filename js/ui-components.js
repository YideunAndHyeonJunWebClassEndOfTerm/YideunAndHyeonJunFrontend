class UIComponents {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadSavedApiKey();
        });
    }

    loadSavedApiKey() {
        const savedKey = localStorage.getItem('chatgpt_api_key');
        if (savedKey) {
            document.getElementById('apiKey').value = savedKey;
        }
    }

    showLoading() {
        document.getElementById('resultSection').style.display = 'block';
        document.getElementById('loadingSpinner').style.display = 'block';
        document.getElementById('recommendationResult').innerHTML = '';
        
        document.getElementById('resultSection').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    showError(message) {
        this.hideLoading();
        document.getElementById('recommendationResult').innerHTML = `
            <div style="color: #e53e3e; text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }

    displayRecommendation(recommendation) {
        this.hideLoading();
        
        const formattedRecommendation = this.formatRecommendation(recommendation);
        
        document.getElementById('recommendationResult').innerHTML = formattedRecommendation;
    }

    formatRecommendation(text) {
        const lines = text.split('\n');
        let formattedHtml = '';
        let currentCourse = '';

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('**강의명**:')) {
                if (currentCourse) {
                    formattedHtml += '</div>';
                }
                currentCourse = line.replace('**강의명**:', '').trim();
                formattedHtml += `
                    <div class="course-item">
                        <div class="course-title">${currentCourse}</div>
                `;
            } else if (line.startsWith('**추천 이유**:')) {
                const reason = line.replace('**추천 이유**:', '').trim();
                formattedHtml += `<div class="course-reason">${reason}</div>`;
            } else if (line.startsWith('**선수과목**:')) {
                const prereq = line.replace('**선수과목**:', '').trim();
                formattedHtml += `<div class="course-description"><strong>선수과목:</strong> ${prereq}</div>`;
            } else if (line.startsWith('**난이도**:')) {
                const difficulty = line.replace('**난이도**:', '').trim();
                formattedHtml += `<div class="course-description"><strong>난이도:</strong> ${difficulty}</div>`;
            } else if (line && !line.startsWith('**')) {
                formattedHtml += `<div class="course-description">${line}</div>`;
            }
        });

        if (currentCourse) {
            formattedHtml += '</div>';
        }

        return formattedHtml || `<div class="course-description">${text}</div>`;
    }

    getUserInput() {
        const grade = document.getElementById('currentGrade').value;
        const apiKey = document.getElementById('apiKey').value;
        
        const interests = Array.from(
            document.querySelectorAll('#interestAreas input:checked')
        ).map(cb => cb.value);

        return { grade, interests, apiKey };
    }

    validateInput(input) {
        if (!input.grade) return '학년을 선택해주세요.';
        if (input.interests.length === 0) return '관심 분야를 하나 이상 선택해주세요.';
        
        const useMockAPI = document.getElementById('useMockAPI').checked;
        if (!useMockAPI && !input.apiKey) return 'ChatGPT API 키를 입력해주세요.';
        
        return null;
    }
}

window.uiComponents = new UIComponents(); 