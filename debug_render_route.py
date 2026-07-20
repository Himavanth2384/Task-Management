import os
import pathlib
from backend.app import create_app

root = pathlib.Path('frontend/dist')
print('dist exists', root.exists(), 'index exists', (root / 'index.html').exists())

os.environ['FRONTEND_DIST_PATH'] = str(root.resolve())
app = create_app()
with app.test_client() as client:
    for path in ['/', '/health', '/tasks/123']:
        resp = client.get(path)
        print(path, resp.status_code, resp.data[:200])
