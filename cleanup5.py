import re
filepath = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# 'donÃ¢â‚¬â„¢t' -> "don't"
text = re.sub(r'donÃ¢â‚¬[^\w\s]*t', "don't", text)

# '8Ã¢â‚¬12' -> '8-12'
text = re.sub(r'8Ã¢â‚¬[^\w\s]*12', '8-12', text)

# 'Ã¢â‚¬Â¢' -> '•'
text = re.sub(r'<li>Ã¢â‚¬[^\w\s]* ', '<li>&#8226; ', text)

# 'Ã¢â‚¬\x9d' and 'Ã¢â‚¬' -> '—'
text = re.sub(r'Ã¢â‚¬[^\w\s]*', '&#8212;', text)

# Fix double replacements if any
text = text.replace('&#8212; ', '&#8212; ')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
print("Regex cleanup complete.")