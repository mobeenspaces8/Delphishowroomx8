filepath = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Make the second ai-practice-gallery unique
parts = text.split('<div id="ai-practice-gallery"></div>')
if len(parts) == 3:
    text = parts[0] + '<div id="ai-practice-gallery"></div>' + parts[1] + '<div id="hc-ai-practice-gallery"></div>' + parts[2]
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
print("Made IDs unique.")