from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from PIL import Image
import tensorflow as tf
import cv2
import base64
import io
import time
from ultralyticsplus import YOLO

model = tf.keras.models.load_model('model.h5')
yolo_model = YOLO('foduucom/plant-leaf-detection-and-classification')

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

        #detection of paddy leaf
        yolo_results = yolo_model.predict(img)
        paddy_leaf_detected = False
        for box in yolo_results[0].boxes:
            if box.cls == 19:  # Class ID 19 corresponds to paddy leaf
                paddy_leaf_detected = True
                break
        
        if not paddy_leaf_detected:
            return jsonify({"error": "Image does not contain a paddy leaf."}),400

        #masking
        # resized = img.resize((600, 800)) 
        # ori=np.array(resized)
        # input_image = cv2.cvtColor(np.array(resized), cv2.COLOR_RGB2BGR)
        # hsv = cv2.cvtColor(input_image, cv2.COLOR_BGR2HSV)
        # ur = np.array([225, 250, 250])
        # lr = np.array([25, 52, 72])
        # mask = cv2.inRange(hsv, lr, ur)
        # masked_image = cv2.bitwise_and(hsv, input_image, mask=(255 - mask))
        # resized_image = cv2.resize(masked_image, (180, 180))/255.0

        # cv2.imshow('Masked Image', masked_image)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
        img = img.convert("RGB")
        img = img.resize((180, 180))  
        img_array = np.array(img) / 255.0  
        img_array = np.expand_dims(img_array, axis=0)  
        # print("img_array shape:", resized_image.shape)
        # print("img_array values:", resized_image)
        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction)

        
        label_names = ['Brown spot', 'Healthy leaf', 'Leaf Blast', 'Leaf Blight', 'Leaf smut']
        predicted_class_label = label_names[predicted_class]

        additional_info = ""
        if predicted_class_label == 'Brown spot':
            additional_info = """Fungicide: Propiconazole
            Application Quantity: 100-200 ml per 100 liters of water
            Application Interval: Every 10-14 days during the disease outbreak period"""
        elif predicted_class_label == 'Healthy leaf':
            additional_info = "No fungicide required"
        elif predicted_class_label == 'Leaf Blast':
            additional_info = """Fungicide: Azoxystrobin
            Application Quantity: 200-300 ml per 100 liters of water
            Application Interval: Every 7-10 days during the disease outbreak period"""
        elif predicted_class_label == 'Leaf Blight':
            additional_info = """Fungicide: Tricyclazole
            Application Quantity: 150-250 grams per acre
            Application Interval: Every 10-14 days during the disease outbreak period"""
        elif predicted_class_label == 'Leaf smut':
            additional_info = """Fungicide: Carbendazim
            Application Quantity: 100-200 grams per 100 liters of water
            Application Interval: Every 10-14 days during the disease outbreak period"""
    
        result = {
            "predicted_class": predicted_class_label,
            "additional_info": additional_info
        }

        return jsonify(result)
    
    except Exception as e:
        msg = "Error occurred during prediction: " + str(e)
        return jsonify({"error": msg}),400

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
