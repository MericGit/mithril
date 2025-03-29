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
        SYS_PROMPT = """Given this research paper, summarize it into its core parts. You do not need to summarize its technical details rather summarize what field the paper is in, its novel applications, and any other key components. Additionally give me the list of authors, and also list which of the following topics below that tha paper references (can be multiple!)
        topics = [
AI,
Semiconductors,
Life Sciences,
Nuclear,
Energy,
Quantum Computing,
Biotechnology,
Robotics,
Nanotechnology,
Cybersecurity,
Space Exploration,
Environmental Science,
Advanced Materials,
Telecommunications,
Defense Technology,
Data Science,
High-Performance Computing,
Synthetic Biology,
Climate Technology,
Autonomous Systems,
5G/6G Networks,
Geopolitical Tech Strategy,
Innovation Policy,
Digital Infrastructure
]"""
        #file = self.client.files.upload(file=LOCAL_DATA / file)
        full_prompt = f"""{SYS_PROMPT}"""
        files = [
            # Please ensure that the file is available in local system working direrctory or change the file path.
            self.client.files.upload(file=LOCAL_DATA / file),
        ]
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_uri(
                        file_uri=files[0].uri,
                        mime_type=files[0].mime_type,
                    ),
                    types.Part.from_text(text=full_prompt),
                ],  
            ),
        ]
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=genai.types.Schema(
                type = genai.types.Type.OBJECT,
                required = ["authors", "topics", "risk_analysis", "topics_relevence"],
                properties = {
                    "authors": genai.types.Schema(
                        type = genai.types.Type.ARRAY,
                        items = genai.types.Schema(
                            type = genai.types.Type.STRING,
                        ),
                    ),
                    "topics": genai.types.Schema(
                        type = genai.types.Type.ARRAY,
                        items = genai.types.Schema(
                            type = genai.types.Type.STRING,
                        ),
                    ),
                    "risk_analysis": genai.types.Schema(
                        type = genai.types.Type.STRING,
                    ),
                    "topics_relevence": genai.types.Schema(
                        type = genai.types.Type.ARRAY,
                        items = genai.types.Schema(
                            type = genai.types.Type.INTEGER,
                        ),
                    ),
                },
            ),
        )

        for chunk in self.client.models.generate_content_stream(
            model=self.model,
            contents=contents,
            config=generate_content_config,
        ):
            print(chunk.text, end="")
    
client = AGIClient()
client.generate_summary("Lecun98.pdf")