import re

filepath = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the inner HTML of ai-practice-gallery
# We need to find <div class="interactive-image-library" id="ai-practice-gallery"> and replace everything up to its closing </div>
# Since regex across multiple lines with nested divs is tricky, we can do it with a careful regex or by finding the index.
# Actually, the easiest is to just use regex since it's a known structure.

def replace_gallery(match):
    id_name = match.group(1)
    return f'<div id="{id_name}"></div>'

# The first one is id="ai-practice-gallery"
# The second one is just <div class="interactive-image-library" style="width: 100%; margin: 0 auto;">
# Let's just find them manually.
text = re.sub(r'<div class="interactive-image-library" id="ai-practice-gallery">.*?</div>\s*</div>\s*</div>', '<div id="ai-practice-gallery"></div>', text, flags=re.DOTALL)
text = re.sub(r'<div class="interactive-image-library" style="width: 100%; margin: 0 auto;">.*?</div>\s*</div>\s*</div>', '<div id="patient-intake-gallery"></div>', text, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
print("Replaced galleries in HTML.")