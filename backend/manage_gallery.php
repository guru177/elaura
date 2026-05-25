<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

// Initialize the gallery table if it doesn't exist
$pdo->exec("CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// GET request - fetch all images
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM gallery ORDER BY sort_order ASC, created_at DESC");
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($images);
    exit;
}

// Ensure it's a POST request with authentication for admin actions
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
if ($authHeader !== 'Bearer elaura_admin_2026') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$action = $_POST['action'] ?? ($_GET['action'] ?? null);

if (!$action) {
    // Check if JSON payload was sent
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    if ($data && isset($data['action'])) {
        $action = $data['action'];
        $_POST = $data;
    }
}

if ($action === 'save') {
    $caption = $_POST['caption'] ?? '';
    $id = isset($_POST['id']) && $_POST['id'] !== 'null' ? intval($_POST['id']) : null;
    $imageUrl = $_POST['image_url'] ?? '';

    // Handle image upload if provided
    if (isset($_FILES['imageFile']) && $_FILES['imageFile']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../public/uploads/gallery/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileName = time() . '_' . basename($_FILES['imageFile']['name']);
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['imageFile']['tmp_name'], $targetPath)) {
            $imageUrl = '/uploads/gallery/' . $fileName;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to upload image.']);
            exit;
        }
    }

    if (!$imageUrl && !$id) {
        echo json_encode(['status' => 'error', 'message' => 'Image is required.']);
        exit;
    }

    if ($id) {
        // Update existing
        $stmt = $pdo->prepare("UPDATE gallery SET caption = ?, image_url = ? WHERE id = ?");
        $stmt->execute([$caption, $imageUrl, $id]);
    } else {
        // Insert new
        $stmt = $pdo->prepare("INSERT INTO gallery (caption, image_url) VALUES (?, ?)");
        $stmt->execute([$caption, $imageUrl]);
    }

    echo json_encode(['status' => 'success', 'message' => 'Image saved successfully']);
    exit;
}

if ($action === 'delete') {
    $id = $_POST['id'] ?? null;
    if ($id) {
        // Fetch image URL to delete the file
        $stmt = $pdo->prepare("SELECT image_url FROM gallery WHERE id = ?");
        $stmt->execute([$id]);
        $image = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($image && $image['image_url']) {
            $filePath = __DIR__ . '/../public' . $image['image_url'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $stmt = $pdo->prepare("DELETE FROM gallery WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'ID required']);
    }
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
