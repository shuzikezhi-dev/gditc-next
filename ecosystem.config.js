module.exports = {
  apps: [
    {
      name: 'ditc-auto-updater',
      script: 'scripts/auto-update.js',
      args: 'start',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        UPDATE_INTERVAL: '600000', // 10分钟
        DEPLOY_COMMAND: 'npx wrangler deploy'
      },
      env_file: '.env.local',
      env_development: {
        NODE_ENV: 'development',
        UPDATE_INTERVAL: '300000', // 5分钟用于测试
        DEPLOY_COMMAND: 'echo "Development deploy"'
      },
      env_file: '.env.local',
      log_file: './logs/auto-updater.log',
      out_file: './logs/auto-updater-out.log',
      error_file: './logs/auto-updater-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true
    },
    {
      name: 'ditc-static-server',
      script: 'scripts/serve-static.js',
      args: '6001',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 6001
      },
      log_file: './logs/static-server.log',
      out_file: './logs/static-server-out.log',
      error_file: './logs/static-server-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true
    }
  ]
};
