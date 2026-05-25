<?php
require 'config.php';

$jsonStr = '[
  {
    "title": "Certification Courses",
    "image": "/src/assets/course_1.jpg",
    "description": "Enroll now and take the first step towards a brighter tomorrow with our short-term certification.",
    "coursesCount": "3 Months",
    "lessonsCount": "English",
    "duration": "Govt. Approved",
    "category": "Certification",
    "overview": "Our Certification Courses are tailored for fast-paced learning. They equip you with highly focused, industry-ready skills that employers demand right now.",
    "whatYouLearn": ["Core fundamentals of your chosen field", "Practical implementation through live projects", "Industry best practices and standard workflows", "Professional communication"],
    "curriculum": [{"id": 1, "title": "Module 1: Fundamentals", "duration": "2 Weeks", "description": "Grasping the basic concepts and setting up your environment."}, {"id": 2, "title": "Module 2: Core Concepts", "duration": "4 Weeks", "description": "Deep dive into the primary technologies and tools."}, {"id": 3, "title": "Module 3: Advanced Applications", "duration": "4 Weeks", "description": "Applying what you learned to solve complex problems."}, {"id": 4, "title": "Module 4: Final Project", "duration": "2 Weeks", "description": "Capstone project, review, and certification exam prep."}]
  },
  {
    "title": "Diploma Courses",
    "image": "/src/assets/course_2.jpg",
    "description": "Comprehensive 8-month diploma programs designed to build strong foundational industry skills.",
    "coursesCount": "8 Months",
    "lessonsCount": "English",
    "duration": "Govt. Approved",
    "category": "Diploma",
    "overview": "Our Diploma programs offer a comprehensive educational journey, thoroughly preparing you for entry-level and mid-level technical roles in competitive industries.",
    "whatYouLearn": ["In-depth theoretical knowledge", "Extended hands-on lab sessions", "Collaborative teamwork in simulated environments", "Enterprise workflow and tools"],
    "curriculum": [{"id": 1, "title": "Semester 1: Basics", "duration": "2 Months", "description": "Foundation building and core theory."}, {"id": 2, "title": "Semester 2: Intermediate", "duration": "3 Months", "description": "Complex implementations and system architecture."}, {"id": 3, "title": "Semester 3: Specialization", "duration": "2 Months", "description": "Choosing a niche and mastering it."}, {"id": 4, "title": "Semester 4: Internship", "duration": "1 Month", "description": "Real-world experience with corporate partners."}]
  },
  {
    "title": "Advanced Diploma",
    "image": "/src/assets/course_3.jpg",
    "description": "Advanced curriculum for professionals aiming to specialize and excel in their chosen fields.",
    "coursesCount": "10 Months",
    "lessonsCount": "English",
    "duration": "Govt. Approved",
    "category": "Diploma",
    "overview": "Designed for ambitious learners, the Advanced Diploma pushes boundaries and explores cutting-edge technologies and leadership skills for modern businesses.",
    "whatYouLearn": ["Advanced system architectures", "Performance optimization and scaling", "Project management methodologies", "Tech leadership and mentoring"],
    "curriculum": [{"id": 1, "title": "Phase 1: Advanced Concepts", "duration": "3 Months", "description": "Moving beyond the basics into high-level design."}, {"id": 2, "title": "Phase 2: Optimization", "duration": "3 Months", "description": "Scaling, speed, and efficiency."}, {"id": 3, "title": "Phase 3: Leadership", "duration": "2 Months", "description": "Managing tech teams and resources."}, {"id": 4, "title": "Phase 4: Capstone", "duration": "2 Months", "description": "Building an enterprise-grade project."}]
  },
  {
    "title": "PG Diploma",
    "image": "/src/assets/course_4.jpg",
    "description": "Post-graduate level diploma tracks focusing on high-level expertise and practical application.",
    "coursesCount": "12 Months",
    "lessonsCount": "English",
    "duration": "Govt. Approved",
    "category": "Diploma",
    "overview": "The PG Diploma is our most rigorous offering, equivalent to a master\'s level specialization, preparing you for senior technical, strategic, and management roles.",
    "whatYouLearn": ["Enterprise-scale systems", "Data architecture and analytics", "Strategic planning for IT", "Global deployment and compliance"],
    "curriculum": [{"id": 1, "title": "Term 1: Enterprise Architecture", "duration": "3 Months", "description": "System design at scale."}, {"id": 2, "title": "Term 2: Data & Analytics", "duration": "3 Months", "description": "Big data pipelines and reporting."}, {"id": 3, "title": "Term 3: Business Strategy", "duration": "3 Months", "description": "Aligning technology with business goals."}, {"id": 4, "title": "Term 4: Thesis", "duration": "3 Months", "description": "Research, defense, and deployment."}]
  },
  {
    "title": "Professional Track",
    "image": "/src/assets/course_5.jpg",
    "description": "Intense, industry-focused training tracks to prepare you for modern corporate environments.",
    "coursesCount": "6 Months",
    "lessonsCount": "English",
    "duration": "Govt. Approved",
    "category": "Professional",
    "overview": "Targeted directly at employability, this track skips the fluff and teaches exactly what corporate partners are hiring for right now. Perfect for career switchers.",
    "whatYouLearn": ["Modern, in-demand tech stacks", "Agile and Scrum methodologies", "Corporate communication and etiquette", "Advanced interview preparation"],
    "curriculum": [{"id": 1, "title": "Sprint 1: Bootstrapping", "duration": "1 Month", "description": "Rapid skilling and basics."}, {"id": 2, "title": "Sprint 2: Agile Development", "duration": "2 Months", "description": "Working in Scrum teams."}, {"id": 3, "title": "Sprint 3: Soft Skills", "duration": "1 Month", "description": "Workplace readiness and communication."}, {"id": 4, "title": "Sprint 4: Placement", "duration": "2 Months", "description": "Mock interviews and resume building."}]
  },
  {
    "title": "Expert Degree Prep",
    "image": "/src/assets/course_6.jpg",
    "description": "Rigorous preparation courses designed for ambitious students seeking elite higher education.",
    "coursesCount": "12 Months",
    "lessonsCount": "English",
    "duration": "Govt. Approved",
    "category": "Preparation",
    "overview": "Preparing for higher education requires extreme discipline. We provide the academic rigor, foundational knowledge, and portfolio building necessary for top universities.",
    "whatYouLearn": ["Academic writing and research", "Advanced mathematics and logic", "Comprehensive portfolio building", "Entrance exam strategies and mock tests"],
    "curriculum": [{"id": 1, "title": "Quarter 1: Foundation", "duration": "3 Months", "description": "Revisiting academic basics and study habits."}, {"id": 2, "title": "Quarter 2: Intensive Study", "duration": "3 Months", "description": "Deep dive into core required subjects."}, {"id": 3, "title": "Quarter 3: Portfolio", "duration": "3 Months", "description": "Building proof of work and essays."}, {"id": 4, "title": "Quarter 4: Exam Prep", "duration": "3 Months", "description": "Mock exams and final revisions."}]
  }
]';

$courses = json_decode($jsonStr, true);

foreach($courses as $c) {
    $sql = "INSERT INTO courses (title, image, description, coursesCount, lessonsCount, duration, category, overview, whatYouLearn, curriculum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $c['title'], $c['image'], $c['description'], $c['coursesCount'], $c['lessonsCount'], 
        $c['duration'], $c['category'], $c['overview'], json_encode($c['whatYouLearn']), json_encode($c['curriculum'])
    ]);
}
echo "Seeded successfully!";
?>
