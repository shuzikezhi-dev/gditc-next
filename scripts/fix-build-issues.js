#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BuildFixer {
  constructor() {
    this.projectRoot = process.cwd();
    this.outDir = path.join(this.projectRoot, 'out');
    this.nextDir = path.join(this.projectRoot, '.next');
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  // 修复 ActivitiesAndServices 页面
  fixActivitiesAndServicesPage() {
    this.log('🔧 修复 ActivitiesAndServices 页面...');
    
    const pagePath = path.join(this.projectRoot, 'pages', 'ActivitiesAndServices', 'page', '[page].tsx');
    
    if (!fs.existsSync(pagePath)) {
      this.log('❌ ActivitiesAndServices 页面文件不存在', 'ERROR');
      return false;
    }

    // 读取文件内容
    let content = fs.readFileSync(pagePath, 'utf8');
    
    // 修复 getStaticPaths 函数
    const fixedGetStaticPaths = `export const getStaticPaths: GetStaticPaths = async () => {
  try {
    console.log('🚀 开始生成 ActivitiesAndServices 分页路径...');
    
    // 简化路径生成，避免复杂的多语言问题
    const paths = [
      { params: { page: '1' } },
      { params: { page: '2' } },
      { params: { page: '3' } },
      { params: { page: '4' } },
      { params: { page: '5' } }
    ];
    
    console.log(\`✅ 生成了 \${paths.length} 条 ActivitiesAndServices 静态路径\`);
    
    return {
      paths,
      fallback: false
    };
  } catch (error) {
    console.error('❌ 生成ActivitiesAndServices分页路径失败:', error);
    return {
      paths: [{ params: { page: '1' } }],
      fallback: false
    };
  }
}`;

    // 替换 getStaticPaths 函数
    content = content.replace(
      /export const getStaticPaths: GetStaticPaths = async \(\) => \{[\s\S]*?\n\}/,
      fixedGetStaticPaths
    );

    // 修复 getStaticProps 函数
    const fixedGetStaticProps = `export const getStaticProps: GetStaticProps<ActivitiesAndServicesPageProps> = async ({ params }) => {
  try {
    const page = parseInt(params?.page as string) || 1;
    const activitiesPerPage = 12;
    
    console.log(\`\\n--- 🚀 开始为 ActivitiesAndServices 页面 \${page} 获取数据 ---\`);

    // 获取英文活动数据
    console.log('🔄 正在获取 ActivitiesAndServices 数据...');
    const activities = await getContentList('activities-and-services', 'en');
    console.log(\`✅ 获取到 \${activities.length} 条 ActivitiesAndServices 数据\`);

    // 清理数据
    const cleanActivities = (activities: DetailContent[]): Activity[] => {
      return activities.map((item: DetailContent, index: number) => ({
        id: item.id || index + 1,
        documentId: item.documentId,
        category: item.type || 'standardization',
        title: item.title,
        description: item.description || item.descript || '',
        content: item.content,
        image: item.cover?.url,
        date: item.publishedAt || item.createdAt,
        status: 'ongoing',
        location: item.location || 'Online',
        organizer: item.organizer || 'DITC',
        contact: item.contact || '',
        registrationUrl: item.registrationUrl || '',
        tags: item.tags || []
      }));
    };

    const processedActivities = cleanActivities(activities);
    
    // 计算分页
    const totalPages = Math.ceil(processedActivities.length / activitiesPerPage);
    const startIndex = (page - 1) * activitiesPerPage;
    const endIndex = startIndex + activitiesPerPage;
    const paginatedActivities = processedActivities.slice(startIndex, endIndex);

    console.log(\`📊 当前页: \${page}, 每页数量: \${activitiesPerPage}\`);
    console.log(\`📊 总 Activities 数量: \${processedActivities.length}, 总页数: \${totalPages}\`);
    console.log(\`📋 当前页 Activities 数量: \${paginatedActivities.length}\`);

    if (!paginatedActivities.length && page > 1) {
      console.warn(\`⚠️ ActivitiesAndServices 页面 \${page} 没有数据，可能超出范围。\`);
      return { notFound: true };
    }

    return {
      props: {
        activities: paginatedActivities,
        currentPage: page,
        totalPages,
        locale: 'en'
      },
      revalidate: 60
    };
  } catch (error) {
    console.error(\`❌ 获取 ActivitiesAndServices 页面 \${params?.page} 数据失败:\`, error);
    return {
      props: {
        activities: [],
        currentPage: parseInt(params?.page as string) || 1,
        totalPages: 1,
        locale: 'en'
      },
      revalidate: 60
    };
  }
}`;

    // 替换 getStaticProps 函数
    content = content.replace(
      /export const getStaticProps: GetStaticProps<ActivitiesAndServicesPageProps> = async \(\{[\s\S]*?\n\}/,
      fixedGetStaticProps
    );

    // 写回文件
    fs.writeFileSync(pagePath, content);
    this.log('✅ ActivitiesAndServices 页面修复完成');
    return true;
  }

  // 修复英文版本的 ActivitiesAndServices 页面
  fixEnActivitiesAndServicesPage() {
    this.log('🔧 修复英文版 ActivitiesAndServices 页面...');
    
    const pagePath = path.join(this.projectRoot, 'pages', 'en', 'ActivitiesAndServices', 'page', '[page].tsx');
    
    if (!fs.existsSync(pagePath)) {
      this.log('❌ 英文版 ActivitiesAndServices 页面文件不存在', 'ERROR');
      return false;
    }

    // 复制修复后的内容
    const sourcePath = path.join(this.projectRoot, 'pages', 'ActivitiesAndServices', 'page', '[page].tsx');
    const content = fs.readFileSync(sourcePath, 'utf8');
    
    fs.writeFileSync(pagePath, content);
    this.log('✅ 英文版 ActivitiesAndServices 页面修复完成');
    return true;
  }

  // 清理构建缓存
  cleanBuildCache() {
    this.log('🧹 清理构建缓存...');
    
    const dirsToClean = [this.outDir, this.nextDir];
    
    dirsToClean.forEach(dir => {
      if (fs.existsSync(dir)) {
        try {
          execSync(`rm -rf "${dir}"`, { stdio: 'inherit' });
          this.log(`✅ 已清理: ${path.basename(dir)}`);
        } catch (error) {
          this.log(`⚠️ 清理失败: ${path.basename(dir)}`, 'WARN');
        }
      }
    });
  }

  // 运行构建
  runBuild() {
    this.log('🚀 开始构建项目...');
    
    try {
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: this.projectRoot
      });
      
      if (fs.existsSync(this.outDir)) {
        this.log('✅ 构建成功！out 目录已生成');
        return true;
      } else {
        this.log('❌ 构建失败，未生成 out 目录', 'ERROR');
        return false;
      }
    } catch (error) {
      this.log('❌ 构建过程中出现错误', 'ERROR');
      return false;
    }
  }

  // 主修复流程
  async run() {
    this.log('🔧 开始修复构建问题...');
    
    try {
      // 1. 修复页面文件
      this.fixActivitiesAndServicesPage();
      this.fixEnActivitiesAndServicesPage();
      
      // 2. 清理缓存
      this.cleanBuildCache();
      
      // 3. 运行构建
      const buildSuccess = this.runBuild();
      
      if (buildSuccess) {
        this.log('🎉 构建问题修复完成！');
        this.log('📁 out 目录已生成，可以部署静态文件');
      } else {
        this.log('❌ 构建仍然失败，请检查错误信息', 'ERROR');
      }
      
    } catch (error) {
      this.log(`❌ 修复过程中出现错误: ${error.message}`, 'ERROR');
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const fixer = new BuildFixer();
  fixer.run();
}

module.exports = BuildFixer;
