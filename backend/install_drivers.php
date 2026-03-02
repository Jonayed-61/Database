<?php
set_time_limit(300);

$phpExtDir = 'C:/xampp/php/ext/';
$phpIni = 'C:/xampp/php/php.ini';
$tmpZip = 'C:/xampp/php/ext/sqlsrv_drivers.zip';
$extractDir = 'C:/xampp/php/ext/sqlsrv_temp/';

// CORRECT download URL from GitHub API
$url = 'https://github.com/microsoft/msphpsql/releases/download/v5.12.0/Windows_5.12.0RTW.zip';

echo "Step 1: Downloading PHP 8.2 SQLSRV drivers from: $url\n";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36');
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 180);
$data = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    echo "CURL Error: $err\n";
    exit(1);
}

echo "HTTP response code: $httpCode\n";
echo "Downloaded " . strlen($data) . " bytes\n";

if ($httpCode !== 200 || strlen($data) < 10000) {
    echo "Download failed or too small: " . substr($data, 0, 500) . "\n";
    exit(1);
}

file_put_contents($tmpZip, $data);
echo "Saved to: $tmpZip\n";

echo "\nStep 2: Extracting ZIP...\n";
if (!is_dir($extractDir)) mkdir($extractDir, 0777, true);

$zip = new ZipArchive();
if ($zip->open($tmpZip) === TRUE) {
    $zip->extractTo($extractDir);
    $zip->close();
    echo "Extraction complete.\n";
} else {
    echo "Failed to open ZIP file.\n";
    exit(1);
}

echo "\nFiles in extracted folder:\n";
$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($extractDir));
foreach ($it as $file) {
    if ($file->isFile()) {
        echo "  " . $file->getPathname() . "\n";
    }
}

echo "\nStep 3: Copying DLLs to XAMPP ext folder...\n";
$copied = [];
$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($extractDir));
foreach ($it as $file) {
    if ($file->isFile() && strpos(strtolower($file->getFilename()), 'sqlsrv') !== false && substr($file->getFilename(), -4) === '.dll') {
        $dest = $phpExtDir . $file->getFilename();
        if (copy($file->getPathname(), $dest)) {
            echo "Copied: " . $file->getFilename() . "\n";
            $copied[] = $file->getFilename();
        } else {
            echo "FAILED to copy: " . $file->getFilename() . "\n";
        }
    }
}

if (empty($copied)) {
    echo "No DLLs found!\n";
    exit(1);
}

echo "\nStep 4: Updating php.ini...\n";
$iniContent = file_get_contents($phpIni);

// We want the TS x64 versions for PHP 8.2 thread-safe
$priorityDlls = ['php_pdo_sqlsrv_82_ts_x64.dll', 'php_sqlsrv_82_ts_x64.dll'];
$toAdd = [];
foreach ($priorityDlls as $dll) {
    if (in_array($dll, $copied) && strpos($iniContent, $dll) === false) {
        $toAdd[] = "extension=$dll";
    }
}
if (empty($toAdd)) {
    foreach ($copied as $dll) {
        if (strpos($iniContent, $dll) === false) {
            $toAdd[] = "extension=$dll";
        }
    }
}

if ($toAdd) {
    $addLines = "\n; PHP SQL Server Drivers\n" . implode("\n", $toAdd) . "\n";
    file_put_contents($phpIni, $iniContent . $addLines);
    echo "Added to php.ini:\n" . implode("\n", $toAdd) . "\n";
} else {
    echo "php.ini already has these extensions.\n";
}

// Cleanup
@unlink($tmpZip);

echo "\n=== DONE! ===\n";
echo "Please restart Apache in XAMPP.\n";
echo "Then test by visiting: http://localhost:8000/test_mssql.php\n";
?>
