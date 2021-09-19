FROM node:lts


WORKDIR /app


# 소스 추가
COPY . .

COPY package*.json ./

RUN npm install


COPY .env .env


# 소스 빌드
RUN npm run build

CMD ["node", "dist/main"]