<template>
  <Transition>
    <div class="search-container">
      <el-form :label-width="`${labelWidth}px`" @submit.native.prevent>
        <!-- 主内容区域 -->
        <div class="main-content">
          <el-row type="flex" :gutter="gutter">
            <el-col :span="rows.length === 1 ? 20 : 22">
              <template v-for="(row, rowIndex) in finalRows">
                <el-row :key="rowIndex" :gutter="gutter">
                  <el-col v-for="(slotKey, colIndex) in row" :key="colIndex" :span="6">
                    <slot :name="slotKey" />
                  </el-col>
                </el-row>
              </template>
            </el-col>
            <el-col :span="rows.length === 1 ? 4 : 2" style="border-left: 1px solid #ddd">
               <div class="button-group" :class="{ 'single-row': rows.length === 1 }">
                <el-button size="small" type="primary" plain class="button" :icon="searchIcon" @click="queryByConditions">
                  {{ searchText }}
                </el-button>
                <el-button v-if="hasReset" plain size="small" class="button" :icon="resetIcon" @click="resetAllConditions">
                  {{ resetText }}
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 展开/收起控制 -->
        <div v-if="showExpandControl" class="expand-control">
          <div class="arrow-container" @click="toggleExpand">
            <span>{{ isExpanded ? '收起' : '更多筛选项' }}</span>
            <i :class="['custom-double-arrow', isExpanded ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-right', isExpanded ? 'arrow-up' : 'arrow-down']" />
          </div>
        </div>
      </el-form>
    </div>
  </Transition>
</template>

<script>

import EventBus from '@/utils/eventBus'

export default {
  name: 'SearchQroup',
  props: {
    labelWidth: { type: Number, default: () => 70 },
    span: { type: Number, default: () => 6 },
    gutter: { type: Number, default: () => 24 },
    searchText: { type: [String, Function], default: '查询' },
    resetText: { type: String, default: '清空' },
    searchIcon: { type: String, default: 'el-icon-search' },
    resetIcon: { type: String, default: 'el-icon-refresh-right' },
    hasReset: { type: Boolean, default: true }
  },
  data() {
    return {
      count: 1,
      slotKeys: [],
      /*  */
      isExpanded: false,
    }
  },
  computed: {
    rows() { // 默认4个一行
      const result = []
      for (let i = 0; i < this.slotKeys.length; i += Math.floor(24 / this.span)) {
        result.push(this.slotKeys.slice(i, i + 4))
      }
      return result
    },
    showExpandControl() {
      return this.rows.length > 2
    },
    finalRows() {
      return this.isExpanded ? this.rows : this.rows.slice(0, 2)
    },
    showExpand() {
      return this.rows.length > 2
    }
  },
  mounted() {
    this.slotKeys = Object.keys(this.$slots)
    this.count = Object.keys(this.$slots).length
  },
  beforeUpdate() {
    this.slotKeys = Object.keys(this.$slots)
    if (Object.keys(this.$slots).length !== this.count) {
      this.count = Object.keys(this.$slots).length
      this.$nextTick(() => EventBus.$emit('search-group-changed'))
    }
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded
      this.$nextTick(() => EventBus.$emit('search-group-changed'))
    },
    queryByConditions() {
      this.$emit('search')
    },
    resetAllConditions() {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  position: relative;
  padding: 8px 8px 8px 0;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.main-content {
  padding: 0 8px;
}
.expand-control {
  position: relative;
  height: 12px;
  border-top: 1px dashed #ddd;
  margin-top: 8px;
  
  .arrow-container {
    position: absolute;
    left: 50%;
    top: -12px;
    transform: translateX(-50%);
    background: white;
    padding: 2px 20px;
    cursor: pointer;
    color: #d36b5f;
    display: flex;
    align-items: center;
    font-size: 12px;
    >span {
      margin-right: 4px;
    }

    .custom-double-arrow {
      display: block;
      font-size: 14px;
      color: #d36b5f;

      &.arrow-up {
        transform: rotate(-90deg);
      }
      &.arrow-down {
        transform: rotate(90deg);
      }

      &:hover {
        color: #d36b5f;
      }
    }
  }
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  justify-content: flex-start;
  padding-top: 2px;

  &.single-row {
    flex-direction: row;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 0;

    .el-button {
      margin-top: 0 !important;
      margin-left: 8px !important;
    }
  }

  .expand-btn {
    i {
      margin-left: 4px;
      font-size: 12px;
    }
  }
  .button {
    height: 32px;
    min-width: 80px;
  }
  .el-button + .el-button {
    margin-left: 0 !important;
    margin-top: 0;
  }
}

.el-col {
  @media (max-width: 1366px) {
    &[class*="el-col-"] {
      &.single-row-mode {
        width: 100%;
      }
    }
  }
}

.transition-box {
  margin: 10px;
  padding: 10px;
  background-color: #f0f2f5;
  border-radius: 4px;
}
.search-container /deep/ .el-form-item {
  margin-bottom: 12px;
}
.search-container /deep/ .el-form-item .el-form-item__label{
  line-height: 16px;
  display: flex;
  align-items: center;
  justify-content: right;
  height: 32px;
  font-size: 12px;
}
.search-container /deep/ .el-form-item .el-form-item__content{
  font-size: 12px;
  height: 32px;
  line-height: 32px;
}
/deep/ .el-input .el-input__inner {
  height: 32px;
  line-height: 32px;
  max-width: 500px;
}
/deep/ .el-select {
  display: inline-block;
  position: relative;
  width: 100%;
  max-width: 500px;
}
/deep/ .el-autocomplete {
  position: relative;
  display: inline-block;
  height: 34px;
  max-width: 500px;
  width: 100%;
}
/deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
  max-width: 500px;
}
/deep/ .el-range-editor.el-input__inner {
  width: 100%;
  height: 32px;
  max-width: 500px;
}
/deep/ .el-button {
  padding: 8px 12px;
  font-size: 12px;
  border-radius: 3px;
}
.btn-container {
  height: 40px;
  padding-top: 8px;
  margin-right: 12px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>
