<?php

if (!function_exists('loadEnvFile')) {
    function loadEnvFile($envPath) {
        if (!file_exists($envPath) || !is_readable($envPath)) {
            return false;
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '' || strpos($line, '#') === 0) {
                continue;
            }

            $pos = strpos($line, '=');
            if ($pos === false) {
                continue;
            }

            $key = trim(substr($line, 0, $pos));
            $val = trim(substr($line, $pos + 1));

            if (strlen($val) >= 2) {
                $first = $val[0];
                $last = substr($val, -1);
                if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                    $val = substr($val, 1, -1);
                }
            }

            if (!isset($GLOBALS['__APP_ENV'])) {
                $GLOBALS['__APP_ENV'] = [];
            }
            $GLOBALS['__APP_ENV'][$key] = $val;
            $_ENV[$key] = $val;
            $_SERVER[$key] = $val;

            if (function_exists('putenv')) {
                @putenv("{$key}={$val}");
            }
        }
        return true;
    }
}

$rootDir = dirname(__DIR__);
$envLoaded = loadEnvFile($rootDir . '/.env') || loadEnvFile(__DIR__ . '/.env');

if (!function_exists('getEnvVal')) {
    function getEnvVal($key, $default = '') {
        if (isset($GLOBALS['__APP_ENV'][$key])) {
            return $GLOBALS['__APP_ENV'][$key];
        }
        if (isset($_ENV[$key])) {
            return $_ENV[$key];
        }
        if (isset($_SERVER[$key])) {
            return $_SERVER[$key];
        }
        if (function_exists('getenv')) {
            $val = @getenv($key);
            if ($val !== false && $val !== null) {
                return $val;
            }
        }
        return $default;
    }
}

return [

    'DEV_MODE' => filter_var(getEnvVal('DEV_MODE', 'true'), FILTER_VALIDATE_BOOLEAN),

    'MAIL_DRIVER' => getEnvVal('MAIL_DRIVER', 'smtp'),

    'SMTP' => [
        'HOST' => getEnvVal('SMTP_HOST', 'smtp.gmail.com'),
        'PORT' => intval(getEnvVal('SMTP_PORT', 587)),
        'SECURE' => strtolower(getEnvVal('SMTP_SECURE', 'tls')),
        'AUTH' => true,
        'USERNAME' => getEnvVal('SMTP_USERNAME', ''),
        'PASSWORD' => getEnvVal('SMTP_PASSWORD', ''),
        'TIMEOUT' => intval(getEnvVal('SMTP_TIMEOUT', 15)),
    ],

    'DEFAULT_TO' => getEnvVal('MAIL_DEFAULT_TO', 'treydurden@gmail.com'),

    'FROM_EMAIL' => getEnvVal('FROM_EMAIL', 'service@hvaccomfort.com'),
    'FROM_NAME' => getEnvVal('FROM_NAME', 'HVAC Comfort Services'),

    'STORAGE_DIR' => $rootDir . '/storage/sent_emails',
];
