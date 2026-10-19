<?php
/**
 * Mail Configuration for HVAC Form Suite
 * 
 * Securely loads credentials and configuration from .env file.
 * Zero external dependencies.
 */

// Hàm hỗ trợ nạp file .env an toàn
if (!function_exists('loadEnvFile')) {
    function loadEnvFile($envPath) {
        if (!file_exists($envPath) || !is_readable($envPath)) {
            return false;
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            // Bỏ qua dòng comment (#) hoặc dòng rỗng
            if ($line === '' || strpos($line, '#') === 0) {
                continue;
            }

            // Tách key và value ở dấu '=' đầu tiên
            $pos = strpos($line, '=');
            if ($pos === false) {
                continue;
            }

            $key = trim(substr($line, 0, $pos));
            $val = trim(substr($line, $pos + 1));

            // Bỏ dấu ngoặc kép hoặc ngoặc đơn nếu có
            if (strlen($val) >= 2) {
                $first = $val[0];
                $last = substr($val, -1);
                if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                    $val = substr($val, 1, -1);
                }
            }

            $_ENV[$key] = $val;
            putenv("{$key}={$val}");
        }
        return true;
    }
}

// Tìm và nạp file .env ở thư mục gốc hoặc cùng cấp
$rootDir = dirname(__DIR__);
$envLoaded = loadEnvFile($rootDir . '/.env') || loadEnvFile(__DIR__ . '/.env');

// Hàm đọc biến môi trường kèm giá trị mặc định
if (!function_exists('getEnvVal')) {
    function getEnvVal($key, $default = '') {
        if (isset($_ENV[$key])) {
            return $_ENV[$key];
        }
        $val = getenv($key);
        if ($val !== false) {
            return $val;
        }
        return $default;
    }
}

return [
    // Bật DEV_MODE
    'DEV_MODE' => filter_var(getEnvVal('DEV_MODE', 'true'), FILTER_VALIDATE_BOOLEAN),

    // Phương thức gửi: 'smtp' hoặc 'mail'
    'MAIL_DRIVER' => getEnvVal('MAIL_DRIVER', 'smtp'),

    // Cấu hình SMTP đọc từ .env
    'SMTP' => [
        'HOST' => getEnvVal('SMTP_HOST', 'smtp.gmail.com'),
        'PORT' => intval(getEnvVal('SMTP_PORT', 587)),
        'SECURE' => strtolower(getEnvVal('SMTP_SECURE', 'tls')),
        'AUTH' => true,
        'USERNAME' => getEnvVal('SMTP_USERNAME', ''),
        'PASSWORD' => getEnvVal('SMTP_PASSWORD', ''),
        'TIMEOUT' => intval(getEnvVal('SMTP_TIMEOUT', 15)),
    ],

    // Người nhận mặc định
    'DEFAULT_TO' => getEnvVal('MAIL_DEFAULT_TO', 'treydurden@gmail.com'),

    // Thông tin người gửi mặc định
    'FROM_EMAIL' => getEnvVal('FROM_EMAIL', 'service@hvaccomfort.com'),
    'FROM_NAME' => getEnvVal('FROM_NAME', 'HVAC Comfort Services'),

    // Thư mục lưu trữ bản sao email
    'STORAGE_DIR' => $rootDir . '/storage/sent_emails',
];
