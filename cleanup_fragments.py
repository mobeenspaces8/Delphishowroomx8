import re
filepath = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix ai-practice-gallery fragments
text = re.sub(r'<div id="ai-practice-gallery"></div>\s*<button class="gallery-nav-btn"[^>]+>.*?</button>\s*</div>', '<div id="ai-practice-gallery"></div>', text, flags=re.DOTALL)

# Fix patient-intake-gallery formatting and newline
text = text.replace('<div id="patient-intake-gallery"></div>                        <!--', '<div id="patient-intake-gallery"></div>\n                        </div>\n                        <!--')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
print("Cleaned up gallery fragments.")