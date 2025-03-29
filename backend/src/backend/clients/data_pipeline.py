from agiClient import AGIClient
from pathlib import Path
import json

agiClient = AGIClient()
LOCAL_DATA = Path(__file__).resolve().parent.parent / "local_data"
print("LOCAL DATA", LOCAL_DATA)

final_json = []
for file in LOCAL_DATA.iterdir():
    if file.is_file() and file.suffix.lower() == '.pdf':
        print(file)
        try:
            result = agiClient.nlp_pipeline(file.name)
            final_json.append(result)
        except Exception as e:
            print(f"Error processing {file.name}: {str(e)}")

# Save to data.json in the parent directory
output_path = Path(__file__).resolve().parent.parent / "data.json"
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_json, f, indent=2, ensure_ascii=False)