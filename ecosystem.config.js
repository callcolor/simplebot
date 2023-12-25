module.exports = {
  apps: [
    {
      autorestart: true,
      instances: 1,
      kill_timeout: 20000,
      max_memory_restart: '500M',
      name: 'bonnie',
      restart_delay: 10 * 60 * 1000,
      script: 'dist/bonnie.js',
      shutdown_with_message: true,
      watch: false,
    }
  ],
};
