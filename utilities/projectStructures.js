// utilities/projectStructures.js
const structures = {
    'Single script': [
      'main.py'
    ],
    'Package Python': [
      'src/__init__.py',
      'src/main.py',
      'tests/__init__.py',
      'tests/test_main.py',
      'docs/README.md'
    ],
    'Web App (Flask)': [
      'app/__init__.py',
      'app/routes.py',
      'app/models.py',
      'app/templates/base.html',
      'app/templates/index.html',
      'app/static/css',
      'app/static/js',
      'app/static/img',
      'config.py',
      'run.py'
    ],
    'Web App (Django)': [
      'manage.py',
      'projectname/settings.py',
      'projectname/urls.py',
      'projectname/wsgi.py',
      'apps/mainapp/views.py',
      'apps/mainapp/models.py',
      'templates/base.html',
      'static/css',
      'static/js',
      'static/img'
    ],
    'API REST (FastAPI)': [
      'app/__init__.py',
      'app/main.py',
      'app/api/endpoints',
      'app/core/config.py',
      'app/models',
      'app/schemas',
      'tests'
    ],
    'Data Science': [
      'notebooks/exploration.ipynb',
      'data/raw/',
      'data/processed/',
      'src/data_processing',
      'src/features',
      'src/models',
      'src/visualization',
      'reports/figures'
    ],
    'Machine Learning': [
      'data/raw',
      'data/processed',
      'models/',
      'notebooks',
      'src/features',
      'src/models',
      'src/training',
      'src/evaluation',
      'config/model_config.yaml'
    ],
    'GUI (Tkinter)': [
      'src/main.py',
      'src/views',
      'src/controllers',
      'src/models',
      'resources/images',
      'resources/styles'
    ],
    'CLI Tool': [
      'src/cli.py',
      'src/commands',
      'src/utils',
      'tests/test_cli.py',
      'config/default.yaml'
    ]
  };
  
  module.exports = structures;