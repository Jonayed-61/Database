<?php
$phpIni = 'C:/xampp/php/php.ini';
$content = file_get_contents($phpIni);

// Check current entries
preg_match_all('/extension=php.*sqlsrv.*\.dll/i', $content, $matches);
echo "Current SQLSRV entries in php.ini:\n";
foreach ($matches[0] as $m) echo "  $m\n";

// Make sure we have the ts_x64 ones (for thread-safe PHP)
$needed = [
    'extension=php_pdo_sqlsrv_82_ts_x64.dll',
    'extension=php_sqlsrv_82_ts_x64.dll',
];
$toAdd = [];
foreach ($needed as $ext) {
    $dllName = str_replace('extension=', '', $ext);
    if (strpos($content, $dllName) === false) {
        $toAdd[] = $ext;
        echo "Need to add: $ext\n";
    } else {
        echo "Already present: $dllName\n";
    }
}
if ($toAdd) {
    $append = "\n; PHP SQLSRV Drivers (Thread-Safe x64)\n" . implode("\n", $toAdd) . "\n";
    file_put_contents($phpIni, $content . $append);
    echo "Added missing entries.\n";
}
echo "Done!\n";
?>
