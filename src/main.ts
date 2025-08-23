import { createApp } from "vue";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { loadSlim } from '@tsparticles/slim'
import Particles from '@tsparticles/vue3'
import App from "./App.vue";
import router from "./router";
import './style/main.scss'

declare module '@tsparticles/vue3'

import { iconList } from './libs/icon'

iconList()

const app = createApp(App);

app.component("fa", FontAwesomeIcon);

app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine)
  }
})

app.use(createPinia());

app.use(router);

app.mount("#app");
