import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
// import App from "./App.vue";

import FullscreenCamera from "./components/FullscreenCamera.vue";
import "./assets/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStopwatch, faSync } from "@fortawesome/free-solid-svg-icons";

library.add(faSync, faStopwatch);

createApp(FullscreenCamera)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount("#app");
