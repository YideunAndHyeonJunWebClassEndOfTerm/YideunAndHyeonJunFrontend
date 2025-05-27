class DataManager {
    constructor() {
        this.curriculum = null;
        this.loadCurriculum();
    }

    async loadCurriculum() {
        try {
            console.log('교육과정 데이터 로딩 시작');
            const response = await fetch('./data/curriculum.json');
            
            if (!response.ok) {
                throw new Error(`HTTP 오류: ${response.status} ${response.statusText}`);
            }
            
            this.curriculum = await response.json();
            console.log('교육과정 데이터 로딩 완료:', this.curriculum);
            
            setTimeout(() => {
                this.displayCompletedCourses();
            }, 100);
            
        } catch (error) {
            console.error('교육과정 데이터 로드 실패:', error);
            console.error('오류 세부사항:', error.message);
            
            setTimeout(() => {
                console.log('교육과정 데이터 재시도 중...');
                this.loadCurriculum();
            }, 2000);
        }
    }

    displayCompletedCourses() {
        if (!this.curriculum) return;

        const container = document.getElementById('completedCourses');
        container.innerHTML = '';

        const allCourses = [
            ...this.curriculum.major_required,
            ...this.curriculum.major_elective
        ];

        allCourses.forEach(course => {
            const label = document.createElement('label');
            label.className = 'checkbox-item';
            label.innerHTML = `
                <input type="checkbox" value="${course.code}"> 
                ${course.name} (${course.year}학년 ${course.semester}학기)
            `;
            container.appendChild(label);
        });
    }

    getCompletedCourses() {
        const checkboxes = document.querySelectorAll('#completedCourses input:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    getCoursesByField(field) {
        if (!this.curriculum) return [];
        return this.curriculum.major_elective.filter(course => course.field === field);
    }

    getCourseInfo(code) {
        if (!this.curriculum) return null;
        const allCourses = [
            ...this.curriculum.major_required,
            ...this.curriculum.major_elective
        ];
        return allCourses.find(course => course.code === code);
    }
}

window.dataManager = new DataManager(); 