"""Bundle the separate student design options without changing option A."""
from pathlib import Path
import base64

root = Path(__file__).parent
logo = base64.b64encode((root / 'atlas-logo.png').read_bytes()).decode()
for option in ('b', 'c'):
    html = (root / f'option-{option}.html').read_text(encoding='utf-8')
    for name in ('style.css', f'option-{option}.css'):
        html = html.replace(f'<link rel="stylesheet" href="{name}">', '<style>' + (root / name).read_text(encoding='utf-8') + '</style>')
    for name in ('app.js', f'option-{option}.js'):
        if (root / name).exists():
            html = html.replace(f'<script src="{name}"></script>', '<script>' + (root / name).read_text(encoding='utf-8') + '</script>')
    html = html.replace('src="atlas-logo.png"', f'src="data:image/png;base64,{logo}"')
    (root / f'atlas-course-option-{option}.html').write_text(html, encoding='utf-8')
    print(f'Packaged option {option.upper()}')
