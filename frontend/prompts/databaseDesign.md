# Database Design - AutoQuiz AI

## Overview

Database schema cho hệ thống AI tạo đề thi cá nhân hóa (AutoQuiz AI) với các tính năng chính:

-   Phân tích khả năng học tập
-   Sinh đề thi tự động
-   Feedback lập tức
-   Theo dõi tiến độ học tập

## Database Schema

### 1. Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'student', -- student, teacher, admin
    current_level VARCHAR(50), -- grade level: elementary, middle, high, university
    learning_goal TEXT, -- specific learning objectives
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### 2. Subjects Table

```sql
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Mathematics, Physics, Chemistry, etc.
    description TEXT,
    grade_level VARCHAR(50), -- elementary, middle, high, university
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Knowledge_Sources Table

```sql
CREATE TABLE knowledge_sources (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    name VARCHAR(255) NOT NULL, -- Textbook name, Wikipedia article, etc.
    source_type VARCHAR(50), -- textbook, wikipedia, academic_paper, etc.
    content_url TEXT, -- URL to source content
    content_text TEXT, -- Actual content for AI processing
    chapter VARCHAR(100), -- Chapter or section
    topic VARCHAR(100), -- Specific topic
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Question_Templates Table

```sql
CREATE TABLE question_templates (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    knowledge_source_id INTEGER REFERENCES knowledge_sources(id),
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- multiple_choice, essay, true_false
    bloom_taxonomy_level VARCHAR(50), -- remember, understand, apply, analyze, evaluate, create
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 10),
    correct_answer TEXT,
    explanation TEXT, -- Explanation for correct answer
    options JSONB, -- For multiple choice questions: {"A": "option1", "B": "option2", ...}
    tags TEXT[], -- Array of tags for categorization
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Adaptive_Tests Table

```sql
CREATE TABLE adaptive_tests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subject_id INTEGER REFERENCES subjects(id),
    test_type VARCHAR(50), -- initial_assessment, practice, final_exam
    status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, completed, abandoned
    current_question_index INTEGER DEFAULT 0,
    total_questions INTEGER,
    time_limit_minutes INTEGER,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    estimated_ability_level DECIMAL(3,2), -- AI estimated user ability (0-10)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Test_Questions Table

```sql
CREATE TABLE test_questions (
    id SERIAL PRIMARY KEY,
    adaptive_test_id INTEGER REFERENCES adaptive_tests(id),
    question_template_id INTEGER REFERENCES question_templates(id),
    question_order INTEGER NOT NULL,
    user_answer TEXT,
    is_correct BOOLEAN,
    time_spent_seconds INTEGER,
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Generated_Quizzes Table

```sql
CREATE TABLE generated_quizzes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subject_id INTEGER REFERENCES subjects(id),
    quiz_name VARCHAR(255) NOT NULL,
    quiz_type VARCHAR(50), -- practice, assessment, review
    total_questions INTEGER NOT NULL,
    time_limit_minutes INTEGER,
    difficulty_target DECIMAL(3,2), -- Target difficulty level
    bloom_taxonomy_focus VARCHAR(50)[], -- Focus on specific taxonomy levels
    status VARCHAR(50) DEFAULT 'active', -- active, completed, archived
    ai_generation_prompt TEXT, -- The prompt used to generate this quiz
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Quiz_Questions Table

```sql
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    generated_quiz_id INTEGER REFERENCES generated_quizzes(id),
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    correct_answer TEXT,
    explanation TEXT,
    options JSONB,
    bloom_taxonomy_level VARCHAR(50),
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 10),
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. Quiz_Attempts Table

```sql
CREATE TABLE quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    generated_quiz_id INTEGER REFERENCES generated_quizzes(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    score DECIMAL(5,2), -- Percentage score
    total_correct INTEGER,
    total_questions INTEGER,
    time_spent_minutes INTEGER,
    status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, completed, abandoned
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. Quiz_Responses Table

```sql
CREATE TABLE quiz_responses (
    id SERIAL PRIMARY KEY,
    quiz_attempt_id INTEGER REFERENCES quiz_attempts(id),
    quiz_question_id INTEGER REFERENCES quiz_questions(id),
    user_answer TEXT,
    is_correct BOOLEAN,
    time_spent_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 11. Learning_Analytics Table

```sql
CREATE TABLE learning_analytics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subject_id INTEGER REFERENCES subjects(id),
    analytics_date DATE NOT NULL,
    total_questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    average_time_per_question DECIMAL(5,2), -- in seconds
    strength_areas TEXT[], -- Array of strong topics
    weakness_areas TEXT[], -- Array of weak topics
    bloom_taxonomy_performance JSONB, -- Performance by taxonomy level
    difficulty_progression JSONB, -- Difficulty level progression over time
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 12. Study_Recommendations Table

```sql
CREATE TABLE study_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subject_id INTEGER REFERENCES subjects(id),
    recommendation_type VARCHAR(50), -- review_topic, practice_weak_areas, advanced_study
    topic VARCHAR(100),
    description TEXT,
    priority_level INTEGER CHECK (priority_level BETWEEN 1 AND 5),
    related_knowledge_sources INTEGER[], -- Array of knowledge_source_ids
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes for Performance

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Questions
CREATE INDEX idx_question_templates_subject ON question_templates(subject_id);
CREATE INDEX idx_question_templates_difficulty ON question_templates(difficulty_level);
CREATE INDEX idx_question_templates_bloom ON question_templates(bloom_taxonomy_level);
CREATE INDEX idx_question_templates_active ON question_templates(is_active);

-- Tests and Quizzes
CREATE INDEX idx_adaptive_tests_user ON adaptive_tests(user_id);
CREATE INDEX idx_adaptive_tests_status ON adaptive_tests(status);
CREATE INDEX idx_generated_quizzes_user ON generated_quizzes(user_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(generated_quiz_id);

-- Analytics
CREATE INDEX idx_learning_analytics_user_date ON learning_analytics(user_id, analytics_date);
CREATE INDEX idx_learning_analytics_subject ON learning_analytics(subject_id);

-- Knowledge Sources
CREATE INDEX idx_knowledge_sources_subject ON knowledge_sources(subject_id);
CREATE INDEX idx_knowledge_sources_difficulty ON knowledge_sources(difficulty_level);
```

## Key Features Supported

1. **User Management**: Multi-role users with learning goals and current levels
2. **Subject Organization**: Structured subjects with grade levels
3. **Knowledge Sources**: Multiple content sources (textbooks, Wikipedia, etc.)
4. **Question Templates**: Reusable question templates with Bloom's taxonomy
5. **Adaptive Testing**: Dynamic test generation based on user performance
6. **Quiz Generation**: AI-generated personalized quizzes
7. **Performance Tracking**: Comprehensive analytics and progress monitoring
8. **Recommendations**: AI-powered study recommendations
9. **Content Management**: Flexible content sources and question types

## Data Flow

1. **Initial Assessment**: User takes adaptive test → System analyzes ability → Stores in learning_analytics
2. **Quiz Generation**: AI uses knowledge_sources + user_analytics → Creates generated_quizzes
3. **Quiz Taking**: User attempts quiz → Responses stored → Performance analyzed
4. **Feedback Loop**: Analytics updated → New recommendations generated → Improved future quizzes

## Scalability Considerations

-   JSONB fields for flexible data storage (options, taxonomy performance)
-   Array fields for efficient tag and topic storage
-   Proper indexing for common query patterns
-   Soft deletes for data integrity
-   Timestamp tracking for audit trails
