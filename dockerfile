# 1단계: Node.js 이미지를 사용하여 React 애플리케이션 빌드
FROM node:alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# 2단계: Node.js 이미지를 사용하여 serve 설치 및 실행
FROM node:alpine
WORKDIR /app
# serve 패키지를 전역으로 설치
RUN npm install -g serve
# 1단계에서 생성된 빌드 디렉토리를 현재 디렉토리로 복사
COPY --from=build-stage /app/build /app
# serve를 사용하여 정적 파일 제공, 포트 3000에서 실행
CMD ["serve", "-s", "/app", "-l", "3000"]

# 포트 3000을 외부에 노출
EXPOSE 3000
