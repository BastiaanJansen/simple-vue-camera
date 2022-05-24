<template>
    <div id="camera-container">
        <camera
            ref="camera"
            @loading="logEvent('loading')"
            @started="logEvent('started')"
            @error="(error) => logEvent('error: ' + error)"
            autoplay
        >
        </camera>
    </div>

    <img :src="currentSnapshot" />

    <div>
        <button @click="start">Start</button>
        <button @click="stop">Stop</button>
        <button @click="pause">Pause</button>
        <button @click="resume">Resume</button>
        <button @click="snapshot">Snapshot</button>
    </div>

    <select @change="changeCamera">
        <option
            v-for="camera in cameras"
            :key="camera"
            :value="camera.deviceId"
        >
            {{ camera.deviceId }}
        </option>
    </select>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";

import Camera from "@/components/Camera.vue";

export default defineComponent({
    name: "App",
    components: {
        Camera,
    },
    setup() {
        const camera = ref<InstanceType<typeof Camera>>();

        const cameras: Ref<MediaDeviceInfo[]> = ref([]);

        onMounted(async () => {
            if (!camera.value) return;
            try {
                cameras.value = await camera.value.devices(["videoinput"]);
            } catch (e) {
                console.error(e);
            }
        });

        const start = () => camera.value?.start();
        const stop = () => camera.value?.stop();
        const pause = () => camera.value?.pause();
        const resume = () => camera.value?.resume();
        const snapshot = async () => {
            const blob = await camera.value?.snapshot({
                width: 1280,
                height: 720,
            });
            currentSnapshot.value = URL.createObjectURL(blob!);
        };

        const logEvent = (name: string) => console.log(name);

        const currentSnapshot = ref();

        const changeCamera = (event: Event) => {
            const target = event.target as HTMLSelectElement;
            camera.value?.changeCamera(target.value);
        };

        return {
            camera,
            start,
            stop,
            pause,
            resume,
            logEvent,
            snapshot,
            currentSnapshot,
            cameras,
            changeCamera,
        };
    },
});
</script>

<style scoped>
#camera-container {
    width: 300px;
    height: 300px;
}
</style>
