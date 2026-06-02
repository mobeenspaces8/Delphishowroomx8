import re

files = [
    'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/index.html',
    'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/script.js',
]

replacements = {
    'Ã¢â‚¬Âº': '›',
    'Ã¢â‚¬â€œ': '–',
    'Ã¢â‚¬Å“': '“',
    'Ã¢â‚¬â€': '—',
    'Ã¢â‚¬â„¢': '’',
    'Ã¢â‚¬': '”'
}

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Fix Mojibake
    for bad, good in replacements.items():
        text = text.replace(bad, good)
        
    # Fix backticks in script.js specifically for updateLightboxTransform
    if filepath.endswith('script.js'):
        bad_transform = "content.style.transform = \translate( + translateX + px,  + translateY + px) scale( + currentZoom + );"
        bad_transform2 = "content.style.transform = \t" + "ranslate( + translateX + px,  + translateY + px) scale( + currentZoom + );"
        good_transform = "content.style.transform = 	ranslate(px, px) scale();"
        
        text = text.replace(bad_transform, good_transform)
        text = text.replace(bad_transform2, good_transform)
        
        # Another pass with regex for safety if the exact string matching fails
        text = re.sub(r'content\.style\.transform = \s*ranslate\( \+ translateX \+ px,  \+ translateY \+ px\) scale\( \+ currentZoom \+ \);', good_transform, text)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

print("Cleanup complete!")