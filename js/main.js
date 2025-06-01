const ALL_SPECIALTIES = Array.from(new Set(professorsData.flatMap(p => p.specialties)));

const INTEREST_CATEGORIES = {
    '하드웨어': [
        { category: '전자공학' },
        { category: '컴퓨터 구조론' },
        { category: '신호 처리 및 제어' },
        { category: '임베디드 컴퓨팅 / 마이크로프로세서(CPU)' },
        { category: '컴퓨터 하드웨어 응용' }
    ],
    '소프트웨어': [
        { category: '운영체제' },
        { category: '데이터베이스' },
        { category: '통신 및 컴퓨터 네트워크' },
        { category: '클라우드' },
        { category: '정보보안' },
        { category: '암호학' },
        { category: '인공지능, 신경과학' },
        { category: '자연어 처리' },
        { category: 'HCI (인간-컴퓨터 상호작용)' }
    ]
};

const CATEGORY_TO_SPECIALTIES = {
    '전자공학': ALL_SPECIALTIES.filter(s => ['임베디드시스템', '임베디드소프트웨어', 'IoT시스템', '센서네트워크', '센서데이터분석', '멀티미디어시스템'].includes(s)),
    '컴퓨터 구조론': ALL_SPECIALTIES.filter(s => ['컴퓨터아키텍처', '병렬처리', '하드웨어보안'].includes(s)),
    '신호 처리 및 제어': ALL_SPECIALTIES.filter(s => ['센서네트워크', '센서데이터분석'].includes(s)),
    '임베디드 컴퓨팅 / 마이크로프로세서(CPU)': ALL_SPECIALTIES.filter(s => ['임베디드시스템', '임베디드소프트웨어', '임베디드AI'].includes(s)),
    '컴퓨터 하드웨어 응용': ALL_SPECIALTIES.filter(s => ['IoT시스템', '멀티미디어시스템'].includes(s)),
    '운영체제': ALL_SPECIALTIES.filter(s => ['운영체제', '시스템소프트웨어', '프로그래밍언어'].includes(s)),
    '데이터베이스': ALL_SPECIALTIES.filter(s => ['데이터베이스', '빅데이터', '데이터마이닝', '데이터베이스시스템', '데이터사이언스', '빅데이터처리', '데이터분석', '빅데이터분석'].includes(s)),
    '통신 및 컴퓨터 네트워크': ALL_SPECIALTIES.filter(s => ['컴퓨터네트워크', '네트워크보안', '네트워크트래픽분석', 'M2M통신', '모바일컴퓨팅', '미래인터넷아키텍처', '머신러닝네트워킹', '이동통신', '통신프로토콜'].includes(s)),
    '클라우드': ALL_SPECIALTIES.filter(s => ['클라우드컴퓨팅', '클라우드시스템', '분산처리', '분산데이터베이스'].includes(s)),
    '정보보안': ALL_SPECIALTIES.filter(s => ['사이버보안', '시스템보안', '이상행위탐지', 'IoT보안', '개인정보보호', 'CPS보안', '센서보안'].includes(s)),
    '암호학': ALL_SPECIALTIES.filter(s => ['암호학', '양자컴퓨팅'].includes(s)),
    '인공지능, 신경과학': ALL_SPECIALTIES.filter(s => ['인공지능', '딥러닝', '기계학습', '머신러닝', '패턴인식', '의료AI', '헬스케어AI', '디지털헬스', '컴퓨터비전', '의료영상분석', '생물정보학', '바이오데이터분석', '의료빅데이터', '의료정보표준', '헬스케어정보학', '영상처리'].includes(s)),
    '자연어 처리': ALL_SPECIALTIES.filter(s => ['자연어처리', '자연언어처리', '텍스트마이닝', '정보검색'].includes(s)),
    'HCI (인간-컴퓨터 상호작용)': ALL_SPECIALTIES.filter(s => ['HCI', '인간AI상호작용', '인간컴퓨터상호작용', '소프트웨어공학', '인간공학', '가상현실', '가상증강현실', '3D인터페이스', '컴퓨터그래픽스', '수치최적화', '학습분석'].includes(s)),
};

