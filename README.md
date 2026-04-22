# vue-gantt-linetable

A Vue3 component for displaying Gantt line tables.

## License

MIT

## 描述

基于Vue-Ganttastic的船舶海工ERP项目中的线表甘特图组件

## 示例

###### 效果图

![image](https://github.com/chuCxs/vue-gantt-linetable/blob/main/public/demo.png?raw=true)

##### Demo地址：https://chucxs.github.io/vue-gantt-linetable

## 说明

基于Vue-Ganttastic开发，使用dayjs处理时间的vue组件

## 安装

```
npm install vue-gantt-pipelinetable --save
```

## 依赖安装

```
npm install @infectoone/vue-ganttastic dayjs
```

## 使用

在您的Vue项目中引入组件和样式：

```javascript
import GanttLineTable from "vue-gantt-pipelinetable";
import "vue-gantt-pipelinetable/dist/style.css";

// 注册组件
app.component("GanttLineTable", GanttLineTable);
```

或在组件中：

```vue
<template>
  <GanttLineTable ref="GanttLineTableRef" :ganttOption="ganttOption" :source="source" :statusColor="statusColor">
    <template #content="{ bar }"> </template>
  </GanttLineTable>
</template>
```

##### 插槽内线形组件

```
github仓库
/src/components/lineNode.vue
/src/components/index.css
```

## 配置属性

```js
let ganttOption = {
  //详细属性可查看Vue-Ganttastic文档
  chartStart: dayjs("2022-01-01").startOf("year").format("YYYY-MM-DD"),
  chartEnd: dayjs("2026-12-31").endOf("year").format("YYYY-MM-DD"),
  precision: "month",
  dateFormat: "YYYY-MM-DD",
  colorScheme: "default",
  hideTimeaxis: false,
  grid: true,
  currentTime: false,
  currentTimeLabel: "显示在当前时间标记旁边的文本槽",
  rowHeight: 120,
  labelColumnTitle: "资源",
  labelColumnWidth: "150px",
  barStart: "beginDate",
  barEnd: "endDate",
};
let source = [
  {
    siteName: "1#滑道",
    shipStatus: "规划", //非必要
    detailList: [
      {
        nodeStartDate: "2026-04-01",
      },
    ],
  },
];
let statusColor = {
  default: "#000000",
  // ......
  规划: "#A9A9A9", //对应shipStatus的value
};
```

## keywords

###### vue、gantt、linetable、component
