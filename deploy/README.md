# 배포 가이드

## 디렉토리 구조
```
deploy/
├── deploy-test-server/
│   ├── dev/                    # 개발환경 (빌드 & 푸시용)
│   │   ├── docker-compose.yml
│   │   ├── frontend.Dockerfile
│   │   ├── .env
│   │   ├── build-and-push.sh   # 빌드 & 푸시
│   │   ├── test-local.sh       # 로컬 테스트
│   │   └── cleanup.sh          # 환경 정리
│   └── operation/              # 운영환경 (배포용)
│       ├── docker-compose.yml
│       ├── .env
│       ├── deploy.sh
│       ├── test-local.sh       # 로컬 테스트
│       ├── cleanup.sh          # 환경 정리
│       ├── setup-server.sh     # 서버 초기 설정
│       └── reboot-server.sh    # 서버 재부팅
```

## 로컬환경에서 할 일

### 1. 사전 준비
```bash
# Docker Hub 로그인
docker login

# .env 파일에서 DOCKER_NAMESPACE를 본인의 Docker Hub 사용자명으로 변경
# dev/.env와 operation/.env 둘 다 수정하세요
```

### 2. 빌드 & 푸시
```bash
# dev 폴더로 이동
cd deploy/deploy-test-server/dev

# 태그 계산 & 빌드 & 푸시
export TAG=$(git rev-parse --short HEAD)
echo "빌드·푸시 태그 = $TAG"
docker compose build
docker images | grep "$TAG"
docker compose push
```

**또는 스크립트 사용:**
```bash
./build-and-push.sh
```

### 3. 로컬 테스트
```bash
# 로컬에서 컨테이너 실행 및 테스트
./test-local.sh

# 브라우저에서 http://localhost:3000 접속하여 확인
```

### 4. 환경 정리
```bash
# 컨테이너 중지 및 정리 (시스템 정리 자동 실행)
./cleanup.sh
```

## 배포환경 설정

### 방법 1: Git Clone (추천 🌟)
```bash
# 서버에서 실행
curl -O https://raw.githubusercontent.com/your-username/YideunAndHyeonJunFrontend/main/deploy/deploy-test-server/operation/setup-repo.sh
chmod +x setup-repo.sh
./setup-repo.sh
```

### 방법 2: 수동 파일 복사
operation 폴더를 배포 서버로 복사:
```bash
scp -r operation/ ec2-user@43.201.71.192:/home/ec2-user/
```

## 서버 초기 설정 (최초 1회만)

새로운 서버에서 최초 1회만 실행하세요:

```bash
# operation 폴더 업로드 후
cd operation/
chmod +x *.sh

# 서버 초기 설정 (Zsh, Docker, 플러그인 등)
./setup-server.sh

# 재부팅 (권장)
./reboot-server.sh
```

### 설치되는 항목
- **패키지**: zsh, git, htop, maven, docker, tree
- **Oh My Zsh**: 터미널 환경 개선
- **Zsh 플러그인**: autosuggestions, syntax-highlighting  
- **Docker Compose**: v2.35.1
- **Docker 권한**: ec2-user를 docker 그룹에 추가

## 배포환경에서 할 일

```bash
# 운영용 compose 폴더로 이동
cd operation/

# TAG 설정 (빌드 시 생성된 커밋 해시 사용)
echo "" >> .env && echo "TAG=a2caa12" >> .env

# 최신 이미지 pull + 컨테이너 재시작
docker compose up -d --pull always --no-build

# 로그 확인
docker compose logs -f --tail=200 frontend
```

**또는 스크립트 사용:**
```bash
./deploy.sh a2caa12
```

## 포트 설정

- 개발환경: `http://localhost:3000`
- 운영환경: `http://서버IP:3000`

포트를 변경하려면 `docker-compose.yml`의 `ports` 섹션을 수정하세요.