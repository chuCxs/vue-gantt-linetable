import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

//使用vue-ganttastic
import ganttastic from "@infectoone/vue-ganttastic";
app.use(ganttastic);
app.mount("#app");
