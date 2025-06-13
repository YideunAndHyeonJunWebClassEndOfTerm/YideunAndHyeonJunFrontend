# 배포 가이드

## 디렉토리 구조
```
deploy/
├── deploy-test-server/
│   ├── dev/                    # 개발환경 (빌드 & 푸시용)
│   │   ├── docker-compose.yml
│   │   ├── frontend.Dockerfile
│   │   ├── .env
│   │   ├── build-and-push.sh
│   │   └── build-and-push.bat
│   └── operation/              # 운영환경 (배포용)
│       ├── docker-compose.yml
│       ├── .env
│       └── deploy.sh
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
# Linux/Mac
./build-and-push.sh

# Windows
build-and-push.bat
```

## 배포환경으로 파일 이동

operation 폴더를 배포 서버로 복사:
- FileZilla 등 FTP 클라이언트 사용
- `scp` 명령어 사용
- Git clone 사용

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

- 개발환경: `http://localhost:8080`
- 운영환경: `http://서버IP:8080`

포트를 변경하려면 `docker-compose.yml`의 `ports` 섹션을 수정하세요.