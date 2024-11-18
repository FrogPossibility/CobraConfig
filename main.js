#!/usr/bin/env node

const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ora = require('ora');
const figlet = require('figlet');

function createReadme(folderPath, projectName, projectType) {
  const readmeContent = `
# ${projectName}

## Description
Brief description of the project

## Installation
\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage
[Usage instructions]

## Testing
[Testing Instructions]

## Contribute
[How to contribute to the project]

## License
[License Information]
`;
  
  fs.writeFileSync(path.join(folderPath, 'README.md'), readmeContent);
}


// Funzione per il controllo dei prerequisiti
function checkPrerequisites() {
  const spinner = ora('Checking prerequisites...').start();

  return new Promise((resolve, reject) => {
    exec('python --version', (error) => {
      spinner.stop();
      if (error) {
        console.error(chalk.red('Error: Python is not installed or configured incorrectly in the PATH.'));
        reject(new Error('Python not found'));
      } else {
        console.log(chalk.green('Python is configured correctly.'));
        resolve();
      }
    });
  });
}

// Funzione per creare una licenza
function createLicense(folderPath, licenseType) {
  const licenses = {
    MIT: `MIT License\n\nCopyright (c) ${new Date().getFullYear()}\n\nPermission is hereby granted, free of charge...`,
    GPL: `GNU GENERAL PUBLIC LICENSE\nVersion 3, 29 June 2007\n\nCopyright (C)...`,
    Apache: `Apache License\nVersion 2.0, January 2004\n\nTERMS AND CONDITIONS FOR USE...`,
  };

  const licenseContent = licenses[licenseType];
  if (!licenseContent) return;

  const licensePath = path.join(folderPath, 'LICENSE');
  fs.writeFileSync(licensePath, licenseContent);
  console.log(chalk.green(`LICENSE file (${licenseType}) created successfully!`));
}

// Funzione per installare dipendenze
async function installDependencies(folderPath, virtualEnvName, requirementsPath, dependencies) {
  const isWindows = process.platform === 'win32';
  const pipPath = isWindows
    ? path.join(folderPath, virtualEnvName, 'Scripts', 'pip')
    : path.join(folderPath, virtualEnvName, 'bin', 'pip');

  let command = `"${pipPath}" install`;
  if (requirementsPath) {
    command += ` -r "${requirementsPath}"`;
  } else if (dependencies.length > 0) {
    command += ` ${dependencies.join(' ')}`;
  } else {
    return;
  }

  const spinner = ora('Installing dependencies...').start();
  return new Promise((resolve, reject) => {
    exec(command, { cwd: folderPath }, (error, stdout, stderr) => {
      spinner.stop();
      if (error) {
        console.error(chalk.red(`Error installing dependencies: ${stderr.trim()}`));
        reject(error);
      } else {
        console.log(chalk.green('Dependencies installed successfully!'));
        resolve();
      }
    });
  });
}

// Funzione per creare una struttura di cartelle
function createFolderStructure(folderPath, folderStructure) {
  folderStructure.forEach((subFolder) => {
    const subFolderPath = path.join(folderPath, subFolder);
    fs.mkdirSync(subFolderPath, { recursive: true });
    console.log(chalk.green(`Folder '${subFolder}' created successfully!`));
  });
}

// Funzione per creare un file .gitignore
function createGitignore(folderPath) {
  const gitignoreContent = `# Ignore virtual environments
venv/
__pycache__/
*.pyc
*.pyo
*.log
.env
`;

  const gitignorePath = path.join(folderPath, '.gitignore');
  fs.writeFileSync(gitignorePath, gitignoreContent);
  console.log(chalk.green('.gitignore file created successfully!'));
}

// Funzione per inizializzare un repository Git
function initializeGitRepo(folderPath) {
  const spinner = ora('Initializing the Git repository...').start();

  return new Promise((resolve, reject) => {
    exec('git init', { cwd: folderPath }, (error, stdout, stderr) => {
      spinner.stop();
      if (error) {
        console.error(chalk.red(`Error initializing Git: ${stderr.trim()}`));
        reject(error);
      } else {
        console.log(chalk.green('Git repository initialized successfully!'));
        resolve();
      }
    });
  });
}

// Funzione per creare un Dockerfile
function createDockerfile(folderPath) {
  const dockerfileContent = `FROM python:3.9-slim

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "main.py"]
`;

  const dockerfilePath = path.join(folderPath, 'Dockerfile');
  fs.writeFileSync(dockerfilePath, dockerfileContent);
  console.log(chalk.green('Dockerfile successfully created!'));
}

