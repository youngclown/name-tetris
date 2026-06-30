# 로컬 APK 빌드 (Expo 로그인 불필요)
# 필요: Android Studio + Android SDK

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $projectRoot

$javaHome = "$env:LOCALAPPDATA\Programs\Android Studio\jbr"
$androidHome = "$env:LOCALAPPDATA\Android\Sdk"

if (-not (Test-Path $javaHome)) {
    Write-Host "Android Studio JBR를 찾을 수 없습니다: $javaHome" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $androidHome)) {
    Write-Host "Android SDK를 찾을 수 없습니다: $androidHome" -ForegroundColor Red
    exit 1
}

$env:JAVA_HOME = $javaHome
$env:ANDROID_HOME = $androidHome
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

Write-Host "=== OO이 테트리스 로컬 APK 빌드 ===" -ForegroundColor Cyan

if (-not (Test-Path "android")) {
    Write-Host "Android 프로젝트 생성 중..." -ForegroundColor Yellow
    npx expo prebuild --platform android --no-install
}

Write-Host "APK 빌드 중... (5~10분 소요)" -ForegroundColor Yellow
Set-Location android
.\gradlew.bat assembleDebug --no-daemon
Set-Location $projectRoot

$sourceApk = "android\app\build\outputs\apk\debug\app-debug.apk"
$destDir = "releases"
$destApk = "$destDir\OOi-Tetris-test.apk"

New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Copy-Item $sourceApk $destApk -Force

$sizeMb = [math]::Round((Get-Item $destApk).Length / 1MB, 1)
Write-Host ""
Write-Host "빌드 완료!" -ForegroundColor Green
Write-Host "APK: $((Resolve-Path $destApk).Path) ($sizeMb MB)" -ForegroundColor Green
Write-Host "폰으로 보내서 설치하세요." -ForegroundColor Green