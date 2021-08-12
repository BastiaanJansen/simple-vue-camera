<template>
    <video autoplay ref="video" id="video"></video>

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
    emits: [
        "started",
        "stopped",
        "paused",
        "resumed",
        "camera-change",
        "snapshot",
    ],
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
    setup(props, { emit }) {
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

        const video = ref<HTMLVideoElement>();
        const canvas = ref<HTMLCanvasElement>();
        const stream = ref<MediaStream>();

        const devices = (): Promise<MediaDeviceInfo[]> =>
            navigator.mediaDevices.enumerateDevices();

        const start = async (): Promise<void> => {
            if (!video.value) throw new Error("Video ref is null");

            stream.value = await navigator.mediaDevices.getUserMedia(
                constraints
            );
            video.value.srcObject = stream.value;

            emit("started");
        };

        const snapshot = (
            type = "image/png",
            quality?: any
        ): Promise<Blob | null> => {
            if (!video.value) throw new Error("Video ref is null");
            if (!canvas.value) throw new Error("Canvas ref is null");

            const width = video.value.videoWidth;
            const height = video.value.videoHeight;

            canvas.value.width = width;
            canvas.value.height = height;

            canvas.value
                .getContext("2d")
                ?.drawImage(video.value, 0, 0, width, height);

            return new Promise((resolve) => {
                canvas.value!.toBlob(
                    (blob: Blob | null) => {
                        emit("snapshot", blob);
                        resolve(blob);
                    },
                    type,
                    quality
                );
            });
        };

        const changeCamera = (deviceID: string): void => {
            emit("camera-change", deviceID);
        };

        const resume = (): void => {
            video.value?.play();
            emit("resumed");
        };

        const pause = (): void => {
            video.value?.pause();
            emit("paused");
        };

        const stop = (): void => {
            stream.value?.getTracks().forEach((track) => track.stop());
            emit("stopped");
        };

        return {
            start,
            stop,
            constraints,
            video,
            snapshot,
            canvas,
            devices,
            pause,
            resume,
            changeCamera,
        };
    },
});
</script>

<style scoped>
#canvas {
    display: none;
}
</style>
