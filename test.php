<?php
require 'backend/config.php';

$pdo->exec("CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    stars INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$stmt = $pdo->query("SELECT COUNT(*) FROM testimonials");
if ($stmt->fetchColumn() == 0) {
    $testimonials = [
        ['Sarah Jenkins', 'Senior Software Engineer', 'https://i.pravatar.cc/150?img=47', 'Elura Academy transformed my career trajectory. The hybrid learning experience and expert mentorship allowed me to master advanced architecture concepts seamlessly. Highly recommend to any ambitious professional!', 5],
        ['David Chen', 'Product Manager', 'https://i.pravatar.cc/150?img=11', 'Our company needed a pipeline of highly skilled developers, and Elura Academy delivered. The candidates we hired from their placement drives were exceptionally well-prepared and immediately impactful.', 5],
        ['Elena Rodriguez', 'UI/UX Lead', 'https://i.pravatar.cc/150?img=32', 'I love the variety of intensive tracks available! The curriculum is incredibly modern and aligned with exactly what top tech companies are looking for. The professional exposure is unmatched.', 5],
        ['Michael Carter', 'Data Scientist', 'https://i.pravatar.cc/150?img=60', 'The PG Diploma program is rigorous and exceptionally structured. The hands-on projects helped me build a portfolio that directly landed me my dream role. Best investment in my future.', 5],
        ['Aisha Patel', 'Frontend Developer', 'https://i.pravatar.cc/150?img=41', 'The environment here is unlike any other. The networking opportunities with industry leaders are genuinely top-tier. I made connections that were crucial for my career advancement.', 5],
        ['James Wilson', 'Tech Consultant', 'https://i.pravatar.cc/150?img=68', 'As an employer, Elura graduates consistently stand out during our interviews. They possess a perfect blend of theoretical knowledge and practical, modern coding skills.', 5]
    ];

    $insert = $pdo->prepare("INSERT INTO testimonials (name, role, image, text, stars) VALUES (?, ?, ?, ?, ?)");
    foreach ($testimonials as $t) {
        $insert->execute($t);
    }
    echo "Seeded!";
} else {
    echo "Already seeded!";
}
?>
