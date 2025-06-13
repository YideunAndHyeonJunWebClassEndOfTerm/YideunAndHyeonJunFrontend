#!/bin/bash

echo "=== 🔗 EC2 SSH 접속 ==="

# operation 폴더로 이동
OPERATION_DIR="../operation"
if [ ! -d "$OPERATION_DIR" ]; then
    echo "❌ operation 폴더를 찾을 수 없습니다: $OPERATION_DIR"
    exit 1
fi

cd $OPERATION_DIR

# .env 파일에서 EC2 정보 읽기
if [ -f ".env" ]; then
    source .env
    echo "📄 설정 파일 로드 완료"
else
    echo "❌ .env 파일이 없습니다."
    echo "💡 먼저 ./setup-local-send-ec2.sh를 실행하세요."
    exit 1
fi

# 필수 정보 확인
if [ -z "$EC2_HOST" ] || [ -z "$EC2_USER" ] || [ -z "$EC2_PEM_KEY_PATH" ]; then
    echo "❌ EC2 설정이 불완전합니다."
    echo "💡 먼저 ./setup-local-send-ec2.sh를 실행하여 설정을 완료하세요."
    exit 1
fi

# PEM 키 파일 존재 확인
if [ ! -f "$EC2_PEM_KEY_PATH" ]; then
    echo "❌ PEM 키 파일을 찾을 수 없습니다: $EC2_PEM_KEY_PATH"
    exit 1
fi

echo "📡 EC2 서버: $EC2_USER@$EC2_HOST"
echo "📁 배포 경로: $EC2_DEPLOY_PATH"
echo "🔑 PEM 키: $EC2_PEM_KEY_PATH"
echo ""
echo "🔗 EC2 서버로 SSH 접속 중..."
echo "💡 배포 디렉토리($EC2_DEPLOY_PATH)에서 시작합니다."
echo ""

# SSH 접속 (배포 디렉토리에서 시작)
ssh -i "$EC2_PEM_KEY_PATH" -t $EC2_USER@$EC2_HOST "cd $EC2_DEPLOY_PATH && exec \$SHELL -l" 