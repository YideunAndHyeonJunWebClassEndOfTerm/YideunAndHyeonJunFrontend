#!/bin/bash

echo "=== 서버 재부팅 ==="
echo "⚠️  모든 설정이 적용되도록 서버를 재부팅합니다."
echo ""
read -p "정말 재부팅하시겠습니까? [y/N]: " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 3초 후 재부팅합니다..."
    sleep 1
    echo "3..."
    sleep 1
    echo "2..."
    sleep 1
    echo "1..."
    sudo reboot
else
    echo "재부팅을 취소했습니다."
    echo ""
    echo "💡 수동으로 설정을 적용하려면:"
    echo "   source ~/.zshrc"
    echo "   newgrp docker"
fi