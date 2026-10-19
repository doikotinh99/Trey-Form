<?php
/**
 * Mail Configuration for HVAC Form Suite
 * 
 * Supports:
 * - SMTP (Gmail, SendGrid, custom SMTP)
 * - PHP mail() (Laragon sendmail)
 * - DEV_MODE: Auto-saves sent emails to storage/sent_emails/ for instant browser preview
 */

return [
    // Bật DEV_MODE: Luôn lưu một bản sao email HTML vào storage/sent_emails/ để xem trước trực tiếp trên web
    'DEV_MODE' => true,

    // Phương thức gửi: 'smtp' hoặc 'mail'
    'MAIL_DRIVER' => 'smtp',

    // Cấu hình SMTP (mặc định cấu hình cho Gmail SMTP)
    'SMTP' => [
        'HOST' => 'smtp.gmail.com',
        'PORT' => 587,
        'SECURE' => 'tls', // 'tls' (cổng 587) hoặc 'ssl' (cổng 465)
        'AUTH' => true,
        // Điền email Gmail của bạn (ví dụ: yourcompany@gmail.com)
        'USERNAME' => 'doikotinh99@gmail.com',
        // Điền Mật khẩu ứng dụng Google (Google App Password 16 ký tự, KHÔNG dùng pass đăng nhập thường)
        // Lấy tại: https://myaccount.google.com/apppasswords
        'PASSWORD' => 'balf ojzh pskn yrac',
        'TIMEOUT' => 15,
    ],

    // Thông tin người gửi mặc định
    'FROM_EMAIL' => 'service@hvaccomfort.com',
    'FROM_NAME' => 'HVAC Comfort Services',

    // Thư mục lưu trữ bản sao email
    'STORAGE_DIR' => dirname(__DIR__) . '/storage/sent_emails',
];
