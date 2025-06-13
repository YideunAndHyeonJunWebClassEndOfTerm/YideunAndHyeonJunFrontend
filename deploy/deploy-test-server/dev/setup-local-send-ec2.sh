#!/bin/bash

echo "=== 🚀 로컬에서 EC2로 배포 파일 전송 ==="

# operation 폴더로 이동
OPERATION_DIR="../operation"
if [ ! -d "$OPERATION_DIR" ]; then
    echo "❌ operation 폴더를 찾을 수 없습니다: $OPERATION_DIR"
    exit 1
fi

cd $OPERATION_DIR

# operation 폴더의 .env 파일에서 EC2 정보 읽기
if [ -f ".env" ]; then
    echo "📄 operation/.env 파일에서 설정 읽는 중..."
    source .env
    echo "✅ 기존 설정 로드 완료"
else
    echo "❌ operation/.env 파일이 없습니다."
fi

# EC2 정보 확인 및 설정
if [ -n "$EC2_HOST" ] && [ -n "$EC2_USER" ]; then
    echo "🎯 기존 EC2 설정 사용:"
    echo "   호스트: $EC2_HOST"
    echo "   사용자: $EC2_USER"
    echo "   경로: $EC2_DEPLOY_PATH"
    echo ""
    read -p "이 설정을 사용하시겠습니까? [Y/n]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        EC2_HOST=""
        EC2_USER=""
    fi
fi

# EC2 정보 입력 (없거나 변경하는 경우)
if [ -z "$EC2_HOST" ]; then
    read -p "EC2 IP 주소를 입력하세요: " EC2_HOST
fi

if [ -z "$EC2_USER" ]; then
    read -p "EC2 사용자명을 입력하세요 (기본: ec2-user): " EC2_USER
    EC2_USER=${EC2_USER:-ec2-user}
fi

if [ -z "$EC2_DEPLOY_PATH" ]; then
    EC2_DEPLOY_PATH="/home/$EC2_USER/deploy"
fi

if [ -z "$EC2_PEM_KEY_PATH" ]; then
    read -p "PEM 키 파일 경로를 입력하세요 (예: ~/.ssh/my-key.pem): " EC2_PEM_KEY_PATH
fi

echo "📡 EC2 서버: $EC2_USER@$EC2_HOST"
echo "📁 배포 경로: $EC2_DEPLOY_PATH"
echo "🔑 PEM 키: $EC2_PEM_KEY_PATH"

# PEM 키 파일 존재 확인
if [ ! -f "$EC2_PEM_KEY_PATH" ]; then
    echo "❌ PEM 키 파일을 찾을 수 없습니다: $EC2_PEM_KEY_PATH"
    echo "💡 올바른 경로를 확인하세요."
    exit 1
fi

# .env 파일 업데이트
echo ""
echo "⚙️ .env 파일 업데이트 중..."
cat > .env << EOF
# Docker 설정
DOCKER_NAMESPACE=hyeonjun0527

# EC2 서버 설정
EC2_HOST=$EC2_HOST
EC2_USER=$EC2_USER
EC2_DEPLOY_PATH=$EC2_DEPLOY_PATH
EC2_PEM_KEY_PATH=$EC2_PEM_KEY_PATH
EOF

echo "✅ .env 파일 업데이트 완료"

# EC2 서버 연결 테스트
echo ""
echo "🔗 EC2 서버 연결 테스트 중..."
if ssh -i "$EC2_PEM_KEY_PATH" -o ConnectTimeout=5 -o BatchMode=yes $EC2_USER@$EC2_HOST exit 2>/dev/null; then
    echo "✅ EC2 서버 연결 성공!"
else
    echo "❌ EC2 서버 연결 실패! SSH 키 설정을 확인하세요."
    echo "💡 다음 명령어로 수동 연결을 시도해보세요:"
    echo "   ssh -i $EC2_PEM_KEY_PATH $EC2_USER@$EC2_HOST"
    echo "💡 PEM 키 권한 확인:"
    echo "   chmod 400 $EC2_PEM_KEY_PATH"
    exit 1
fi

# EC2 서버에 배포 디렉토리 생성
echo ""
echo "📁 EC2 서버에 배포 디렉토리 생성 중..."
ssh -i "$EC2_PEM_KEY_PATH" $EC2_USER@$EC2_HOST "mkdir -p $EC2_DEPLOY_PATH"

# operation 폴더의 모든 파일 전송
echo ""
echo "📤 operation 폴더 파일들 전송 중..."

FILES=(
    "deploy.sh"
    "deploy-simple.sh"
    "docker-compose.yml"
    ".env"
    "setup-server.sh"
    "cleanup.sh"
    "test-local.sh"
    "reboot-server.sh"
    "setup-lightweight.sh"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  📄 $file 전송 중..."
        scp -i "$EC2_PEM_KEY_PATH" "$file" $EC2_USER@$EC2_HOST:$EC2_DEPLOY_PATH/
        if [ $? -eq 0 ]; then
            echo "    ✅ $file 전송 완료"
        else
            echo "    ❌ $file 전송 실패"
        fi
    else
        echo "    ⚠️ $file 파일이 없습니다."
    fi
done

# 실행 권한 부여
echo ""
echo "⚙️ EC2 서버에서 실행 권한 설정 중..."
ssh -i "$EC2_PEM_KEY_PATH" $EC2_USER@$EC2_HOST "cd $EC2_DEPLOY_PATH && chmod +x *.sh"

echo ""
echo "🎉 전송 완료!"
echo ""
echo "📍 EC2 서버 파일 위치: $EC2_DEPLOY_PATH"
echo ""
echo "🚀 다음 단계 (EC2 서버에서 실행):"
echo "1. ssh -i $EC2_PEM_KEY_PATH $EC2_USER@$EC2_HOST"
echo "2. cd $EC2_DEPLOY_PATH"
echo "3. ./setup-server.sh     # 서버 초기 설정 (최초 1회)"
echo "4. ./reboot-server.sh    # 서버 재부팅 (최초 1회)"
echo "5. ./deploy-simple.sh    # 애플리케이션 배포"
echo ""
echo "💡 이제 EC2에서 바로 배포할 수 있습니다!" 