import numpy as np
import cv2
import os
import sys
from sklearn.neighbors import KNeighborsClassifier

saveTo = sys.argv[1]
files = [faces for faces in os.listdir("C:\\Users\\sargam\\Desktop\\OnlineExamSystem\\Face_Detection\\dataset") if faces.endswith('.npy')]

dataset = []

for filename in files:
    data = np.load("C:\\Users\\sargam\\Desktop\\OnlineExamSystem\\Face_Detection\\dataset\\"+filename,allow_pickle=True)
    dataset.append(np.array(data))

dataset = np.array(dataset,dtype='object')

dataset = np.concatenate(dataset , axis = 0)

knn = KNeighborsClassifier(n_neighbors=5)

x_train = []
y_train = []

for data in dataset:
    x_train.append(data[0])
    y_train.append(data[1])

x_train = np.array(x_train)
y_train = np.array(y_train)

knn.fit(x_train , y_train)

face_cascade = cv2.CascadeClassifier("C:\\Users\\sargam\\Desktop\\OnlineExamSystem\\Face_Detection\\haarcascade_frontalface_default.xml")

frame = cv2.imread(saveTo)

faces = face_cascade.detectMultiScale(frame , 1.3 , 5) # frame , scaling factor neighbor 
#returns x , y , w , h  

predictions = []

for face in faces:
    x,y,w,h = face
    face_selected = frame[y:y+h, x:x+w]
    face_selected = cv2.resize(face_selected , (100,100))
    face_selected = face_selected.reshape((1,-1)) # (30000, )
    pred = knn.predict(face_selected)
    predictions.append(pred[0])

print(predictions,end="")