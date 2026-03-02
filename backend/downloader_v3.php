<?php
$url = 'https://github.com/microsoft/msphpsql/releases/download/v5.12.0/Windows-8.2.zip';
$file = 'e:/3.1/Database-main/backend/php_drivers_82.zip';
$options = [
    "http" => [
        "method" => "GET",
        "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36\r\n"
    ]
];
$context = stream_context_create($options);
echo "Downloading $url...\n";
$data = file_get_contents($url, false, $context);
if ($data !== false) {
    file_put_contents($file, $data);
    echo "Success! Size: " . strlen($data) . " bytes\n";
} else {
    echo "Failed to download.\n";
}
?>