$(document).ready(function() {
    initializeTabs();
    renderFixedInterestAreas();
    loadAllProfessors();
    loadSearchHistory();
    loadSavedApiKey();
    
    $('#getRecommendation').click(function() {
        const selectedFields = getSelectedFields();
        
        if (selectedFields.length === 0) {
            alert('관심 분야를 최소 1개 이상 선택해주세요.');
            return;
        }
        
        showLoadingState();
        
        setTimeout(() => {
            const recommendedProfessors = getRecommendedProfessors(selectedFields);
            displayProfessors(recommendedProfessors);
            saveSearchHistory(selectedFields, recommendedProfessors);
        }, 1500);
    });
    
    $('#clearApiKey').click(function() {
        CONFIG.clearApiKey();
        $('#apiKey').val('');
        alert('API 키가 삭제되었습니다.');
    });
    
    $('#apiKey').on('blur', function() {
        const apiKey = $(this).val().trim();
        if (apiKey) {
            CONFIG.setApiKey(apiKey);
        }
    });

    $(document).on('click', '.history-item', function() {
        const index = $(this).data('index');
        rerunSearchFromHistory(index);
    });

    $(document).on('click', '.delete-history-btn', function(event) {
        event.stopPropagation();
        const index = $(this).closest('.history-item').data('index');
        deleteSearchHistoryItem(index);
    });
});

function initializeTabs() {
    $('.tab-btn').click(function() {
        const targetTab = $(this).data('tab');
        
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        
        $('.tab-content').removeClass('active');
        $(`#${targetTab}-tab`).addClass('active');
    });
}


function getSelectedFields() {
    const selectedFields = [];
    $('.checkbox-item input[type="checkbox"]:checked').each(function() {
        selectedFields.push($(this).val());
    });
    return selectedFields;
}

async function showLoadingState(skipAnimation = false) {
    if (!skipAnimation) {
        $('#userForm').fadeOut(600, function() {
            $('#resultSection').fadeIn(600);
        });
    }
    
    $('#professorList').html('');
    $('#loadingSpinner').show();
    $('#professorList').show();
}

