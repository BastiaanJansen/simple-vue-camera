<template>
    <div class="w-full h-full">
        <!-- <div class="w-full h-full bg-black"></div> -->
        <camera :resolution="{ width: 375, height: 812 }" autoplay ref="camera">
            <div class="w-full h-full flex flex-col auto-rows-min relative">
                <div
                    class="w-full h-full grid grid-cols-3 grid-rows-3 absolute"
                >
                    <div
                        v-for="index in 9"
                        :key="index"
                        class="w-full h-full border-b-1 border-gray-400"
                        :class="{ 'border-r-1': index % 3 !== 0 }"
                    ></div>
                </div>
                <header></header>

                <footer class="mt-auto relative">
                    <div
                        class="relative w-full mb-3 h-20 flex justify-end"
                        id="countdown-container"
                    >
                        <transition name="slide-back">
                            <h1
                                class="
                                    text-white
                                    font-bold
                                    text-7xl
                                    mr-5
                                    absolute
                                "
                                v-if="hasDelay && countdownHasStarted"
                                :key="countdown"
                            >
                                {{ countdown }}<span class="text-3xl">s</span>
                            </h1>
                        </transition>
                    </div>

                    <div
                        class="
                            bg-black
                            h-auto
                            bg-opacity-25
                            backdrop-filter backdrop-blur-lg
                        "
                    >
                        <div
                            class="
                                w-full
                                px-5
                                h-24
                                flex
                                items-center
                                justify-between
                            "
                        >
                            <button
                                class="
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-white
                                    flex
                                    justify-center
                                    items-center
                                    overflow-hidden
                                    relative
                                "
                                @click="cycleDelay"
                            >
                                <transition-group name="slide">
                                    <div v-for="index in [delay]" :key="index">
                                        <p
                                            class="font-extrabold text-lg"
                                            v-if="hasDelay"
                                        >
                                            {{ delays[index]
                                            }}<span class="text-sm">s</span>
                                        </p>
                                        <font-awesome-icon
                                            v-else
                                            icon="stopwatch"
                                        ></font-awesome-icon>
                                    </div>
                                </transition-group>
                            </button>

                            <button
                                class="
                                    flex
                                    justify-center
                                    items-center
                                    transition-all
                                    duration-500
                                    rounded-full
                                "
                                :class="[
                                    hasDelay && countdownHasStarted
                                        ? 'w-7 h-7 bg-red-400'
                                        : 'w-12 h-12 bg-white',
                                ]"
                                v-on="
                                    hasDelay
                                        ? { click: toggleCountdown }
                                        : { click: snapshot }
                                "
                            >
                                <div
                                    class="
                                        w-full
                                        h-full
                                        rounded-full
                                        border-2 border-white
                                        p-7
                                    "
                                ></div>
                            </button>

                            <button
                                class="
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-white
                                    flex
                                    justify-center
                                    items-center
                                "
                            >
                                <font-awesome-icon
                                    icon="sync"
                                ></font-awesome-icon>
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </camera>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

import Camera from "@/components/Camera.vue";

export default defineComponent({
    name: "App",
    components: {
        Camera,
    },
    setup() {
        const camera = ref<InstanceType<typeof Camera>>();

        const delays = [0, 3, 5, 10];
        const delay = ref(0);

        const cycleDelay = () => {
            delay.value = delay.value < delays.length - 1 ? delay.value + 1 : 0;
        };

        const countdown = ref(0);
        const countdownTimeout = ref();
        const countdownInterval = ref();

        const hasDelay = computed(() => delays[delay.value] !== 0);
        const countdownHasStarted = computed(
            () => countdownTimeout.value !== undefined
        );

        const snapshot = async () => {
            const blob = await camera.value?.snapshot();
            console.log(blob);
        };

        const toggleCountdown = () =>
            countdownHasStarted.value
                ? stopCountdown()
                : startCountdown(snapshot);

        const startCountdown = (callback: () => void) => {
            countdown.value = delays[delay.value];

            countdownInterval.value = setInterval(() => {
                countdown.value--;
            }, 1000);

            countdownTimeout.value = setTimeout(() => {
                callback();
                stopCountdown();
            }, countdown.value * 1000);
        };

        const stopCountdown = () => {
            clearTimeout(countdownTimeout.value);
            clearInterval(countdownInterval.value);
            countdownTimeout.value = undefined;
            countdownInterval.value = undefined;
        };

        return {
            camera,
            delays,
            delay,
            cycleDelay,
            countdown,
            snapshot,
            toggleCountdown,
            countdownTimeout,
            hasDelay,
            countdownHasStarted,
        };
    },
});
</script>

<style>
body,
html,
#app {
    margin: 0;
    height: 100%;
}

#countdown-container {
    perspective: 100px;
    perspective-origin: right;
}

.slide-leave-active,
.slide-enter-active {
    transition: all 0.3s;
    transform-origin: center center;
    position: absolute;
}

.slide-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.slide-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

.slide-back-leave-active,
.slide-back-enter-active {
    transition: all 0.3s;
    transform-origin: center center;
    position: absolute;
}

.slide-back-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.slide-back-leave-to {
    transform: translateZ(-10px);
    opacity: 0;
}
</style>
