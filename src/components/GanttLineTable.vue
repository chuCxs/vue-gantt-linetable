<template>
  <div class="ganttWrapper">
    <g-gantt-chart class="ganttChart" v-bind="props.ganttOption">
      <template #upper-timeunit="{ label }">
        <!-- 主时间插槽 -->
        {{ label }}
      </template>
      <template #timeunit="{ value }">
        <!-- 副时间插槽 -->
        {{ dayjs(value).format("MM") }}
      </template>
      <template #bar-tooltip>
        <!-- bar悬浮提示插槽 -->
      </template>
      <template #current-time-label>
        <!-- 显示在当前时间标记旁边的文本槽 -->
        显示在当前时间标记旁边的文本槽
      </template>
      <template #label-column-title>
        <!-- 左侧额外列标题的插槽 -->
      </template>
      <template #label-column-row="{ label }">
        <!-- 行标签预留插槽 -->
        {{ label }}
      </template>
      <g-gantt-row v-for="(item, index) in rowBarList" :key="index" label="" :bars="item.rowChildren" :style="{ height: item.rowHeight + 'px' }">
        <template #label>
          <!-- 用于修改位于行左上角的浮动文本 显示label-column-title后无效 -->
        </template>
        <template #bar-label="{ bar }">
          <!-- 用于修改工具栏中的文本 -->
          <slot name="content" :bar="bar"></slot>
        </template>
      </g-gantt-row>
    </g-gantt-chart>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import dayjs from "dayjs";
