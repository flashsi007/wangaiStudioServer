<template>
  <div class="commands-list">
    <template v-if="items.length">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="command-item"
        :class="{ 'is-selected': index === selectedIndex }"
        @click="selectItem(index)"
      >
        <div class="command-content">
          <div class="command-header">
            <component 
              v-if="item.icon" 
              :is="item.icon" 
              class="command-icon" 
              :size="16"
            />
            <div class="command-title">{{ item.title }}</div>
          </div>
          <div class="command-description">{{ item.description }}</div>
        </div>
      </div>
    </template>
    <div v-else class="command-item">
      No result
    </div>
  </div>
</template>

<script>
import { 
  Bot, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  List, 
  ListOrdered, 
  LayoutList, 
  Braces, 
  TextQuote,
  Table 
} from 'lucide-vue-next'

export default {
  name: 'CommandsList',
  
  components: {
    Bot,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    List,
    ListOrdered,
    LayoutList,
    Braces,
    TextQuote,
    Table,
  },
  
  props: {
    items: {
      type: Array,
      required: true,
    },
    command: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: 0,
    }
  },

  watch: {
    items() {
      this.selectedIndex = 0
    },
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }

      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }

      return false
    },

    upHandler() {
      this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length
    },

    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },

    enterHandler() {
      this.selectItem(this.selectedIndex)
    },

    selectItem(index) {
      const item = this.items[index]

      if (item) {
        this.command(item)
      }
    },
  },
}
</script>

<style scoped>
.commands-list {
  background: var(--popover);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-size: 0.9rem;
  max-height: 20rem;
  overflow: auto;
  padding: 0.5rem;
  position: relative;
  z-index: 1000;
  min-width: 280px;
  /* 确保菜单在任何位置都有良好的视觉效果 */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* 当菜单显示在上方时的特殊样式 */
.commands-list[data-placement^="top"] {
  box-shadow: 0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05);
}

.command-item {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  display: block;
  margin: 0;
  padding: 0.75rem;
  text-align: left;
  width: 100%;
  transition: all 0.15s ease-in-out;
  color: var(--foreground);
}

.command-item:hover,
.command-item.is-selected {
  background-color: var(--accent);
  border-color: var(--border);
  color: var(--accent-foreground);
}

.command-content {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}

.command-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.command-icon {
  color: var(--muted-foreground);
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
}

.command-title {
  font-weight: 500;
  color: var(--foreground);
  font-size: 0.875rem;
}

.command-description {
  color: var(--muted-foreground);
  font-size: 0.75rem;
  margin-top: 0.125rem;
  line-height: 1.4;
}


</style>