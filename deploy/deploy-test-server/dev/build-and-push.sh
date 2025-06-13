#!/bin/bash

# Git 커밋 해시를 TAG로 설정
export TAG=$(git rev-parse --short HEAD)
echo "빌드·푸시 태그 = $TAG"

# 빌드
echo "Docker 이미지 빌드 중..."
docker compose build

# 이미지 확인
echo "빌드된 이미지 확인:"
docker images | grep "$TAG"

# 푸시
echo "Docker Hub에 푸시 중..."
docker compose push

echo "빌드 및 푸시 완료!"