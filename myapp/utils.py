# import os
# from google.oauth2 import service_account
# from googleapiclient.discovery import build
# from googleapiclient.http import MediaFileUpload

# # ✅ **ใส่ไฟล์ Service Account ที่คุณดาวน์โหลดจาก Google Cloud**
# CREDENTIALS_FILE = "service_account.json"  # 📌 ตรวจสอบว่าไฟล์นี้อยู่ในโฟลเดอร์โปรเจค

# # ✅ **กำหนดขอบเขตการเข้าถึง Google Drive**
# SCOPES = ["https://www.googleapis.com/auth/drive.file"]

# # ✅ **ใส่ Google Drive Folder ID ที่ใช้เก็บวิดีโอ**
# PARENT_FOLDER_ID = "1Mk4riuBzH5cl71OxAQMGsBZjcz3lsVVP"  # 📌 เปลี่ยนเป็น Folder ID ของคุณ

# def upload_video_to_drive(file_path, file_name,user_email):
#     """ อัปโหลดวิดีโอไปยังโฟลเดอร์ Google Drive และคืนค่า File ID """
    
#     # โหลด Credentials จาก service_account.json
#     creds = service_account.Credentials.from_service_account_file(
#         CREDENTIALS_FILE, scopes=SCOPES
#     )
    
#     # สร้าง Google Drive API service
#     service = build("drive", "v3", credentials=creds)

#     # ตั้งค่า Metadata ของไฟล์
#     file_metadata = {
#         "name": file_name,
#         "mimeType": "video/mp4",
#         "parents": [PARENT_FOLDER_ID]  # ✅ อัปโหลดไปโฟลเดอร์ที่กำหนด
#     }
    
#     # อัปโหลดไฟล์
#     media = MediaFileUpload(file_path, mimetype="video/mp4", resumable=True)
#     file = service.files().create(body=file_metadata, media_body=media, fields="id").execute()

#         # ใช้ Google Drive API เพื่ออนุญาตให้ผู้ใช้ที่ซื้อคอร์สเรียนสามารถดูวิดีโอได้
#     file_id = file.get("id")
#     grant_access_to_user(file_id, user_email)
    
#     return file.get("id")  # ✅ คืนค่า Google Drive File ID
# def grant_access_to_user(file_id, user_email):
#     """ เพิ่มสิทธิ์ให้ผู้ใช้เข้าถึงไฟล์ใน Google Drive """
#     creds = service_account.Credentials.from_service_account_file(
#         'service_account.json', scopes=['https://www.googleapis.com/auth/drive']
#     )
    
#     service = build("drive", "v3", credentials=creds)
    
#     # กำหนด permission
#     permission = {
#         'type': 'user',
#         'role': 'reader',  # สิทธิ์การเข้าถึง (reader = ดูได้)
#         'emailAddress': user_email  # อีเมลของผู้ใช้ที่ต้องการให้เข้าถึง
#     }
    
#     # เพิ่ม permission ให้กับไฟล์ Google Drive
#     service.permissions().create(
#         fileId=file_id,
#         body=permission,
#         fields='id'
#     ).execute()


import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# ✅ **กำหนดขอบเขตการเข้าถึง Google Drive**
SCOPES = ["https://www.googleapis.com/auth/drive.file"]

# ✅ **ใส่ Google Drive Folder ID ที่ใช้เก็บวิดีโอ**
PARENT_FOLDER_ID = "1Mk4riuBzH5cl71OxAQMGsBZjcz3lsVVP"  # 📌 เปลี่ยนเป็น Folder ID ของคุณ

def upload_video_to_drive(file_path, file_name, user_email):
    """ อัปโหลดวิดีโอไปยังโฟลเดอร์ Google Drive และคืนค่า File ID """
    
    # ✅ โหลด Credentials จาก Environment Variable
    service_account_info = json.loads(os.getenv("GOOGLE_CREDENTIALS"))
    creds = service_account.Credentials.from_service_account_info(service_account_info, scopes=SCOPES)
    
    # ✅ สร้าง Google Drive API service
    service = build("drive", "v3", credentials=creds)

    # ✅ ตั้งค่า Metadata ของไฟล์
    file_metadata = {
        "name": file_name,
        "mimeType": "video/mp4",
        "parents": [PARENT_FOLDER_ID]  # ✅ อัปโหลดไปโฟลเดอร์ที่กำหนด
    }
    
    # ✅ อัปโหลดไฟล์
    media = MediaFileUpload(file_path, mimetype="video/mp4", resumable=True)
    file = service.files().create(body=file_metadata, media_body=media, fields="id").execute()

    # ✅ ใช้ Google Drive API เพื่ออนุญาตให้ผู้ใช้ที่ซื้อคอร์สเรียนสามารถดูวิดีโอได้
    file_id = file.get("id")
    grant_access_to_user(file_id, user_email)
    
    return file.get("id")  # ✅ คืนค่า Google Drive File ID

def grant_access_to_user(file_id, user_email):
    """ เพิ่มสิทธิ์ให้ผู้ใช้เข้าถึงไฟล์ใน Google Drive """
    
    # ✅ โหลด Credentials จาก Environment Variable
    service_account_info = json.loads(os.getenv("GOOGLE_CREDENTIALS"))
    creds = service_account.Credentials.from_service_account_info(service_account_info, scopes=["https://www.googleapis.com/auth/drive"])
    
    service = build("drive", "v3", credentials=creds)
    
    # ✅ กำหนด permission
    permission = {
        'type': 'user',
        'role': 'reader',  # สิทธิ์การเข้าถึง (reader = ดูได้)
        'emailAddress': user_email  # อีเมลของผู้ใช้ที่ต้องการให้เข้าถึง
    }
    
    # ✅ เพิ่ม permission ให้กับไฟล์ Google Drive
    service.permissions().create(
        fileId=file_id,
        body=permission,
        fields='id'
    ).execute()



import os
import json

credentials_json = os.getenv("GOOGLE_CREDENTIALS")

if credentials_json:
    try:
        service_account_info = json.loads(credentials_json)
        print("✅ GOOGLE_CREDENTIALS Loaded Successfully!")
    except json.JSONDecodeError as e:
        print(f"❌ Error: JSON Decode Failed! {e}")
else:
    print("❌ GOOGLE_CREDENTIALS Not Found!")



import os
import json
from google.oauth2 import service_account

# ✅ ลองโหลด GOOGLE_CREDENTIALS จาก Environment Variable
credentials_json = os.getenv("GOOGLE_CREDENTIALS")

if credentials_json:
    try:
        service_account_info = json.loads(credentials_json)

        # ✅ ตรวจสอบค่า private_key
        if "private_key" in service_account_info:
            print(f"🔍 ตรวจสอบค่า private_key: {service_account_info['private_key'][:50]}...")  # พิมพ์เฉพาะ 50 ตัวแรกเพื่อดูว่ามีข้อมูลจริงไหม

        # ✅ สร้างไฟล์ชั่วคราวเพื่อเก็บ JSON Credentials
        temp_file_path = "/tmp/service_account.json"
        with open(temp_file_path, "w") as temp_file:
            json.dump(service_account_info, temp_file)

        # ✅ โหลด Credentials จากไฟล์แทนจาก Dictionary
        creds = service_account.Credentials.from_service_account_file(temp_file_path, scopes=["https://www.googleapis.com/auth/drive"])
        print("✅ ใช้งาน Credentials จากไฟล์ได้สำเร็จ!")

    except json.JSONDecodeError as e:
        print(f"❌ Error: JSON Decode Failed! {e}")
else:
    print("❌ GOOGLE_CREDENTIALS Not Found!")

