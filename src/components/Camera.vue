<template>
    <div id="camera-container">
        <video autoplay ref="video" id="video"></video>

        <div id="slot-container">
            <slot></slot>
        </div>
    </div>

    <canvas ref="canvas" id="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, PropType, ref } from "vue";
import { MediaDeviceKind } from "./media-device-kind";
import { Resolution } from "./resolution";

export default defineComponent({
    name: "Camera",
    components: {},
    emits: [
        "loading",
        "started",
        "stopped",
        "paused",
        "resumed",
        "camera-change",
        "snapshot",
    ],
    props: {
        resolution: {
            type: Object as PropType<Resolution>,
            default: () => {
                return { width: 1920, height: 1080 };
            },
        },
        facingMode: {
            type: String,
            default: "environment",
        },
        autoplay: {
            type: Boolean,
            default: false,
        },
        constraints: {
            type: Object,
            required: false,
        },
    },
    setup(props, { emit }) {
        onMounted(() => {
            if (!navigator.mediaDevices)
                throw new Error("Media devices not available");
            if (props.autoplay) start();
        });

        onUnmounted(() => stop());

        const video = ref<HTMLVideoElement>();
        const canvas = ref<HTMLCanvasElement>();
        const stream = ref<MediaStream>();

        const constraints = props.constraints || {
            video: {
                width: props.resolution.width,
                height: props.resolution.height,
                facingMode: props.facingMode,
                deviceId: {},
            },
            audio: false,
        };

        const devices = async (
            kinds: MediaDeviceKind[] = ["audioinput", "videoinput"]
        ): Promise<MediaDeviceInfo[]> => {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.filter((device) => kinds.includes(device.kind));
        };
        
        const currentDevice = (stream: MediaStream | undefined) => {
            if (!stream) return;
            const used_devices = stream
                .getVideoTracks()
                .map((track) => track.getSettings().deviceId);
            if (used_devices.length === 1) {
                emit("used-video-device", used_devices[0]);
            }
        };

        const start = async (): Promise<void> => {
            emit("loading");

            stream.value = await navigator.mediaDevices.getUserMedia(
                constraints
            );

            if (!video.value) throw new Error("Video ref is null");

            video.value.srcObject = stream.value;

            emit("started");
        };

        const snapshot = (
            resolution: Resolution = props.resolution,
            type = "image/png",
            quality?: number
        ): Promise<Blob | null> => {
            if (!video.value) throw new Error("Video ref is null");
            if (!canvas.value) throw new Error("Canvas ref is null");

            const { width, height } = resolution;

            canvas.value.width = width;
            canvas.value.height = height;

            canvas.value
                .getContext("2d")
                ?.drawImage(video.value, 0, 0, width, height);

            return new Promise((resolve) => {
                canvas.value?.toBlob(
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
            stop();
            constraints.video.deviceId.exact = deviceID;
            start();
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
            video,
            snapshot,
            canvas,
            devices,
            currentDevice,
            pause,
            resume,
            changeCamera,
            stream,
        };
    },
});
</script>

<style lang="css" scoped>
#camera-container {
    position: relative;
    width: 100%;
    height: 100%;
}

#slot-container {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
}

#video {
    width: 100%;
    height: 100%;
}

#canvas {
    display: none;
}
</style>
