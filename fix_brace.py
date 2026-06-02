import re
filepath = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/script.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Delete the dangling }
text = text.replace('}\n\n\n// Lightbox Escape Key Listener', '\n\n// Lightbox Escape Key Listener')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)