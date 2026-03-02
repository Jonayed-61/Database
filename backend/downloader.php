<?php
$url = 'https://github.com/microsoft/msphpsql/releases/download/v5.12.0/SQLSRV512.EXE';
$file = 'e:/3.1/Database-main/backend/php_drivers.exe';
echo "Downloading $url to $file...\n";
if (copy($url, $file)) {
    echo "Success! File size: " . filesize($file) . " bytes\n";
} else {
    echo "Failed to download.\n";
}

$url2 = 'https://go.microsoft.com/fwlink/?linkid=2249006&clcid=0x409';
$file2 = 'e:/3.1/Database-main/backend/msodbcsql.msi';
echo "Downloading $url2 to $file2...\n";
if (copy($url2, $file2)) {
    echo "Success! File size: " . filesize($file2) . " bytes\n";
} else {
    echo "Failed to download.\n";
}
?>
