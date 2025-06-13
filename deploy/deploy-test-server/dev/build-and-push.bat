@echo off

REM Git 커밋 해시를 TAG로 설정
for /f %%i in ('git rev-parse --short HEAD') do set TAG=%%i
echo 빌드·푸시 태그 = %TAG%

REM 빌드
echo Docker 이미지 빌드 중...
docker compose build

REM 이미지 확인
echo 빌드된 이미지 확인:
docker images | findstr "%TAG%"

REM 푸시
echo Docker Hub에 푸시 중...
docker compose push

echo 빌드 및 푸시 완료!
pause