from fastapi import FastAPI
from pydantic import BaseModel
import re
from ai import model

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Prompt(BaseModel):
    prompt: str
    old_code: str = ""  


def generate_with_model(user_prompt: str, old_code: str) -> str:
   """Generates code based on the user prompt and old code(If available)."""
   
   system_prompt = f"""
    You are an expert frontend developer and UI/UX designer.

    Generate a modern, responsive website.

    Rules:
    - Return ONLY code
    - No markdown (no ``` blocks)
    - Single HTML file
    - Include HTML, CSS, JS
    - Clean UI with good design
    - Add animations and proper spacing
    """

    # 👇 Final combined prompt (future ke liye ready)
   final_prompt = system_prompt + "\nUser Request:\n" + user_prompt + ("\nOld Code:\n" + old_code if old_code else "")
    
   output = model.invoke(final_prompt)
    
    # 🔥 CLEANING LOGIC
   clean_code = re.sub(r"```html|```", "", output.content).strip()

   return clean_code

@app.post("/generate")
def generate_code(data: Prompt):
    if not data.prompt:
     return {"error": "Prompt required"}

    code = generate_with_model(data.prompt, data.old_code)

    return {
        "success": True,
        "code": code
    }