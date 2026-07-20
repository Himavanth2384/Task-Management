import os
import tempfile
import pathlib
from backend.app import create_app

d=tempfile.mkdtemp()
pathlib.Path(d,'index.html').write_text('<html>spa-ready</html>',encoding='utf-8')
os.environ['FRONTEND_DIST_PATH']=d
app=create_app()
print(app.url_map)
with app.test_client() as c:
    resp=c.get('/tasks/123')
    print('status', resp.status_code)
    print(resp.data.decode('utf-8'))