function displayProfessors(professors) {
    $('#loadingSpinner').hide();
    
    if (professors.length === 0) {
        $('#professorList').html(`
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3>조건에 맞는 교수님을 찾을 수 없습니다</h3>
                <p>다른 분야를 선택해보세요.</p>
                <button id="resetForm" class="btn-secondary" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-redo"></i> 다시 선택하기
                </button>
            </div>
        `);
    } else {
        const resetButton = `
            <div style="text-align: center; margin-bottom: 20px;">
                <button id="resetForm" class="btn-secondary" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-redo"></i> 다시 선택하기
                </button>
            </div>
        `;
        
        const apiKey = CONFIG.getApiKey();
        let aiStatusMessage = '';
        
        if (!apiKey) {
            aiStatusMessage = `
                <div class="ai-status-message" style="text-align: center; margin-bottom: 20px; padding: 10px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; color: #856404;">
                    <i class="fas fa-exclamation-triangle" style="color: #f39c12;"></i> 
                    <strong>AI 소개 기능이 비활성화되었습니다.</strong> API 키를 입력하면 교수님별 맞춤 소개를 볼 수 있습니다.
                </div>
            `;
        } else {
            aiStatusMessage = `
                <div class="ai-status-message" style="text-align: center; margin-bottom: 20px; padding: 10px; background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 6px; color: #0c5460;">
                    <i class="fas fa-robot" style="color: #17a2b8;"></i> 
                    <strong>AI 맞춤 소개 생성 중...</strong> 잠시만 기다려 주세요.
                </div>
            `;
        }
        
        const professorCards = professors.map(professor => createProfessorCard(professor)).join('');
        $('#professorList').html(resetButton + aiStatusMessage + professorCards);
        
        if (apiKey) {
            let completedCount = 0;
            const totalCount = professors.length;
            
            professors.forEach((professor, index) => {
                generateAIProfessorIntro(professor, apiKey)
                    .then(aiIntro => {
                        console.log(`[DEBUG] ${professor.name} AI 응답:`, aiIntro);
                        completedCount++;
                        
                        const cardElement = $(`.professor-card[data-professor="${professor.name}"]`);
                        console.log(`[DEBUG] ${professor.name} 카드 요소 찾기:`, cardElement.length);
                        
                        if (cardElement.length > 0) {
                            const descriptionElement = cardElement.find('.professor-description');
                            console.log(`[DEBUG] ${professor.name} 설명 요소 찾기:`, descriptionElement.length);
                            
                            if (aiIntro) {
                                const aiIntroHtml = `
                                    <div class="ai-intro-section" style="margin-top: 15px; padding: 12px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #28a745; line-height: 1.5;">
                                        <div style="margin-bottom: 8px;"><i class="fas fa-robot" style="color: #28a745; margin-right: 6px;"></i><strong style="color: #155724;">AI 논문 분석:</strong></div>
                                        <div style="color: #155724; font-size: 14px; white-space: pre-wrap;">${aiIntro}</div>
                                    </div>
                                `;
                                console.log(`[DEBUG] ${professor.name} AI HTML 추가 시도`);
                                descriptionElement.append(aiIntroHtml);
                                console.log(`[DEBUG] ${professor.name} AI HTML 추가 완료`);
                            } else {
                                const errorHtml = `
                                    <div class="ai-intro-section" style="margin-top: 15px; padding: 12px; background: #f8d7da; border-radius: 8px; border-left: 4px solid #dc3545;">
                                        <div style="color: #721c24; font-size: 14px;"><i class="fas fa-exclamation-circle" style="margin-right: 6px;"></i>AI 소개 생성에 실패했습니다.</div>
                                    </div>
                                `;
                                descriptionElement.append(errorHtml);
                            }
                        } else {
                            console.error(`[ERROR] ${professor.name} 카드 요소를 찾을 수 없습니다. 이름: "${professor.name}"`);
                        }
                        
                        if (completedCount === totalCount) {
                            $('.ai-status-message').fadeOut(500);
                        }
                    })
                    .catch(error => {
                        console.error(`${professor.name} AI 소개 생성 오류:`, error);
                        completedCount++;
                        
                        const cardElement = $(`.professor-card[data-professor="${professor.name}"]`);
                        if (cardElement.length > 0) {
                            const errorHtml = `
                                <div class="ai-intro-section" style="margin-top: 15px; padding: 12px; background: #f8d7da; border-radius: 8px; border-left: 4px solid #dc3545;">
                                    <div style="color: #721c24; font-size: 14px;"><i class="fas fa-exclamation-circle" style="margin-right: 6px;"></i>AI 소개 생성 중 오류가 발생했습니다.</div>
                                </div>
                            `;
                            cardElement.find('.professor-description').append(errorHtml);
                        }
                        
                        if (completedCount === totalCount) {
                            $('.ai-status-message').fadeOut(500);
                        }
                    });
            });
        }
    }
    
    $('#professorList').show();
    
    $('#resetForm').click(function() {
        resetToForm();
    });
}

function loadAllProfessors() {
    const allProfessorsHtml = professorsData.map(professor => createProfessorCard(professor)).join('');
    $('#allProfessorsList').html(allProfessorsHtml);
}

function saveSearchHistory(selectedFields, results) {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const newEntry = {
        date: new Date().toLocaleString('ko-KR'),
        fields: selectedFields,
        results: results.map(p => p.name),
        timestamp: Date.now()
    };
    
    history.unshift(newEntry);
    if (history.length > 10) {
        history.pop();
    }
    
    localStorage.setItem('searchHistory', JSON.stringify(history));
    loadSearchHistory();
}

