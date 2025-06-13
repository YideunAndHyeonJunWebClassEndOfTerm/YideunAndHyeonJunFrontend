#!/bin/bash

echo "=== Operation 환경 정리 시작 ==="

# 컨테이너 중지 및 제거
echo "Docker 컨테이너 중지 및 제거 중..."
docker compose down

# 중지된 컨테이너 확인
echo ""
echo "=== 컨테이너 상태 확인 ==="
docker ps -a | grep yideunandhyeonjun-frontend || echo "컨테이너가 성공적으로 제거되었습니다."

# 시스템 정리 (자동)
echo ""
echo "Docker 시스템 정리 중..."
docker system prune -f
echo "✅ 시스템 정리 완료"

echo ""
echo "✅ Operation 환경 정리 완료!"