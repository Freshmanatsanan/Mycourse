from django.db import models
#from django.contrib.auth.models import AbstractUser


#class CustomUser(AbstractUser):
   # ROLE_CHOICES = (
    #    ('member', 'Member'),
    #    ('instructor', 'Instructor'),
    #    ('admin', 'Admin'),
    #)
   # role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')

   # def __str__(self):
    #    return f"{self.username} ({self.get_role_display()})"


class Course(models.Model):
    STATUS_CHOICES = [
        ('pending', 'รอการอนุมัติ'),
        ('approved', 'อนุมัติแล้ว'),
         ('revision', 'ส่งกลับมาแก้ไข'),
         ('revised', 'แก้ไขแล้วรอการตรวจสอบ'),
    ]
    title = models.CharField(max_length=200,unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='courses/images/')
    instructor = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    revision_message = models.TextField(blank=True, null=True)  # เพิ่มฟิลด์นี้
    created_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return self.title
    
class Staff(models.Model):
    name = models.CharField(max_length=100)  # ชื่อบุคลากร
    subject = models.CharField(max_length=200)  # วิชาหรือบทบาท
    image = models.ImageField(upload_to='staff_images/')  # รูปภาพบุคลากร

    def __str__(self):
        return self.name
    

class VideoCourse(models.Model):
    STATUS_CHOICES = [
        ('pending', 'รอการตรวจสอบ'),
        ('approved', 'อนุมัติแล้ว'),
        ('revision', 'ส่งกลับไปแก้ไข'),
        ('revised', 'แก้ไขแล้วรอการตรวจสอบ'),
    ]

    name = models.CharField(max_length=255,unique=True)
    description = models.TextField()
    video_url = models.URLField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', verbose_name="สถานะ")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class CourseDetails(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255,unique=True)
    description = models.TextField()
    additional_description = models.TextField()
    image = models.ImageField(upload_to='course_images/')
    additional_image = models.ImageField(upload_to='course_additional_images/')
    extra_image_1 = models.ImageField(upload_to='course_extra_images/', null=True, blank=True)  # รูปภาพเพิ่มเติม 1
    extra_image_2 = models.ImageField(upload_to='course_extra_images/', null=True, blank=True)  # รูปภาพเพิ่มเติม 2
    created_at = models.DateTimeField(auto_now_add=True)


class VideoCourseDetail(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    extra_description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='course_images/')
    extra_image = models.ImageField(upload_to='course_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    


class Banner(models.Model):
    image = models.ImageField(upload_to='banners/', verbose_name="รูปภาพ")
    is_active = models.BooleanField(default=True, verbose_name="แสดงผล")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Banner {self.id} - {'Active' if self.is_active else 'Inactive'}"
    
class BookingCourse(models.Model):
    STATUS_CHOICES = [
        ('pending', 'รอการตรวจสอบ'),
        ('approved', 'อนุมัติแล้ว'),
        ('revision', 'ส่งกลับไปแก้ไข'),
    ]

    name = models.CharField(max_length=255, verbose_name="ชื่อคอร์สเรียน")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="ราคา")
    instructor = models.CharField(max_length=255, verbose_name="ผู้สอน")
    duration = models.CharField(max_length=50, verbose_name="ระยะเวลา")
    image = models.ImageField(upload_to='booking_courses/', verbose_name="รูปปกคอร์ส")
    payment_qr = models.ImageField(upload_to='payment_qrs/', blank=True, null=True, verbose_name="QR Code การชำระเงิน")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', verbose_name="สถานะ")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="วันที่ส่งคอร์ส")

    def __str__(self):
        return self.name

    

class VideoLesson(models.Model):  # เปลี่ยนจาก VideoCourse เป็น VideoLesson
    STATUS_CHOICES = [
        ('pending', 'รอการตรวจสอบ'),
        ('approved', 'อนุมัติแล้ว'),
        ('revision', 'ส่งกลับไปแก้ไข'),
    ]
    name = models.CharField(max_length=255, verbose_name="ชื่อคอร์ส")
    description = models.TextField(verbose_name="คำอธิบาย")
    video_url = models.URLField(verbose_name="ลิงก์วิดีโอ")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="ราคา")
    duration = models.CharField(max_length=50, verbose_name="ระยะเวลา")
    instructor = models.CharField(max_length=255, verbose_name="ผู้สอน")
    is_approved = models.BooleanField(default=False, verbose_name="ตรวจสอบแล้ว")
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='pending', verbose_name="สถานะ"
    )
    payment_qr = models.ImageField(upload_to='payment_qrs/', blank=True, null=True, verbose_name="QR Code การชำระเงิน")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="วันที่สร้าง")

    def __str__(self):
        return self.name
    

class CourseOrder(models.Model):
    course_name = models.CharField(max_length=255, verbose_name="ชื่อคอร์ส")
    customer_name = models.CharField(max_length=255, verbose_name="ชื่อลูกค้า")
    email = models.EmailField(verbose_name="อีเมลลูกค้า")
    transfer_slip = models.ImageField(upload_to='transfer_slips/', verbose_name="สลิปการโอน")
    status = models.CharField(max_length=50, choices=[('paid', 'จ่ายแล้ว'), ('pending', 'รอการตรวจสอบ')], default='pending', verbose_name="สถานะ")
    order_date = models.DateField(auto_now_add=True, verbose_name="เวลาการจอง")

    def __str__(self):
        return f"{self.customer_name} - {self.course_name}"
    

class UserProfile(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    role = models.CharField(max_length=20, choices=[('member', 'Member'), ('teacher', 'Teacher')])

    def __str__(self):
        return f"{self.first_name} {self.last_name}"