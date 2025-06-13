#!/bin/bash

echo "=== 로컬 테스트 환경 정리 시작 ==="

# 컨테이너 중지 및 제거
echo "Docker 컨테이너 중지 및 제거 중..."
docker compose down

# 중지된 컨테이너 확인
echo ""
echo "=== 컨테이너 상태 확인 ==="
docker ps -a | grep yideunandhyeonjun-frontend || echo "컨테이너가 성공적으로 제거되었습니다."

# 시스템 정리 여부 확인
echo ""
read -p "Docker 시스템 정리를 하시겠습니까? (사용하지 않는 이미지, 네트워크 등 삭제) [y/N]: " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Docker 시스템 정리 중..."
    docker system prune -f
    echo "✅ 시스템 정리 완료"
else
    echo "시스템 정리를 건너뜁니다."
fi

echo ""
echo "✅ 로컬 테스트 환경 정리 완료!"