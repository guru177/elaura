<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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
    if (isset($data->whatYouLearn)) $data->whatYouLearn = json_decode($data->whatYouLearn);
    if (isset($data->curriculum)) $data->curriculum = json_decode($data->curriculum);
} else {
    $data = json_decode(file_get_contents("php://input"));
}

if (isset($data->title) && isset($data->category)) {
    $id = isset($data->id) ? $data->id : null;
    $title = $data->title;
    $image = $data->image ?? '';
    
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

    $description = $data->description ?? '';
    $coursesCount = $data->coursesCount ?? '';
    $lessonsCount = $data->lessonsCount ?? '';
    $duration = $data->duration ?? '';
    $category = $data->category ?? '';
    $overview = $data->overview ?? '';
    $whatYouLearn = isset($data->whatYouLearn) ? json_encode($data->whatYouLearn) : '[]';
    $curriculum = isset($data->curriculum) ? json_encode($data->curriculum) : '[]';

    try {
        if ($id) {
            // Update
            $sql = "UPDATE courses SET title=?, image=?, description=?, coursesCount=?, lessonsCount=?, duration=?, category=?, overview=?, whatYouLearn=?, curriculum=? WHERE id=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$title, $image, $description, $coursesCount, $lessonsCount, $duration, $category, $overview, $whatYouLearn, $curriculum, $id]);
            echo json_encode(["status" => "success", "message" => "Course updated successfully."]);
        } else {
            // Insert
            $sql = "INSERT INTO courses (title, image, description, coursesCount, lessonsCount, duration, category, overview, whatYouLearn, curriculum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$title, $image, $description, $coursesCount, $lessonsCount, $duration, $category, $overview, $whatYouLearn, $curriculum]);
            echo json_encode(["status" => "success", "message" => "Course created successfully.", "id" => $pdo->lastInsertId()]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data."]);
}
?>
