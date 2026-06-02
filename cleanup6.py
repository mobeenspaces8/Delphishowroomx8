import re
filepath = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# 'donÃ¢â‚¬â„¢t' -> "don't"
text = re.sub(r'donÃ.*?t', "don't", text)

# '8Ã¢â‚¬12' -> '8-12'
text = re.sub(r'8Ã.*?12', '8-12', text)

# 'Ã¢â‚¬Â¢' -> '•'
text = re.sub(r'<li>Ã.*?[ \xa0]', '<li>&#8226; ', text)

# 'Ã¢â‚¬\x9d' and 'Ã¢â‚¬' -> '—'
text = re.sub(r'Ã.*?\x9d', '&#8212;', text)
text = re.sub(r'Ã.*? ', '&#8212; ', text)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
print("Final Regex cleanup complete.")