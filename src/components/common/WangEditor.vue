<template>
  <div style="border: 1px solid #ccc;">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      :disable="isCheck"
    />
    <Editor
      v-model="html"
      :defaultConfig="editorConfig"
      style="height: 500px; overflow-y: hidden"
      :disable="isCheck"
      @onCreated="onCreated"
      @onChange="onChange"
      @onDestroyed="onDestroyed"
      @onMaxLength="onMaxLength"
      @onFocus="onFocus"
      @onBlur="onBlur"
      @customAlert="customAlert"
      @customPaste="customPaste"
    />
</div>
</template>

<script>

import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
  name: 'WangEditor',
  components: { Editor, Toolbar },
  props: {
    isCheck: { type: Boolean, default: false }
  },
  watch: {
    isCheck: {
      handler(val, oldValue) {
        if (val) {
          this.editor && this.editor.disable()
        } else {
          this.editor && this.editor.enable()
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      html: '',
      editor: null,
      toolbarConfig: {
        toolbarKeys: [
          "bold",
          "italic",
          "underline",
          "fontSize",
          "fontFamily",
          "bgColor",
          "lineHeight",
          "todo",
          "insertLink",
          "insertImage",
          "insertTable",
          "justifyLeft",
          "justifyCenter",
          "justifyRight",
          "undo",
          "redo",
          "code"
        ],
        // excludeKeys: ["insertImage", "insertVideo"], // 排除图片和视频功能
      },
      editorConfig: {
        placeholder: '请输入内容...',
      },
      mode: 'simple', // or 'simple'
    }
  },
  mounted() {
  },
  beforeDestroy() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onCreated(editor) {
        this.editor = Object.seal(editor)
        if (this.isCheck) {
          this.editor.disable()
        } else {
          this.editor.enable()
        }
        // console.log('onCreated', editor)
    },
    onChange(editor) {
      // console.log('onChange', editor.children)
      if (this.isCheck) {
        this.editor.disable()
      }
    },
    onDestroyed(editor) {
      // console.log('onDestroyed', editor)
    },
    onMaxLength(editor) { 
      // console.log('onMaxLength', editor) 
    },
    onFocus(editor) {
      // console.log('onFocus', editor)
    },
    onBlur(editor) { 
      // console.log('onBlur', editor) 
    },
    customAlert(info, type) { 
      // window.alert(`customAlert in Vue demo\n${type}:\n${info}`)
     },
    customPaste(editor, event, callback) {
        // console.log('ClipboardEvent 粘贴事件对象', event)
        // const html = event.clipboardData.getData('text/html') // 获取粘贴的 html
        const text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本
        // const rtf = event.clipboardData.getData('text/rtf') // 获取 rtf 数据（如从 word wsp 复制粘贴）

        // 自定义插入内容
        editor.insertText(text)

        // 返回 false ，阻止默认粘贴行为
        // event.preventDefault()
        // callback(false) // 返回值（注意，vue 事件的返回值，不能用 return）

        // 返回 true ，继续默认的粘贴行为
        callback(true)
    },
    getHtml() {
      return this.html
    },
    setHtml(html) {
      if (html) {
        this.html = html
      }
    },
    clearHtml() {
      this.html = ''
      this.editor.clear()
    }
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>

