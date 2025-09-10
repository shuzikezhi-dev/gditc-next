#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 加载环境变量文件
function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const envContent = fs.readFileSync(filePath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          envVars[key.trim()] = value;
        }
      }
    });
    
    return envVars;
  }
  return {};
}

// 加载多个环境变量文件
function loadAllEnvFiles() {
  const envFiles = ['.env.local', '.env.auto-update', '.env'];
  const allEnvVars = {};
  
  envFiles.forEach(file => {
    const envVars = loadEnvFile(file);
    Object.assign(allEnvVars, envVars);
  });
  
  return allEnvVars;
}

// 设置环境变量
function setEnvVars() {
  const envVars = loadAllEnvFiles();
  
  Object.keys(envVars).forEach(key => {
    if (!process.env[key]) {
      process.env[key] = envVars[key];
    }
  });
  
  return envVars;
}

// 如果直接运行此脚本，输出环境变量
if (require.main === module) {
  const envVars = setEnvVars();
  console.log('Loaded environment variables:');
  Object.keys(envVars).forEach(key => {
    if (key.includes('TOKEN') || key.includes('SECRET') || key.includes('PASSWORD')) {
      console.log(`${key}=***`);
    } else {
      console.log(`${key}=${envVars[key]}`);
    }
  });
}

module.exports = { loadEnvFile, loadAllEnvFiles, setEnvVars };
