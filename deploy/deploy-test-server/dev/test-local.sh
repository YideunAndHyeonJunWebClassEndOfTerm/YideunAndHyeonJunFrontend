#!/bin/bash

echo "=== 로컬 테스트 시작 ==="

# 컨테이너 실행
echo "Docker 컨테이너 실행 중..."
docker compose up -d

# 잠시 대기 (컨테이너 시작 시간)
sleep 3

# 실행 중인 컨테이너 확인
echo ""
echo "=== 실행 중인 컨테이너 확인 ==="
docker ps

# 컨테이너 상태 확인
if docker ps | grep -q "yideunandhyeonjun-frontend"; then
    echo ""
    echo "✅ 컨테이너가 성공적으로 실행되었습니다!"
    echo "🌐 웹 브라우저에서 http://localhost:3000 으로 접속하세요"
    echo ""
    echo "=== 실시간 로그 확인 (Ctrl+C로 종료) ==="
    docker compose logs -f frontend
else
    echo ""
    echo "❌ 컨테이너 실행에 실패했습니다. 로그를 확인하세요:"
    docker compose logs frontend
fi