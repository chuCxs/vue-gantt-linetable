<template>
  <div>
    <div class="icon" @click="update"></div>
    <span class="time">{{ time }}</span>
    <div class="line-wrap">
      <span class="line-label">{{ betweenNodeLabel }}</span>
    </div>
    <div class="node-label">
      {{ nodeLabel }}
      <div class="project-label">{{ projectLabel }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  nodeLabel: {
    type: String,
    default: "",
  },
  projectLabel: {
    type: String,
    default: "",
  },
  betweenNodeLabel: {
    type: String,
    default: "",
  },
  time: {
    type: String,
    default: "",
  },
  nodeConfig: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const emit = defineEmits(["updateValue"]);
const update = () => {
  emit("updateValue", props.nodeConfig);
};
</script>
