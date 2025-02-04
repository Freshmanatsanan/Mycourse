from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile  # นำเข้า Model Profile

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
        model = Profile
        fields = ['profile_picture']


# ✅ Serializer สำหรับข้อมูลโปรไฟล์ของผู้ใช้
class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()  # รวมข้อมูลจาก ProfileSerializer

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'profile']
