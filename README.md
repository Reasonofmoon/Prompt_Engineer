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