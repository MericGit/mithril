import os
from google import genai
from google.genai import types
import pathlib
from dotenv import load_dotenv
from pathlib import Path

"""You can really feel the AGI"""
class AGIClient:
    def __init__(self):
        root_path = Path(__file__).resolve().parent.parent / "config"
        dotenv_path = root_path / ".env"
        print(dotenv_path)
        load_dotenv(dotenv_path)
        print("API KEY: ", os.getenv("GEMINI_API_KEY"))
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = "gemini-2.0-flash-lite"
    

    def generate_summary(self, file):
        LOCAL_DATA = Path(__file__).resolve().parent.parent / "local_data"
        print("LOCAL DATA" , LOCAL_DATA)
        SYS_PROMPT = """Given this research paper, summarize it into its core parts. You do not need to summarize its technical details rather summarize what field the paper is in, its novel applications, and any other key components"""
        file = self.client.files.upload(file=LOCAL_DATA / file)
        full_prompt = f"""{SYS_PROMPT}"""
        response = self.client.models.generate_content(
            model=self.model,
            contents=[
                file,
                "\n\n",
                full_prompt
            ],
        )
        print(response.text)
    
client = AGIClient()
client.generate_summary("Lecun98.pdf")