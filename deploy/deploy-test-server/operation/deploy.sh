#!/bin/bash

# TAG 파라미터 확인
if [ -z "$1" ]; then
    echo "사용법: ./deploy.sh <TAG>"
    echo "예시: ./deploy.sh a2caa12"
    exit 1
fi

TAG=$1

# .env 파일에 TAG 추가
echo "" >> .env
echo "TAG=$TAG" >> .env
echo "TAG=$TAG 설정 완료"

# 최신 이미지 pull + 컨테이너 재시작 (빌드 없음)
echo "최신 이미지 pull 및 컨테이너 재시작 중..."
docker compose up -d --pull always --no-build

# 로그 확인
echo "컨테이너 로그 확인:"
docker compose logs -f --tail=200 frontend