<template>
  <div 
    v-if="items.length > 0" 
    class="slash-commands-menu"
    ref="menuRef"
  >
    <div class="command-list">
      <div 
        v-for="(item, index) in items" 
        :key="item.title"
        :class="['command-item', { active: index === selectedIndex }]"
        @click="selectItem(index)"
      >
        <component :is="item.icon" class="command-icon" />
        <div class="command-content">
          <span class="command-title">{{ item.title }}</span>
          <span class="command-description">{{ item.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
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
  TextQuote
} from 'lucide-vue-next'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  command: {
    type: Function,
    required: true
  }
})

const selectedIndex = ref(0)
const menuRef = ref(null)

const selectItem = (index) => {
  const item = props.items[index]
  if (item) {
    props.command(item)
  }
}

const upHandler = () => {
  selectedIndex.value = ((selectedIndex.value + props.items.length) - 1) % props.items.length
}

const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

const enterHandler = () => {
  selectItem(selectedIndex.value)
}

const keydownHandler = (event) => {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}

watch(() => props.items, () => {
  selectedIndex.value = 0
})

defineExpose({
  onKeyDown: keydownHandler
})
</script>

<style scoped>
.slash-commands-menu {
  position: fixed;
  z-index: 1000;
  background: var(--popover);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-height: 300px;
  overflow-y: auto;
  min-width: 280px;
}

.command-list {
  padding: 0.5rem;
}

.command-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  gap: 0.75rem;
  color: var(--foreground);
}

.command-item:hover,
.command-item.active {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

.command-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--muted-foreground);
  flex-shrink: 0;
}

.command-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.command-title {
  font-weight: 500;
  color: var(--foreground);
  font-size: 0.875rem;
}

.command-description {
  color: var(--muted-foreground);
  font-size: 0.75rem;
  line-height: 1.4;
}
</style>