<?php
$url = 'https://github.com/microsoft/msphpsql/releases/download/v5.12.0/Windows-8.2.zip';
$file = 'e:/3.1/Database-main/backend/php_drivers_82.zip';
echo "Downloading $url...\n";
$fp = fopen($file, 'w+');
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_FILE, $fp);
curl_exec($ch);
curl_close($ch);
fclose($fp);
echo "Done. Size: " . filesize($file) . " bytes\n";
?>
