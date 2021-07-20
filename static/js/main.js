import init, { AsyncGameEngine } from '/ao-wasm-site/pkg/ao_rust_web.js';
await init();
// await run();
// await gl_main();

let canvas = document.getElementById("canvas");


let gameEngine = await AsyncGameEngine.new("/ao-wasm-site/static/asset/", canvas);
let cameraSpeed = {x: 0.0, y: 0.0};
let mapIndex = 1;

await gameEngine.set_map(mapIndex);

let last;
function step(timestamp) {
    if (last === undefined) {
        last = timestamp;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameEngine.set_viewport_size(canvas.width, canvas.height);
    gameEngine.step((timestamp - last) / 1000.0);
    last = timestamp;
    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);

function updateCameraSpeed() {
    let norm = Math.sqrt(cameraSpeed.x*cameraSpeed.x + cameraSpeed.y*cameraSpeed.y);
    if (norm > 0.0) {
        cameraSpeed.x /= norm;
        cameraSpeed.y /= norm;
    }
    gameEngine.set_camera_speed(cameraSpeed.x, cameraSpeed.y);
}

document.addEventListener('keypress', async function (e) {
    switch(e.key) {
        case 'n':
            mapIndex++;
            break;
        case 'p':
            mapIndex--;
            break;
    }
    if (mapIndex < 1) mapIndex = 1;
    console.log("Loading map ", mapIndex);
    await gameEngine.set_map(mapIndex);
})

document.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'ArrowDown':
            cameraSpeed.y = 1.0;
            break;
        case 'ArrowUp':
            cameraSpeed.y = -1.0;
            break;
        case 'ArrowRight':
            cameraSpeed.x = 1.0;
            break;
        case 'ArrowLeft':
            cameraSpeed.x = -1.0;
            break;
    }
    updateCameraSpeed();
});

document.addEventListener('keyup', function (e) {
    switch (e.key) {
        case 'ArrowDown':
            cameraSpeed.y = 0.0;
            break;
        case 'ArrowUp':
            cameraSpeed.y = 0.0;
            break;
        case 'ArrowRight':
            cameraSpeed.x = 0.0;
            break;
        case 'ArrowLeft':
            cameraSpeed.x = 0.0;
            break;
    }
    updateCameraSpeed();
});
