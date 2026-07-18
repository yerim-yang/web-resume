// 카드를 뒤집는 동작을 정의하는 함수입니다.
function flipCard() {
    const card = document.getElementById('myCard');
    card.classList.toggle('is-flipped');
}

// 페이지가 로드되면 카드가 부드럽게 나타나는 효과
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.card-container');
    // 처음엔 투명하게 시작
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    // 잠깐 기다린 후 부드럽게 나타남
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);

    // 홀로그래픽 모바일 기울임 및 마우스 인터랙션 초기화
    initHolographic();
});

// =========================================
// 홀로그래픽 쉬머 — 기울임/마우스 움직임 기반 제어
// =========================================
function initHolographic() {
    const cardFaces = document.querySelectorAll('.card-face');
    
    let isMoving = false;
    let hideTimeout;

    // 공통 홀로그램 업데이트 함수
    function updateHoloEffect(x, y, specificFace = null) {
        const faces = specificFace ? [specificFace] : cardFaces;
        
        faces.forEach(face => {
            const holo = face.querySelector('.holo-overlay');
            if (!holo) return;
            
            // 각도 계산 (0 ~ 360)
            const angle = Math.round(x * 360);
            
            // 위치 계산 (배경이 따라 움직이도록, 0% ~ 100%)
            const bgX = Math.round(x * 100);
            const bgY = Math.round(y * 100);
            
            holo.style.setProperty('--holo-opacity', '1');
            holo.style.setProperty('--holo-angle', angle + 'deg');
            holo.style.setProperty('--holo-bg-x', bgX + '%');
            holo.style.setProperty('--holo-bg-y', bgY + '%');
            face.style.setProperty('--holo-angle', angle + 'deg');
        });
        
        // 디바이스 기울임 시 움직임 멈추면 일정 시간 후 서서히 사라지도록 (옵션)
        // 여기서는 계속 유지하려면 주석 처리합니다.
    }

    // 1. 모바일 디바이스 기울임 감지 (DeviceOrientation)
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            if (e.beta === null || e.gamma === null) return;
            
            // gamma: 좌우 기울임 (-90 ~ 90) -> 0 ~ 1 정규화 (대략 -45 ~ 45를 주 범위로)
            let x = (e.gamma + 45) / 90;
            // beta: 앞뒤 기울임 (기본 들고있는 상태 45도를 기준으로) -> 0 ~ 1 정규화
            let y = (e.beta - 45) / 90;
            
            x = Math.max(0, Math.min(1, x));
            y = Math.max(0, Math.min(1, y));
            
            updateHoloEffect(x, y);
            
            // 폰을 들고 있을 땐 항상 효과가 보이도록 opacity 유지
            cardFaces.forEach(face => {
                const holo = face.querySelector('.holo-overlay');
                if (holo) holo.style.setProperty('--holo-opacity', '1');
            });
        });
    }

    // 2. PC 마우스 움직임 감지
    cardFaces.forEach(face => {
        face.addEventListener('mousemove', (e) => {
            const rect = face.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            updateHoloEffect(x, y, face);
        });

        face.addEventListener('mouseleave', () => {
            // 마우스가 카드를 벗어나면 홀로그램 숨김
            const holo = face.querySelector('.holo-overlay');
            if (holo) {
                holo.style.setProperty('--holo-opacity', '0');
            }
        });
    });
}
