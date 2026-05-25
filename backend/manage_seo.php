<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

// Ensure table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS seo_meta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_path VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    keywords TEXT,
    og_image VARCHAR(255),
    canonical_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // If a specific path is requested
    if (isset($_GET['path'])) {
        $stmt = $pdo->prepare("SELECT * FROM seo_meta WHERE page_path = ?");
        $stmt->execute([$_GET['path']]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result ? $result : []);
        exit;
    }
    
    // Otherwise return all SEO records
    $stmt = $pdo->query("SELECT * FROM seo_meta ORDER BY page_path ASC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === 'POST') {
    // Basic Auth Check
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    if ($authHeader !== 'Bearer elaura_admin_2026') {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit;
    }

    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    $isMultipart = strpos($contentType, 'multipart/form-data') !== false;

    if ($isMultipart) {
        $data = (object) $_POST;
    } else {
        $data = json_decode(file_get_contents("php://input"));
    }

    $action = $data->action ?? '';

    if ($action === 'save') {
        $page_path = trim($data->page_path ?? '');
        $title = trim($data->title ?? '');
        $description = trim($data->description ?? '');
        $keywords = trim($data->keywords ?? '');
        $canonical_url = trim($data->canonical_url ?? '');
        $og_image = trim($data->og_image ?? '');

        // Handle File Upload for OG Image
        if (isset($_FILES['imageFile']) && $_FILES['imageFile']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../public/uploads/seo/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $fileName = time() . '_' . basename($_FILES['imageFile']['name']);
            $targetFilePath = $uploadDir . $fileName;
            if (move_uploaded_file($_FILES['imageFile']['tmp_name'], $targetFilePath)) {
                $og_image = '/uploads/seo/' . $fileName;
            }
        }

        if ($page_path && $title) {
            // Check if exists
            $stmt = $pdo->prepare("SELECT id FROM seo_meta WHERE page_path = ?");
            $stmt->execute([$page_path]);
            $exists = $stmt->fetchColumn();

            if ($exists) {
                $stmt = $pdo->prepare("UPDATE seo_meta SET title=?, description=?, keywords=?, og_image=?, canonical_url=? WHERE page_path=?");
                $stmt->execute([$title, $description, $keywords, $og_image, $canonical_url, $page_path]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO seo_meta (page_path, title, description, keywords, og_image, canonical_url) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$page_path, $title, $description, $keywords, $og_image, $canonical_url]);
            }
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Path and Title are required"]);
        }
    }
    elseif ($action === 'delete') {
        $id = $data->id ?? null;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM seo_meta WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success"]);
        }
    }
}
