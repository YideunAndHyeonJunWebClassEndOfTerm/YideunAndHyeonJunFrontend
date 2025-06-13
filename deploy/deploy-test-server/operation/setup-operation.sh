#!/bin/bash

echo "=== 가벼운 배포 환경 설정 ==="

# 작업 디렉토리 설정
WORK_DIR="/home/ec2-user/deploy"
REPO_BASE="https://raw.githubusercontent.com/YideunAndHyeonJunWebClassEndOfTerm/YideunAndHyeonJunFrontend/main/deploy/deploy-test-server/operation"

echo "📁 작업 디렉토리: $WORK_DIR"

# 기존 디렉토리 정리
echo "🧹 기존 디렉토리 정리 중..."
rm -rf $WORK_DIR
mkdir -p $WORK_DIR
cd $WORK_DIR

# 필요한 파일들만 다운로드
echo "📥 필요한 파일들 다운로드 중..."

FILES=(
    "deploy.sh"
    "docker-compose.yml"
    ".env"
    "setup-server.sh"
    "cleanup.sh"
    "test-local.sh"
    "reboot-server.sh"
)

for file in "${FILES[@]}"; do
    echo "  - $file 다운로드 중..."
    curl -s -O "$REPO_BASE/$file"
    if [ $? -eq 0 ]; then
        echo "    ✅ $file 다운로드 완료"
    else
        echo "    ❌ $file 다운로드 실패"
    fi
done

# 스크립트 실행 권한 부여
echo "⚙️ 실행 권한 설정 중..."
chmod +x *.sh

echo ""
echo "✅ 가벼운 배포 환경 설정 완료!"
echo ""
echo "📍 현재 위치: $(pwd)"
echo "📦 다운로드된 파일들:"
ls -la *.sh *.yml *.env 2>/dev/null

echo ""
echo "🚀 다음 단계:"
echo "1. ./setup-server.sh  # 서버 초기 설정 (최초 1회)"
echo "2. ./deploy.sh        # 애플리케이션 배포"
echo ""
echo "💡 Git clone 없이 필요한 파일들만 가져왔습니다!" 