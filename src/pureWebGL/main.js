let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
let k = canvas.width/canvas.height;

let context = canvas.getContext('webgl');

context.clearColor(1, 1, 1, 1);

let vertexShader = context.createShader(context.VERTEX_SHADER);
context.shaderSource(vertexShader, `
            attribute vec2 position;
            uniform vec2 translation;
            void main() {
                gl_Position = vec4(position + translation, 0.0, 1.0);
            }
        `);
context.compileShader(vertexShader);

let fragmentShader = context.createShader(context.FRAGMENT_SHADER);
context.shaderSource(fragmentShader, `
            precision highp float;
            uniform vec4 color;
            void main() {
                gl_FragColor = color;
            }
        `);
context.compileShader(fragmentShader);

let program = context.createProgram();
context.attachShader(program, vertexShader);
context.attachShader(program, fragmentShader);
context.linkProgram(program);
context.useProgram(program);

let vertices = new Float32Array(createCircleArray([-0.75, 0], 0.1, 20));

let buffer = context.createBuffer();
context.bindBuffer(context.ARRAY_BUFFER, buffer);
context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);

program.color = context.getUniformLocation(program, 'color');
context.uniform4fv(program.color, [0, 0, 0, 1.0]);

program.position = context.getAttribLocation(program, 'position');
context.enableVertexAttribArray(program.position);
context.vertexAttribPointer(program.position, 2, context.FLOAT, false, 0, 0);

program.translation = context.getUniformLocation(program, 'translation');
let translation = [0, 0];

context.clear(context.COLOR_BUFFER_BIT);
context.drawArrays(context.TRIANGLES, 0, vertices.length/2);
function drawScene() {
    if (translation[0] < 0.9) {
        context.clear(context.COLOR_BUFFER_BIT);
        translation[0] += 0.005;
        context.uniform2fv(program.translation, translation);

        context.drawArrays(context.TRIANGLES, 0, vertices.length/2);
        requestAnimationFrame(drawScene);
    }
}
function createCircleArray(centreCoordinates, radius, segments) {
    let circlePartsCoordinates = new Array(6*segments+6); //coordinates of each triangle (segment) vertex
    let alfa = Math.PI*2/segments;
    let currentAngle = 0;
    for (let i = 0; i < circlePartsCoordinates.length; i+=6) {
        circlePartsCoordinates[i] = centreCoordinates[0];
        circlePartsCoordinates[i+1] = centreCoordinates[1];
    }
    for (let i = 4; i < circlePartsCoordinates.length; i+=6) {
        circlePartsCoordinates[i] = centreCoordinates[0] + radius*Math.cos(currentAngle);
        circlePartsCoordinates[i+1] = (centreCoordinates[1] + radius*Math.sin(currentAngle))*k;
        currentAngle += alfa;
    }
    circlePartsCoordinates[2] = centreCoordinates[0] + radius;
    circlePartsCoordinates[3] = centreCoordinates[1]*k;
    for (let i = 8; i < circlePartsCoordinates.length; i+=6) {
        circlePartsCoordinates[i] = circlePartsCoordinates[i-4];
        circlePartsCoordinates[i + 1] = circlePartsCoordinates[i-3];
    }
    return circlePartsCoordinates;
}

function drawIonPulserImage(position, AccelerationZoneSize, size, borderSize) {
    //...
}
drawIonPulserImage([-0.85, -0.2], 0.3, 0.7, 0.05);
drawScene();
