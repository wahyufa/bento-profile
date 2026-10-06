from pathlib import Path
import base64

root = Path(__file__).parent
html = (root / 'index.html').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + (root / 'style.css').read_text(encoding='utf-8') + '</style>')
html = html.replace('<script src="app.js"></script>', '<script>' + (root / 'app.js').read_text(encoding='utf-8') + '</script>')
logo = base64.b64encode((root / 'atlas-logo.png').read_bytes()).decode()
html = html.replace('src="atlas-logo.png"', f'src="data:image/png;base64,{logo}"')
(root / 'atlas-course.html').write_text(html, encoding='utf-8')
print('Packaged atlas-course.html')
