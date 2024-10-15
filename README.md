# 타워 디펜스 프로젝트
----
## 4조
----
#### 프로젝트 제작 기간 : 2024.10.08(화) ~ 2024.10.16(수)
----
### 프로젝트 구성
#### 개발 환경
1. 개발 환경
   - 개발 툴 : VS-Code
   - 협업 : GitHub
1. 프로그램 언어
   - Node.js
   - JavaScript
1. 프레임 워크
   - Express
1. 데이터 베이스
   - MySQL
   - Prisma
1. 패키지 관리자
   - npm
- [Github Rule](https://www.notion.so/teamsparta/Github-Rules-fff2dc3ef51481e6a99dcc1b84210a37)
- [Code Convention](https://www.notion.so/teamsparta/Code-Convention-fff2dc3ef5148130a637d194604a8f8a)
----
#### 와이어 프레임
----
#### 핸들러 명세서
----
#### ERD 다이어그램
----
### 구현 기능
- 시간에 따라 스테이지가 진행되고 몬스터를 처치하고 얻은 돈으로 타워를 구매해 기지가 파괴되지 않게 지키는 게임입니다.<br>
1. 회원가입<br>아이디, 비밀번호, 비밀번호 확인, 닉네임을 입력받고 검증 과정을 거친 후 틀린 값이 없다면 해당 값을 데이터 테이블에 저장합니다.
1. 로그인<br>저장되어있는 아이디, 비밀번호 값을 받아 문제가 없다면 닉네임을 index.html에 띄워주고 jwt토큰을 생성합니다.
1. 게임 시작<br>게임 플레이 클릭 시 가지고 있는 jwt토큰이 있다면 게임이 시작되고, 스테이지의 남은 시간, 몬스터 생성등이 진행됩니다.
1. 게임 오버<br>몬스터가 기지에 닿을 시 기지의 HP가 감소하고 HP가 0이 되면 해당 유저의 게임 로그에 최고 기록을 업데이트하고 게임을 종료합니다.
1. 스테이지 이동 - (**추가 구현**)<br>게임화면 상단의 남은 시간이 0이 되면 다음 스테이지가 시작됩니다. 몬스터의 종류가 바뀌고 몬스터가 더 강해집니다.
1. 타워 배치(타워 구매)<br> 타워 이미지를 몬스터의 경로가 아닌 곳에 드래그 앤 드롭하면 보유 골드가 감소하면서 타워가 배치됩니다.
1. 타워 판매 - (**도전 구현**)<br> 타워 판매 버튼을 누른 후 판매하고자 하는 타워를 클릭하면 해당 타워를 판매합니다. 판매가격은 구매가의 반값입니다.
1. 타워 업그레이드 - (**도전 구현**)<br> 타워 업그레이드 버튼을 누른 후 업그레이드하고자 하는 타워를 클릭하면 보유 골드가 감소하면서 해당 타워를 업그레이드합니다.
1. 타워 종류 - (**추가 구현**)<br>여러 가지 타워들이 존재하고 원하는 플레이 방식, 전략에 따라 타워를 배치할 수 있습니다.
   - 폰 : 사거리 짧은 단일 공격 타워
     - 비용 : n
     - 업그레이드 비용 : n
   - 룩 : 사거리 긴 단일 공격 타워
     - 비용 : n
     - 업그레이드 비용 : n
   - 나이트 : 여러마리 때릴 수 있는 타워(최대 3마리)
     - 비용 : n
     - 업그레이드 비용 : n
   - 비숍 : 슬로우 타워
     - 비용 : n
     - 업그레이드 비용 : n
   - 퀸 : 가까이오면 죽을때까지 때리는 타워
     - 비용 : n
     - 업그레이드 비용 : n
   - 킹 : 
     - 비용 : n
     - 업그레이드 비용 : n
1. 몬스터 사망<br>해당 몬스터의 데이터 테이블이 가지고 있는 골드와 점수를 획득합니다.
1. 하이 스코어<br>해당 유저의 게임 로그를 확인하고 게임 로그에서 유저의 최고 기록을 가져옵니다.
----
### 폴더 구조
 📦sparta-tower-defense-game<br>
 ┃<br>
 ┣ 📂node_modules<br>
 ┃ <br>
 ┣ 📂prisma<br>
 ┃ ┗ 📜schema.prisma<br>
 ┣ 📂public<br>
 ┃ ┣ 📂assets<br>
 ┃ ┃ ┣ 📜monster.json<br>
 ┃ ┃ ┣ 📜stage.json<br>
 ┃ ┃ ┣ 📜tower.json<br>
 ┃ ┃ ┗ 📜tower_unlock.json<br>
 ┃ ┣ 📂images<br>
 ┃ ┃ ┣ 📜.DS_Store<br>
 ┃ ┃ ┣ 📜base.png<br>
 ┃ ┃ ┣ 📜bg.webp<br>
 ┃ ┃ ┣ 📜favicon.ico<br>
 ┃ ┃ ┣ 📜monster1.png<br>
 ┃ ┃ ┣ 📜monster2.png<br>
 ┃ ┃ ┣ 📜monster3.png<br>
 ┃ ┃ ┣ 📜monster4.png<br>
 ┃ ┃ ┣ 📜monster5.png<br>
 ┃ ┃ ┣ 📜path.png<br>
 ┃ ┃ ┣ 📜tower_bishopTower.png<br>
 ┃ ┃ ┣ 📜tower_kingTower.png<br>
 ┃ ┃ ┣ 📜tower_knightTower.png<br>
 ┃ ┃ ┣ 📜tower_pawnTower.png<br>
 ┃ ┃ ┣ 📜tower_queenTower.png<br>
 ┃ ┃ ┗ 📜tower_rookTower.png<br>
 ┃ ┣ 📂src<br>
 ┃ ┃ ┣ 📂init<br>
 ┃ ┃ ┃ ┗ 📜asset.js<br>
 ┃ ┃ ┣ 📂utils<br>
 ┃ ┃ ┃ ┗ 📜stage.util.js<br>
 ┃ ┃ ┣ 📜base.js<br>
 ┃ ┃ ┣ 📜constant.js<br>
 ┃ ┃ ┣ 📜game.js<br>
 ┃ ┃ ┣ 📜monster.js<br>
 ┃ ┃ ┣ 📜socket.js<br>
 ┃ ┃ ┗ 📜tower.js<br>
 ┃ ┣ 📜index.html<br>
 ┃ ┣ 📜login.html<br>
 ┃ ┗ 📜register.html<br>
 ┣ 📂src<br>
 ┃ ┣ 📂handlers<br>
 ┃ ┃ ┣ 📜gameOver.handler.js<br>
 ┃ ┃ ┣ 📜gameStart.handler.js<br>
 ┃ ┃ ┣ 📜getHighScore.handler.js<br>
 ┃ ┃ ┣ 📜handlermapping.js<br>
 ┃ ┃ ┣ 📜helper.js<br>
 ┃ ┃ ┣ 📜monster.handler.js<br>
 ┃ ┃ ┣ 📜moveStage.handler.js<br>
 ┃ ┃ ┣ 📜register.handler.js<br>
 ┃ ┃ ┗ 📜tower.handler.js<br>
 ┃ ┣ 📂init<br>
 ┃ ┃ ┣ 📜asset.js<br>
 ┃ ┃ ┣ 📜monster.js<br>
 ┃ ┃ ┗ 📜socket.js<br>
 ┃ ┣ 📂middlewares<br>
 ┃ ┃ ┗ 📜auth.middleware.js<br>
 ┃ ┣ 📂models<br>
 ┃ ┃ ┣ 📜gameLog.model.js<br>
 ┃ ┃ ┣ 📜monster.model.js<br>
 ┃ ┃ ┣ 📜stage.model.js<br>
 ┃ ┃ ┗ 📜user.model.js<br>
 ┃ ┣ 📂route<br>
 ┃ ┃ ┗ 📜accout.router.js<br>
 ┃ ┣ 📂utils<br>
 ┃ ┃ ┣ 📂prisma<br>
 ┃ ┃ ┃ ┗ 📜index.js<br>
 ┃ ┃ ┣ 📜monsters.js<br>
 ┃ ┃ ┣ 📜stage.util.js<br>
 ┃ ┃ ┗ 📜user.util.js<br>
 ┃ ┗ 📜constant.js<br>
 ┣ 📜.env<br>
 ┣ 📜.gitignore<br>
 ┣ 📜.prettierrc<br>
 ┣ 📜app.js<br>
 ┣ 📜package-lock.json<br>
 ┣ 📜package.json<br>
 ┗ 📜README.md
----
### 팀 노션
[코드 요리 4조](https://www.notion.so/teamsparta/4-f867f8121013476885105160f2df35d0#fff2dc3ef51481c3a2a2fe305d910572)
----
### 프로젝트 제작 인원
- [권영현](https://github.com/DudeKYH "Github") [정동현](https://github.com/803571 "Github") [김민규](https://github.com/mingyu6688 "Github")
 [이상현](https://github.com/LeeSanghyun1212 "Github") [김선우](https://github.com/Rien3844 "Github") [이의현](https://github.com/UIHyeonLEE "Github")