# Gester

## Remote Desktop Control from a Mobile Device

Gester is a program that allows you to remotely control a host that is running the script. It is ideal for applications in which the host does not have an easily accessible mouse or keyboard. 

For example, one could use Gester on a media server (with the help of an init system) to allow for easy control with just a phone.

## Installation

To install gester, clone this git repo, install the dependencies listed in `requirements.txt` using pip, and then run `main.py`. It will host a Flask server on port 8080 that you can connect to from your home Wi-Fi network. 

If your host device has a local IP address of `192.168.1.4` you would type `192.168.1.4:8080` into your address bar on your mobile device to interface with the server.

## Controls

### Mouse

The top 80% of the screen is taken up by the mouse. Drag anywhere on this box to move the mouse. 

If you tap on this box, its behavior depends on where the tap was. The upper subdivisions will toggle holding their respective mouse buttons (left, middle, right), while the lower subdivisions will simply click their respective mouse buttons.

### Keyboard

Swiping anywhere on this mouse box will simulate arrow key presses. It is sensitive to direction and magnitude of the swipe, so larger swipes will send more key presses.

There is a text box for entering text input. Type the desired text in and press the "Send" button to send it to the host device. The remaining buttons are used for keys or commands such as enter, backspace, copy, paste, etc.