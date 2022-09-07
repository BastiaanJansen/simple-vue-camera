# Simple Vue Camera

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/7d9578d39b5e4736be10095914541a07)](https://www.codacy.com/gh/BastiaanJansen/simple-vue-camera/dashboard?utm_source=github.com&utm_medium=referral&utm_content=BastiaanJansen/simple-vue-camera&utm_campaign=Badge_Grade)
![](https://img.shields.io/github/license/BastiaanJansen/simple-vue-camera)
![](https://img.shields.io/github/issues/BastiaanJansen/simple-vue-camera)

A simple to use, but extensive, camera component for Vue 3 with Typescript support to create great camera experiences like this:

[![Phone camera](https://media.giphy.com/media/UuAkrsLaxI5AXDwJuQ/giphy.gif)](https://media.giphy.com/media/UuAkrsLaxI5AXDwJuQ/giphy.gif)

By default, this component does not render any UI elements on top of the video feed, so you can style it and make it your own.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
    -   [Basics](#basics)
    -   [Snapshots](#snapshots)
    -   [Camera](#camera)
    -   [Component information](#component-information)

## Installation

Install Simple Vue Camera with NPM:

```
npm install simple-vue-camera
```

or, with Yarn:

```
yarn install simple-vue-camera
```

After installation, you can register the `Camera` component globally in `main.ts`:

```ts
import { createApp } from "vue";
import App from "./App.vue";
import Camera from "simple-vue-camera";

createApp(App).component("camera", Camera).mount("#app");
```

or, register it to a specific component:

```vue
<script lang="ts">
import { defineComponent } from "vue";
import Camera from "simple-vue-camera";

export default defineComponent({
    components: {
        Camera,
    },
});
```

## Usage

### Basics

After registering the `Camera` component, you can use it as follows:

```vue
<template>
    <camera :resolution="{ width: 375, height: 812 }" autoplay></camera>
</template>
```

Use the available slot to overlay UI on top of the video feed:

```vue
<template>
    <camera :resolution="{ width: 375, height: 812 }" autoplay>
        <button>I'm on top of the video</button>
    </camera>
</template>
```

### Snapshots

To create screenshots of the video feed, use the `snapshot` function on the component reference:

```vue
<template>
    <camera :resolution="{ width: 375, height: 812 }" ref="camera" autoplay></camera>
    <button @click="snapshot">Create snapshot</button>
</template>

<script lang="ts">
import Camera from "simple-vue-camera";

export default defineComponent({
    setup() {
        // Get a reference of the component
        const camera = ref<InstanceType<typeof Camera>>();

        // Use camera reference to call functions
        const snapshot = async () => {
            const blob = await camera.value?.snapshot();

            // To show the screenshot with an image tag, create a url
            const url = URL.createObjectURL(blob);
        }

        return {
            camera,
            snapshot
        }
    }
});
```

By default, when creating a snapshot, the resolution of the snapshot will be the same as the resolution of the camera feed. To change that, pass a `Resolution` with the function call:

```ts
const blob = await camera.value?.snapshot({ width: 1920, height: 1080 });
```

Or change the image type and quality:

```ts
const blob = await camera.value?.snapshot(
    { width: 1920, height: 1080 },
    "image/png",
    0.5
);
```

### Camera

It is possible to change the camera. First request all `videoinput` devices:

```ts
const devices = camera.value?.devices(["videoinput"]);
```

Pick a device, e.g. with a dropdown, and pass the device ID to the `changeCamera` function:

```ts
const device = devices[0];
camera.value?.changeCamera(device.deviceId);
```

**Note:** When switching cameras, the camera component will restart and emit the `loading` and `started` events again.

### Component information

#### Properties

|    Name     |           Type           | Default     | Description                                                                                                                           |
| :---------: | :----------------------: | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| resolution  |       `Resolution`       | 1920 x 1080 | The resolution of the camera view                                                                                                     |
| facingMode  |         `string`         | environment |                                                                                                                                       |
|  autoplay   |        `boolean`         | `true`      | Determines if the camera is automatically started when mounted, when set to false, you must start the camera programmatically         |
| playsinline |        `boolean`         | `true`      | Determines if the camera plays inline instead of starting full screen, when set to false some browsers open a fullscreen video player |
| constraints | `MediaStreamConstraints` |             | Change the default constraints                                                                                                        |

#### Functions

| Name            | Parameters                                                  | Description                                                          |
| :-------------- | :---------------------------------------------------------- | -------------------------------------------------------------------- |
| devices         | `kinds: MediaDeviceKind[]`                                  | Returns a list of compatible devices which matches the allowed kinds |
| start           |                                                             | Starts the camera                                                    |
| stop            |                                                             | Stops the camera                                                     |
| pause           |                                                             | Pauses the video stream                                              |
| resume          |                                                             | Resumes the video stream                                             |
| changeCamera    | `deviceID: string`                                          | Changes the selected camera                                          |
| snapshot        | `resolution: Resolution`, `type: string`, `quality: number` | Creates a snapshot of the current video image                        |
| currentDeviceID |                                                             | Returns the currently used device id of the mediastream              |

#### Events

The `Camera` component emits 7 different events.

```vue
<template>
    <camera
        @loading="loading"
        @started="started"
        @stopped="stopped"
        @paused="paused"
        @resumed="resumed"
        @camera-change="cameraChange"
        @snapshot="snapshot"
        @error="error"
    ></camera>
</template>

<script lang="ts">
import Camera from "simple-vue-camera";

export default defineComponent({
    setup() {
        const loading = () => console.log("Camera is loading and will start any second");
        const started = () => console.log("Camera has started");
        const stopped = () => console.log("Camera has stopped");
        const paused = () => console.log("Video feed has paused");
        const resumed = () => console.log("Video feed has resumed");
        const cameraChange = (deviceID: string) => console.log(`Camera has been changed to ${deviceID}`);
        const snapshot = (blob: Blob) => console.log("A snapshot has been taken");
        const error = (error: Error) => console.log("error");

        return {
            loading,
            started,
            stopped,
            paused,
            resumed,
            cameraChange,
            snapshot,
            error
        }
    }
});
```

|     Name      |     Parameters     | Description                                      |
| :-----------: | :----------------: | ------------------------------------------------ |
|    loading    |                    | Emitted when the camera is loading               |
|    started    |                    | Emitted when the camera is loaded and is visible |
|    stopped    |                    | Emitted when the camera has stopped              |
|    paused     |                    | Emitted when the video has paused                |
|    resumed    |                    | Emitted when the video has resumed               |
| camera-change | `deviceID: string` | Emitted when a camera change occurs              |
|   snapshot    |    `blob: Blob`    | Emitted when a snapshot is taken                 |
|     error     |   `error: Error`   | Emitted when an error occurs                     |

## Licence

simple-vue-camera is available under the MIT licence. See the LICENCE for more info.

[![Stargazers repo roster for @BastiaanJansen/simple-vue-camera](https://reporoster.com/stars/BastiaanJansen/simple-vue-camera)](https://github.com/BastiaanJansen/simple-vue-camera/stargazers)
