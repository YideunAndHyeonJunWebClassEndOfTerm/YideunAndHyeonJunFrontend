#!/bin/bash

echo "=== 서버 초기 설정 시작 ==="

# 패키지 설치
echo "📦 필수 패키지 설치 중..."
sudo dnf install zsh git util-linux-user htop maven docker tree -y

# Oh My Zsh 설치
echo "🐚 Oh My Zsh 설치 중..."
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" "" --unattended

# Zsh 플러그인 설치
echo "🔌 Zsh 플러그인 설치 중..."
cd ~/.oh-my-zsh/custom/plugins
git clone https://github.com/zsh-users/zsh-autosuggestions.git 2>/dev/null || echo "zsh-autosuggestions 이미 설치됨"
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git 2>/dev/null || echo "zsh-syntax-highlighting 이미 설치됨"

# .zshrc 설정 (plugins 섹션 업데이트)
echo "⚙️  .zshrc 설정 중..."
cd ~

# 백업 생성
cp ~/.zshrc ~/.zshrc.backup

# plugins 설정 업데이트
sed -i '/^plugins=(/,/^)/ {
    /^plugins=(/ c\
plugins=(\
    git\
    zsh-autosuggestions\
    zsh-syntax-highlighting\
)
    /^)/d
}' ~/.zshrc

echo "✅ .zshrc 플러그인 설정 완료"

# Docker 그룹에 사용자 추가
echo "🐳 Docker 설정 중..."
sudo usermod -a -G docker ec2-user

# Docker Compose 설치
echo "🔧 Docker Compose 설치 중..."
DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.35.1/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

# Docker 서비스 시작
echo "🚀 Docker 서비스 시작 중..."
sudo systemctl start docker
sudo systemctl enable docker

# 버전 확인
echo ""
echo "=== 설치 완료 확인 ==="
docker --version
docker compose version

echo ""
echo "🔑 Docker Hub 로그인을 진행하세요:"
read -p "Docker Hub 사용자명을 입력하세요: " DOCKER_USERNAME
docker login -u $DOCKER_USERNAME

echo ""
echo "✅ 서버 초기 설정 완료!"
echo ""
echo "⚠️  다음 단계:"
echo "1. 터미널을 재시작하거나 다음 명령어 실행:"
echo "   source ~/.zshrc"
echo "2. 또는 서버 재부팅:"
echo "   sudo reboot"
echo ""
echo "🎉 설정이 완료되면 배포를 시작할 수 있습니다!"