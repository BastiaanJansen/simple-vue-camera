<template>
    <video v-show="isPlaying" autoplay ref="video" id="video"></video>

    <div>
        <slot></slot>
    </div>

    <canvas ref="canvas" id="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "Camera",
    components: {},
    emits: [],
    props: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        facingMode: {
            type: String,
            default: "environment",
        },
        autoplay: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        onMounted(() => {
            if (props.autoplay) start();
        });

        const constraints = {
            video: {
                width: { ideal: props.width },
                height: { ideal: props.height },
                facingMode: props.facingMode,
            },
            audio: false,
        };

        const isPlaying = ref(false);
        const video = ref<HTMLVideoElement>();
        const canvas = ref<HTMLCanvasElement>();
        const stream = ref<MediaStream>();

        const devices = (): Promise<MediaDeviceInfo[]> =>
            navigator.mediaDevices.enumerateDevices();

        const start = async (deviceID?: string) => {
            if (!video.value) throw new Error("Video ref is null");
            stream.value = await navigator.mediaDevices.getUserMedia({
                ...constraints,
            });

            video.value.onplay = () => (isPlaying.value = true);
            video.value.srcObject = stream.value;
        };

        const snapshot = (type = "image/png"): string => {
            if (!video.value) throw new Error("Video ref is null");
            if (!canvas.value) throw new Error("Canvas ref is null");

            const width = video.value.videoWidth;
            const height = video.value.videoHeight;

            canvas.value.width = width;
            canvas.value.height = height;

            canvas.value
                .getContext("2d")
                ?.drawImage(video.value, 0, 0, width, height);

            return canvas.value.toDataURL(type);
        };

        const stop = () =>
            stream.value?.getTracks().forEach((track) => track.stop());

        return {
            start,
            stop,
            constraints,
            video,
            snapshot,
            isPlaying,
            canvas,
            devices,
        };
    },
});
</script>

<style scoped>
#canvas {
    display: none;
}
</style>
