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

echo "=== 자동 배포 시작 ==="
echo "TAG: $TAG"

# 1. Git에서 최신 코드 받기
echo ""
echo "📥 Git에서 최신 코드 받는 중..."

# 현재 디렉토리가 git repo인지 확인
if [ -d "../../../.git" ]; then
    echo "✅ 기존 리포지토리에서 최신 코드 pull"
    cd ../../..
    git pull origin main
    cd deploy/deploy-test-server/operation
else
    echo "🔄 Git 리포지토리를 찾을 수 없습니다."
    echo "❌ 먼저 ./setup-repo.sh를 실행하여 리포지토리를 설정하세요."
    exit 1
    
    # 현재 디렉토리를 새로운 위치로 변경
    echo "📁 작업 디렉토리를 /tmp/YideunAndHyeonJunFrontend/deploy/deploy-test-server/operation으로 변경"
fi

# 2. .env 파일에 TAG 추가
echo ""
echo "⚙️  환경 설정 중..."
echo "" >> .env
echo "TAG=$TAG" >> .env
echo "TAG=$TAG 설정 완료"

# 3. 최신 이미지 pull + 컨테이너 재시작 (빌드 없음)
echo ""
echo "🐳 Docker 컨테이너 배포 중..."
docker compose up -d --pull always --no-build

# 4. 배포 결과 확인
echo ""
echo "=== 배포 완료 확인 ==="
sleep 3
docker ps | grep yideunandhyeonjun-frontend

if docker ps | grep -q "yideunandhyeonjun-frontend"; then
    echo ""
    echo "✅ 배포 성공!"
    echo "🌐 http://서버IP:3000 으로 접속하여 확인하세요"
    echo ""
    echo "=== 실시간 로그 확인 (Ctrl+C로 종료) ==="
    docker compose logs -f --tail=200 frontend
else
    echo ""
    echo "❌ 배포 실패! 로그를 확인하세요:"
    docker compose logs frontend
fi