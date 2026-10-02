#!/usr/bin/env pwsh
# Auto-push script for Global Youth Dialogue
$env:PATH += ";C:\Program Files\Git\bin"
Set-Location "d:\antigravity\Mubashir"
git add -A
$msg = "auto: update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $msg
git push origin main
