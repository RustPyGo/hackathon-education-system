-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE projects (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
pdf_path TEXT NOT NULL,
account_id TEXT NOT NULL,
extracted TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create question_packs table
CREATE TABLE question_packs (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
project_id UUID NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create questions table
CREATE TABLE questions (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
pack_id UUID NOT NULL,
question TEXT NOT NULL,
correct_answer TEXT NOT NULL,
answers TEXT[] NOT NULL,
difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (pack_id) REFERENCES question_packs(id) ON DELETE CASCADE
);

-- Create responses table
CREATE TABLE responses (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
pack_id UUID NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (pack_id) REFERENCES question_packs(id) ON DELETE CASCADE
);

-- Create answers table
CREATE TABLE answers (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
response_id UUID NOT NULL,
question_id UUID NOT NULL,
answer TEXT NOT NULL,
time_spent INTEGER NOT NULL, -- in seconds
analytics TEXT, -- JSON data for additional analytics
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (response_id) REFERENCES responses(id) ON DELETE CASCADE,
FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
UNIQUE(response_id, question_id) -- Ensure one answer per question per response
);

-- Create flash_cards table
CREATE TABLE flash_cards (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
project_id UUID NOT NULL,
question TEXT NOT NULL,
answer TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create chat_messages table
CREATE TABLE chat_messages (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
project_id UUID NOT NULL,
role VARCHAR(10) NOT NULL CHECK (role IN ('bot', 'user')),
content TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_projects_pdf_path ON projects(pdf_path);
CREATE INDEX idx_projects_account_id ON projects(account_id);
CREATE INDEX idx_question_packs_project_id ON question_packs(project_id);
CREATE INDEX idx_questions_pack_id ON questions(pack_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty_level);
CREATE INDEX idx_responses_pack_id ON responses(pack_id);
CREATE INDEX idx_answers_response_id ON answers(response_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_flash_cards_project_id ON flash_cards(project_id);
CREATE INDEX idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX idx_chat_messages_role ON chat_messages(role);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;

$$
language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_question_packs_updated_at BEFORE UPDATE ON question_packs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_updated_at BEFORE UPDATE ON responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flash_cards_updated_at BEFORE UPDATE ON flash_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Example data insertion (optional)
-- INSERT INTO projects (pdf_path, account_id, extracted)
-- VALUES ('sample.pdf', 'user123', 'Sample extracted content');

-- Comments for documentation
COMMENT ON TABLE projects IS 'Main projects table storing PDF document information';
COMMENT ON TABLE question_packs IS 'Groups of questions for each project';
COMMENT ON TABLE questions IS 'Individual questions with multiple choice answers';
COMMENT ON TABLE responses IS 'User response sessions for question packs';
COMMENT ON TABLE answers IS 'Individual answers given by users during response sessions';
COMMENT ON TABLE flash_cards IS 'Flash cards for studying, linked to projects';
COMMENT ON TABLE chat_messages IS 'Chat conversation history for each project';

COMMENT ON COLUMN projects.pdf_path IS 'Path to PDF document';
COMMENT ON COLUMN projects.extracted IS 'Extracted text content from PDF';
COMMENT ON COLUMN questions.answers IS 'Array of possible answers for multiple choice';
COMMENT ON COLUMN questions.difficulty_level IS 'Difficulty rating from 1-5';
COMMENT ON COLUMN answers.time_spent IS 'Time spent on question in seconds';
COMMENT ON COLUMN answers.analytics IS 'JSON field for additional analytics data';
COMMENT ON COLUMN chat_messages.role IS 'Either bot or user message';
$$
