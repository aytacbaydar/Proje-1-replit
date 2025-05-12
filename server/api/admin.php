<?php
// Admin yönetim API'si
require_once '../config.php';

// Kullanıcı listesi
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Admin yetkisini kontrol et
        authorizeAdmin();
        
        $conn = getConnection();
        
        // Tüm öğrencileri getir
        $stmt = $conn->prepare("
            SELECT o.id, o.adi_soyadi, o.email, o.cep_telefonu, o.rutbe, o.aktif, o.avatar, o.created_at,
                   ob.okulu, ob.sinifi, ob.grubu, ob.ders_gunu, ob.ders_saati, ob.ucret
            FROM ogrenciler o
            LEFT JOIN ogrenci_bilgileri ob ON o.id = ob.ogrenci_id
            ORDER BY o.id DESC
        ");
        $stmt->execute();
        
        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        successResponse($students);
        
    } catch (PDOException $e) {
        errorResponse('Veritabanı hatası: ' . $e->getMessage(), 500);
    } catch (Exception $e) {
        errorResponse('Beklenmeyen bir hata oluştu: ' . $e->getMessage(), 500);
    }
}
// Öğrenci silme
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        // Admin yetkisini kontrol et
        $admin = authorizeAdmin();
        
        // URL'den ID parametresini al
        $requestUri = $_SERVER['REQUEST_URI'];
        $parts = explode('/', $requestUri);
        $studentId = intval(end($parts));
        
        if (!$studentId) {
            errorResponse('Geçerli bir öğrenci ID'si belirtilmelidir');
        }
        
        // Admin kendisini silemez
        if ($studentId === $admin['id']) {
            errorResponse('Kendi hesabınızı silemezsiniz', 403);
        }
        
        $conn = getConnection();
        
        // Önce öğrenciyi kontrol et
        $stmt = $conn->prepare("SELECT id FROM ogrenciler WHERE id = :id");
        $stmt->bindParam(':id', $studentId);
        $stmt->execute();
        
        if ($stmt->rowCount() === 0) {
            errorResponse('Öğrenci bulunamadı', 404);
        }
        
        // İşlemi transaction içinde yap
        $conn->beginTransaction();
        
        // Önce öğrenci detaylarını sil (foreign key constraint nedeniyle)
        $stmt = $conn->prepare("DELETE FROM ogrenci_bilgileri WHERE ogrenci_id = :id");
        $stmt->bindParam(':id', $studentId);
        $stmt->execute();
        
        // Sonra öğrenciyi sil
        $stmt = $conn->prepare("DELETE FROM ogrenciler WHERE id = :id");
        $stmt->bindParam(':id', $studentId);
        $stmt->execute();
        
        $conn->commit();
        
        successResponse(null, 'Öğrenci başarıyla silindi');
        
    } catch (PDOException $e) {
        if (isset($conn) && $conn->inTransaction()) {
            $conn->rollBack();
        }
        errorResponse('Veritabanı hatası: ' . $e->getMessage(), 500);
    } catch (Exception $e) {
        if (isset($conn) && $conn->inTransaction()) {
            $conn->rollBack();
        }
        errorResponse('Beklenmeyen bir hata oluştu: ' . $e->getMessage(), 500);
    }
}
// Yeni öğrenci ekleme (register.php aynı işlevi görüyor)
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Admin yetkisini kontrol et
    authorizeAdmin();
    
    // register.php'yi çağır
    require_once 'register.php';
}
// Diğer HTTP metodlarını reddet
else {
    errorResponse('Bu endpoint sadece GET, POST ve DELETE metodlarını desteklemektedir', 405);
}
