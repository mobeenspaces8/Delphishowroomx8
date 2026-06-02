import re
filepath = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/script.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the original openLightbox definition with nothing (since the new one is appended at the bottom)
pattern = r'function openLightbox\(src, type\)\s*\{[^\}]*\}[^\}]*\}'
# Wait, the original openLightbox is:
# function openLightbox(src, type) {
#     zoomLightbox(0);
#     const modal = ...
#     ...
#     modal.classList.remove('hidden');
#     document.body.style.overflow = 'hidden';
# }
pattern = r'function openLightbox\(src, type\) \{[\s\S]*?document\.body\.style\.overflow = \'hidden\';\n\}'
text = re.sub(pattern, '', text)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)