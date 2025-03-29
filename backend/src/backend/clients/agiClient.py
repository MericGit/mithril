import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
from pathlib import Path

# List of STEM topics for classification
STEM_TOPICS = [
    # Computer Science & AI
    "Machine Learning", "Deep Learning", "Artificial Intelligence", "Computer Vision",
    "Natural Language Processing", "Reinforcement Learning", "Cybersecurity",
    "Quantum Computing", "Software Engineering", "High-Performance Computing",
    "Algorithms & Data Structures", "Distributed Systems", "Embedded Systems",
    "Robotics", "Edge Computing", "Internet of Things (IoT)", "Cryptography",

    # Mathematics & Theoretical Science
    "Linear Algebra", "Statistics", "Probability Theory", "Numerical Methods",
    "Graph Theory", "Topology", "Game Theory", "Chaos Theory", "Optimization",
    "Computational Mathematics",

    # Physics & Engineering
    "Quantum Mechanics", "Thermodynamics", "Electromagnetism", "Fluid Dynamics",
    "Materials Science", "Electrical Engineering", "Mechanical Engineering",
    "Aerospace Engineering", "Civil Engineering", "Biomedical Engineering",
    "Nanotechnology",

    # Biology & Life Sciences
    "Neuroscience", "Bioinformatics", "Genetics", "Synthetic Biology",
    "Evolutionary Biology", "Cognitive Science", "Biochemistry", "Microbiology",
    "Immunology",

    # Environmental Science & Earth Sciences
    "Climate Change", "Geophysics", "Oceanography", "Renewable Energy",
    "Atmospheric Science", "Environmental Engineering", "Hydrology",

    # Chemistry & Material Sciences
    "Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry",
    "Polymer Science", "Chemical Engineering", "Electrochemistry",

    # Astronomy & Space Science
    "Astrophysics", "Cosmology", "Planetary Science", "Space Exploration"
]

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
        SYS_PROMPT = """Given this research paper, summarize it into its core parts. You do not need to summarize its technical details rather summarize what field the paper is in, its novel applications, and any other key components. Additionally give me the list of authors. For each author also provide relevent information about them, for example their current job, research institution, country theyre in, and also list which of the following topics below that tha paper references (can be multiple!) and give a relevence of each topic 1-100
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
] Format your response as JSON with proper escaping of quotes and special characters."""
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
                required = ["authors", "topics", "paper_summary", "topics_relevence", "author_info", "presumed_publish_country"],
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
                    "paper_summary": genai.types.Schema(
                        type = genai.types.Type.STRING,
                    ),
                    "topics_relevence": genai.types.Schema(
                        type = genai.types.Type.ARRAY,
                        items = genai.types.Schema(
                            type = genai.types.Type.INTEGER,
                        ),
                    ),
                    "author_info": genai.types.Schema(
                        type = genai.types.Type.ARRAY,
                        items = genai.types.Schema(
                            type = genai.types.Type.STRING,
                        ),
                    ),
                    "presumed_publish_country": genai.types.Schema(
                        type = genai.types.Type.STRING,
                    ),
                    "paper_title": genai.types.Schema(
                        type = genai.types.Type.STRING,
                    ),
                    "paper_abstract": genai.types.Schema(
                        type = genai.types.Type.STRING,
                    ),
                    "paper_publish_date": genai.types.Schema(
                        type = genai.types.Type.STRING,
                    ),
                    "paper_doi": genai.types.Schema(
                        type = genai.types.Type.STRING,
                    ),
                    "paper_journal": genai.types.Schema(
                        type = genai.types.Type.STRING,
                    )
                },
            ),
        )
        output = ""
        for chunk in self.client.models.generate_content_stream(
            model=self.model,
            contents=contents,
            config=generate_content_config,
        ):
            output += chunk.text
        return json.loads(output)
    
    def generate_risk_score(self, json_bg):
        LOCAL_DATA = Path(__file__).resolve().parent.parent / "local_data"
        print("LOCAL DATA" , LOCAL_DATA)
        SYS_PROMPT = """Given the following summary of a research paper, information about authors, and topics, give me a reasoning about this papers particular military applications, and then a risk score 0-100 of if it has strong military applications or not. In particular view this from a US perspective, so foreign military development is high risk. Format your response as JSON with proper escaping of quotes and special characters."""
        #file = self.client.files.upload(file=LOCAL_DATA / file)
        json_bg = json.dumps(json_bg)
        full_prompt = f"""{SYS_PROMPT} {json_bg}"""
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=full_prompt),
                ],  
            ),
        ]
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=genai.types.Schema(
                type = genai.types.Type.OBJECT,
                required = ["risk_score", "reasoning"],
                properties = {
                    "risk_score": genai.types.Schema(
                        type = genai.types.Type.INTEGER,
                    ),
                    "reasoning": genai.types.Schema(
                        type = genai.types.Type.STRING,
                    ),
                },
            ),
        )
        output = ""
        for chunk in self.client.models.generate_content_stream(
            model=self.model,
            contents=contents,
            config=generate_content_config,
        ):
            output += chunk.text
        return json.loads(output)

    def nlp_pipeline(self, file):
        summary = self.generate_summary(file)
        risk_score = self.generate_risk_score(summary)
        #Combine the two jsons into one super json with each field
        combined = {**summary, **risk_score}
        return combined


client = AGIClient()
print(json.dumps(client.nlp_pipeline("2503.01293v1.pdf")))