import cv2
import time
import numpy as np

name = input("Enter Your name : ")
num = int(input("Total Number of images to be clicked : "))

face_data = []

face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
cap=cv2.VideoCapture(1,cv2.CAP_DSHOW) 

while True and num:

    time.sleep(0.5)

    ret , frame = cap.read() #status,frame

    if not ret:
        continue

    faces = face_cascade.detectMultiScale(frame , 1.3 , 5) # frame , scaling factor neighbor 
    
    faces = sorted(faces ,key = lambda x : x[2]*x[3] , reverse = True )
    faces = faces[:1]
    #returns x , y , w , h  

    for face in faces:
        x,y,w,h = face

        face_selected = frame[y:y+h, x:x+w]
        print(face_selected.shape)
        cv2.imshow("Cropped Face" , face_selected)
        face_selected = cv2.resize(face_selected , (100,100))

        face_selected = face_selected.flatten() # (30000, )
        print(face_selected.shape)
        face_data.append(np.array([face_selected , name],dtype='object'))

        cv2.rectangle(frame, (x,y) , (x+w,y+h) , (0,255,0) , 2)
        num -= 1

    cv2.imshow("Feed" , frame)
    key = cv2.waitKey(1)

    if key & 0xFF == ord('q'):
        break

print(len(face_data))  #num
face_data = np.array(face_data)
print(face_data.shape) # (num,2)
np.save(("C:\\Users\\sargam\\Desktop\\OnlineExamSystem\\Face_Detection\\dataset\\" + name),face_data)
cap.release()
cv2.destroyAllWindows() 