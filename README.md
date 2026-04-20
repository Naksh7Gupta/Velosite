# 🚀 Velosite – AI Website Builder  

Velosite is an **AI-powered website builder** that converts natural language prompts into fully functional frontend code.

> 💡 “Describe your idea. Get a working website.”

---

## ✨ Features  

- 🧠 AI-based code generation  
- ⚡ FastAPI backend with streaming output  
- 🎨 Clean, modern UI  
- 🔁 Live preview of generated website  
- 📂 Structured code output (HTML, CSS, JS / React)  
- 🤖 Multi-agent system (Planner → Builder → Reviewer)  

---

## 🛠️ Tech Stack  

**Frontend**  
- React / Next.js  
- Tailwind CSS  

**Backend**  
- FastAPI  
- Python  

**AI System**  
- CrewAI (multi-agent architecture)  
- LLM-based structured generation  

---

## 📁 Project Structure  

velosite/
│
├── backend/
│ ├── main.py
│ ├── agents/
│ ├── utils/
│
├── frontend/
│ ├── components/
│ ├── pages/
│ ├── styles/
│
├── .env
├── README.md



---

## ⚙️ Installation & Setup  

### 1. Clone Repository  

```bash
git clone https://github.com/your-username/Velosite.git
cd velosite

cd backend
pip install -r requirements.txt
uvicorn main:app --reload

cd frontend
npm install
npm run dev
```

Create a modern landing page for an AI startup with pricing section

Velosite will:
Generate structured plan
Build frontend code
Show live preview
🧠 How It Works

Velosite uses a multi-agent pipeline:

🧩 Planner Agent → Converts prompt into structured JSON
🏗️ Builder Agent → Generates code files
🔍 Reviewer Agent → Improves and fixes output
📌 Future Improvements
🔐 GitHub integration (auto push generated code)
🌐 Full-stack generation (backend + database)
🧩 Component-level editing
📦 Export as deployable project

⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
