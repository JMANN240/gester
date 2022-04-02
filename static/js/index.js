const tap_time = 100;
const tap_thresh = 0.0001;
const left_line_x = 0.4;
const right_line_x = 0.6;
const hold_line_y = 0.1;

const canvas = document.querySelector('#mouse');
const text_input = document.querySelector('#text');
const send_button = document.querySelector('#send');
const backspace_button = document.querySelector('#backspace');
const cut_button = document.querySelector('#cut');
const copy_button = document.querySelector('#copy');
const paste_button = document.querySelector('#paste');
const undo_button = document.querySelector('#undo');
const enter_button = document.querySelector('#enter');

document.body.style.height = `${window.innerHeight}px`;

const canvas_width = parseFloat(window.getComputedStyle(canvas).width.match(/(\d|\.)*/)[0]);
const canvas_height = parseFloat(window.getComputedStyle(canvas).height.match(/(\d|\.)*/)[0]);

canvas.width = canvas_width;
canvas.height = canvas_height;

const socket = io();

var ctx = canvas.getContext('2d');
ctx.moveTo(canvas_width*left_line_x, 0);
ctx.lineTo(canvas_width*left_line_x, canvas_height);
ctx.moveTo(canvas_width*right_line_x, 0);
ctx.lineTo(canvas_width*right_line_x, canvas_height);
ctx.moveTo(0, canvas_height*hold_line_y);
ctx.lineTo(canvas_width, canvas_height*hold_line_y);
ctx.stroke();

let down = false;
let start_pos = { x: 0, y: 0 };
let start_time = Date.now();
let end_pos = start_pos;
let last_pos = start_pos;
let current_pos = start_pos;

send_button.addEventListener('click', () => {
    socket.emit('text', text_input.value);
    text_input.value = "";
});

backspace_button.addEventListener('click', () => {
    socket.emit('key', 'BACKSPACE 1');
});

cut_button.addEventListener('click', () => {
    socket.emit('hotkey', 'ctrl+x');
});

copy_button.addEventListener('click', () => {
    socket.emit('hotkey', 'ctrl+c');
});

paste_button.addEventListener('click', () => {
    socket.emit('hotkey', 'ctrl+v');
});

undo_button.addEventListener('click', () => {
    socket.emit('hotkey', 'ctrl+z');
});

enter_button.addEventListener('click', () => {
    socket.emit('key', 'ENTER 1');
});

let toPercentWidth = (e) => {
    return {
        x: e.touches[0].clientX / canvas.width, 
        y: e.touches[0].clientY / canvas.width
    };
}

canvas.addEventListener('touchstart', (e) => {
    start_pos = toPercentWidth(e);
    start_time = Date.now();
    end_pos = start_pos;
    last_pos = start_pos;
    current_pos = start_pos;
});

canvas.addEventListener('touchmove', (e) => {
    const current_time = Date.now();
    const delta_time = current_time - start_time;    
    current_pos = toPercentWidth(e);
    if (delta_time > tap_time) {
        let delta_x = current_pos.x - last_pos.x;
        let delta_y = current_pos.y - last_pos.y;
        socket.emit('mouse', {x: delta_x, y: delta_y});
    }
    last_pos = current_pos;
});

canvas.addEventListener('touchend', (e) => {
    const current_time = Date.now();
    const delta_time = current_time - start_time;
    end_pos = current_pos;

    // If the touch was quick enough to be a tap
    if (delta_time <= tap_time) {

        // Variable names for clarity
        const start_x = start_pos.x;
        const start_y = start_pos.y;
        const end_x = end_pos.x;
        const end_y = end_pos.y;
        const delta_x = end_x - start_x;
        const delta_y = end_y - start_y;
        const absolute_delta_x = Math.abs(delta_x);
        const absolute_delta_y = Math.abs(delta_y);

        // If the user swiped, else the user tapped
        if (absolute_delta_x > tap_thresh && absolute_delta_y > tap_thresh) {

            // If the swipe was larger in the x direction, else it was larger in the y direction
            if (absolute_delta_x > absolute_delta_y) {

                // If the swipe was towards the right, else if it was towards the left
                if (delta_x > 0) {
                    console.log("right")
                    socket.emit('key', 'RIGHT ' + Math.ceil(absolute_delta_x*10));
                } else if (delta_x < 0) {
                    console.log("left")
                    socket.emit('key', 'LEFT ' + Math.ceil(absolute_delta_x*10));
                }

            } else if (absolute_delta_x < absolute_delta_y) {

                // If the swipe was downward, else if it was upward
                if (delta_y > 0) {
                    console.log("down")
                    socket.emit('key', 'DOWN ' + Math.ceil(absolute_delta_y*10));
                } else if (delta_y < 0) {
                    console.log("up")
                    socket.emit('key', 'UP ' + Math.ceil(absolute_delta_y*10));
                }

            }
        } else {

            // If the tap was on the left click region, else if it was on the right click region, else it was on the middle click region
            if (start_x < left_line_x) {

                // If the tap was on the hold region, else it was not
                if (start_y < hold_line_y) {
                    console.log("left click (hold)")
                    socket.emit('click', 'LEFT CLICK HOLD');
                } else {
                    console.log("left click");
                    socket.emit('click', 'LEFT CLICK');
                }

            } else if (start_x > right_line_x) {

                // If the tap was on the hold region, else it was not
                if (start_y < hold_line_y) {
                    console.log("right click (hold)")
                    socket.emit('click', 'RIGHT CLICK HOLD');
                } else {
                    console.log("right click");
                    socket.emit('click', 'RIGHT CLICK');
                }

            } else {

                // If the tap was on the hold region, else it was not
                if (start_y < hold_line_y) {
                    console.log("middle click (hold)")
                    socket.emit('click', 'MIDDLE CLICK HOLD');
                } else {
                    console.log("middle click");
                    socket.emit('click', 'MIDDLE CLICK');
                }

            }

        }

    }
});