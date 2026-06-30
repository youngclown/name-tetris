# OO이 테트리스

광고 없는 블록 퍼즐 테트리스 앱입니다.  
이름을 입력하면 **OO이 테트리스** 형태로 나만의 게임이 만들어집니다.

예: `시율` 입력 → **시율 테트리스**

## 주요 기능

- 8×8 격자에 블록 3개를 끌어다 놓는 퍼즐 방식
- 가로·세로 줄이 가득 차면 제거 및 점수 획득
- 게임 오버 시 **10,000점**을 사용해 이어하기 (아래 3줄 제거)
- 이름 등록 랭킹 (기기 내 저장)
- 이름 커스터마이징 (응원 멘트·타이틀 자동 변경)
- 광고 없음

## 기술 스택

- [Expo](https://expo.dev/) 52
- React Native
- TypeScript

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm

### 설치 및 실행

```bash
git clone https://github.com/YOUR_USERNAME/name-tetris.git
cd name-tetris
npm install
npm start
```

Expo 개발 서버가 실행되면:

- **Expo Go** 앱으로 QR 코드 스캔 (가장 빠른 테스트)
- 또는 `npm run android` / `npm run ios`

## Android APK 빌드 (설치용 앱)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

빌드 완료 후 Expo 대시보드에서 APK를 다운로드해 설치할 수 있습니다.

## 프로젝트 구조

```
├── App.tsx                 # 앱 진입점
├── components/             # UI 컴포넌트
│   ├── GameScreen.tsx      # 메인 게임 화면
│   ├── GameBoard.tsx       # 8×8 보드
│   ├── DraggablePiece.tsx  # 드래그 블록
│   └── ...
├── context/                # 플레이어 설정 Context
├── game/                   # 게임 로직
│   ├── logic.ts            # 배치·줄 제거
│   ├── pieces.ts           # 블록 모양 생성
│   ├── ranking.ts          # 랭킹 저장
│   └── personalization.ts  # 이름 기반 문구
└── assets/                 # 아이콘·스플래시
```

## 게임 방법

1. 처음 실행 시 **이름**을 입력합니다.
2. 아래에 나온 블록 3개 중 하나를 위 판으로 끌어다 놓습니다.
3. 가로 또는 세로 한 줄이 가득 차면 사라지고 점수가 올라갑니다.
4. 블록 3개를 모두 사용하면 새 블록 3개가 나옵니다.
5. 더 이상 놓을 수 없으면 게임 오버입니다.

## 앱 정보

| 항목 | 값 |
|---|---|
| 스토어 앱 이름 | OO이 테트리스 |
| Android 패키지 | `com.nametetris.app` |
| iOS 번들 ID | `com.nametetris.app` |

## 라이선스

Private — 개인 프로젝트