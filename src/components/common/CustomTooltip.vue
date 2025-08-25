<template>
  <div class="custom-tooltip-wrapper">
    <span 
      ref="contentRef"
      class="text-ellipsis"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      {{ content }}
    </span>
    
    <!-- 自定义 tooltip -->
    <div 
      v-show="visible"
      ref="tooltipRef"
      class="custom-tooltip"
      :style="tooltipStyle"
      @mouseenter="keepTooltipVisible"
      @mouseleave="closeTooltip"
    >
      <div class="tooltip-content">
        <div class="tooltip-text">{{ content }}</div>
        <el-button 
          class="copy-btn" 
          icon="el-icon-document-copy" 
          circle
          size="mini"
          @click="handleCopy"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomTooltip',
  props: {
    content: String
  },
  data() {
    return {
      visible: false,
      showTooltip: false,
      tooltipTimer: null,
      isHoveringTooltip: false,
      tooltipStyle: {
        top: '0px',
        left: '0px'
      }
    };
  },
  methods: {
    handleMouseEnter(event) {
      const el = event.target;

      // 确保 contentRef 的宽度和高度不为 0
      if (el.offsetWidth === 0 || el.offsetHeight === 0) {
        console.warn('Content element has no width or height.');
        return;
      }
      // 判断文本是否溢出
      this.showTooltip = el.scrollWidth > el.offsetWidth;
      
      if (this.showTooltip) {
        // 清除之前的关闭定时器
        clearTimeout(this.tooltipTimer);
        this.visible = true;
        
        // 等待 DOM 更新后定位 tooltip
        this.$nextTick(() => {
          this.positionTooltip(event);
        });
      }
    },
    
    handleMouseLeave() {
      // 设置延迟关闭，让鼠标有足够时间移动到 tooltip
      this.tooltipTimer = setTimeout(() => {
        if (!this.isHoveringTooltip) {
          this.visible = false;
        }
      }, 200);
    },
    
    keepTooltipVisible() {
      // 标记鼠标正在 tooltip 上
      this.isHoveringTooltip = true;
      clearTimeout(this.tooltipTimer);
    },
    
    closeTooltip() {
      this.isHoveringTooltip = false;
      this.visible = false;
    },
    
    positionTooltip(event) {
      if (!this.$refs.tooltipRef) return;

      const target = event.target;
      const rect = target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // 获取 tooltip 的尺寸
      const tooltipRect = this.$refs.tooltipRef.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 初始位置：默认显示在目标元素下方
      let top = rect.bottom + scrollTop + 5; // 目标元素底部下方 5px
      let left = rect.left + scrollLeft;

      // 如果超出视口右侧，则将 tooltip 放置在目标元素左侧
      if (left + tooltipRect.width > viewportWidth + scrollLeft) {
        left = rect.right - tooltipRect.width - 5; // 左侧留 5px 边距
      }

      // 如果超出视口底部，则将 tooltip 放置在目标元素上方
      if (top + tooltipRect.height > viewportHeight + scrollTop) {
        top = rect.top + scrollTop - tooltipRect.height - 5; // 放置在目标元素上方
      }

      // 确保 left 和 top 不为负值
      if (left < 0) left = 5; // 最小 left 为 5px
      if (top < 0) top = 5; // 最小 top 为 5px

      // 应用样式
      this.tooltipStyle = {
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: '50vw', // 最大宽度为视口宽度的一半
        maxHeight: '80vh' // 最大高度为视口高度的 80%
      };

      console.log('【目标元素位置】', rect);
      console.log('【tooltip 尺寸】', tooltipRect);
      console.log('【最终样式】', this.tooltipStyle);
    },
    
    handleCopy() {
      // 创建临时 textarea 元素用于复制
      const textarea = document.createElement('textarea');
      textarea.value = this.content;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          this.$message.success('复制成功');
        } else {
          this.$message.error('复制失败');
        }
      } catch (err) {
        this.$message.error('复制失败');
      } finally {
        document.body.removeChild(textarea);
      }
      
      this.visible = false;
    }
  },
  beforeDestroy() {
    clearTimeout(this.tooltipTimer);
  }
};
</script>

<style scoped>
.custom-tooltip-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.text-ellipsis {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  height: 100%;
  cursor: default;
}

.custom-tooltip {
  position: absolute;
  z-index: 9999;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  overflow-y: auto;
  word-break: break-all;
}

.tooltip-content {
  position: relative;
  padding-right: 30px;
}

.tooltip-text {
  max-height: 300px; /* 设置一个固定的最大高度 */
  overflow-y: auto; /* 启用垂直滚动条 */
  padding-right: 5px; /* 避免滚动条遮挡内容 */
  word-break: break-word; /* 确保长单词自动换行 */
}

.copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px !important;
  font-size: 12px;
  z-index: 10;
  background: #fff;
}

.copy-btn:hover {
  background: #f5f7fa;
}
</style>

<style>
/* 全局滚动条样式 */
.custom-tooltip::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-tooltip::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.custom-tooltip::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>