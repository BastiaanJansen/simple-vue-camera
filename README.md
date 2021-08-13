# simple-vue-camera

## Installation

## Usage

### Properties
|     Name    |           Type           | Default     | Description                                                                                                                   |
|:-----------:|:------------------------:|-------------|-------------------------------------------------------------------------------------------------------------------------------|
|  resolution |       `Resolution`       | 1920 x 1080 | The resolution of the camera view                                                                                             |
|  facingMode |         `string`         | environment |                                                                                                                               |
|   autoplay  |         `boolean`        | `true`      | Determines if the camera is automatically started when mounted, when set to false, you must start the camera programmatically |
| constraints | `MediaStreamConstraints` |             | Change the default constraints                                                                                                |
### Functions
|     Name     |                          Parameters                         | Description                                                           |
|:------------:|:-----------------------------------------------------------:|-----------------------------------------------------------------------|
|    devices   |                  `kinds: MediaDeviceKind[]`                 | Returns a list of compatible devices which matches the allowed kinds  |
|     start    |                                                             | Starts the camera                                                     |
|     stop     |                                                             | Stops the camera                                                      |
|     pause    |                                                             | Pauses the video stream                                               |
|    resume    |                                                             | Resumes the video stream                                              |
| changeCamera |                           deviceID                          | Changes the selected camera                                           |
|   snapshot   | `resolution: Resolution`, `type: string`, `quality: number` | Creates a snapshot of the current video image                         |

### Events

| Name          | Parameters         | Description                                      |
|:-------------:|:------------------:|--------------------------------------------------|
| loading       |                    | Emitted when the camera is loading               |
| started       |                    | Emitted when the camera is loaded and is visible |
| stopped       |                    | Emitted when the camera has stopped              |
| paused        |                    | Emitted when the video has paused                |
| resumed       |                    | Emitted when the video has resumed               |
| camera-change | `deviceID: string` | Emitted when a camera change occurs              |
| snapshot      | `blob: Blob`       | Emitted when a snapshot is taken                 |
