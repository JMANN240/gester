from flask import Flask, render_template
from flask_socketio import SocketIO
import pyautogui
import os
from engineio.payload import Payload

Payload.max_decode_packets = 50

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app)

w, h = pyautogui.size()

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('key')
def handle_key(message):
    print(str(message))
    split_message = message.split(" ")
    key = split_message[0]
    num = int(split_message[1])
    for i in range(num):
        pyautogui.press(key.lower())

@socketio.on('hotkey')
def handle_hotkey(message):
    print(str(message))
    split_message = message.split("+")
    pyautogui.hotkey(split_message[0], split_message[1])

left_down = False
middle_down = False
right_down = False

@socketio.on('click')
def handle_click(message):
    global left_down, middle_down, right_down
    if message == "LEFT CLICK":
        pyautogui.leftClick()
    elif message == "MIDDLE CLICK":
        pyautogui.middleClick()
    elif message == "RIGHT CLICK":
        pyautogui.rightClick()
    elif message == "LEFT CLICK HOLD":
        if left_down:
            pyautogui.mouseUp(button='left')
            left_down = False
        else:
            pyautogui.mouseDown(button='left')
            left_down = True
    elif message == "MIDDLE CLICK HOLD":
        if middle_down:
            pyautogui.mouseUp(button='middle')
            middle_down = False
        else:
            pyautogui.mouseDown(button='middle')
            middle_down = True
    elif message == "RIGHT CLICK HOLD":
        if right_down:
            pyautogui.mouseUp(button='right')
            right_down = False
        else:
            pyautogui.mouseDown(button='right')
            right_down = True

@socketio.on('mouse')
def handle_mouse(message):
    pyautogui.move(message['x']*w, message['y']*h)

@socketio.on('text')
def handle_text(message):
    pyautogui.write(message, interval=0.025)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080, debug=True)