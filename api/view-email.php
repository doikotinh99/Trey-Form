<?php

$config = require __DIR__ . '/mail-config.php';
$storageDir = $config['STORAGE_DIR'] ?? (dirname(__DIR__) . '/storage/sent_emails');

$file = basename($_GET['file'] ?? '');

if (empty($file) || !file_exists($storageDir . '/' . $file)) {

    $files = glob($storageDir . '/*.html');
    if ($files) {
        usort($files, fn($a, $b) => filemtime($b) - filemtime($a));
        $file = basename($files[0]);
    } else {
        die("<h3>Chưa có email nào được lưu. Hãy thử nhấn 'Gửi Mail Tự Động' từ giao diện form!</h3>");
    }
}

$fullPath = $storageDir . '/' . $file;
$content = file_get_contents($fullPath);
$fileDate = date("d/m/Y H:i:s", filemtime($fullPath));
$fileSize = round(filesize($fullPath) / 1024, 1) . " KB";

$recentFiles = glob($storageDir . '/*.html');
usort($recentFiles, fn($a, $b) => filemtime($b) - filemtime($a));
$recentList = array_slice($recentFiles, 0, 10);
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Viewer - <?= htmlspecialchars($file) ?></title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; }
        .topbar { background: #1e293b; border-bottom: 1px solid #334155; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .topbar-left { display: flex; align-items: center; gap: 12px; }
        .badge { background: #10b981; color: #ffffff; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .title { font-size: 15px; font-weight: 600; color: #ffffff; }
        .meta { font-size: 12px; color: #94a3b8; }
        .topbar-right { display: flex; align-items: center; gap: 10px; }
        .btn-view { background: #334155; color: #f8fafc; border: 1px solid #475569; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; text-decoration: none; }
        .btn-view:hover { background: #475569; }
        .select-file { background: #0f172a; color: #cbd5e1; border: 1px solid #475569; padding: 6px 10px; border-radius: 6px; font-size: 12px; }
        .viewport { padding: 30px 16px; display: flex; justify-content: center; }
        .mail-frame-wrap { width: 100%; max-width: 780px; background: #ffffff; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4); overflow: hidden; }
        iframe { width: 100%; height: 860px; border: none; display: block; }
    </style>
</head>
<body>
    <div class="topbar">
        <div class="topbar-left">
            <span class="badge">EMAIL PREVIEW</span>
            <div>
                <div class="title"><?= htmlspecialchars($file) ?></div>
                <div class="meta">Đã tạo: <?= $fileDate ?> &bull; Dung lượng: <?= $fileSize ?></div>
            </div>
        </div>
        <div class="topbar-right">
            <select class="select-file" onchange="location.href='view-email.php?file='+this.value">
                <?php foreach ($recentList as $rf): $b = basename($rf); ?>
                    <option value="<?= htmlspecialchars($b) ?>" <?= $b === $file ? 'selected' : '' ?>>
                        <?= htmlspecialchars($b) ?> (<?= date("H:i:s d/m", filemtime($rf)) ?>)
                    </option>
                <?php endforeach; ?>
            </select>
            <button class="btn-view" onclick="toggleWidth(740)">Desktop View</button>
            <button class="btn-view" onclick="toggleWidth(420)">Mobile View</button>
            <a class="btn-view" href="<?= htmlspecialchars($file) ?>" target="_blank" download>Tải HTML</a>
        </div>
    </div>
    <div class="viewport">
        <div class="mail-frame-wrap" id="frameWrap">
            <iframe id="mailIframe" srcdoc="<?= htmlspecialchars($content, ENT_QUOTES, 'UTF-8') ?>"></iframe>
        </div>
    </div>
    <script>
        function toggleWidth(w) {
            document.getElementById('frameWrap').style.maxWidth = w + 'px';
        }

        window.addEventListener('load', function() {
            var ifr = document.getElementById('mailIframe');
            try {
                var doc = ifr.contentDocument || ifr.contentWindow.document;
                ifr.style.height = Math.max(doc.body.scrollHeight + 40, 700) + 'px';
            } catch(e){}
        });
    </script>
</body>
</html>
