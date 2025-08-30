<template>
  <div class="mention-test-container">
    <h1>Mention 组件测试</h1>
    <div class="test-section">
      <h2>基本功能测试</h2>
      <p>在下面的文本框中输入 "#" 来触发提及功能：</p>
      <!-- <Mention :tree="testTreeData" /> -->
    </div>
    
    <div class="test-section">
      <h2>测试数据结构</h2>
      <details>
        <summary>点击查看测试数据</summary>
        <pre>{{ JSON.stringify(testTreeData, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import Mention from '@/components/TiptapEditor/extensions/Mention.vue'

// 测试数据 - 简化版的树形结构
const testTreeData = ref([
  {
    "title": "写网文的步骤",
    "key": "4d8c66dd-cace-4225-8ec0-b65c11f5f76b",
    "children": [
      {
        "title": "一、第一阶段：市场调研（1-2天）",
        "key": "cbc0bb09-ce12-4f1d-8492-33038ad22a26",
        "children": [
          {
            "title": "1. 分析当前热门榜单：看什么类型最火",
            "key": "73fc1e8c-d84b-488d-bc0b-647a6137278d",
            "children": [
              {
                "title": "目的：了解目前市场上哪些小说类型最受欢迎",
                "key": "08a5d1a9-0562-4cd3-88d7-0db1e989d6f8"
              },
              {
                "title": "操作建议",
                "key": "20c3fa58-a74e-4810-9600-182e610019a5",
                "children": [
                  {
                    "title": "平台选择：在主流网文平台查看榜单",
                    "key": "a5e8e9ad-d8f7-4224-a385-20b72fc3fde7"
                  },
                  {
                    "title": "类型识别",
                    "key": "f208b7fb-f810-4e22-8e0d-84c8960f5b0d",
                    "children": [
                      {
                        "title": "男频：玄幻、修真、都市、科幻",
                        "key": "bc417e8d-9680-4d28-8454-e94c5dfc64e7"
                      },
                      {
                        "title": "女频：言情、穿越、重生、宫斗",
                        "key": "f4bf579a-ca13-4740-a82d-e05a554e4909"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "title": "2. 研究爆款套路：总结成功模式",
            "key": "a10e6145-1dc0-4775-93e4-1dcadc137d2d",
            "children": [
              {
                "title": "目的：学习已有成功作品的结构",
                "key": "49d9331c-13d5-4ed1-9591-070f0bf22c12"
              },
              {
                "title": "操作建议",
                "key": "a840ced1-e290-451b-b525-0763472669e0",
                "children": [
                  {
                    "title": "选书标准：挑选3-5部近期爆红的小说",
                    "key": "b321a3f4-5916-4446-b963-0ed2c8986148"
                  },
                  {
                    "title": "分析维度",
                    "key": "b5fea2b9-a6e4-4537-9718-681cbac28dae",
                    "children": [
                      {
                        "title": "开头是否吸引人",
                        "key": "94551407-3074-4958-acf3-cf8c513a42cd"
                      },
                      {
                        "title": "人物塑造是否立体",
                        "key": "c3fbddc8-d35d-4b6e-80d3-eb0792db8325"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "title": "二、第二阶段：核心创意（1天）",
        "key": "second-stage",
        "children": [
          {
            "title": "确定核心卖点",
            "key": "core-selling-point"
          },
          {
            "title": "设计主角人设",
            "key": "protagonist-design"
          }
        ]
      }
    ]
  },
  {
    "title": "技术文档",
    "key": "tech-docs",
    "children": [
      {
        "title": "前端开发",
        "key": "frontend",
        "children": [
          {
            "title": "Vue.js",
            "key": "vuejs"
          },
          {
            "title": "React",
            "key": "react"
          }
        ]
      },
      {
        "title": "后端开发",
        "key": "backend",
        "children": [
          {
            "title": "Node.js",
            "key": "nodejs"
          },
          {
            "title": "Python",
            "key": "python"
          }
        ]
      }
    ]
  }
])
</script>

<style scoped>
.mention-test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.test-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #f9fafb;
}

.test-section h2 {
  margin-top: 0;
  color: #374151;
  font-size: 18px;
  font-weight: 600;
}

.test-section p {
  color: #6b7280;
  margin-bottom: 16px;
}

details {
  margin-top: 16px;
}

summary {
  cursor: pointer;
  font-weight: 500;
  color: #3b82f6;
  margin-bottom: 8px;
}

pre {
  background-color: #f3f4f6;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
  color: #374151;
}

h1 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 40px;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .mention-test-container {
    background-color: #111827;
    color: #f9fafb;
  }
  
  .test-section {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  .test-section h2 {
    color: #f9fafb;
  }
  
  .test-section p {
    color: #d1d5db;
  }
  
  pre {
    background-color: #374151;
    color: #f9fafb;
  }
  
  h1 {
    color: #f9fafb;
  }
  
  summary {
    color: #60a5fa;
  }
}
</style>