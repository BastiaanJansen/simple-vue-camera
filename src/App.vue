<template>
    <div id="camera-container">
        <camera
            :width="300"
            :height="140"
            ref="camera"
            @started="logEvent"
            autoplay
        ></camera>
    </div>

    <div>
        <button @click="start">Start</button>
        <button @click="stop">Stop</button>
        <button @click="pause">Pause</button>
        <button @click="resume">Resume</button>
        <button @click="snapshot">Snapshot</button>
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
        const pause = () => camera.value?.pause();
        const resume = () => camera.value?.resume();
        const snapshot = async () => {
            const blob = await camera.value?.snapshot();
            console.log(blob);
        };

        const logEvent = () => console.log("started");

        return {
            camera,
            start,
            stop,
            pause,
            resume,
            logEvent,
            snapshot,
        };
    },
});
</script>

<style scoped></style>
