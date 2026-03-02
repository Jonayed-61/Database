[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$url = "https://github.com/microsoft/msphpsql/releases/download/v5.12.0/Windows_5.12.0RTW.zip"
$zipPath = "e:\3.1\Database-main\backend\sqlsrv_win.zip"
$extractPath = "e:\3.1\Database-main\backend\sqlsrv_ext"
$xamppExt = "C:\xampp\php\ext"
$phpIni = "C:\xampp\php\php.ini"

Write-Host "Downloading from: $url"
Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing
$size = (Get-Item $zipPath).Length
Write-Host "Downloaded: $size bytes"

if ($size -lt 100000) {
    Write-Host "ERROR: File too small. Download may have failed."
    exit 1
}

Write-Host "Extracting..."
if (Test-Path $extractPath) { Remove-Item $extractPath -Recurse -Force }
New-Item -ItemType Directory -Path $extractPath | Out-Null
Expand-Archive -LiteralPath $zipPath -DestinationPath $extractPath -Force
Write-Host "Extraction done."

Write-Host "Files found:"
Get-ChildItem -Path $extractPath -Recurse -Filter "*.dll" | Select-Object FullName

Write-Host "Copying DLLs..."
$dlls = Get-ChildItem -Path $extractPath -Recurse -Filter "*sqlsrv*82*ts*.dll"
foreach ($dll in $dlls) {
    Copy-Item $dll.FullName -Destination $xamppExt -Force
    Write-Host "Copied: $($dll.Name)"
}

Write-Host "Updating php.ini..."
$content = Get-Content $phpIni -Raw
$append = ""
foreach ($dll in $dlls) {
    if ($content -notmatch $dll.Name) {
        $append += "`nextension=$($dll.Name)"
        Write-Host "Adding: extension=$($dll.Name)"
    } else {
        Write-Host "Already in php.ini: $($dll.Name)"
    }
}
if ($append -ne "") {
    Add-Content -Path $phpIni -Value $append
}

Write-Host ""
Write-Host "=== DONE! ==="
Write-Host "Now restart Apache in XAMPP."
