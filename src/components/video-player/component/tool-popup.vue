<template>
  <div class="tools-popup" ref="ToolsPopupRef" @mouseleave="leaveTool">
    <div class="tool" @click="clickTool">
      <slot name="tool"></slot>
    </div>
    <!-- <div class="popup" ref="PopupRef"> -->
    <div class="popup" ref="PopupRef" v-show="bShowPopup">
      <slot name="popup"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'tool-popup',
  data () {
    return {
      bShowPopup: false
    };
  },
  methods: {
    clickTool () {
      this.bShowPopup = !this.bShowPopup;
      this.$emit('clickTool');
    },

    leaveTool () {
      this.bShowPopup = false;
    }
  }
}
</script>
<style scoped>
.popup {
    position: absolute;
    bottom: 34px;
    width: auto;
    padding-bottom: 28px;
    color: #eee;
    display: inline-block;
    transform: translateX(-50%);
}
</style>
