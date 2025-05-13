
<?php
// Avatar yükleme API'si
require_once '../config.php';

// Sadece POST isteklerine izin ver
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Sadece POST metoduna izin verilmektedir', 405);
}

try {
    // Kullanıcıyı doğrula
    $user = authorize();
    
    // Upload klasörünü kontrol et ve oluştur
    $uploadDir = '../../uploads/avatars/';
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            errorResponse('Upload dizini oluşturulamadı', 500);
        }
    }
    
    // Dosya geldi mi kontrol et
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        errorResponse('Dosya yüklenirken bir hata oluştu: ' . ($_FILES['file']['error'] ?? 'Dosya gönderilmedi'), 400);
    }
    
    // Dosya türünü kontrol et
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $fileType = $_FILES['file']['type'];
    
    if (!in_array($fileType, $allowedTypes)) {
        errorResponse('Sadece JPEG, PNG, GIF ve WEBP dosyaları yüklenebilir', 400);
    }
    
    // Dosya boyutunu kontrol et (5MB max)
    $maxFileSize = 5 * 1024 * 1024; // 5MB
    if ($_FILES['file']['size'] > $maxFileSize) {
        errorResponse('Dosya boyutu en fazla 5MB olabilir', 400);
    }
    
    // Dosya adını oluştur (kullanıcı id + timestamp + uzantı)
    $fileExtension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
    $newFileName = 'avatar_' . $user['id'] . '_' . time() . '.' . $fileExtension;
    $targetPath = $uploadDir . $newFileName;
    
    // Dosyayı taşı
    if (!move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
        errorResponse('Dosya kaydedilirken bir hata oluştu', 500);
    }
    
    // Dosyayı küçült
    $resizedPath = $uploadDir . 'resized_' . $newFileName;
    resizeImage($targetPath, $resizedPath, 300, 300);
    
    // Başarılıysa orijinal dosyayı sil ve küçültülmüş dosyayı kullan
    if (file_exists($resizedPath)) {
        unlink($targetPath);
        $avatarPath = 'uploads/avatars/resized_' . $newFileName;
    } else {
        // Küçültme başarısız olursa orijinal dosyayı kullan
        $avatarPath = 'uploads/avatars/' . $newFileName;
    }
    
    // Veritabanında avatar alanını güncelle
    $conn = getConnection();
    $stmt = $conn->prepare("UPDATE ogrenciler SET avatar = :avatar WHERE id = :id");
    
    $stmt->bindParam(':avatar', $avatarPath);
    $stmt->bindParam(':id', $user['id']);
    $stmt->execute();
    
    // Başarılı yanıt döndür
    successResponse([
        'file_url' => $avatarPath,
        'message' => 'Avatar başarıyla güncellendi'
    ]);
    
} catch (PDOException $e) {
    errorResponse('Veritabanı hatası: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    errorResponse('Beklenmeyen bir hata oluştu: ' . $e->getMessage(), 500);
}

// Resim boyutlandırma fonksiyonu
function resizeImage($sourcePath, $destinationPath, $width, $height) {
    // Kaynak resim bilgilerini al
    list($sourceWidth, $sourceHeight, $sourceType) = getimagesize($sourcePath);
    
    // Kaynak resmi yükle
    switch ($sourceType) {
        case IMAGETYPE_JPEG:
            $sourceImage = imagecreatefromjpeg($sourcePath);
            break;
        case IMAGETYPE_PNG:
            $sourceImage = imagecreatefrompng($sourcePath);
            break;
        case IMAGETYPE_GIF:
            $sourceImage = imagecreatefromgif($sourcePath);
            break;
        default:
            return false;
    }
    
    // En-boy oranını koruyacak şekilde boyutlandır
    $ratio = min($width / $sourceWidth, $height / $sourceHeight);
    $newWidth = $sourceWidth * $ratio;
    $newHeight = $sourceHeight * $ratio;
    
    // Yeni resim oluştur
    $destinationImage = imagecreatetruecolor($newWidth, $newHeight);
    
    // PNG için şeffaflığı koru
    if ($sourceType == IMAGETYPE_PNG) {
        imagealphablending($destinationImage, false);
        imagesavealpha($destinationImage, true);
        $transparent = imagecolorallocatealpha($destinationImage, 255, 255, 255, 127);
        imagefilledrectangle($destinationImage, 0, 0, $newWidth, $newHeight, $transparent);
    }
    
    // Resmi yeniden boyutlandır
    imagecopyresampled(
        $destinationImage, $sourceImage,
        0, 0, 0, 0,
        $newWidth, $newHeight, $sourceWidth, $sourceHeight
    );
    
    // Yeni resmi kaydet
    switch ($sourceType) {
        case IMAGETYPE_JPEG:
            imagejpeg($destinationImage, $destinationPath, 90);
            break;
        case IMAGETYPE_PNG:
            imagepng($destinationImage, $destinationPath, 9);
            break;
        case IMAGETYPE_GIF:
            imagegif($destinationImage, $destinationPath);
            break;
    }
    
    // Bellekten temizle
    imagedestroy($sourceImage);
    imagedestroy($destinationImage);
    
    return true;
}
