filepath = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('Ã¢â‚¬Âº', '&#8250;')
text = text.replace('Ã¢â‚¬â€œ', '&#8211;')
text = text.replace('Ã¢â‚¬Å“', '&#8220;')
text = text.replace('Ã¢â‚¬â€', '&#8212;')
text = text.replace('Ã¢â‚¬â„¢', '&#8217;')
text = text.replace('Ã¢â‚¬', '&#8221;')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

filepath_js = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/script.js'
with open(filepath_js, 'r', encoding='utf-8') as f:
    text_js = f.read()

text_js = text_js.replace('Ã¢â‚¬Âº', '&#8250;')
text_js = text_js.replace('Ã¢â‚¬â€œ', '&#8211;')
text_js = text_js.replace('Ã¢â‚¬Å“', '&#8220;')
text_js = text_js.replace('Ã¢â‚¬â€', '&#8212;')
text_js = text_js.replace('Ã¢â‚¬â„¢', '&#8217;')
text_js = text_js.replace('Ã¢â‚¬', '&#8221;')
text_js = text_js.replace('', '')

with open(filepath_js, 'w', encoding='utf-8') as f:
    f.write(text_js)
print("Done fixing characters.")