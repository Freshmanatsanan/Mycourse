from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile  # นำเข้า Model Profile
from .models import CourseDetails,Course, CourseBooking
from myapp.models import CourseBooking 

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

#------------------------------------------------สำหรับapiเไฟล์นี้ใช้สำหรับแปลงข้อมูล User และ Profile เป็น JSON

# ✅ เพิ่ม Serializer สำหรับ Profile
class ProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)  # อนุญาตให้อัปโหลดรูปภาพได้

    class Meta:
        model = UserProfile
        fields = ['profile_picture']


# ✅ Serializer สำหรับข้อมูลโปรไฟล์ของผู้ใช้
class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()  # รวมข้อมูลจาก ProfileSerializer

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'profile']

class CourseDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseDetails
        fields = '__all__' 

class AddCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__' 

class CourseBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseBooking
        fields = '__all__' 
        
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'price', 'image']


# ✅ **แก้ไข BookingDetailSerializer**
class BookingDetailSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email')
    course = CourseSerializer()  # ✅ ตอนนี้มันถูกนิยามแล้ว

    class Meta:
        model = CourseBooking
        fields = [
            'id', 'course', 'user_email', 'student_name', 'student_name_en', 
            'nickname_th', 'nickname_en', 'age', 'grade', 'parent_nickname', 
            'phone', 'line_id', 'booking_status', 'payment_slip'
        ]

