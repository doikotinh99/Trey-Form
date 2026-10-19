<?php
/**
 * Automated Email Sender API for HVAC Forms
 * Pure PHP, zero-dependency SMTP & local preview logger.
 */

// Headers CORS & JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json; charset=utf-8");

$config = require __DIR__ . '/mail-config.php';

// Đọc dữ liệu JSON gửi lên
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    echo json_encode([
        'success' => false,
        'error' => 'Dữ liệu JSON không hợp lệ hoặc rỗng.'
    ]);
    exit;
}

$to = filter_var(trim($data['to'] ?? ''), FILTER_SANITIZE_EMAIL);
$subject = trim($data['subject'] ?? 'HVAC Document');
$htmlContent = trim($data['html_content'] ?? '');
$companyName = trim($data['company_name'] ?? ($config['FROM_NAME'] ?? 'HVAC Comfort Services'));
$docNumber = trim($data['doc_number'] ?? '');

// Kiểm tra tính hợp lệ
if (empty($to) || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'error' => 'Địa chỉ email người nhận (To) không hợp lệ: ' . htmlspecialchars($to)
    ]);
    exit;
}

if (empty($htmlContent)) {
    echo json_encode([
        'success' => false,
        'error' => 'Nội dung email (HTML) bị rỗng.'
    ]);
    exit;
}

// Đảm bảo thư mục storage/sent_emails tồn tại
$storageDir = $config['STORAGE_DIR'] ?? (dirname(__DIR__) . '/storage/sent_emails');
if (!is_dir($storageDir)) {
    mkdir($storageDir, 0777, true);
}

// Lưu bản sao email thành file HTML
$timestamp = date('Y-m-d_His');
$safeEmail = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $to);
$fileName = "mail_{$timestamp}_{$safeEmail}.html";
$filePath = $storageDir . '/' . $fileName;

$emailWrapper = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
{$htmlContent}
</body>
</html>
HTML;

file_put_contents($filePath, $emailWrapper);

$previewUrl = 'api/view-email.php?file=' . urlencode($fileName);

// Kiểm tra xem cấu hình SMTP đã được điền chưa
$smtp = $config['SMTP'] ?? [];
$hasSmtpCreds = !empty($smtp['USERNAME']) && !empty($smtp['PASSWORD']);

// Nếu chưa điền SMTP credentials hoặc đang bật DEV_MODE mà không có thông tin SMTP
if (!$hasSmtpCreds) {
    echo json_encode([
        'success' => true,
        'mode' => 'dev_preview',
        'message' => 'Email đã được tạo thành công và lưu vào hệ thống! (Chế độ Xem trước). Để gửi mail thật ra Internet, hãy điền tài khoản SMTP trong api/mail-config.php.',
        'file' => $fileName,
        'preview_url' => $previewUrl,
        'to' => $to,
        'subject' => $subject
    ]);
    exit;
}

// Nếu đã có thông tin SMTP, tiến hành gửi qua SMTP Socket
try {
    $mailer = new SimpleSMTPClient(
        $smtp['HOST'] ?? 'smtp.gmail.com',
        intval($smtp['PORT'] ?? 587),
        $smtp['SECURE'] ?? 'tls',
        $smtp['USERNAME'],
        $smtp['PASSWORD'],
        intval($smtp['TIMEOUT'] ?? 15)
    );

    $fromEmail = !empty($config['FROM_EMAIL']) ? $config['FROM_EMAIL'] : $smtp['USERNAME'];
    $fromName = !empty($companyName) ? $companyName : ($config['FROM_NAME'] ?? 'HVAC Service');

    $sent = $mailer->send($fromEmail, $fromName, $to, $subject, $emailWrapper);

    if ($sent) {
        echo json_encode([
            'success' => true,
            'mode' => 'smtp',
            'message' => "Đã gửi email thành công đến {$to} qua SMTP!",
            'file' => $fileName,
            'preview_url' => $previewUrl,
            'to' => $to,
            'subject' => $subject
        ]);
    } else {
        throw new Exception("Không gửi được email qua SMTP.");
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'mode' => 'smtp_error',
        'error' => 'Lỗi gửi SMTP: ' . $e->getMessage(),
        'file' => $fileName,
        'preview_url' => $previewUrl,
        'to' => $to,
        'subject' => $subject
    ]);
}

/**
 * Class gửi mail SMTP thuần không phụ thuộc thư viện ngoài
 */
class SimpleSMTPClient {
    private $host;
    private $port;
    private $secure;
    private $username;
    private $password;
    private $timeout;
    private $socket;

    public function __construct($host, $port, $secure, $username, $password, $timeout = 15) {
        $this->host = $host;
        $this->port = $port;
        $this->secure = strtolower($secure);
        $this->username = $username;
        $this->password = $password;
        $this->timeout = $timeout;
    }

    private function readResponse() {
        $data = '';
        while ($line = fgets($this->socket, 515)) {
            $data .= $line;
            if (substr($line, 3, 1) === ' ') {
                break;
            }
        }
        return $data;
    }

    private function sendCommand($cmd, $expectedCode) {
        fwrite($this->socket, $cmd . "\r\n");
        $resp = $this->readResponse();
        $code = substr($resp, 0, 3);
        if ($code != $expectedCode) {
            throw new Exception("Lệnh {$cmd} thất bại. Phản hồi: {$resp}");
        }
        return $resp;
    }

    public function send($fromEmail, $fromName, $toEmail, $subject, $htmlBody) {
        $proto = ($this->secure === 'ssl') ? 'ssl://' : '';
        $this->socket = @stream_socket_client(
            $proto . $this->host . ':' . $this->port,
            $errno,
            $errstr,
            $this->timeout
        );

        if (!$this->socket) {
            throw new Exception("Không thể kết nối đến máy chủ SMTP {$this->host}:{$this->port} ($errstr)");
        }

        stream_set_timeout($this->socket, $this->timeout);
        $this->readResponse(); // Banner 220

        $this->sendCommand("EHLO " . gethostname(), 250);

        if ($this->secure === 'tls') {
            $this->sendCommand("STARTTLS", 220);
            $crypto = stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            if (!$crypto) {
                throw new Exception("Không thể thiết lập mã hóa TLS với máy chủ SMTP.");
            }
            $this->sendCommand("EHLO " . gethostname(), 250);
        }

        // Đăng nhập AUTH LOGIN
        $this->sendCommand("AUTH LOGIN", 334);
        $this->sendCommand(base64_encode($this->username), 334);
        $this->sendCommand(base64_encode($this->password), 235);

        // MAIL FROM & RCPT TO
        $this->sendCommand("MAIL FROM:<{$fromEmail}>", 250);
        $this->sendCommand("RCPT TO:<{$toEmail}>", 250);

        // DATA
        $this->sendCommand("DATA", 354);

        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';

        $headers = [
            "Date: " . date('r'),
            "From: {$encodedFromName} <{$fromEmail}>",
            "To: <{$toEmail}>",
            "Subject: {$encodedSubject}",
            "MIME-Version: 1.0",
            "Content-Type: text/html; charset=UTF-8",
            "Content-Transfer-Encoding: base64",
            "X-Mailer: HVAC-Form-Suite-Mailer"
        ];

        $payload = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($htmlBody));
        fwrite($this->socket, $payload . "\r\n.\r\n");
        $dataResp = $this->readResponse();
        if (substr($dataResp, 0, 3) != 250) {
            throw new Exception("Gửi dữ liệu thư thất bại: {$dataResp}");
        }

        $this->sendCommand("QUIT", 221);
        fclose($this->socket);

        return true;
    }
}
