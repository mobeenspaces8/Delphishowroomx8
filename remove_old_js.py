import re
filepath = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/script.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Delete scrollGallery, scrollAiGallery, updateFeaturedImage
text = re.sub(r'function scrollGallery\(dir\).*?\}\s*\}', '', text, flags=re.DOTALL)
text = re.sub(r'function scrollAiGallery\(dir\).*?\}\s*\}', '', text, flags=re.DOTALL)
text = re.sub(r'function updateFeaturedImage\([^\)]+\).*?\}\s*', '', text, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
print("Removed old gallery functions.")