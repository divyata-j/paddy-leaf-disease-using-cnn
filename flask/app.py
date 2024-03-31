from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from PIL import Image
import tensorflow as tf
import cv2
import base64
import io
import time

model = tf.keras.models.load_model('model.h5')

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Paddy Leaf Disease Detection API"

@app.route('/detect-leaf', methods=['POST'])
def predict():
    try:
        time.sleep(2)
        img_data = request.files['image'] 
        img = Image.open(img_data)
        # input_image = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        # hsv = cv2.cvtColor(input_image, cv2.COLOR_BGR2HSV)
        # ur = np.array([225, 250, 250])
        # lr = np.array([25, 52, 72])
        # mask = cv2.inRange(hsv, lr, ur)
        # masked_image = cv2.bitwise_and(hsv, input_image, mask=(255 - mask))
        # resized_image = cv2.resize(masked_image, (180, 180))
        img = img.resize((180, 180))  
        img_array = np.array(img) / 255.0  
        img_array = np.expand_dims(img_array, axis=0)  

        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction)

        confidence = np.max(prediction)
        confidence_threshold = 0.5

        if confidence <= confidence_threshold:
            return jsonify({"predicted_class": "Invalid image", "additional_info": "The uploaded image does not appear to be a paddy leaf."})
        
        label_names = ['Brown spot', 'Healthy leaf', 'Leaf Blast', 'Leaf Blight', 'Leaf smut']
        predicted_class_label = label_names[predicted_class]

        additional_info = ""
        if predicted_class_label == 'Brown spot':
            additional_info = "Fungicide: Propiconazole \nApplication Quantity: 100-200 ml per 100 liters of water \nApplication Interval: Every 10-14 days during the disease outbreak period"
        elif predicted_class_label == 'Healthy leaf':
            additional_info = "No fungicide required"
        elif predicted_class_label == 'Leaf Blast':
            additional_info = "Fungicide: Azoxystrobin \nApplication Quantity: 200-300 ml per 100 liters of water \nApplication Interval: Every 7-10 days during the disease outbreak period"
        elif predicted_class_label == 'Leaf Blight':
            additional_info = "Fungicide: Tricyclazole \nApplication Quantity: 150-250 grams per acre \n Application Interval: Every 10-14 days during the disease outbreak period"
        elif predicted_class_label == 'Leaf smut':
            additional_info = "Fungicide: Carbendazim \nApplication Quantity: 100-200 grams per 100 liters of water \nApplication Interval: Every 10-14 days during the disease outbreak period"
    
        result = {
            "predicted_class": predicted_class_label,
            "additional_info": additional_info
        }

        return jsonify(result)
    
    except Exception as e:
        msg = "Error occurred during prediction: " + str(e)
        return jsonify({"error": msg})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
