FROM nginx:alpine

# 프로젝트 루트의 모든 파일을 복사
COPY . /usr/share/nginx/html

# 불필요한 파일들 제거
RUN rm -rf /usr/share/nginx/html/deploy /usr/share/nginx/html/.git* /usr/share/nginx/html/README.md /usr/share/nginx/html/LICENSE

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]