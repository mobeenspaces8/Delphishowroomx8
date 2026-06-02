import re

filepath = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace any corrupted bc-sep with HTML entity for ›
text = re.sub(r'<span class="bc-sep">[^<]+</span>', '<span class="bc-sep">&#8250;</span>', text)

# Replace any corrupted quote-icon with HTML entity for “
text = re.sub(r'<div class="quote-icon">[^<]+</div>', '<div class="quote-icon">&#8220;</div>', text)

# Replace any corrupted Architecture dash with em-dash
text = re.sub(r'<h2>Automated Patient Intake [^<]+ Architecture</h2>', '<h2>Automated Patient Intake &#8212; Architecture</h2>', text)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print("Entities replace complete!")