// Domande interattive
async function askQuestions() {
  console.log(chalk.cyan(figlet.textSync('CobraConfig')));

  const answers = await inquirer.prompt([
    {
      name: 'directory',
      type: 'input',
      message: 'Enter the directory where you want to create the project:',
      default() {
        return 'C:/';
      },
    },
    {
      name: 'folderName',
      type: 'input',
      message: 'Enter the name of the project to create:',
      default() {
        return 'New_project';
      },
    },
    {
      name: 'createVirtualEnv',
      type: 'confirm',
      message: 'Do you want to create a virtual environment for this project?',
      default: false,
    },
    {
      name: 'virtualEnvName',
      type: 'input',
      message: 'Enter the name of the virtual environment:',
      when: (answers) => answers.createVirtualEnv,
      default: 'venv',
    },
    {
      name: 'useRequirements',
      type: 'confirm',
      message: 'Do you want to use a requirements.txt file for dependencies?',
      when: (answers) => answers.createVirtualEnv,
    },
    {
      name: 'requirementsPath',
      type: 'input',
      message: 'Enter the path to the requirements.txt file:',
      when: (answers) => answers.useRequirements,
      validate(input) {
        if (!input) {
          return 'The file path cannot be empty.';
        }
        return true;
      },
    },
    {
      name: 'dependencies',
      type: 'input',
      message: 'What dependencies do you want to install? (separated by a space)',
      when: (answers) => answers.createVirtualEnv && !answers.useRequirements,
      filter(input) {
        return input.split(' ').filter(Boolean);
      },
    },
    {
      name: 'addGitignore',
      type: 'confirm',
      message: 'Do you want to add a .gitignore file',
    },
    {
      name: 'projectType',
      type: 'list',
      message: 'What type of project do you want to create?',
      choices: [
        'Single script',
        'Package Python',
        'Web App (Flask)',
        'Web App (Django)',
        'API REST (FastAPI)',
        'Data Science',
        'Machine Learning',
        'GUI (Tkinter)',
        'CLI Tool'
      ],
      default: 'Single script'
    },
    {
      name: 'addReadme',
      type: 'confirm',
      message: 'Do you want to add a README.md with template?',
      default: true
    },
    {
      name: 'initializeGit',
      type: 'confirm',
      message: 'Do you want to initialize a Git repository?',
    },
    {
      name: 'addDockerfile',
      type: 'confirm',
      message: 'Do you want to add a Dockerfile?',
    },
    {
      name: 'license',
      type: 'list',
      message: 'Choose a license for your project:',
      choices: ['MIT', 'GPL', 'Apache', 'None'],
      default: 'MIT',
    },
  ]);

  return answers;
}

// Funzione modificata per chiedere se ricominciare
async function askToRestart() {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldRestart',
      message: 'Setup complete! Do you want to create another project?',
      default: true
    }
  ]);
  
  if (answer.shouldRestart) {
    console.clear(); // Pulisce la console per il nuovo progetto
    await createProject();
  } else {
    console.log(chalk.cyan('Thank you for using CobraConfig python project builder!'));
    console.clear();
    process.exit(0);
  }
}

async function createProject() {
  try {
    await checkPrerequisites();

    const {
      directory,
      folderName,
      projectType,
      createVirtualEnv,
      virtualEnvName,
      useRequirements,
      requirementsPath,
      dependencies,
      addGitignore,
      initializeGit,
      addDockerfile,
      addReadme,
      license,
    } = await askQuestions();

    const folderPath = path.join(directory, folderName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(chalk.green(`Project folder '${folderName}' created successfully!`));
    }

    // Crea sempre la struttura delle cartelle in base al tipo di progetto
    const spinner = ora('Creating project structure...').start();
    try {
      createProjectStructure(folderPath, projectType);
      spinner.succeed('Project structure successfully created!');
    } catch (error) {
      spinner.fail('Error creating project structure');
      throw error;
    }

    // Crea README.md se richiesto
    if (addReadme) {
      const readmeSpinner = ora('Creating README.md...').start();
      try {
        createReadme(folderPath, folderName, projectType, license);
        readmeSpinner.succeed('README.md created successfully!');
      } catch (error) {
        readmeSpinner.fail('Error creating README.md');
        throw error;
      }
    }

    if (createVirtualEnv) {
      const venvSpinner = ora('Creating the virtual environment...').start();
      await new Promise((resolve, reject) => {
        exec(`python -m venv ${virtualEnvName}`, { cwd: folderPath }, async (error) => {
          if (error) {
            venvSpinner.fail('Error creating virtual environment.');
            reject(error);
          } else {
            venvSpinner.succeed('Virtual environment created successfully!');
            try {
              await installDependencies(folderPath, virtualEnvName, requirementsPath, dependencies);
              resolve();
            } catch (err) {
              reject(err);
            }
          }
        });
      });
    }

    if (addGitignore) {
      createGitignore(folderPath);
    }

    if (initializeGit) {
      await initializeGitRepo(folderPath);
    }

    if (addDockerfile) {
      createDockerfile(folderPath);
    }

    if (license !== 'None') {
      createLicense(folderPath, license);
    }

    console.log(chalk.cyan(figlet.textSync('Setup Complete!')));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await askToRestart();

  } catch (error) {
    console.error(chalk.red(error.message));
    await askToRestart();
  }
}

