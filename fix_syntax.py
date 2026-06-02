import re
filepath = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/script.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Delete the dangling remainder of updateFeaturedImage
# It starts with: " autoplay muted loop
# and ends with: }, 300); // 300ms matches a quick fade out duration
pattern1 = r'\" autoplay muted loop style.*?\}, 300\); // 300ms matches a quick fade out duration'
text = re.sub(pattern1, '', text, flags=re.DOTALL)

# Delete updateAiFeaturedImage completely
pattern2 = r'function updateAiFeaturedImage\([^\)]+\)\s*\{.*?\},\ 300\);\n\}'
text = re.sub(pattern2, '', text, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)