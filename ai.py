from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from dotenv import load_dotenv
import os
load_dotenv()

llm=HuggingFaceEndpoint(repo_id='openai/gpt-oss-120b', task='conversational',max_new_tokens=5120, huggingfacehub_api_token=os.getenv('HUGGINGFACE_API_KEY'))

model = ChatHuggingFace(llm=llm)