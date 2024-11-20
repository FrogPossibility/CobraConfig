// questions.js
const inquirer = require('inquirer');

const questions = [
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
      'CLI Tool',
    ],
    default: 'Single script',
  },
  {
    name: 'addReadme',
    type: 'confirm',
    message: 'Do you want to add a README.md with template?',
    default: true,
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
];

module.exports = questions;
