# OO이 테트리스 - 테스트 APK 빌드 스크립트
# 사전 준비: https://expo.dev 가입 후 `npx eas-cli login` 실행

Set-Location $PSScriptRoot\..

Write-Host "=== OO이 테트리스 APK 빌드 ===" -ForegroundColor Cyan
Write-Host ""

$eas = "npx eas-cli"
& $eas whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Expo 로그인이 필요합니다." -ForegroundColor Yellow
    Write-Host "다음 명령을 실행하세요: npx eas-cli login" -ForegroundColor Yellow
    exit 1
}

Write-Host "Android APK 빌드를 시작합니다 (EAS 클라우드)..." -ForegroundColor Green
& $eas build --platform android --profile preview

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "빌드가 완료되면 https://expo.dev 에서 APK를 다운로드할 수 있습니다." -ForegroundColor Green
}