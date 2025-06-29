# 🎓 QLearning: An innovative AI-based learning system for college students of FPT University

An end-to-end, AI-powered educational platform that extracts learning content from PDF documents, summarizes key terms, generates intelligent multiple-choice quizzes, flashcards with feedback, and provides a user-friendly AI chatbot for study purposes
All are completed with a full-stack web interface, scalable backend, and API-first architecture.

---

## 🚀 Features

- 🧠 **AI Quiz Generation**  
  Extracts key concepts from PDFs using NLP embeddings and generates thought-provoking questions with GPT or Gemini.

- 🧾 **PDF Ingestion and Parsing**  
  Upload documents via URL or file and tokenize them into clean, structured text chunks.

- 📚 **Knowledge Retrieval**  
  Vector search (RAG) is used to identify relevant context from materials before generating questions.

- 🧪 **Multiple AI Models Supported**  
  OpenAI (`gpt-3.5-turbo`) and Gemini (`gemini-pro`, `gemini-flash`) are pluggable via environment variables.

- 🧩 **Modular Architecture**  
  Cleanly separated frontend (Next.js), backend (Go), and microservices for AI-driven quiz generation (Python).

- ⚡ **High Performance**  
  Generates up to 300 questions in under 5 minutes across multiple documents.

- 🌐 **Frontend Web UI**  
  Upload PDFs, trigger question generation, and visualize output with a beautiful interface built using `shadcn/ui`.

---

## 🧱 Tech Stack

| Layer     | Tech Details                                  |
|-----------|-----------------------------------------------|
| Frontend  | Next.js, TailwindCSS, TypeScript              |
| Backend   | Go (Golang), Fiber, PostgreSQL                |
| AI Engine | Python 3.11, FastAPI, OpenAI API, Gemini API  |
| DevOps    | Docker, Docker Compose, GitHub Actions        |

---

## 🛠️ Project Structure

```
hackathon-education-system/
├── backend/                      # ⚙️ Modern Go backend service
│   ├── cmd/                     # Entry point commands for running the app
│   ├── global/                  # Global configurations (logging, env, constants)
│   ├── internal/                # Business logic modules (handlers, routes)
│   ├── pkg/                     # Utility helpers (PDF, embeddings, etc.)
│   ├── response/                # Response schema structs
│   ├── Dockerfile               # Backend Docker config
│   ├── go.mod / go.sum          # Go modules and dependencies
│   ├── Makefile                 # Task runner shortcuts
│   └── README.md                # Backend-specific usage info
│
├── frontend/                    # 🖥️ Web UI built with Next.js + TailwindCSS
│   ├── app/                    # Next.js app router and pages
│   ├── components/             # Shared React components
│   ├── public/                 # Static assets
│   ├── lib/                    # Client-side utilities
│   ├── Dockerfile              # Frontend Docker config
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.js      # Tailwind customization
│   └── README.md               # Frontend usage guide
│
├── education-system/           # 🧪 Legacy structure from initial hackathon prototype
│   ├── backend/                # Older Go-based backend (deprecated/experimental)
│   └── frontend/               # Earlier frontend version (likely pre-Next.js)
│
├── compose.yaml                # 🔄 Docker Compose for local dev (latest version)
├── compose.build.yaml          # 🧱 Extended Compose setup with custom builds
└── .github/                    # 🔧 GitHub Actions for CI/CD
    └── workflows/
        └── deploy.yml         # Deployment pipeline script
```

---

## 🧪 Run Locally

### Option 1: Full Stack with Docker (Recommended)

```
# 1. Clone repo
git clone https://github.com/rust-py-go/hackathon-education-system.git
cd hackathon-education-system

# 2. Create .env file in backend/
echo "OPENAI_API_KEY=your_key" >> backend/.env
echo "GOOGLE_API_KEY=your_key" >> backend/.env

# 3. Launch with Docker Compose
docker compose -f compose.yaml up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)  
- Backend API: [http://localhost:8000/docs](http://localhost:8000/docs)

### Option 2: Manual Setup for Python AI Generator

See [`education-system/ai/`](https://github.com/rust-py-go/hackathon-education-system/tree/main/education-system/ai) folder for a Python-only AI quiz engine.

---

## 📦 API Highlights

Available at `http://localhost:8000/docs` (Swagger UI)

| Endpoint                           | Description                          |
|------------------------------------|--------------------------------------|
| `POST /api/generate-questions-sync` | Generate quiz questions from PDFs    |
| `GET /api/health`                  | Health check                         |

---

## 🧪 Testing with Postman

Use the included `postman_sync_optimized_collection.json` and follow steps in:
```bash
education-system/ai/POSTMAN_TEST_GUIDE.md
```

---

## 🌍 Deployment

- Includes Dockerfiles for all services
- GitHub Actions CI/CD
- CORS enabled for frontend/backend communication

---

## 👥 Contributors

- [Huỳnh Minh Khang](https://github.com/akagiyuu)  
- [Nguyễn Trinh Quý](https://github.com/nguyentrinhquy1411)  
- [Nguyễn Trường An](https://github.com/MichaelNguyen0406)
- [Nguyễn Thái An](https://github.com/Anfind)
- [Lương Minh Ngọc](https://github.com/RevDra)
- [Phan Tiến Đạt](https://github.com/tiendat2k6)

---

## 📄 License

MIT License. See [`LICENSE`](LICENSE) file.

---

## 💡 Future Improvements

- User authentication & history tracking
- Flashcard export & spaced repetition tools
- LLM evaluation of student answers
```