function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    if (history.length === 0) {
        $('#searchHistoryList').html(`
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-clock" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3>아직 검색 기록이 없습니다</h3>
                <p>교수님 추천 기능을 사용해보세요!</p>
            </div>
        `);
        return;
    }

    const clearAllButton = `
        <div style="text-align: center; margin-bottom: 20px;">
            <button id="clearAllHistory" style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">
                <i class="fas fa-trash-alt"></i> 전체 기록 삭제
            </button>
        </div>
    `;

    const historyHtml = history.map((entry, index) => `
        <div class="history-item" style="position: relative; cursor: pointer; border-radius: 8px; transition: background-color 0.2s;" 
             data-index="${index}">
            <button class="delete-history-btn" style="position: absolute; top: 10px; right: 10px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 12px; z-index: 10;">
                <i class="fas fa-times"></i>
            </button>
            <div class="history-date">
                <i class="fas fa-calendar"></i> ${entry.date}
            </div>
            <div class="history-fields">
                <i class="fas fa-tags"></i> 관심 분야: ${entry.fields.map(field => getFieldDisplayName(field)).join(', ')}
            </div>
            <div class="history-results">
                <i class="fas fa-user-graduate"></i> 추천된 교수님: ${entry.results.join(', ')}
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: #999;">
                <i class="fas fa-mouse-pointer"></i> 클릭하여 다시 검색
            </div>
        </div>
    `).join('');
    
    $('#searchHistoryList').html(clearAllButton + historyHtml);

    $('#clearAllHistory').click(function() {
        if (confirm('모든 검색 기록을 삭제하시겠습니까?')) {
            clearAllSearchHistory();
        }
    });
}

function deleteSearchHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history.splice(index, 1);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    loadSearchHistory();
}

function clearAllSearchHistory() {
    localStorage.removeItem('searchHistory');
    loadSearchHistory();
}

function rerunSearchFromHistory(index) {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    if (history[index]) {
        const entry = history[index];
        
        $('.checkbox-item input[type="checkbox"]').prop('checked', false);
        
        entry.fields.forEach(field => {
            $(`.checkbox-item input[value="${field}"]`).prop('checked', true);
        });
        
        $('.tab-btn').removeClass('active');
        $('.tab-content').removeClass('active');
        $('[data-tab="recommend"]').addClass('active');
        $('#recommend-tab').addClass('active');
        
        showLoadingState(true);
        
        const apiKey = CONFIG.getApiKey() || $('#apiKey').val().trim();
        
        if (apiKey) {
            getAIRecommendation(entry.fields, apiKey);
            } else {
            setTimeout(() => {
                const recommendedProfessors = getRecommendedProfessors(entry.fields);
                displayProfessors(recommendedProfessors);
            }, 1500);
        }
    }
}

function loadSavedApiKey() {
    const savedKey = CONFIG.getApiKey();
    if (savedKey) {
        $('#apiKey').val(savedKey);
    }
}

function resetToForm() {
    $('#resultSection').fadeOut(600, function() {
        $('#userForm').fadeIn(800);
        $('html, body').animate({
            scrollTop: $('#userForm').offset().top - 20
        }, 500);
    });
}

