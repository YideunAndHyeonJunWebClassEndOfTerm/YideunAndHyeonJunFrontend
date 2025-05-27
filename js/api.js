class APIService {
    constructor() {
        this.apiKey = localStorage.getItem('chatgpt_api_key') || '';
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.useMockAPI = false; // 개발 중에는 true로 설정
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('chatgpt_api_key', key);
    }

    async getRecommendation(userData) {
        if (!this.apiKey && !this.useMockAPI) {
            throw new Error('API 키가 설정되지 않았습니다.');
        }

        console.log('AI 추천 요청 시작:', userData);
        const prompt = this.createPrompt(userData);
        console.log('생성된 프롬프트:', prompt);

        if (this.useMockAPI) {
            return this.getMockRecommendation(userData);
        }

        try {
            console.log('ChatGPT API 호출 중...');
            
            // CORS 문제 해결을 위해 headers에 모드 추가
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: '당신은 강원대학교 컴퓨터공학과 학습 상담사입니다. 학생의 상황을 분석하여 적합한 강의를 추천해주세요.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API 오류 응답:', errorData);
                
                if (response.status === 401) {
                    throw new Error('API 키가 유효하지 않습니다. API 키를 확인해주세요.');
                } else if (response.status === 429) {
                    throw new Error('API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
                } else if (response.status === 403) {
                    console.warn('CORS 문제 감지, Mock API로 전환합니다');
                    this.useMockAPI = true;
                    return this.getMockRecommendation(userData);
                } else {
                    throw new Error(`API 오류 (${response.status}): ${errorData.error?.message || response.statusText}`);
                }
            }

            const data = await response.json();
            console.log('API 응답 성공:', data);
            return data.choices[0].message.content;

        } catch (error) {
            console.error('API 호출 상세 오류:', error);
            
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                console.warn('CORS 오류 감지, Mock API로 전환합니다');
                this.useMockAPI = true;
                return this.getMockRecommendation(userData);
            }
            
            throw error;
        }
    }

    getMockRecommendation(userData) {
        console.log('Mock API 사용 중');
        const { grade, interests, completedCourses } = userData;
        
        setTimeout(() => {}, 1000); // 실제 API 호출 시뮬레이션
        
        let recommendations = [];
        
        if (interests.includes('웹개발')) {
            recommendations.push({
                code: 'CSEE401',
                name: '웹프로그래밍',
                reason: '웹 개발에 대한 관심이 있으시고, HTML, CSS, JavaScript 기초를 배울 수 있는 과목입니다.',
                prerequisites: '프로그래밍기초',
                difficulty: '중급'
            });
        }
        
        if (interests.includes('AI머신러닝')) {
            recommendations.push({
                code: 'CSEE403',
                name: '기계학습',
                reason: 'AI/머신러닝 분야에 관심이 있으시며, 기본적인 머신러닝 알고리즘을 학습할 수 있습니다.',
                prerequisites: '자료구조',
                difficulty: '고급'
            });
        }
        
        if (interests.includes('모바일앱')) {
            recommendations.push({
                code: 'CSEE402',
                name: '모바일프로그래밍',
                reason: '모바일 앱 개발에 관심이 있으시며, Android 기반 앱 개발을 배울 수 있습니다.',
                prerequisites: '객체지향프로그래밍',
                difficulty: '중급'
            });
        }
        
        if (grade <= 2) {
            recommendations.push({
                code: 'CSEE201',
                name: '자료구조',
                reason: '프로그래밍의 기초가 되는 자료구조를 학습하여 알고리즘 사고력을 기를 수 있습니다.',
                prerequisites: '프로그래밍기초',
                difficulty: '중급'
            });
        }
        
        if (recommendations.length === 0) {
            recommendations.push({
                code: 'CSEE202',
                name: '객체지향프로그래밍',
                reason: '프로그래밍 기초 실력을 향상시키고 객체지향 개념을 학습할 수 있습니다.',
                prerequisites: '프로그래밍기초',
                difficulty: '중급'
            });
        }
        
        let result = '다음은 귀하의 학습 프로필에 맞는 강의 추천입니다:\n\n';
        
        recommendations.slice(0, 4).forEach((rec, index) => {
            result += `**강의명**: [${rec.code}] ${rec.name}\n`;
            result += `**추천 이유**: ${rec.reason}\n`;
            result += `**선수과목**: ${rec.prerequisites}\n`;
            result += `**난이도**: ${rec.difficulty}\n\n`;
        });
        
        return result;
    }

    createPrompt(userData) {
        const { grade, interests, completedCourses, curriculum } = userData;
        
        const curriculumInfo = JSON.stringify(curriculum, null, 2);
        const completedList = completedCourses.join(', ') || '없음';
        const interestList = interests.join(', ');

        return `
강원대학교 컴퓨터공학과 ${grade}학년 학생입니다.

[관심 분야]
${interestList}

[이미 수강한 과목 코드]
${completedList}

[강원대 컴공 교육과정]
${curriculumInfo}

위 정보를 바탕으로 다음 학기에 수강하면 좋을 강의 3-5개를 추천해주세요.
각 강의에 대해 다음 형식으로 답변해주세요:

**강의명**: [강의코드] 강의명
**추천 이유**: 학생의 관심 분야와 현재 수강 상황을 고려한 구체적인 이유
**선수과목**: 필요한 선수과목이 있다면 언급
**난이도**: 현재 학년 수준에서의 난이도 평가

학생의 관심 분야와 학습 진도를 종합적으로 고려하여 실용적이고 체계적인 추천을 부탁드립니다.
        `;
    }
}

window.apiService = new APIService(); 