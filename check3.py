with open('e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/index.html', 'r', encoding='utf-8') as f:
    text = f.read()
import re
match1 = re.search(r'<span class="bc-sep">(.*?)</span>', text)
if match1:
    print('bc-sep char:', match1.group(1))