const props = defineProps({
  ganttOption: {
    type: Object,
    default: () => {
      return {};
    },
  },
  source: {
    type: Array<{
      siteName: string;
      [key: string]: any;
      detailList: Array<any>;
      // 其他必要的属性
    }>,
    default: [],
  },
  statusColor: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const rowBarList = ref(<any>[]);
const init = async () => {
  await resetStatus();
  props.source.forEach((item) => {
    let height = 90;
    let rowList = <any>[];
    rowLabel.value[item.siteName] = 0;
    let translateY = 0;
    item.detailList.forEach((detailItem: any, index: number) => {
      if (detailItem.hasOwnProperty("nodeId") && detailItem.nodeId.includes("__LineTable.node.ft")) {
        height += 20;
        translateY += 20;
      }
      let child = {
        strokeColor: props.statusColor[item.hasOwnProperty("shipStatus") ? item.shipStatus : "default"],
        projectDesc: index == 0 ? (item.hasOwnProperty("projectDesc") ? item.projectDesc : "") : "",
        translateY: translateY,
        nodeConfig: detailItem,
        beginDate: dayjs(detailItem.nodeStartDate).format("YYYY-MM-DD"),
        endDate: index == item.detailList.length - 1 ? dayjs(detailItem.nodeStartDate).format("YYYY-MM-DD") : dayjs(item.detailList[index + 1].nodeStartDate).format("YYYY-MM-DD"),
        ganttBarConfig: {
          id: generateSecure32Id(),
          label: detailItem.nodeDesc,
          hasHandles: false, //是否在条形的左右两侧显示可拖拽的手柄，用于调整条形的宽度
          immobile: true, //禁用拖拽
          // bundle: "1", //捆绑标识符字符串。具有相同 bundle 值的条形将被绑定在一起，拖拽其中一个时，其他条形会同时移动。
          style: {
            background: "#e09b69",
          },
          // class:''//类
        },
      };
      rowList.push(child);
    });
    rowBarList.value.push({
      nodeConfig: item,
      rowHeight: height,
      rowChildren: rowList,
    });
  });
  nextTick(() => {
    let gLabelColumnRowElements = document.getElementsByClassName("g-label-column-row") as any;
    for (let i = 0; i < gLabelColumnRowElements.length; i++) {
      gLabelColumnRowElements[i].style.height = `${rowBarList.value[i].rowHeight}px`;
    }
    let gridLines = document.getElementsByClassName("g-grid-line") as any;
    for (let i = 0; i < gridLines.length; i++) {
      let bmeLine1 = document.createElement("div");
      bmeLine1.setAttribute("class", "g-bme-line");
      bmeLine1.setAttribute("style", "width:33.3%;height:100%;border-right:1px dashed #eaeaea;");
      gridLines[i].appendChild(bmeLine1);
      let bmeLine2 = document.createElement("div");
      bmeLine2.setAttribute("class", "g-bme-line");
      bmeLine2.setAttribute("style", "width:33.3%;height:100%;border-right:1px dashed #eaeaea;");
      gridLines[i].appendChild(bmeLine2);
    }
    let containerHeight = document.getElementsByClassName("ganttChart")[0].clientHeight;
    let g_label_column = document.getElementsByClassName("g-label-column") as HTMLCollection;
    let g_label_column_attribute = g_label_column[0].getAttribute("style");
    let g_gantt_chart = document.getElementsByClassName("g-gantt-chart") as HTMLCollection;
    let g_gantt_chart_attribute = g_gantt_chart[0].getAttribute("style");
    g_gantt_chart[0].setAttribute("style", `height:${containerHeight}px;overflow-y:scroll;${g_gantt_chart_attribute}`);
    g_label_column[0].setAttribute("style", `position: relative;height:${containerHeight}px;overflow-y:scroll;${g_label_column_attribute}`);
    g_label_column[0].addEventListener("scroll", handleSidebarScroll);
    g_gantt_chart[0].addEventListener("scroll", handleBodyScroll);
    let g_grid_container = document.getElementsByClassName("g-grid-container") as HTMLCollection;
    let g_gantt_rows_container = document.getElementsByClassName("g-gantt-rows-container") as HTMLCollection;
    g_grid_container[0].setAttribute("style", `height:${g_gantt_rows_container[0].clientHeight + 80}px;`);
  }).then(() => {
    setTimeout(() => {
      let a = document.getElementsByClassName("g-gantt-bar") as any;
      for (let i = 0; i < a.length - 1; i++) {
        const newElementChild = Array.from(a[i].children);
        const newElement = a[i].cloneNode(true);
        newElement.innerHTML = "";
        newElementChild.forEach((child) => {
          newElement.appendChild(child);
        });
        a[i].parentNode.replaceChild(newElement, a[i]);
      }
    }, 100);
  });
  GetRowLabel();
};
const resetStatus = () => {
  rowLabel.value = {};
  rowBarList.value = [];
  let g_bme_line = document.getElementsByClassName("g-bme-line") as any;
  if (!!g_bme_line[0]) {
    for (let i = g_bme_line.length - 1; i >= 0; i--) {
      g_bme_line[i].remove();
    }
  }
};
//工具函数
let rowLabel = ref(<any>{});
const GetRowLabel = () => {
  rowBarList.value.forEach((item: any) => {
    rowLabel.value[item.nodeConfig.siteName] += item.rowHeight;
  });
  let g_label_columns_rows = document.getElementsByClassName("g-label-column-rows") as HTMLCollection;
  let g_label_column_title_wrapper = document.getElementsByClassName("g_label_column_title_wrapper") as HTMLCollection;
  if (!!g_label_column_title_wrapper[0]) g_label_column_title_wrapper[0].remove();

  let rowWarpper = document.createElement("div");
  rowWarpper.setAttribute("class", "g_label_column_title_wrapper");
  Object.keys(rowLabel.value).forEach((item: any) => {
    let rowTitle = document.createElement("div");
    rowTitle.setAttribute("class", "g_label_column_title");
    rowTitle.setAttribute("style", `height:${rowLabel.value[item]}px;`);
    const p = document.createElement("p");
    p.textContent = item;
    rowTitle.append(p);
    rowWarpper.appendChild(rowTitle);
  });
  g_label_columns_rows[0].appendChild(rowWarpper);
};
const generateSecure32Id = () => {
  const array = new Uint32Array(32);
  // 填充随机数
  window.crypto.getRandomValues(array);

  // 转换为36进制并拼接，取后两位以确保字符范围
  return Array.from(array, (dec) => dec.toString(36))
    .join("")
    .substring(0, 32);
};
// 滚动同步处理
const syncScroll = (source: HTMLElement, target: HTMLElement | null, property: "scrollTop" | "scrollLeft"): void => {
  if (!target) return;
  target[property] = source[property];
};
let g_label_column = document.getElementsByClassName("g-label-column") as HTMLCollection;
let g_gantt_chart = document.getElementsByClassName("g-gantt-chart") as HTMLCollection;
const handleSidebarScroll = (e: Event) => syncScroll(e.target as HTMLElement, g_gantt_chart[0] as HTMLElement, "scrollTop");
const handleBodyScroll = (e: Event) => syncScroll(e.target as HTMLElement, g_label_column[0] as HTMLElement, "scrollTop");
defineExpose({
  init,
});
</script>
<style scoped>
.ganttWrapper {
  width: 100%;
  height: 100%;
  border: 1px solid #eaeaea;
  overflow: hidden;
  font-size: 14px;
}
.ganttChart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/* 容器 */
:deep(.labels-in-column) {
  min-height: 100% !important;
}
/* 左侧 */
:deep(.g-label-column::-webkit-scrollbar) {
  width: 0px; /* 滚动条宽度 */
}
:deep(.g-label-column-header) {
  box-sizing: border-box;
  border-bottom: 1px solid #eaeaea;
  background-color: white !important;
  position: sticky;
  top: 0;
  z-index: 10;
}
:deep(.g-label-column-rows) {
  box-sizing: border-box;
  display: block;
  position: relative;
}
:deep(.g_label_column_title_wrapper) {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
:deep(.g_label_column_title) {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
}
/* 右侧 */
:deep(.g-timeaxis) {
  min-height: 80px;
}
:deep(.g-grid-line) {
  display: flex;
}
:deep(.g-label-column-row) {
  background: transparent !important;
}
:deep(.g-gantt-bar) {
  background: transparent !important;
  height: 24px !important;
  overflow: visible;
  top: 30px !important; /*待定*/
}
:deep(.g-gantt-bar-label) {
  padding: 0;
}
.ganttWrapper:hover :deep(.g-gantt-chart::-webkit-scrollbar-thumb) {
  background: rgba(136, 136, 136, 0.2); /* 滑块背景色 */
}
:deep(.g-gantt-chart::-webkit-scrollbar) {
  width: 1px; /* 滚动条宽度 */
}
:deep(.g-gantt-chart::-webkit-scrollbar-track) {
  background: transparent; /* 轨道背景色 */
  border-radius: 1px; /* 轨道圆角 */
}
:deep(.g-gantt-chart::-webkit-scrollbar-thumb) {
  background: rgba(136, 136, 136, 0); /* 滑块背景色 */
  border-radius: 6px; /* 滑块圆角 */
}
:deep(.g-gantt-chart::-webkit-scrollbar-thumb:hover) {
  background: rgba(136, 136, 136, 0.8); /* 悬停时滑块背景色 */
}
</style>
