# 폰에 게임 설치 도와주기 (최대한 자동)
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path $PSScriptRoot -Parent
$apkSource = Join-Path $projectRoot "releases\OOi-Tetris-test.apk"
$installDir = Join-Path $projectRoot "install"
$apkDest = Join-Path $installDir "OOi-Tetris-test.apk"
$port = 8765
$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"

if (-not (Test-Path $apkSource)) {
    Write-Host "APK가 없어서 먼저 만듭니다..." -ForegroundColor Yellow
    & (Join-Path $PSScriptRoot "build-apk-local.ps1")
}

New-Item -ItemType Directory -Force -Path $installDir | Out-Null
Copy-Item $apkSource $apkDest -Force

# USB 연결된 폰이 있으면 바로 설치
if (Test-Path $adb) {
    $devices = & $adb devices | Select-Object -Skip 1 | Where-Object { $_ -match "device$" }
    if ($devices) {
        Write-Host "USB로 연결된 폰에 바로 설치합니다!" -ForegroundColor Green
        & $adb install -r $apkDest
        Write-Host "설치 완료! 폰에서 'OO이 테트리스' 앱을 찾아보세요." -ForegroundColor Green
        exit 0
    }
}

# Wi-Fi로 다운로드 링크 제공
$ip = (Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -like '192.168.*' -or $_.IPAddress -like '10.*' } |
    Select-Object -First 1).IPAddress

if (-not $ip) {
    $ip = "PC의IP주소"
}

$url = "http://${ip}:${port}"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OO이 테트리스 - 폰 설치" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "폰과 PC가 같은 Wi-Fi에 연결되어 있어야 해요!" -ForegroundColor White
Write-Host ""
Write-Host "폰 브라우저(크롬)에서 이 주소를 열어주세요:" -ForegroundColor White
Write-Host ""
Write-Host "  $url" -ForegroundColor Green
Write-Host ""
Write-Host "그다음 '게임 다운로드' 버튼만 누르면 끝!" -ForegroundColor White
Write-Host ""
Write-Host "(이 창을 닫지 마세요. 서버가 실행 중입니다)" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $installDir
python -m http.server $port