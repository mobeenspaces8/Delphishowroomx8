import re

files = [
    'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/index.html'
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    text = re.sub(r'<span class="bc-sep">[^<]+</span>', '<span class="bc-sep">›</span>', text)
    text = re.sub(r'<div class="quote-icon">[^<]+</div>', '<div class="quote-icon">“</div>', text)
    text = re.sub(r'<h2>Automated Patient Intake [^<]+ Architecture</h2>', '<h2>Automated Patient Intake — Architecture</h2>', text)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

print("Regex replace complete!")