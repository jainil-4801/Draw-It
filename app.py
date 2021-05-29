from __future__ import with_statement     
from flask import Response, request, jsonify
import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, abort, redirect
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant, ChatGrant
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from twilio.twiml.messaging_response import MessagingResponse
from PIL import Image
import re 
import base64
import requests
import cv2
import numpy as np
import json

from time import sleep

from flask_socketio import SocketIO
from threading import Thread

import requests
import sys
import traceback
import urllib

import json
from rev_ai.models import MediaConfig
from rev_ai.streamingclient import RevAiStreamingClient
from six.moves import queue

import os
import string
import random
from os import listdir
from os.path import isfile, join, splitext
import time
import sys
import numpy as np
import argparse
import ast

from flask_cors import CORS

from twilio.http.http_client import TwilioHttpClient

async_mode = None

app = Flask(__name__)
socketio = SocketIO(app, async_mode=None, cors_allowed_origins="*",logger=True, engineio_logger=True)
app.config['WTF_CSRF_CHECK_DEFAULT'] = False
CORS(app)


load_dotenv()
twilio_account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
twilio_api_key_sid = os.environ.get('TWILIO_API_KEY_SID')
twilio_api_key_secret = os.environ.get('TWILIO_API_KEY_SECRET')
twilio_client = Client(twilio_api_key_sid, twilio_api_key_secret,
                       twilio_account_sid)

def processImage():
    img = Image.open('./output.png')
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        if item[0] >= 70 and item[1] >= 70 and item[2] >= 70:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save("./processed.png", "PNG")

def get_chatroom(name):
    for conversation in twilio_client.conversations.conversations.list():
        if conversation.friendly_name == name:
            return conversation

    # a conversation with the given name does not exist ==> create a new one
    return twilio_client.conversations.conversations.create(
        friendly_name=name)


@app.route('/login', methods=['POST'])
def login():
    try:
        username = request.get_json(force=True).get('username')
    except Exception as e:
        username = request.form.get('username')
    
    conversation = get_chatroom('My Room')
    try:
        conversation.participants.create(identity=username)
    except TwilioRestException as exc:
        # do not error if the user is already in the conversation
        if exc.status != 409:
            raise

    token = AccessToken(twilio_account_sid, twilio_api_key_sid,
                        twilio_api_key_secret, identity=username)
    token.add_grant(VideoGrant(room='My Room'))
    token.add_grant(ChatGrant(service_sid=conversation.chat_service_sid))

    response = {
        'token': token.to_jwt().decode(),
        'conversation_sid': conversation.sid
    }

    return jsonify(response)

@app.route('/token')
def token():
    # Get credentials for environment variables

    # Create an Access Token
    token = AccessToken(twilio_account_sid, twilio_api_key_sid, twilio_api_key_secret)

    # Set the Identity of this token
    token.identity = request.values.get('identity') or 'identity'

    # Return token

    response = {
        'token' : token.to_jwt()
    }

    return jsonify(response)


@app.route("/process_image",methods=['POST'])
def process_image():
    data = request.get_data()
    try:
        dict_str = data.decode("UTF-8")
        mydata = ast.literal_eval(dict_str)
        image_b64 = mydata['img']
        imgstr=re.search(r'data:image/png;base64,(.*)',image_b64).group(1)
        # print(imgstr)
        output=open('output.png', 'wb')
        decoded=base64.b64decode(imgstr)
        output.write(decoded)
        output.close()
        processImage()
    except Exception as e:
        print(e)

    ans=''
    with open("./processed.png", "rb") as file:
        url = "https://api.imgbb.com/1/upload"
        payload = {
            "key": 'f458d32e54f5653de50e29f07a931015',
            "image": base64.b64encode(file.read()),
        }
        res = requests.post(url, payload)
        ans=res.json()['data']['url']

    response = {'ans':ans}

    return jsonify(response)



if __name__ == '__main__':
    socketio.run(app,debug=True)
