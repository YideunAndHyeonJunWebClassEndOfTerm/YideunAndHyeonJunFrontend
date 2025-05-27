class RecommendationApp {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });
    }

    setupEventListeners() {
        const btn = document.getElementById('getRecommendation');
        btn.addEventListener('click', () => {
            this.handleRecommendationRequest();
        });

        document.getElementById('apiKey').addEventListener('change', (e) => {
            window.apiService.setApiKey(e.target.value);
        });

        document.getElementById('useMockAPI').addEventListener('change', (e) => {
            window.apiService.useMockAPI = e.target.checked;
            console.log('Mock API 모드:', e.target.checked ? '활성화' : '비활성화');
            
            const apiKeyInput = document.getElementById('apiKey');
            apiKeyInput.disabled = e.target.checked;
            if (e.target.checked) {
                apiKeyInput.placeholder = 'Mock 모드에서는 API 키가 필요하지 않습니다';
            } else {
                apiKeyInput.placeholder = 'sk-...';
            }
        });
    }

    async handleRecommendationRequest() {
        try {
            console.log('추천 요청 시작');
            const userInput = window.uiComponents.getUserInput();
            console.log('사용자 입력:', userInput);
            
            const validationError = window.uiComponents.validateInput(userInput);
            if (validationError) {
                console.error('입력 검증 오류:', validationError);
                alert(validationError);
                return;
            }

            if (!window.dataManager.curriculum) {
                console.error('교육과정 데이터가 로드되지 않았습니다');
                alert('교육과정 데이터를 로딩 중입니다. 잠시 후 다시 시도해주세요.');
                return;
            }

            console.log('API 키 설정 중');
            window.apiService.setApiKey(userInput.apiKey);
            window.uiComponents.showLoading();

            const completedCourses = window.dataManager.getCompletedCourses();
            console.log('수강 완료 과목:', completedCourses);
            
            const userData = {
                grade: userInput.grade,
                interests: userInput.interests,
                completedCourses: completedCourses,
                curriculum: window.dataManager.curriculum
            };

            console.log('최종 사용자 데이터:', userData);

            const recommendation = await window.apiService.getRecommendation(userData);
            console.log('추천 결과:', recommendation);
            window.uiComponents.displayRecommendation(recommendation);

        } catch (error) {
            console.error('추천 요청 전체 오류:', error);
            console.error('오류 스택:', error.stack);
            window.uiComponents.showError(error.message);
        }
    }
}

new RecommendationApp(); 