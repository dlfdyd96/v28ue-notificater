# NestJS의 TDD + Watcher v2

## Overview

한 아이템에만 재고 알림을 걸지말고 다른 아이템에 대해서도 재고 알림을 만들면 어떨까 해서 v2 를 대략적으로 생각했다.

### Structure

![](./images/v2_overview.png)

1. NestJS

   - 재고 알림 메인 로직 담당 애플리케이션.
   - 재고 알림을 더 추가하려고 REST API 요청을 통해 스케쥴을 CRUD 한다.
   - WatcherService에서는 재고 알림에 대한 더 구체적인 정보를 요청한다. (JS Element, URL)
   - NotifyService에서는 Test환경과 배포환경에서의 알림을 구분하여 이용자들의 혼란을 방지한다.

2. NGINX

   - 기본적인 ADMIN Page를 Single Page Application을 만들어 NGINX를 통해 노출한다.

3. Jenkins

   - Jenkins을 통해 CI CD 과정을 자동화 한다.

4. ELK

   - 로그를 Elastic Stack을 통해 추적, 조회 할 수 있다.

<hr>

## NestJS Application

### 1. 재고 알림 REST API

controller 를 만들어 줍시다.

```sh
> nest generate controller task-scheduler

```

**PART: Create**

dto부터 만들어 줍니다. dto를 만들어 주기 전에 validator를 설치해줘야 합니다.

```sh
npm i class-validator class-transformer
```

main 에 pipeline을 설정해 줍니다.

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

Create

### 2. 재고 확인 parser 수정

### 3. Test 환경, 배포 환경 구분

<hr>

## NGINX

### 1. NGINX Container 구축

### 2. SPA Static web files 생성

<hr>

## Jenkins

### 1. NestJS에 대한 Jenkins Agent 구축

<hr>

## ELK

### 1. ELK Container 생성

### 2. NestJS Log 생성

```

```
