#!/bin/bash

# TAG 파라미터 확인 (없으면 latest 사용)
if [ -z "$1" ]; then
    echo "🏷️  TAG가 지정되지 않았습니다. latest 태그를 사용합니다."
    TAG="latest"
    echo "TAG: $TAG"
else
    TAG=$1
    echo "TAG: $TAG"
fi

echo "=== 🚀 간단한 배포 시작 ==="
echo "TAG: $TAG"

# 1. 환경 변수로 TAG 설정 (파일에 저장하지 않음)
echo ""
echo "⚙️  환경 설정 중..."
export TAG=$TAG
echo "TAG=$TAG 환경변수 설정 완료"

# 2. Docker 이미지 pull + 컨테이너 재시작
echo ""
echo "🐳 Docker 컨테이너 배포 중..."
TAG=$TAG docker compose up -d --pull always --no-build

# 3. 배포 결과 확인
echo ""
echo "=== 배포 완료 확인 ==="
sleep 3
docker ps | grep yideunandhyeonjun-frontend

if docker ps | grep -q "yideunandhyeonjun-frontend"; then
    echo ""
    echo "✅ 배포 성공!"
    echo "🌐 http://$(curl -s ifconfig.me):3000 으로 접속하여 확인하세요"
    echo ""
    echo "=== 실시간 로그 확인 (Ctrl+C로 종료) ==="
    docker compose logs -f --tail=200 frontend
else
    echo ""
    echo "❌ 배포 실패! 로그를 확인하세요:"
    docker compose logs frontend
fi 