function createProfessorCard(professor) {
    return `
        <div class="professor-card" data-professor="${professor.name}">
            <div class="professor-info">
                <img src="${professor.photo}" alt="${professor.name}" class="professor-photo">
                <div class="professor-name">${professor.name}</div>
                <div class="professor-field">${professor.field}</div>
                <div class="professor-lab">
                    <i class="fas fa-map-marker-alt"></i> ${professor.lab}
                </div>
                <div class="professor-contact">
                    <i class="fas fa-phone"></i> ${professor.contact}
                </div>
                <div>
                    <a href="mailto:${professor.email}" class="professor-email">
                        <i class="fas fa-envelope"></i> ${professor.email}
                    </a>
                </div>
            </div>
            <div class="professor-description">
                <h4><i class="fas fa-user-graduate"></i> 교수님 소개</h4>
                <p>${professor.description}</p>
                ${professor.papers ? `
                    <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                        <h5><i class="fas fa-file-alt"></i> 주요 연구/논문</h5>
                        <ul style="margin: 5px 0; padding-left: 20px;">
                            ${professor.papers.map(paper => `<li style="margin: 2px 0; font-size: 14px;">${paper}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${professor.matchReason ? `
                    <div style="margin-top: 15px; padding: 10px; background: #f0f7ff; border-radius: 6px; border-left: 3px solid #667eea;">
                        <small><i class="fas fa-check-circle" style="color: #667eea;"></i> ${professor.matchReason}</small>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function renderFixedInterestAreas() {
    let html = '';
    Object.keys(INTEREST_CATEGORIES).forEach(majorCategory => {
        html += `<div class='major-category'>`;
        html += `<h2 style='color: #667eea; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 5px;'>${majorCategory}</h2>`;
        html += `<div class='checkbox-group'>`;
        INTEREST_CATEGORIES[majorCategory].forEach(cat => {
            html += `<label class='checkbox-item'><input type='checkbox' value='${cat.category}'> ${cat.category}</label>`;
        });
        html += '</div></div>';
    });
    $('#dynamicInterestAreas').html(html);
}

function getRecommendedProfessors(selectedCategories) {
    if (!selectedCategories || selectedCategories.length === 0) {
        return [];
    }
    // 선택된 대분류 → 매핑된 세부분야 모두 모으기
    let mappedSpecialties = [];
    selectedCategories.forEach(cat => {
        if (CATEGORY_TO_SPECIALTIES[cat]) {
            mappedSpecialties = mappedSpecialties.concat(CATEGORY_TO_SPECIALTIES[cat]);
        }
    });
    mappedSpecialties = Array.from(new Set(mappedSpecialties));

    const recommendations = [];
    professorsData.forEach(professor => {
        const matchCount = professor.specialties.filter(s => mappedSpecialties.includes(s)).length;
        if (matchCount > 0) {
            recommendations.push({
                ...professor,
                matchScore: matchCount,
                matchReason: getMatchReason(professor, mappedSpecialties)
            });
        }
    });
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

function getMatchReason(professor, mappedSpecialties) {
    const matches = professor.specialties.filter(s => mappedSpecialties.includes(s));
    if (matches.length === 0) return "";
    return `선택하신 관심 분야와 연관된 세부분야: '${matches.join(", ")}'`;
}

async function generateAIProfessorIntro(professor, apiKey) {
    if (!apiKey) return null;
    try {
        const papersText = professor.papers ? professor.papers.join(', ') : '논문 정보 없음';
        const prompt = `
아래는 강원대학교 컴퓨터공학과 교수님의 주요 논문 목록입니다.

[주요 논문]
${papersText}

위 논문 목록을 바탕으로, 학생들이 이해하기 쉽도록 교수님의 연구 업적을 전문용어를 사용하며 매우 자세하게 설명해 주세요.
- 논문 제목을 자연스럽게 녹여서, '이런 논문을 작성하셨다'는 식으로 설명
- "~을 연구하시는 교수님입니다" 또는 "~에 기여하신 교수님입니다"로 마무리
- 응답은 순수 텍스트(마크다운/JSON 없이)로만 해주세요.
        `;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: '당신은 강원대학교 컴퓨터공학과 교수님의 연구 업적을 학생들에게 친근하게 소개하는 전문가입니다. 논문을 쉽게 요약해 주세요.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 800,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content.trim();
        
        if (data.choices[0].finish_reason === 'length') {
            console.warn(`[WARNING] ${professor.name} AI 응답이 토큰 제한으로 잘렸습니다.`);
            return aiResponse + '... [응답이 길어서 일부만 표시됩니다]';
        }
        
        return aiResponse;
    } catch (error) {
        console.error('AI 소개 생성 오류:', error);
        return null;
    }
} 