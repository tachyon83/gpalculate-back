# gpalculate-back

컨트롤러 분할 시

같은 함수가 여기저기 내부에서 중복 정의되고 있음
인증, 응답, 에러 핸들러 등
resCode를 각 함수마다 req.app.get으로 부르는 것도 문제

