import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(ROOT, '..'))
BACKEND_DIR = os.path.join(REPO_ROOT, 'backend')
if os.path.isdir(BACKEND_DIR):
    sys.path.insert(0, REPO_ROOT)
else:
    sys.path.insert(0, ROOT)

from backend.app import app

