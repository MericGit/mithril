import os
from google import genai
from google.genai import types
import pathlib
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
    
    def generate_country_of_origin(self, file):
        """Generate the country of origin for the research paper's authors/institutions."""
        LOCAL_DATA = Path(__file__).resolve().parent.parent / "local_data"
        SYS_PROMPT = """Analyze this research paper and determine the country or countries of origin for the authors and their institutions. 
        Return only the list of countries, separated by commas if multiple."""
        file = self.client.files.upload(file=LOCAL_DATA / file)
        response = self.client.models.generate_content(
            model=self.model,
            contents=[file, "\n\n", SYS_PROMPT],
        )
        return response.text

    def generate_author_list(self, file):
        """Generate a list of authors from the research paper."""
        LOCAL_DATA = Path(__file__).resolve().parent.parent / "local_data"
        SYS_PROMPT = {
            "type": "object",
            "properties": {
                "authors": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "List of author names from the paper"
                }
            },
            "required": ["authors"]
        }
        file = self.client.files.upload(file=LOCAL_DATA / file)
        response = self.client.models.generate_content(
            model=self.model,
            contents=[file, "\n\n", "Extract all authors from this paper."],
            generation_config=types.GenerationConfig(
                candidate_count=1
            ),
            tools=[types.Tool(function_declarations=[types.FunctionDeclaration(
                name="get_authors",
                parameters=SYS_PROMPT
            )])],
        )
        return response.candidates[0].content.parts[0].function_call.args["authors"]

    def generate_topics(self, file):
        """Generate relevant topics from the predefined STEM_TOPICS list that match the paper's content."""
        LOCAL_DATA = Path(__file__).resolve().parent.parent / "local_data"
        SYS_PROMPT = {
            "type": "object",
            "properties": {
                "topics": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": STEM_TOPICS
                    },
                    "maxItems": 5,
                    "description": "Most relevant topics from the provided list that directly relate to the paper's main focus"
                }
            },
            "required": ["topics"]
        }
        file = self.client.files.upload(file=LOCAL_DATA / file)
        response = self.client.models.generate_content(
            model=self.model,
            contents=[file, "\n\n", "Identify the most relevant topics for this paper."],
            generation_config=types.GenerationConfig(
                candidate_count=1
            ),
            tools=[types.Tool(function_declarations=[types.FunctionDeclaration(
                name="get_topics",
                parameters=SYS_PROMPT
            )])],
        )
        return response.candidates[0].content.parts[0].function_call.args["topics"]

client = AGIClient()
client.generate_summary("Lecun98.pdf")