// Funzione per creare strutture di progetto specifiche
function createProjectStructure(folderPath, projectType) {
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
      'data/raw/README.md',
      'data/processed/README.md',
      'src/data_processing',
      'src/features',
      'src/models',
      'src/visualization',
      'reports/figures'
    ],
    'Machine Learning': [
      'data/raw',
      'data/processed',
      'models/README.md',
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

  const structure = structures[projectType] || ['src', 'tests', 'docs'];
  
  structure.forEach(item => {
    const fullPath = path.join(folderPath, item);
    if (item.endsWith('.py') || item.endsWith('.html') || item.endsWith('.yaml') || item.endsWith('.ipynb')) {
      // Crea il file con contenuto di base
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, getTemplateContent(item, projectType));
    } else {
      // Crea la directory
      fs.mkdirSync(fullPath, { recursive: true });
      // Se è una directory che dovrebbe contenere un README, aggiungilo
      if (item.endsWith('raw') || item.endsWith('processed') || item.endsWith('models')) {
        fs.writeFileSync(path.join(fullPath, 'README.md'), 
          `# ${path.basename(item)}\n\nThis directory contains ${getDirectoryDescription(item)}`);
      }
    }
  });
}

function getTemplateContent(filename, projectType) {
  const templates = {
    'main.py': `#!/usr/bin/env python3\n# -*- coding: utf-8 -*-\n\n"""
${projectType} main module.
"""\n\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()`,
    'cli.py': `#!/usr/bin/env python3\n# -*- coding: utf-8 -*-\n\"""
Command Line Interface for ${projectType}
\"""\n\nimport click\n\n@click.command()\ndef cli():\n    pass\n\nif __name__ == "__main__":\n    cli()`,
    '__init__.py': '',
    'config.py': `"""
Configuration settings for ${projectType}
"""\n\nclass Config:\n    DEBUG = False\n    TESTING = False\n\nclass DevelopmentConfig(Config):\n    DEBUG = True`,
    'base.html': `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>${projectType}</title>\n</head>\n<body>\n    {% block content %}{% endblock %}\n</body>\n</html>`,
    'index.html': `{% extends "base.html" %}\n\n{% block content %}\n<h1>Welcome to ${projectType}</h1>\n{% endblock %}`,
  };

  return templates[path.basename(filename)] || '# Add your code here\n';
}

function getDirectoryDescription(dirname) {
  const descriptions = {
    'raw': 'the raw unprocessed data.',
    'processed': 'processed data ready for analysis.',
    'models': 'saved templates.',
    'tests': 'the project tests.',
    'docs': 'project documentation.'
  };

  return descriptions[path.basename(dirname)] || 'the specific files in this directory.';
}

// Funzione per creare un README completo
function createReadme(folderPath, projectName, projectType, license) {
  const readmeContent = `# ${projectName}

## Description
Project ${projectType} created with CobraConfig.

## Project structure
\`\`\`
${getProjectStructure(folderPath)}
\`\`\`

## Requirements
- Python 3.x
- Virtual environment (optional)
${getDependenciesSection(folderPath)}

## Installation
1. Clone the repository
\`\`\`bash
git clone [url-repository]
cd ${projectName}
\`\`\`

2. (Optional) Create and activate a virtual environment
\`\`\`bash
python -m venv venv
source venv/bin/activate  # Linux/MacOS
venv\\Scripts\\activate    # Windows
\`\`\`

3. Install the dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage
[Add instructions for using the project here]

## Testing
[Add testing instructions here]

## Contributing
[Add guidelines to contribute to the project here]

## License
${getLicenseSection(license)}
`;

  fs.writeFileSync(path.join(folderPath, 'README.md'), readmeContent);
}

function getProjectStructure(folderPath) {
  // Implementa una funzione per ottenere la struttura delle cartelle
  // Questo è un placeholder
  return 'src/\n├── main.py\n└── ...\n';
}

function getDependenciesSection(folderPath) {
  const reqPath = path.join(folderPath, 'requirements.txt');
  if (fs.existsSync(reqPath)) {
    return `\nDependencies (see requirements.txt):\n${fs.readFileSync(reqPath, 'utf8')}`;
  }
  return '';
}

function getLicenseSection(license) {
  return license === 'None' ? 'This project does not yet have a license.' : `This project is under license ${license}.`;
}

// Avvio dello script
createProject();