<?php
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
$pdo->exec("CREATE TABLE IF NOT EXISTS course_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM course_categories ORDER BY id DESC");
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

    $data = json_decode(file_get_contents("php://input"));
    $action = $data->action ?? '';

    if ($action === 'add') {
        $name = trim($data->name ?? '');
        if ($name) {
            $stmt = $pdo->prepare("INSERT INTO course_categories (name) VALUES (?)");
            $stmt->execute([$name]);
            echo json_encode(["status" => "success", "id" => $pdo->lastInsertId()]);
        }
    } elseif ($action === 'edit') {
        $id = $data->id ?? null;
        $name = trim($data->name ?? '');
        if ($id && $name) {
            $stmt = $pdo->prepare("UPDATE course_categories SET name = ? WHERE id = ?");
            $stmt->execute([$name, $id]);
            echo json_encode(["status" => "success"]);
        }
    } elseif ($action === 'delete') {
        $id = $data->id ?? null;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM course_categories WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid action"]);
    }
}
?>
