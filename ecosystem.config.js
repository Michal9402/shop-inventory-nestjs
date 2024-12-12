module.exports = {
  apps: [
    {
      name: 'shop=inventory-app',
      script: 'npm',
      args: 'run start:dev',
      env: { NODE_ENV: 'development', ENV_VAR1: 'environment-variable' },
    },
  ],
};
