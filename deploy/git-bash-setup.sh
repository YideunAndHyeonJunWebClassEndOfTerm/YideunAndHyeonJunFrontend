#!/bin/bash

echo "=== 🎨 Git Bash 예쁘게 만들기 ==="

# 백업 생성
if [ -f ~/.bashrc ]; then
    cp ~/.bashrc ~/.bashrc.backup
    echo "✅ 기존 .bashrc 백업 완료"
fi

# 색상 설정
cat >> ~/.bashrc << 'EOF'

# ========== Git Bash 예쁘게 만들기 ==========

# 색상 활성화
export TERM=xterm-256color
export FORCE_COLOR=1

# 커스텀 프롬프트 (아이콘 포함)
export PS1='\[\033[01;32m\]🚀 \u\[\033[00m\] \[\033[01;34m\]📁 \W\[\033[00m\] \[\033[01;33m\]$(git branch 2>/dev/null | grep "^*" | sed "s/* / 🌿 /")\[\033[00m\]\$ '

# LS 색상
export LS_COLORS="di=1;34:ln=1;36:pi=40;33:so=1;35:do=1;35:bd=40;33;1:cd=40;33;1:or=40;31;1:ex=1;32:*.tar=1;31:*.tgz=1;31:*.arj=1;31:*.taz=1;31:*.lzh=1;31:*.zip=1;31:*.z=1;31:*.Z=1;31:*.gz=1;31:*.bz2=1;31:*.deb=1;31:*.rpm=1;31:*.jar=1;31:*.jpg=1;35:*.jpeg=1;35:*.gif=1;35:*.bmp=1;35:*.pbm=1;35:*.pgm=1;35:*.ppm=1;35:*.tga=1;35:*.xbm=1;35:*.xpm=1;35:*.tif=1;35:*.tiff=1;35:*.png=1;35:*.mov=1;35:*.mpg=1;35:*.mpeg=1;35:*.avi=1;35:*.fli=1;35:*.gl=1;35:*.dl=1;35:*.xcf=1;35:*.xwd=1;35:*.ogg=1;35:*.mp3=1;35:*.wav=1;35"

# 편리한 별칭
alias ll='ls -alF --color=auto'
alias la='ls -A --color=auto'
alias l='ls -CF --color=auto'
alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias ..='cd ..'
alias ...='cd ../..'
alias c='clear'

# Git 별칭 (이모지 포함)
alias gs='echo "📊 Git Status:" && git status'
alias ga='echo "➕ Git Add:" && git add'
alias gc='echo "💾 Git Commit:" && git commit'
alias gp='echo "🚀 Git Push:" && git push'
alias gl='echo "📥 Git Pull:" && git pull'
alias gb='echo "🌿 Git Branches:" && git branch'
alias gd='echo "🔍 Git Diff:" && git diff'
alias glog='echo "📜 Git Log:" && git log --oneline --graph --decorate'

# Docker 별칭
alias dps='echo "🐳 Docker Containers:" && docker ps'
alias dimg='echo "🖼️ Docker Images:" && docker images'
alias dlog='echo "📋 Docker Logs:" && docker logs'

# 배포 관련 별칭
alias deploy='echo "🚀 Starting Deployment..." && ./deploy-simple.sh'
alias build='echo "🏗️ Building..." && ./build-and-push.sh'
alias connect='echo "🔗 Connecting to EC2..." && ./ssh-ec2.sh'

# 환영 메시지
echo ""
echo "🎉 Welcome to Git Bash!"
echo "🚀 Ready for development!"
echo ""
echo "📋 Quick Commands:"
echo "  gs  - Git Status  🌿 gb  - Git Branches"
echo "  ga  - Git Add     📥 gl  - Git Pull"
echo "  gc  - Git Commit  🚀 gp  - Git Push"
echo "  dps - Docker PS   🐳 dimg - Docker Images"
echo ""

EOF

echo "✅ .bashrc 설정 완료!"
echo ""
echo "🎨 추가 설정:"
echo "1. 폰트 변경: Git Bash 우클릭 → Options → Text → Nerd Font 선택"
echo "2. 색상 테마: Git Bash 우클릭 → Options → Looks → Theme 선택"
echo "3. 투명도: Git Bash 우클릭 → Options → Looks → Transparency"
echo ""
echo "🔄 변경사항 적용:"
echo "source ~/.bashrc"
echo ""
echo "💡 Git Bash를 재시작하면 새로운 설정이 적용됩니다!" 