<template>
    <div id="camera-container">
        <camera :width="300" :height="140" ref="camera" autoplay></camera>
    </div>

    <div>
        <button @click="start">Start</button>
        <button @click="stop">Stop</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import Camera from "@/components/Camera.vue";

export default defineComponent({
    name: "App",
    components: {
        Camera,
    },
    setup() {
        const camera = ref<InstanceType<typeof Camera>>();

        onMounted(async () => {
            if (!camera.value) return;
            try {
                const devices: MediaDeviceInfo[] = await camera.value.devices();
            } catch (e) {
                console.log(e);
            }
        });

        const start = () => camera.value?.start();
        const stop = () => camera.value?.stop();

        return {
            camera,
            start,
            stop,
        };
    },
});
</script>

<style scoped>
/*#camera-container {*/
/*    position: relative;*/
/*    background-color: red;*/
/*    width: 500px;*/
/*}*/
</style>
