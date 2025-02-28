# Gemini Prompt Workbench

AI 프롬프트 작성, 분석, 최적화를 위한 워크벤치 애플리케이션입니다. Google의 Gemini API를 활용하여 프롬프트를 평가하고 개선합니다.

## 기능

- **프롬프트 에디터**: 프롬프트 작성 및 생성
- **평가**: 생성된 프롬프트의 품질, 명확성, 제약 조건 등을 평가
- **버전 관리**: 여러 버전의 프롬프트 저장 및 비교
- **테스트**: 프롬프트의 효과를 테스트
- **분석**: 프롬프트에 대한 자세한 분석 제공
- **업그레이드**: AI를 활용한 자동 프롬프트 개선

## 환경 설정

### 필수 요구사항

- Node.js 18 이상
- Google Gemini API 키

### 설치 방법

1. 저장소를 클론합니다:
```bash
git clone <repository-url>
cd prompt-engineer
```

2. 의존성을 설치합니다:
```bash
npm install
```

3. 환경 변수를 설정합니다:
   - 프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=<your-gemini-api-key>
   ```
   
4. 개발 서버를 실행합니다:
```bash
npm run dev
```

5. 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 사용할 수 있습니다.

## 배포 방법

### Vercel을 통한 배포

1. [Vercel](https://vercel.com)에 가입하고 GitHub 계정을 연결합니다.
2. 새 프로젝트를 생성하고 이 저장소를 선택합니다.
3. 환경 변수 섹션에서 `NEXT_PUBLIC_GEMINI_API_KEY`를 추가하고 값을 설정합니다.
4. 배포 버튼을 클릭하여 애플리케이션을 배포합니다.

## 라이센스

MIT

## 참고사항

- Gemini API 사용량에 따라 비용이 발생할 수 있으니 API 사용 정책을 확인하세요.
- API 키를 공개 저장소에 업로드하지 마세요.

# Prompt Engineer

프롬프트 엔지니어링을 위한 웹 어플리케이션으로, Gemini API를 활용하여 프롬프트를 최적화하고 평가할 수 있는 기능을 제공합니다.

## 주요 기능

- 프롬프트 에디터: 다양한 요소를 조합하여 프롬프트 작성
- 평가 도구: Gemini API를 통한 프롬프트 품질 평가
- 버전 관리: 작성한 프롬프트의 버전 저장 및 관리
- 프롬프트 테스트: 실제 Gemini API를 통한 프롬프트 테스트
- 분석 도구: 프롬프트의 강점과 약점 분석
- 자동 개선: AI를 통한 프롬프트 자동 개선 제안

## 설치 및 실행

1. 저장소 클론
   ```bash
   git clone https://github.com/Reasonofmoon/Prompt_Engineer.git
   cd Prompt_Engineer
   ```

2. 의존성 설치
   ```bash
   npm install
   # 또는
   yarn install
   ```

3. 환경 변수 설정
   `.env.local` 파일을 생성하고 다음 내용을 추가합니다:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=여러분의_API_키
   ```
   Gemini API 키는 [Google AI Studio](https://ai.google.dev/)에서 발급받을 수 있습니다.

4. 개발 서버 실행
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

5. 브라우저에서 `http://localhost:3000` 접속

## Vercel에 배포하기

### 1. 환경 변수 설정 (중요)

Vercel에 배포할 때는 반드시 환경 변수를 올바르게 설정해야 합니다:

1. Vercel 대시보드에서 프로젝트로 이동
2. Settings > Environment Variables 메뉴 선택
3. 새 환경 변수 추가:
   - **NAME**: `NEXT_PUBLIC_GEMINI_API_KEY`
   - **VALUE**: 여러분의 Gemini API 키 입력
4. "Add" 버튼 클릭
5. 프로젝트 재배포 (Deploy > Redeploy)

![환경 변수 설정](https://i.imgur.com/example-image.png)

### 2. API 오류 디버깅

만약 "Failed to upgrade the prompt with Gemini API. Using fallback upgrade" 오류가 발생한다면:

1. 브라우저 개발자 도구(F12)의 콘솔 탭에서 자세한 오류 메시지 확인
2. 다음 사항 체크:
   - Vercel에 환경 변수가 올바르게 설정되었는지 확인
   - API 키가 유효한지 확인
   - 너무 긴 프롬프트는 토큰 제한에 걸릴 수 있음 (간결하게 작성)

## 라이선스

MIT License 