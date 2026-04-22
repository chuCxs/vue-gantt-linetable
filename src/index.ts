import GanttLineTable from './components/GanttLineTable.vue'

export { GanttLineTable }

export default {
  install(app: any) {
    app.component('GanttLineTable', GanttLineTable)
  }
}