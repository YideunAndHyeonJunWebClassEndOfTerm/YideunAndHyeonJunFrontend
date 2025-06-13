#!/bin/bash

echo "=== Git 리포지토리 설정 ==="

# GitHub 리포지토리 URL 입력받기
read -p "GitHub 리포지토리 URL을 입력하세요 (예: https://github.com/username/YideunAndHyeonJunFrontend.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ 리포지토리 URL이 필요합니다."
    exit 1
fi

# 작업 디렉토리 설정
WORK_DIR="/home/ec2-user/deploy"
echo "📁 작업 디렉토리: $WORK_DIR"

# 기존 디렉토리 정리
echo "🧹 기존 디렉토리 정리 중..."
rm -rf $WORK_DIR
mkdir -p $WORK_DIR
cd $WORK_DIR

# Git clone
echo "📥 리포지토리 클론 중..."
git clone $REPO_URL

# 프로젝트 이름 추출
PROJECT_NAME=$(basename $REPO_URL .git)
echo "📦 프로젝트: $PROJECT_NAME"

# operation 디렉토리로 이동
cd $PROJECT_NAME/deploy/deploy-test-server/operation

# 스크립트 실행 권한 부여
chmod +x *.sh

echo ""
echo "✅ Git 리포지토리 설정 완료!"
echo ""
echo "📍 현재 위치: $(pwd)"
echo ""
echo "🚀 다음 단계:"
echo "1. ./setup-server.sh  # 서버 초기 설정 (최초 1회)"
echo "2. ./deploy.sh <TAG>  # 애플리케이션 배포"
echo ""
echo "💡 앞으로는 ./deploy.sh만 실행하면 자동으로 최신 코드를 받아와서 배포합니다!"