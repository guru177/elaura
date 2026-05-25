<?php
// backend/manage_testimonials.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM trainers ORDER BY id DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === 'POST') {
    // Check Auth
    $headers = apache_request_headers();
    $authHeader = '';
    if (isset($headers['Authorization'])) { $authHeader = $headers['Authorization']; }
    elseif (isset($headers['authorization'])) { $authHeader = $headers['authorization']; }
    elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) { $authHeader = $_SERVER['HTTP_AUTHORIZATION']; }
    
    $token = trim(str_replace('Bearer ', '', $authHeader));
    $SECRET_TOKEN = 'elaura_admin_2026';
    
    if ($token !== $SECRET_TOKEN) {
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

    if ($action === 'add' || $action === 'edit') {
        $id = $data->id ?? null;
        $name = trim($data->name ?? '');
        $role = trim($data->role ?? '');
        $image = trim($data->image ?? '');
        $description = trim($data->description ?? '');

        // Handle File Upload
        if (isset($_FILES['imageFile']) && $_FILES['imageFile']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../public/uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $fileName = time() . '_' . basename($_FILES['imageFile']['name']);
            $targetFilePath = $uploadDir . $fileName;
            if (move_uploaded_file($_FILES['imageFile']['tmp_name'], $targetFilePath)) {
                $image = '/uploads/' . $fileName;
            }
        }

        if ($name && $description) {
            if ($action === 'add') {
                $stmt = $pdo->prepare("INSERT INTO trainers (name, role, image, description) VALUES (?, ?, ?, ?)");
                $stmt->execute([$name, $role, $image, $description]);
                echo json_encode(["status" => "success", "id" => $pdo->lastInsertId()]);
            } else {
                $stmt = $pdo->prepare("UPDATE trainers SET name = ?, role = ?, image = ?, description = ? WHERE id = ?");
                $stmt->execute([$name, $role, $image, $description, $id]);
                echo json_encode(["status" => "success"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Name and description required"]);
        }
    }
    elseif ($action === 'delete') {
        $id = $data->id ?? null;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM trainers WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success"]);
        }
    }
    exit;
}
?>
