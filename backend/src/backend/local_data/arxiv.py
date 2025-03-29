import urllib, urllib.request
import urllib.request
import xml.etree.ElementTree as ET
import os

url = 'http://export.arxiv.org/api/query?search_query=all:electron&start=0&max_results=2'
data = urllib.request.urlopen(url).read().decode('utf-8')
print(data)
#print(data.read().decode('utf-8'))

root = ET.fromstring(data)

current_directory = os.getcwd()

entries = root.findall('{http://www.w3.org/2005/Atom}entry')

# Write each entry to a separate XML file in the current directory
for idx, entry in enumerate(entries):
    # Create a filename for each entry
    file_name = os.path.join(current_directory, f"entry_{idx+1}.xml")
    
    # Create an ElementTree for this entry
    entry_tree = ET.ElementTree(entry)
    
    # Write the entry to a file
    entry_tree.write(file_name, encoding='utf-8', xml_declaration=True)

    print(f"Saved {file_name}")

print(f"All entries saved in the current directory.")