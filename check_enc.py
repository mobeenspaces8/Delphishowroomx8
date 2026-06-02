import re

with open('e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

match1 = re.search(r'<span class="bc-sep">(.*?)</span>', text)
if match1:
    print('bc-sep:', repr(match1.group(1)))

match2 = re.search(r'<h2>Automated Patient Intake (.*?) Architecture</h2>', text)
if match2:
    print('Architecture sep:', repr(match2.group(1)))

match3 = re.search(r'<div class="quote-icon">(.*?)</div>', text)
if match3:
    print('quote-icon:', repr(match3.group(1)))