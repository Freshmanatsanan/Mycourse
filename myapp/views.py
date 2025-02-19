
from django.shortcuts import render, redirect,get_object_or_404
from django.contrib.auth.models import User
from django.contrib import messages
from .models import Course,VideoCourse
from .models import CourseDetails
from django.http import HttpResponse
from .models import Banner
from .models import Staff
from .models import CourseOrder
from .models import VideoLesson  
from .models import UserProfile 
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.contrib.auth import logout
from rest_framework.decorators import api_view , permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponseBadRequest, HttpResponseRedirect
from django.urls import reverse
from .decorators import admin_required  , instructor_required  # นำเข้า Decorator
from django.contrib.auth.models import User, Group  # นำเข้า Group
from rest_framework.permissions import AllowAny, IsAdminUser
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from .models import InstructorProfile
from django.db.models import Q
from django.http import JsonResponse
import json
from django.core.files.storage import FileSystemStorage
from .models import CourseBooking
from django.db.models import Count
from django.core.paginator import Paginator
from .serializers import CourseDetailsSerializer, AddCourseSerializer ,BannerSerializer
from myapp.serializers import CourseBookingSerializer
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
import random
import string
import datetime
from django.utils.timezone import now
import re
from .serializers import BookingDetailSerializer, CourseSerializer,BookingHistorySerializer,InstructorProfileSerializer
from django.contrib.auth import update_session_auth_hash
from django.core.files.base import ContentFile
import base64



def register(request):
    if request.method == 'POST':    
        username = request.POST['username']
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']
        messages.get_messages(request).used = True
        # ตรวจสอบความยาวของรหัสผ่าน
        if len(password) < 8:
            messages.error(request, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
        elif password != password2:
            messages.error(request, 'รหัสผ่านไม่ตรงกัน')
        else:
            if User.objects.filter(username=username).exists():
                messages.error(request, 'ชื่อผู้ใช้นี้มีอยู่แล้ว')
            elif User.objects.filter(email=email).exists():
                messages.error(request, 'อีเมลนี้ถูกใช้ไปแล้ว')
            else:
                # สร้างผู้ใช้ใหม่
                user = User.objects.create(
                    username=username,
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    password=make_password(password)
                )
                user.save()

                # เพิ่มผู้ใช้เข้า Group 'Member' โดยค่าเริ่มต้น
                try:
                    member_group = Group.objects.get(name='Member')  # ค้นหา Group ชื่อ 'Member'
                    user.groups.add(member_group)  # เพิ่มผู้ใช้เข้า Group
                except Group.DoesNotExist:
                    messages.warning(request, 'Group "Member" ยังไม่ได้ถูกสร้างในระบบ')

                messages.success(request, "✅ สมัครสมาชิกสำเร็จ!")
                return redirect("register") 
            

    return render(request, 'register.html')



def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)

            if user:
                # ✅ ตรวจสอบว่าผู้ใช้มีโปรไฟล์หรือไม่ ถ้าไม่มีให้สร้างใหม่
                profile, created = UserProfile.objects.get_or_create(user=user, defaults={
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                })

                login(request, user)

                # ✅ ตรวจสอบว่าอยู่ในกลุ่มไหน และเปลี่ยนเส้นทางให้เหมาะสม
                if user.groups.filter(name='Instructor').exists():
                    return redirect('instructor_sales')
                elif user.groups.filter(name='Admin').exists():
                    return redirect('admin_dashboard')
                elif user.groups.filter(name='Member').exists():
                    return redirect('home')
                else:
                    messages.error(request, 'บทบาทของผู้ใช้งานไม่ถูกต้อง')
            else:
                messages.error(request, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
        except User.DoesNotExist:
            messages.error(request, 'ไม่พบบัญชีผู้ใช้งานในระบบ')

    return render(request, 'login.html')

def staff_list_api(request):
    """
    API สำหรับดึงข้อมูลบุคลากรทั้งหมด
    """
    domain = request.build_absolute_uri('/').strip('/')
    staffs = Staff.objects.all()

    staff_data = [
        {
            "id": staff.id,
            "name": staff.name,
            "subject": staff.subject,
            "image_url": f"{domain}{staff.image.url}" if staff.image else None,
        }
        for staff in staffs
    ]

    return JsonResponse(staff_data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # ✅ API ใช้ได้เฉพาะผู้ที่ล็อกอิน
def instructor_list_api(request):
    """
    API สำหรับดึงข้อมูลอาจารย์ทั้งหมด (เฉพาะที่ใช้ใน Mobile)
    """
    instructors = InstructorProfile.objects.select_related('user').all()
    
    instructor_data = [
        {
            "id": instructor.id,
            "full_name": f"{instructor.user.first_name} {instructor.user.last_name}",
            "age": instructor.age,
            "subject": instructor.subject,
            "profile_picture": request.build_absolute_uri(instructor.profile_picture.url) if instructor.profile_picture else None,
        }
        for instructor in instructors
    ]
    
    return JsonResponse(instructor_data, safe=False)



#-----------------------------------------------------------------สำหรับ API ------------------------------------------------------------------------------------------------------------------------------------------------------------------

#---------------------------------------------api สมาชิก --------------------------------------------------------

#ใช้เพื่อตรวจสอบ token ของฝั่ง mobile เเละดึงข้อมูลผู้ใช้งาน
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
    })



@api_view(['POST'])
@permission_classes([AllowAny])  # อนุญาตให้ทุกคนเข้าถึง API ได้
def register_api(request):
    """
    API สำหรับสมัครสมาชิก และเพิ่มเข้า Group ของ Django Admin
    """
    username = request.data.get('username')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')
    password = request.data.get('password')
    password2 = request.data.get('password2')

    if not username or not email or not password:
        return Response({"error": "กรุณากรอกข้อมูลให้ครบถ้วน"}, status=status.HTTP_400_BAD_REQUEST)

    if password != password2:
        return Response({"error": "รหัสผ่านไม่ตรงกัน"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "ชื่อผู้ใช้นี้มีอยู่แล้ว"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "อีเมลนี้ถูกใช้ไปแล้ว"}, status=status.HTTP_400_BAD_REQUEST)

    # สร้างบัญชีผู้ใช้
    user = User.objects.create(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=make_password(password)
    )
    user.save()

    # เพิ่มผู้ใช้เข้า Group 'Member' โดยค่าเริ่มต้น
    try:
        member_group = Group.objects.get(name='Member')  # ค้นหา Group 'Member'
        user.groups.add(member_group)  # เพิ่มผู้ใช้เข้า Group
    except ObjectDoesNotExist:
        pass  # ถ้าไม่มี Group ก็ข้ามไป

    return Response({"message": "สร้างบัญชีสำเร็จแล้ว"}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])  # อนุญาตให้ทุกคนเข้าถึง API ได้
def login_api(request):
    """
    API สำหรับเข้าสู่ระบบและรับ JWT Token
    """
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'กรุณากรอกอีเมลและรหัสผ่าน'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # ค้นหาผู้ใช้โดยใช้ email
        user = User.objects.get(email=email)
        user = authenticate(username=user.username, password=password)

        if user:
            # สร้าง JWT Token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # ตรวจสอบสิทธิ์จาก Django Groups
            user_group = "Member"  # ค่าเริ่มต้น

            if user.groups.filter(name='Instructor').exists():
                user_group = "Instructor"
            elif user.groups.filter(name='Admin').exists():
                user_group = "Admin"

            return Response({
                'access': access_token,
                'refresh': str(refresh),
                'group': user_group,
                'message': 'เข้าสู่ระบบสำเร็จ'
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'}, status=status.HTTP_401_UNAUTHORIZED)

    except User.DoesNotExist:
        return Response({'error': 'ไม่พบผู้ใช้งานในระบบ'}, status=status.HTTP_404_NOT_FOUND)
    


@api_view(['GET'])
@permission_classes([AllowAny])
def get_approved_courses(request):
    try:
        approved_courses = Course.objects.filter(status='approved', is_closed=False)
        courses_data = []
        for course in approved_courses:
            courses_data.append({
                'id': course.id,
                'title': course.title,
                'price': course.price,
                'image_url': request.build_absolute_uri(course.image.url) if course.image else None,  # ใช้ URL เต็ม
                'instructor': course.instructor,
            })
        return Response(courses_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])  # อนุญาตให้ทุกคนเข้าถึง API นี้
def banners_api(request):
    """
    API สำหรับดึงรายการแบนเนอร์ทั้งหมด
    """
    try:
        banners = Banner.objects.all()
        banners_data = [
            {
                'id': banner.id,
                'image_url': request.build_absolute_uri(banner.image.url) if banner.image else None
            }
            for banner in banners
        ]
        return Response(banners_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
#---------------------------------------------api สมาชิก --------------------------------------------------------


#---------------------------------------------api ผู้สอน --------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def instructor_profile_api(request):
    """
    API สำหรับดึงข้อมูลโปรไฟล์ของ Instructor
    """
    user = request.user
    profile = user.profile
    data = {
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "profile_picture": request.build_absolute_uri(profile.profile_picture.url) if profile.profile_picture else None
        
    }
    return Response(data, status=status.HTTP_200_OK)

    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_instructor_profile_api(request):
    """
    API สำหรับอัปเดตข้อมูลโปรไฟล์ของ Instructor
    """
    user = request.user
    profile = user.profile

    user.username = request.data.get('username', user.username)
    user.first_name = request.data.get('first_name', user.first_name)
    user.last_name = request.data.get('last_name', user.last_name)
    user.email = request.data.get('email', user.email)
    
    if 'profile_picture' in request.FILES:
        if profile.profile_picture:
            profile.profile_picture.delete()  # ลบไฟล์รูปเก่าก่อนอัปโหลดใหม่
        profile.profile_picture = request.FILES['profile_picture']

    user.save()
    profile.save()

    return Response({"message": "อัปเดตโปรไฟล์สำเร็จ"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def instructor_sales_api(request):
    """
    API สำหรับดึงข้อมูลการขายของ Instructor ให้ตรงกับเว็บ
    """
    try:
        active_tab = request.GET.get("type", "booking")

        # ✅ คอร์สที่มีการจอง (รวมจำนวนการจอง)
        booked_courses = Course.objects.filter(
            id__in=CourseBooking.objects.values("course_id")
        ).annotate(booking_count=Count("coursebooking"))

        # ✅ หา CourseDetails ที่เกี่ยวข้อง
        course_details_dict = {cd.course_id: cd for cd in CourseDetails.objects.filter(course__in=booked_courses)}

        # ✅ คอร์สวิดีโอที่มีการซื้อ (รวมจำนวนการซื้อ)
        purchased_courses = CourseOrder.objects.values("course_name").annotate(purchase_count=Count("id"))

        # ✅ จัดรูปแบบข้อมูลก่อนส่งกลับ
        data = {
            "active_tab": active_tab,
            "booked_courses": [
                {
                    "course_id": course.id,
                    "course_name": course.title if course.title else "N/A",
                    "booking_count": course.booking_count,
                    "course_image": request.build_absolute_uri(course.image.url)
                    if course.image and hasattr(course.image, "url")
                    else None,  
                    "details": {
                        "course_title": course_details_dict[course.id].name if course.id in course_details_dict else "N/A",
                        "course_description": course_details_dict[course.id].description if course.id in course_details_dict else "N/A",
                        "course_price": float(course.price) if course.price else 0.0,
                    }
                }
                for course in booked_courses
            ],
            "purchased_courses": [
                {
                    "course_name": purchase["course_name"],
                    "purchase_count": purchase["purchase_count"]
                }
                for purchase in purchased_courses
            ]
        }

        return Response(data, status=200)

    except Exception as e:
        return Response({"error": f"เกิดข้อผิดพลาด: {str(e)}"}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def instructor_booking_detail_api(request, course_id):
    """
    API สำหรับดึงรายละเอียดการจองหลักสูตรของ Instructor
    """
    try:
        # ✅ ดึง Course จาก `course_id`
        course = get_object_or_404(Course, id=course_id)

        search_query = request.GET.get("search", "")

        # ✅ ดึงข้อมูลการจองจาก `CourseBooking`
        bookings = CourseBooking.objects.select_related("user").filter(course=course).order_by("-booking_date")

        if search_query:
            bookings = bookings.filter(student_name__icontains=search_query)  # ✅ ค้นหาจากชื่อผู้เรียน

        paginator = Paginator(bookings, 10)
        page_number = request.GET.get("page")
        bookings_page = paginator.get_page(page_number)

        # ✅ จัดรูปแบบข้อมูล
        data = {
            "course": {
                "id": course.id,
                "title": course.title,
            },
            "bookings": [
                {
                    "student_name_th": booking.student_name,
                    "student_name_en": booking.student_name_en,
                    "nickname_th": booking.nickname_th,
                    "nickname_en": booking.nickname_en,
                    "age": booking.age,
                    "grade": booking.grade,
                    "parent_nickname": booking.parent_nickname,
                    "phone": booking.phone,
                    "line_id": booking.line_id if booking.line_id else "ไม่มี",
                    "email": booking.user.email if booking.user else "ไม่มีข้อมูล",
                    "selected_course": booking.selected_course,
                    "payment_slip": request.build_absolute_uri(booking.payment_slip.url) if booking.payment_slip else None,
                    "booking_status": booking.get_booking_status_display(),
                    "booking_date": booking.booking_date.strftime('%Y-%m-%d %H:%M:%S'),
                }
                for booking in bookings_page
            ],
            "pagination": {
                "current_page": bookings_page.number,
                "total_pages": bookings_page.paginator.num_pages,
                "has_next": bookings_page.has_next(),
                "has_previous": bookings_page.has_previous(),
            }
        }

        return Response(data, status=200)

    except Exception as e:
        return Response({"error": f"เกิดข้อผิดพลาด: {str(e)}"}, status=500)
    
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_banner_api(request, banner_id):
    """✅ API สำหรับลบแบนเนอร์ของผู้สอน"""
    banner = get_object_or_404(Banner, id=banner_id, instructor=request.user)

    banner.delete()
    return Response({"message": "✅ ลบแบนเนอร์สำเร็จ!"}, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_banner_api(request):
    """✅ API สำหรับเพิ่ม Banner ใหม่"""
    image = request.FILES.get("banner_image")
    if not image:
        return Response({"error": "กรุณาอัปโหลดรูปภาพ"}, status=status.HTTP_400_BAD_REQUEST)

    banner = Banner.objects.create(
        instructor=request.user,
        image=image,
        status="pending"
    )
    return Response({"message": "✅ เพิ่มเบนเนอร์สำเร็จ! โปรดรอการอนุมัติจากแอดมิน"}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_banners_api(request):
    """✅ API สำหรับดึง Banner ทั้งหมดของผู้สอนคนนั้น"""
    banners = Banner.objects.filter(instructor=request.user)
    serializer = BannerSerializer(banners, many=True, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def list_pending_banners_api(request):
    """✅ API สำหรับดึงเฉพาะ Banner ที่รอการอนุมัติ (Admin)"""
    banners = Banner.objects.filter(status="pending")
    serializer = BannerSerializer(banners, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def approve_banner_api(request, banner_id):
    """✅ API สำหรับอนุมัติ Banner (Admin)"""
    banner = get_object_or_404(Banner, id=banner_id)
    banner.status = "approved"
    banner.rejection_message = ""
    banner.save()
    return Response({"message": "✅ อนุมัติโฆษณาสำเร็จ!"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def reject_banner_api(request, banner_id):
    """✅ API สำหรับปฏิเสธ Banner (Admin)"""
    try:
        data = json.loads(request.body)
        rejection_message = data.get("rejection_message", "")

        banner = get_object_or_404(Banner, id=banner_id)
        banner.status = "rejected"
        banner.rejection_message = rejection_message
        banner.save()

        return Response({"message": "⛔ ปฏิเสธโฆษณาสำเร็จ!"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_reservation_courses_api(request):
    """
    ✅ API ดึงข้อมูลคอร์สเรียนแบบจอง พร้อมแสดงข้อความที่แอดมินส่งกลับมา (revision_message)
    """
    try:
        courses = Course.objects.all()
        courses_data = []

        for course in courses:
            courses_data.append({
                'id': course.id,
                'title': course.title,
                'price': str(course.price),
                'instructor': course.instructor,
                'created_at': course.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'status': course.status,
                'revision_message': course.revision_message if course.status == 'revision' else None,  # ✅ เพิ่มข้อความที่แอดมินส่งกลับมา
                'image_url': request.build_absolute_uri(course.image.url) if course.image else None,  # ✅ แสดง URL รูปภาพ
                'is_closed': course.is_closed,
            })

        return Response(courses_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_course_api(request):
    """
    ✅ API สำหรับเพิ่มคอร์สเรียน
    """
    try:
        title = request.data.get('title')
        description = request.data.get('description')
        instructor = request.data.get('instructor')
        price = request.data.get('price')
        image = request.FILES.get('image')

        # ตรวจสอบว่าข้อมูลครบถ้วน
        if not title or not description or not instructor or not price:
            return Response({"error": "กรุณากรอกข้อมูลให้ครบทุกช่อง"}, status=status.HTTP_400_BAD_REQUEST)

        course = Course.objects.create(
            title=title,
            description=description,
            instructor=instructor,
            price=price,
            image=image,
            added_by=request.user  # ✅ บันทึก ID ผู้ที่เพิ่มคอร์ส
        )
        return Response({"message": "✅ เพิ่มคอร์สเรียนสำเร็จ!", "course_id": course.id}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_course_details_api(request, course_id):
    """
    ✅ API สำหรับเพิ่มรายละเอียดคอร์ส
    """
    try:
        course = get_object_or_404(Course, id=course_id)

        name = request.data.get('name')
        description = request.data.get('description')
        additional_description = request.data.get('additional_description')
        image = request.FILES.get('image')
        additional_image = request.FILES.get('additional_image')
        extra_image_1 = request.FILES.get('extra_image_1')
        extra_image_2 = request.FILES.get('extra_image_2')

        if not name or not description or not additional_description:
            return Response({"error": "กรุณากรอกข้อมูลให้ครบทุกช่อง"}, status=status.HTTP_400_BAD_REQUEST)

        course_details = CourseDetails.objects.create(
            course=course,
            name=name,
            description=description,
            additional_description=additional_description,
            image=image,
            additional_image=additional_image,
            extra_image_1=extra_image_1,
            extra_image_2=extra_image_2
        )
        return Response({"message": "✅ เพิ่มรายละเอียดคอร์สสำเร็จ!"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_course_api(request, course_id):
    """
    ✅ API สำหรับแก้ไขคอร์สเรียน
    """
    course = get_object_or_404(Course, id=course_id, added_by=request.user)

    # อัปเดตค่าที่ได้รับจาก request
    course.title = request.data.get('title', course.title)
    course.description = request.data.get('description', course.description)
    course.instructor = request.data.get('instructor', course.instructor)
    course.price = request.data.get('price', course.price)

    # อัปเดตรูปภาพถ้ามีการอัปโหลดใหม่
    if 'image' in request.FILES:
        course.image = request.FILES['image']

    course.save()

    return Response({
        "message": "✅ แก้ไขคอร์สเรียนสำเร็จ!",
        "course_id": course.id
    }, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_course_details_api(request, course_id):
    """
    ✅ API สำหรับแก้ไขรายละเอียดคอร์สเรียน
    """
    course_details = get_object_or_404(CourseDetails, course__id=course_id, course__added_by=request.user)
    course = course_details.course

    # อัปเดตค่าที่ได้รับจาก request
    course_details.name = request.data.get('name', course_details.name)
    course_details.description = request.data.get('description', course_details.description)
    course_details.additional_description = request.data.get('additional_description', course_details.additional_description)

    # อัปเดตรูปภาพถ้ามีการอัปโหลดใหม่
    if 'image' in request.FILES:
        course_details.image = request.FILES['image']
    if 'additional_image' in request.FILES:
        course_details.additional_image = request.FILES['additional_image']

    # อัปเดตสถานะคอร์สเป็น "แก้ไขแล้วรอการตรวจสอบ"
    course.status = 'revised'
    course.save()
    course_details.save()

    return Response({
        "message": "✅ แก้ไขรายละเอียดคอร์สสำเร็จ และส่งไปตรวจสอบ!",
        "course_id": course.id
    }, status=status.HTTP_200_OK)

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_course_review_api(request, course_id):
    """✅ API สำหรับส่งคอร์สให้แอดมินตรวจสอบ"""
    try:
        course = get_object_or_404(Course, id=course_id, instructor=request.user)
        course.status = 'pending'  # ตั้งสถานะเป็นรออนุมัติ
        course.save()

        return Response({'message': '✅ ส่งคอร์สให้แอดมินตรวจสอบแล้ว!'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_course_api(request, course_id):
    """✅ API สำหรับลบคอร์สเดี่ยว (Mobile)"""
    course = get_object_or_404(Course, id=course_id,)
    print(f"📌 Added_by (ID ผู้เพิ่มคอร์ส): {course.added_by_id}")
    print(f"📌 User ID ที่ล็อกอิน: {request.user.id}")

    # ✅ ตรวจสอบสิทธิ์โดยใช้ ID
    if course.added_by_id != request.user.id:
        return Response({"error": "คุณไม่มีสิทธิ์ลบคอร์สนี้"}, status=status.HTTP_403_FORBIDDEN)

    # ลบคอร์ส
    course.delete()
    return Response({"message": "✅ ลบคอร์สสำเร็จ!"},status=status.HTTP_200_OK)  

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def close_course_api(request, course_id):
    """
    ✅ API สำหรับปิดการรับสมัครคอร์ส
    """
    try:
        course = get_object_or_404(Course, id=course_id)
        course.is_closed = True
        course.save()
        return Response({"message": "✅ สิ้นสุดการรับสมัครของคอร์สเรียบร้อยแล้ว"}, status=status.HTTP_200_OK)
    except Course.DoesNotExist:
        return Response({"error": "❌ ไม่พบคอร์สที่ต้องการปิดรับสมัคร"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reopen_course_api(request, course_id):
    """
    ✅ API สำหรับเปิดรับสมัครคอร์สอีกครั้ง
    """
    try:
        course = get_object_or_404(Course, id=course_id)
        course.is_closed = False
        course.save()
        return Response({"message": "✅ เปิดรับสมัครของคอร์สนี้อีกครั้งเรียบร้อยแล้ว"}, status=status.HTTP_200_OK)
    except Course.DoesNotExist:
        return Response({"error": "❌ ไม่พบคอร์สที่ต้องการเปิดรับสมัคร"}, status=status.HTTP_404_NOT_FOUND)




#---------------------------------------------api ผู้สอน --------------------------------------------------------


#---------------------------------------------api แอดมิน --------------------------------------------------------


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_admin_api(request):
    """
    API สำหรับดึงข้อมูลโปรไฟล์ของ Admin
    """
    user = request.user
    profile = user.profile
    data = {
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "profile_picture": request.build_absolute_uri(profile.profile_picture.url) if profile.profile_picture else None
        
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile_admin_api(request):
    """
    API สำหรับอัปเดตข้อมูลโปรไฟล์ของ Admin
    """
    user = request.user
    profile = user.profile

    user.username = request.data.get('username', user.username)
    user.first_name = request.data.get('first_name', user.first_name)
    user.last_name = request.data.get('last_name', user.last_name)
    user.email = request.data.get('email', user.email)
    
    if 'profile_picture' in request.FILES:
        if profile.profile_picture:
            profile.profile_picture.delete()  # ลบไฟล์รูปเก่าก่อนอัปโหลดใหม่
        profile.profile_picture = request.FILES['profile_picture']

    user.save()
    profile.save()

    return Response({"message": "อัปเดตโปรไฟล์สำเร็จ"}, status=status.HTTP_200_OK)

#---------------------------------------------api แอดมิน --------------------------------------------------------


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_api(request):
    """
    API สำหรับดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่
    """
    user = request.user
    profile = user.profile
    data = {
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "profile_picture": request.build_absolute_uri(profile.profile_picture.url) if profile.profile_picture else None
        
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile_api(request):
    """
    API สำหรับอัปเดตโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่
    """
    user = request.user
    profile = user.profile

    user.username = request.data.get('username', user.username)
    user.first_name = request.data.get('first_name', user.first_name)
    user.last_name = request.data.get('last_name', user.last_name)
    user.email = request.data.get('email', user.email)
    
    if 'profile_picture' in request.FILES:
        if profile.profile_picture:
            profile.profile_picture.delete()  # ลบไฟล์รูปเก่าก่อนอัปโหลดใหม่
        profile.profile_picture = request.FILES['profile_picture']

    user.save()
    profile.save()

    return Response({"message": "อัปเดตโปรไฟล์สำเร็จ"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def course_details_api(request, course_id):
    """
    API สำหรับดึงรายละเอียดคอร์สตาม `course_id`
    """
    course_details = get_object_or_404(CourseDetails, course_id=course_id)  # ดึงข้อมูล CourseDetails
    add_course = course_details.course  # ดึงข้อมูล add_course ที่เป็น ForeignKey

    def build_full_url(image_field):
        """ แปลง Path เป็น URL เต็ม """
        if image_field and hasattr(image_field, 'url'):
            return request.build_absolute_uri(image_field.url)
        return None

    # สร้าง URL เต็มของรูปภาพหลักและเพิ่มเติม
    course_data = CourseDetailsSerializer(course_details).data
    add_course_data = AddCourseSerializer(add_course).data

    course_data["image"] = build_full_url(course_details.image)
    course_data["additional_image"] = build_full_url(course_details.additional_image)
    course_data["extra_image_1"] = build_full_url(course_details.extra_image_1)
    course_data["extra_image_2"] = build_full_url(course_details.extra_image_2)
    
    add_course_data["image"] = build_full_url(add_course.image)

    return Response({
        "course_details": course_data,
        "add_course": add_course_data
    }, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_submit_booking(request, course_id):
    """
    API สำหรับจองคอร์สเรียน
    """
    course_details = get_object_or_404(CourseDetails, course_id=course_id)
    course_selected = course_details.course

    data = request.data
    selected_course = data.get("selected_course", "").strip()

    if not selected_course:
        return Response({"error": "กรุณาเลือกคอร์สก่อนดำเนินการต่อ"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ ดึงข้อมูลจาก API Request
    booking = CourseBooking.objects.create(
        user=request.user,
        student_name=data.get("student_name", ""),
        student_name_en=data.get("student_name_en", ""),
        nickname_th=data.get("nickname_th", ""),
        nickname_en=data.get("nickname_en", ""),
        age=data.get("age", ""),
        grade=data.get("grade", ""),
        other_grade=data.get("other_grade", ""),
        parent_nickname=data.get("parent_nickname", ""),
        phone=data.get("phone", ""),
        line_id=data.get("line_id", ""),
        course=course_selected,
        selected_course=selected_course,
        booking_status="pending",
        payment_status="pending"
    )

    return Response({
        "message": "✅ การจองสำเร็จ! โปรดดำเนินการชำระเงิน",
        "booking_id": booking.id
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_payment_details(request, booking_id):
    """
    API สำหรับดึงรายละเอียดการชำระเงิน
    """
    booking = get_object_or_404(CourseBooking, id=booking_id, user=request.user)
    course_details = get_object_or_404(CourseDetails, course=booking.course)
    course = course_details.course

    qr_code_url = request.build_absolute_uri(course.payment_qr.url) if course.payment_qr else None
    
    

    return Response({
        "booking_id": booking.id,
        "course_name": course.title,
        "course_price": course.price,
        "qr_code_url": qr_code_url,
        "payment_status": booking.payment_status
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_submit_payment(request, booking_id):
    """
    API สำหรับอัปโหลดสลิปการชำระเงิน
    """
    booking = get_object_or_404(CourseBooking, id=booking_id, user=request.user)

    if "payment_slip" not in request.FILES:
        return Response({"error": "กรุณาอัปโหลดไฟล์สลิป"}, status=status.HTTP_400_BAD_REQUEST)

    payment_slip = request.FILES["payment_slip"]
    fs = FileSystemStorage()
    filename = fs.save(payment_slip.name, payment_slip)

    # ✅ บันทึกไฟล์ลงฐานข้อมูล
    booking.payment_slip = filename
    booking.payment_status = "pending"
    booking.save()

    return Response({"message": "✅ อัปโหลดสลิปสำเร็จ! กรุณารอการตรวจสอบ"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_booking_status(request, booking_id):
    """
    API สำหรับตรวจสอบสถานะการจอง
    """
    booking = get_object_or_404(CourseBooking, id=booking_id, user=request.user)
    return Response({
        "booking_id": booking.id,
        "booking_status": booking.booking_status,
        "payment_status": booking.payment_status
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_user_bookings(request):
    """
    API สำหรับดึงประวัติการจองของผู้ใช้
    """
    bookings = CourseBooking.objects.filter(user=request.user)
    serializer = CourseBookingSerializer(bookings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_courses_api(request):
    """API สำหรับดึงคอร์สที่ผู้ใช้จอง (เฉพาะของตนเอง)"""
    bookings = CourseBooking.objects.filter(user=request.user).order_by("-booking_date")

    response_data = []
    for booking in bookings:
        course_data = CourseSerializer(booking.course, context={'request': request}).data
        booking_data = CourseBookingSerializer(booking, context={'request': request}).data
        booking_data["course"] = course_data  # ✅ เพิ่มข้อมูลคอร์สเข้าไป
        response_data.append(booking_data)

    return Response(response_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_my_courses_api(request, course_id):
    """API สำหรับดึงรายละเอียดของการจองคอร์ส (เฉพาะของตนเอง)"""
    course = get_object_or_404(Course, id=course_id)

    # ✅ ตรวจสอบให้แน่ใจว่าแสดงเฉพาะข้อมูลของผู้ใช้ที่ล็อกอิน
    bookings = CourseBooking.objects.filter(course=course, user=request.user).order_by("-booking_date")

    if not bookings.exists():
        return Response({"error": "คุณไม่มีสิทธิ์ดูข้อมูลการจองนี้"}, status=403)

    return Response({
        "course": CourseSerializer(course, context={'request': request}).data,
        "bookings": BookingDetailSerializer(bookings, many=True, context={'request': request}).data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_booking_history_api(request):
    """API สำหรับดึงประวัติการจองของผู้ใช้ที่ล็อกอินอยู่ (เฉพาะของตนเอง)"""
    bookings = CourseBooking.objects.filter(user=request.user).order_by("-booking_date")
    serializer = BookingHistorySerializer(bookings, many=True, context={'request': request})

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_password_api(request):
    """
    API สำหรับตรวจสอบรหัสผ่านเก่าก่อนเปลี่ยนรหัสผ่าน
    """
    try:
        # ✅ ใช้ request.data.get() แทน request.POST
        current_password = request.data.get("current_password")  
        
        if not current_password:
            return Response({"error": "❌ กรุณากรอกรหัสผ่านเดิม"}, status=400)

        # ✅ ใช้ request.user เช็ค password อย่างถูกต้อง
        if request.user.check_password(current_password):
            return Response({"message": "✅ รหัสผ่านถูกต้อง", "can_change": True}, status=200)
        else:
            return Response({"error": "❌ รหัสผ่านไม่ถูกต้อง"}, status=400)

    except Exception as e:
        return Response({"error": f"เกิดข้อผิดพลาด: {str(e)}"}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_api(request):
    """
    API สำหรับเปลี่ยนรหัสผ่านใหม่
    """
    user = request.user
    new_password = request.data.get('new_password')
    confirm_new_password = request.data.get('confirm_new_password')

    if not new_password or not confirm_new_password:
        return Response({"error": "กรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่าน"}, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm_new_password:
        return Response({"error": "❌ รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ ตั้งค่ารหัสผ่านใหม่
    user.set_password(new_password)
    user.save()

    # ✅ อัปเดต session auth เพื่อป้องกันการล็อกเอาต์
    update_session_auth_hash(request, user)

    return Response({"message": "✅ เปลี่ยนรหัสผ่านสำเร็จ"}, status=status.HTTP_200_OK)

#-----------------------------------------------------------------สำหรับ API ------------------------------------------------------------------------------------------------------------------------------------------------------------------



def sales(request):
    active_tab = request.GET.get("type", "booking")

    # ✅ คอร์สที่มีการจอง (ดึงจาก Course ที่มี CourseBooking)
    booked_courses = Course.objects.filter(
        id__in=CourseBooking.objects.values("course_id")
    ).annotate(booking_count=Count("coursebooking"))

    # ✅ หา CourseDetails ที่เกี่ยวข้อง (เพื่อดึงรายละเอียดเพิ่มเติม)
    course_details_dict = {cd.course_id: cd for cd in CourseDetails.objects.filter(course__in=booked_courses)}

    # ✅ คอร์สวิดีโอที่มีการซื้อ
    purchased_courses = CourseOrder.objects.values("course_name").annotate(purchase_count=Count("id"))

    return render(request, "admin/sales.html", {
        "booked_courses": booked_courses,
        "course_details_dict": course_details_dict,  # ✅ ส่งข้อมูล CourseDetails ไปให้ Template
        "purchased_courses": purchased_courses,
        "active_tab": active_tab,
    })


def booking_detail(request, course_id):
    # ✅ ดึง Course จาก `course_id`
    course = get_object_or_404(Course, id=course_id)

    search_query = request.GET.get("search", "")

    # ✅ ดึงข้อมูลการจองจาก `CourseBooking`
    bookings = CourseBooking.objects.filter(course=course).order_by("-booking_date")

    if search_query:
        bookings = bookings.filter(student_name__icontains=search_query)

    paginator = Paginator(bookings, 10)
    page_number = request.GET.get("page")
    bookings_page = paginator.get_page(page_number)

    return render(request, "admin/booking_detail.html", {
        "course": course,
        "bookings": bookings_page,
    })


def video_order_detail(request, order_id):
    orders = CourseOrder.objects.filter(course_name=order_id)

    return render(request, "admin/video_order_detail.html", {
        "course": orders.first(),
        "orders": orders,
    })

def review_video_courses(request):
    courses = VideoLesson.objects.filter(status='pending')  # ใช้ VideoLesson
    return render(request, 'admin/review_video_courses.html', {'courses': courses})

def approve_video_course(request, course_id):
    course = get_object_or_404(VideoLesson, id=course_id)  # ใช้ VideoLesson
    course.status = 'approved'
    course.save()
    return redirect('review_video_courses')

def send_back_video_course(request, course_id):
    course = get_object_or_404(VideoLesson, id=course_id)  # ใช้ VideoLesson
    course.status = 'revision'
    course.save()
    return redirect('review_video_courses')

def upload_payment_qr(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    if request.method == "POST" and 'payment_qr' in request.FILES:
        course.payment_qr = request.FILES['payment_qr']
        course.save()
        messages.success(request, "✅ อัปโหลด QR Code สำเร็จแล้ว!")
        return redirect('review_booking_courses')

    messages.error(request, "⚠️ กรุณาอัปโหลดไฟล์ QR Code")
    return redirect('review_booking_courses')

def review_booking_courses(request):
    # ดึงเฉพาะคอร์สที่มีสถานะ 'pending' หรือ 'revised'
    courses = Course.objects.filter(status__in=['pending', 'revised'])
    return render(request, 'admin/review_booking_courses.html', {'courses': courses})


def delete_selected_courses(request):
    if request.method == 'POST':
        # ดึงรายการ ID คอร์สที่ถูกเลือกจาก checkbox
        selected_ids = request.POST.getlist('selected_courses')

        if selected_ids:
            # ลบคอร์สทั้งหมดที่มี ID ตรงกับรายการที่เลือก
            courses_to_delete = Course.objects.filter(id__in=selected_ids)

            # ลบคอร์สและรายละเอียดคอร์สที่เกี่ยวข้อง
            for course in courses_to_delete:
                course.delete()

            messages.success(request, f"ลบคอร์สที่เลือกจำนวน {len(selected_ids)} รายการเรียบร้อยแล้ว!")
        else:
            messages.error(request, "กรุณาเลือกรายการที่ต้องการลบ")
    
    # กลับไปยังหน้าคอร์สเรียนแบบจอง
    return redirect('reservation_courses')

def approve_course(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    if not course.payment_qr:
        messages.error(request, "❌ กรุณาอัปโหลด QR Code ก่อนอนุมัติ")
        return redirect('review_booking_courses')

    course.status = 'approved'  # เปลี่ยนสถานะเป็นอนุมัติ
    course.save()
    messages.success(request, 'อนุมัติคอร์สเรียนเรียบร้อยแล้ว!')
    return redirect('review_booking_courses')  # กลับไปยังหน้าตรวจสอบคอร์ส




def send_back_course(request, course_id):
    if request.method == 'POST':
        revision_message = request.POST.get('revision_message')

        # ดึงข้อมูลคอร์สและอัปเดตสถานะ
        course = get_object_or_404(Course, id=course_id)
        course.status = 'revision'  # เปลี่ยนสถานะเป็น "revision"
        course.revision_message = revision_message  # บันทึกข้อความที่แอดมินส่งกลับ
        course.save()

        messages.success(request, 'ส่งคอร์สกลับไปแก้ไขเรียบร้อยแล้ว!')
        return redirect('review_booking_courses')
    else:
        # กรณี GET method
        return HttpResponseRedirect(reverse('review_booking_courses'))
    
@login_required
@admin_required
def admin_dashboard(request):

    return render(request, 'admin/dashboard_admin.html')


@login_required
def add_banner(request):
    if request.method == 'POST':
        image = request.FILES.get('banner_image')

        if image:
            Banner.objects.create(
                instructor=request.user,  # ✅ ระบุว่าใครเป็นคนเพิ่ม
                image=image,
                status='pending'  # ✅ ตั้งค่ารออนุมัติ
            )
            messages.success(request, "✅ เพิ่มเบนเนอร์สำเร็จ! โปรดรอการอนุมัติจากแอดมิน")
            return redirect('banners')
        else:
            messages.error(request, "⚠ กรุณาเลือกไฟล์รูปภาพ")
    
    return render(request, 'instructor/add_banner.html')

@login_required
def banners(request):
    banners = Banner.objects.filter(instructor=request.user)  # ✅ แสดงเฉพาะของผู้สอนคนนั้น
    return render(request, 'instructor/banners.html', {'banners': banners})

@login_required
@admin_required
def banners_admin(request):
    banners = Banner.objects.filter(status='pending')  # ✅ ดึงเฉพาะที่รออนุมัติ
    return render(request, 'admin/banners_admin.html', {'banners': banners})

@login_required
@admin_required
def approve_banner(request, banner_id):
    banner = get_object_or_404(Banner, id=banner_id)
    banner.status = 'approved'
    banner.rejection_message = ""  # ✅ เคลียร์ข้อความปฏิเสธ
    banner.save()
    messages.success(request, "อนุมัติโฆษณาสำเร็จ!")
    return redirect('banners_admin')

@login_required
@admin_required
def reject_banner(request, banner_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            rejection_message = data.get('rejection_message', '')

            banner = get_object_or_404(Banner, id=banner_id)
            banner.status = 'rejected'
            banner.rejection_message = rejection_message
            banner.save()

            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})


def delete_banner(request, banner_id):
    banner = get_object_or_404(Banner, id=banner_id)
    banner.delete()
    messages.success(request, "ลบเบนเนอร์สำเร็จ!")
    return redirect('banners')

def add_video_course_details(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        extra_description = request.POST.get('extra_description', '')
        image = request.FILES.get('image')
        extra_image = request.FILES.get('extra_image')
        return redirect('video_courses')
    return render(request, 'instructor/add_video_course_details.html')



@instructor_required
def add_course_details(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        additional_description = request.POST.get('additional_description')
        image = request.FILES.get('image')
        additional_image = request.FILES.get('additional_image')
        extra_image_1 = request.FILES.get('extra_image_1')  
        extra_image_2 = request.FILES.get('extra_image_2')

        # บันทึกข้อมูลรายละเอียดคอร์ส
        course_details = CourseDetails(
            course=course,
            name=name,
            description=description,
            additional_description=additional_description,
            image=image,
            additional_image=additional_image,
            extra_image_1=extra_image_1,  # เพิ่มฟิลด์รูปภาพเพิ่มเติม 1
            extra_image_2=extra_image_2,
        )
        course_details.save()

        messages.success(request, "เพิ่มรายละเอียดคอร์สสำเร็จ!")
        return redirect('reservation_courses')

    return render(request, 'instructor/add_course_details.html', {'course': course})

def course_details(request, course_id):
    # ดึง CourseDetails ตาม course_id
    course = get_object_or_404(CourseDetails, course_id=course_id)
    add_course = course.course  # สมมติว่า CourseDetails มี ForeignKey กับ add_course

    return render(request, 'course_details.html', {'course': course, 'add_course': add_course})



def submit_course_for_review(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    course_details = get_object_or_404(CourseDetails, course=course)

    if request.method == 'POST':
        # เปลี่ยนสถานะคอร์สเป็นรอการตรวจสอบ
        course.status = 'pending'
        course.save()
        messages.success(request, "ส่งคอร์สให้แอดมินตรวจสอบเรียบร้อยแล้ว!")
        return redirect('reservation_courses')

    return render(request, 'instructor/submit_course.html', {
        'course': course,
        'course_details': course_details
    })
def add_video_course(request):
    if request.method == 'POST':
        # รับข้อมูลจากฟอร์ม
        name = request.POST['name']
        description = request.POST['description']
        video_url = request.POST['video_url']
        price = request.POST['price']

        # บันทึกลงฐานข้อมูล (สมมติว่ามีโมเดล VideoCourse)
        VideoCourse.objects.create(
            name=name,
            description=description,
            video_url=video_url,
            price=price
        )
        return redirect('video_courses')  # กลับไปยังหน้ารายการคอร์ส

    return render(request, 'instructor/add_video_course.html')
def video_courses(request):
    return render(request, "instructor/video_courses.html")


@instructor_required
def add_course(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        instructor = request.POST.get('instructor')  # รับค่าชื่อผู้สอน
        price = request.POST.get('price')
        image = request.FILES.get('image')


        # บันทึกข้อมูลในโมเดล
        course = Course.objects.create(
            title=title,
            description=description,
            instructor=instructor,
            price=price,
            image=image,

        )
        course.save()
        messages.success(request, "เพิ่มคอร์สเรียนสำเร็จ! คุณสามารถเพิ่มรายละเอียดคอร์สเรียนต่อได้")
        return redirect('add_course_details', course_id=course.id)  # ส่ง course_id ไปยังหน้ารายละเอียด

    return render(request, 'instructor/add_course.html')


@instructor_required
def edit_course(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    
    if request.method == 'POST':
        # รับค่าจากฟอร์มและบันทึก
        course.title = request.POST.get('title')
        course.description = request.POST.get('description')
        course.instructor = request.POST.get('instructor')
        course.price = request.POST.get('price')
        if 'image' in request.FILES:
            course.image = request.FILES['image']
        course.save()
        
        # หลังบันทึกให้เด้งไปยังหน้าแก้ไขรายละเอียดคอร์สเรียน
        return redirect('edit_course_details', course_id=course.id)
    
    return render(request, 'instructor/edit_course.html', {'course': course})


@instructor_required
def edit_course_details(request, course_id):
    # ดึงข้อมูลรายละเอียดคอร์ส
    course_details = get_object_or_404(CourseDetails, course__id=course_id)
    course = course_details.course

    if request.method == "POST":
        # อัปเดตฟิลด์ต่างๆ
        course_details.name = request.POST.get('name', course_details.name)
        course_details.description = request.POST.get('description', course_details.description)
        course_details.additional_description = request.POST.get('additional_description', course_details.additional_description)

        if 'image' in request.FILES:
            course_details.image = request.FILES['image']
        if 'additional_image' in request.FILES:
            course_details.additional_image = request.FILES['additional_image']

        # อัปเดตสถานะคอร์สเป็น "แก้ไขแล้วรอการตรวจสอบ"
        course.status = 'revised'
        course.save()

        course_details.save()

        # ส่งข้อความยืนยัน
        messages.success(request, "รายละเอียดคอร์สถูกบันทึกและส่งไปยังแอดมินตรวจสอบแล้ว")
        return redirect('reservation_courses')

    return render(request, 'instructor/edit_course_details.html', {
        'course_details': course_details,
        'course': course
    })


@instructor_required
def reservation_courses(request):
    courses = Course.objects.all()
    return render(request, 'instructor/reservation_courses.html', {'courses': courses})




def contact(request):
    return render(request, 'contact.html')


def user_list(request):
    members = User.objects.filter(instructor_profile__isnull=True)  # สมาชิกทั่วไป
    instructors = InstructorProfile.objects.select_related('user').all()  # ผู้สอน

    # ✅ Debugging เพื่อตรวจสอบข้อมูลก่อนส่งไปยังเทมเพลต
    print(f"📌 สมาชิกทั้งหมด: {members.count()} | ผู้สอนทั้งหมด: {instructors.count()}")
    for instructor in instructors:
        print(f"👨‍🏫 {instructor.user.first_name} {instructor.user.last_name} | {instructor.subject} | {instructor.phone}")

    return render(request, 'admin/users_teachers.html', {
        'members': members,
        'instructors': instructors
    })

    return render(request, "admin/users_teachers.html", {
        "instructors": instructors,
        "members": members  # ✅ ต้องมี members ส่งไปที่ template
    })

def add_staff(request, user_id):  # รับ user_id เป็นพารามิเตอร์
    """ เพิ่มโปรไฟล์ผู้สอน """

    user = get_object_or_404(User, id=user_id)  # ดึงข้อมูลผู้ใช้จาก User Model

    if request.method == "POST":
        display_name = request.POST.get("display_name")
        subject = request.POST.get("subject")
        image = request.FILES.get("image")

        if display_name and subject:
            # บันทึกข้อมูลลงในตาราง myapp_staff
            new_staff = Staff(name=display_name, subject=subject, image=image)
            new_staff.save()

            messages.success(request, "เพิ่มโปรไฟล์ผู้สอนสำเร็จ!")
            return redirect("user_list")  # กลับไปที่หน้ารายชื่อผู้สอน
        else:
            messages.error(request, "กรุณากรอกข้อมูลให้ครบถ้วน!")

    return render(request, "admin/add_staff.html", {"user": user})




def home(request):
    banners = Banner.objects.filter(status="approved") 
    approved_courses = Course.objects.filter(status='approved', is_closed=False)
    
    if request.user.is_authenticated:
        return render(request, 'home.html', {
            'banners': banners,
            'courses': approved_courses,
        })  # สำหรับสมาชิก
    
    return render(request, 'guest_home.html', {
        'banners': banners,
        'courses': approved_courses,
    })  # สำหรับผู้ที่ยังไม่ได้เป็นสมาชิก


def all_courses(request):
    """ แสดงเฉพาะคอร์สที่ได้รับอนุมัติและยังเปิดรับสมัคร """
    query = request.GET.get('q', '')
    
    # ✅ กรองเฉพาะคอร์สที่ได้รับอนุมัติและยังเปิดรับสมัคร
    approved_courses = Course.objects.filter(status='approved', is_closed=False)  

    if query:
        approved_courses = approved_courses.filter(
            Q(title__icontains=query) | 
            Q(description__icontains=query)
        )

    template_name = 'all_courses.html' if request.user.is_authenticated else 'guest_all_courses.html'
    return render(request, template_name, {'courses': approved_courses, 'query': query})


#def all_courses(request):
    # ค้นหาคอร์สที่มีสถานะ 'approved'
    query = request.GET.get('q', '')  # รับค่าค้นหาจากช่องค้นหา
    approved_courses = Course.objects.filter(status='approved',is_closed=False)

    # ✅ ถ้ามีการค้นหา ให้กรองผลลัพธ์
    if query:
        approved_courses = approved_courses.filter(
            Q(title__icontains=query) |  # ค้นหาชื่อคอร์ส
            Q(description__icontains=query)  # ค้นหาจากรายละเอียดคอร์ส
        )

    # ✅ ตรวจสอบว่าผู้ใช้เข้าสู่ระบบหรือไม่
    template_name = 'all_courses.html' if request.user.is_authenticated else 'guest_all_courses.html'

    return render(request, template_name, {'courses': approved_courses, 'query': query})


@login_required
def profile_view(request):
    return render(request, 'profile.html', {'user': request.user, 'profile': request.user.profile})


@login_required
def update_profile(request):
    if request.method == 'POST':
        user = request.user
        profile = user.profile

        user.username = request.POST.get('username', user.username)
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.email = request.POST.get('email', user.email)
        user.save()

        if 'profile_picture' in request.FILES:
            profile.profile_picture = request.FILES['profile_picture']
            profile.save()  # ✅ บันทึกการเปลี่ยนแปลง
            
        messages.success(request, "บันทึกข้อมูลเรียบร้อยแล้ว!")
        return redirect('profile')
    
    return render(request, 'edit_profile.html', {'user': request.user, 'profile': request.user.profile})


@login_required
def profile_instructor(request):
    return render(request, 'instructor/profile_instructor.html', {'user': request.user, 'profile': request.user.profile})

@login_required
def update_profile_instructor(request):
    if request.method == 'POST':
        user = request.user
        profile = user.profile

        user.username = request.POST.get('username', user.username)
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.email = request.POST.get('email', user.email)
        user.save()

        if 'profile_picture' in request.FILES:
            profile.profile_picture = request.FILES['profile_picture']
            profile.save()  # ✅ บันทึกการเปลี่ยนแปลง
            
        messages.success(request, "บันทึกข้อมูลเรียบร้อยแล้ว!")
        return redirect(reverse('profile_instructor')) 
    
    return render(request, 'instructor/update_profile_instructor.html', {'user': request.user, 'profile': request.user.profile})

@login_required
def logout_view(request):
    logout(request)  # ลบ session ของ User ทั่วไป
    messages.success(request, "ออกจากระบบสำเร็จ")
    return redirect('home')  # ส่งกลับไปยังหน้าแรก

@login_required
@instructor_required
def instructor_logout(request):
    logout(request)  # ลบ session ของ Instructor
    messages.success(request, "คุณได้ออกจากระบบในฐานะผู้สอนแล้ว")
    return redirect('login')  # ส่งกลับไปหน้า Login หรือหน้าที่เหมาะสม

@login_required
def admin_logout(request):
    logout(request)  # ออกจากระบบ
    messages.success(request, "คุณได้ออกจากระบบในฐานะผู้ดูแลระบบแล้ว")
    return redirect('login')  # เปลี่ยนเส้นทางไปยังหน้า Login ของ Admin



def check_password(request):
    return render(request, 'check_password.html')

def verify_password(request):
    if request.method == 'POST':
        current_password = request.POST['current_password']
        if request.user.check_password(current_password):
            return redirect('change_password')
        else:
            return render(request, 'check_password.html', {'error_message': 'รหัสผ่านไม่ถูกต้อง'})
    return redirect('check_password')

def change_password(request):
    if request.method == 'POST':
        new_password = request.POST['new_password']
        confirm_new_password = request.POST['confirm_new_password']
        if new_password == confirm_new_password:
            request.user.set_password(new_password)
            request.user.save()
            login(request, request.user)  # Log the user back in
            return redirect('profile')
    return render(request, 'change_password.html')


def register_instructor(request):
    if request.method == "POST":
        username = request.POST.get("username")
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        age = request.POST.get("age")
        subject = request.POST.get("subject")
        password = request.POST.get("password")
        password2 = request.POST.get("password2")
        profile_picture = request.FILES.get("profile_picture")

        # ✅ ตรวจสอบรหัสผ่านตรงกันหรือไม่
        if password != password2:
            messages.error(request, "รหัสผ่านไม่ตรงกัน")
            return redirect("register_instructor")

        # ✅ ตรวจสอบว่ามีชื่อผู้ใช้และอีเมลซ้ำหรือไม่
        if User.objects.filter(username=username).exists():
            messages.error(request, "ชื่อผู้ใช้นี้มีอยู่แล้ว")
            return redirect("register_instructor")
        if User.objects.filter(email=email).exists():
            messages.error(request, "อีเมลนี้ถูกใช้ไปแล้ว")
            return redirect("register_instructor")

        # ✅ สร้าง User
        user = User.objects.create(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=make_password(password),
        )

        # ✅ ตรวจสอบว่ากลุ่ม "Instructor" มีอยู่หรือไม่ ถ้าไม่มีให้สร้าง
        instructor_group, created = Group.objects.get_or_create(name="Instructor")
        user.groups.add(instructor_group)  # เพิ่มผู้ใช้เข้าในกลุ่ม Instructor

        # ✅ สร้าง InstructorProfile
        instructor_profile = InstructorProfile(
            user=user,
            profile_picture=profile_picture,
            phone=phone,
            age=age,
            subject=subject,
        )
        instructor_profile.save()  # บันทึกข้อมูล

        messages.success(request, "ลงทะเบียนผู้สอนสำเร็จ")
        return redirect("user_list")

    return render(request, "admin/register_instructor.html")


def instructor_list(request):
    instructors = InstructorProfile.objects.select_related('user').all()
    return render(request, 'staff.html', {'instructors': instructors})


def course_details_admin(request, course_id):
    # ดึงข้อมูลคอร์สที่มี id ตรงกับ course_id
    course = get_object_or_404(CourseDetails, course_id=course_id)
    add_course = course.course  # สมมติว่า CourseDetails มี ForeignKey กับ add_course

    # ส่งข้อมูลคอร์สไปที่ Template
    return render(request, 'admin/course_details_admin.html', {'course': course, 'add_course': add_course})

def update_booking_status(request, booking_id, status):
    booking = get_object_or_404(CourseBooking, id=booking_id)

    if status in ["confirmed", "rejected"]:
        booking.booking_status = status
        booking.save()
        
        # ✅ แจ้งเตือนผู้ใช้
        messages.success(request, f"อัปเดตสถานะเป็น {booking.get_booking_status_display()} สำเร็จ!")

    return redirect("booking_detail", course_id=booking.course.id)


def booking_course(request, course_id):
    course = get_object_or_404(CourseDetails, course_id=course_id) 
    return render(request, 'booking_course.html', {'course': course})

@login_required
def submit_booking(request, course_details_id):
    course_details = get_object_or_404(CourseDetails, id=course_details_id)
    course_selected = course_details.course

    if request.method == "POST":
        selected_course = request.POST.get("selected_course", "").strip()

        if not selected_course:
            messages.error(request, "❌ กรุณาเลือกคอร์สก่อนดำเนินการต่อ")
            return redirect("booking_course", course_id=course_details_id)

        # ✅ ดึงข้อมูลจากฟอร์ม
        student_name = request.POST['student_name']
        student_name_en = request.POST['student_name_en']
        nickname_th = request.POST['nickname_th']
        nickname_en = request.POST['nickname_en']
        age = request.POST['age']
        grade = request.POST['grade']
        other_grade = request.POST.get('other_grade', '')
        parent_nickname = request.POST['parent_nickname']
        phone = request.POST['phone']
        line_id = request.POST.get('line_id', '')

        if grade == "อื่นๆ":
            grade = other_grade

        # ✅ บันทึกข้อมูลลง `CourseBooking` และกำหนด `user=request.user`
        booking = CourseBooking.objects.create(
            user=request.user,  # ✅ บันทึก user ที่จองคอร์ส
            student_name=student_name,
            student_name_en=student_name_en,
            nickname_th=nickname_th,
            nickname_en=nickname_en,
            age=age,
            grade=grade,
            other_grade=other_grade,
            parent_nickname=parent_nickname,
            phone=phone,
            line_id=line_id,
            course=course_selected,
            selected_course=selected_course,
            booking_status="pending",
            payment_status="pending"
        )

        return redirect("payment_page", booking_id=booking.id)

    return render(request, "booking_course.html", {"course": course_details})




def payment_page(request, booking_id):
    booking = get_object_or_404(CourseBooking, id=booking_id)  # ✅ ดึงข้อมูลการจอง
    course_details = get_object_or_404(CourseDetails, course=booking.course)

    #course_details = get_object_or_404(CourseDetails, id=booking.course.id)  # ✅ ดึง CourseDetails
    course = course_details.course  # ✅ ดึง Course ที่แท้จริง
    qr_code_url = course.payment_qr.url if course.payment_qr else None  # ✅ ดึง QR Code จาก Course

    return render(request, "payment_page.html", {
        "booking": booking,
        "course": course,  # ✅ ใช้ข้อมูล Course ที่ถูกต้อง
        "qr_code_url": qr_code_url
    })



    
def submit_payment(request, booking_id):
    booking = get_object_or_404(CourseBooking, id=booking_id)

    if request.method == "POST" and "payment_slip" in request.FILES:
        payment_slip = request.FILES["payment_slip"]

        # ✅ บันทึกสลิป
        fs = FileSystemStorage()
        filename = fs.save(payment_slip.name, payment_slip)
        booking.payment_slip = filename
        booking.payment_status = "pending"
        booking.save()

        messages.success(request, "✅ อัปโหลดสลิปสำเร็จ! กรุณารอการตรวจสอบ")
        return redirect("home")  # ✅ พากลับไปหน้าหลัก

    messages.error(request, "⚠ กรุณาอัปโหลดไฟล์สลิป")
    return redirect("payment_page", booking_id=booking.id)




@login_required
def instructor_sales(request):

    user = request.user  # ✅ ดึงผู้ใช้ที่เข้าสู่ระบบ
    active_tab = request.GET.get("type", "booking")

    # ✅ คอร์สที่มีการจอง (ดึงจาก Course ที่มี CourseBooking)
    booked_courses = Course.objects.filter(
        id__in=CourseBooking.objects.values("course_id")
    ).annotate(booking_count=Count("coursebooking"))

    # ✅ หา CourseDetails ที่เกี่ยวข้อง (เพื่อดึงรายละเอียดเพิ่มเติม)
    course_details_dict = {cd.course_id: cd for cd in CourseDetails.objects.filter(course__in=booked_courses)}

    # ✅ คอร์สวิดีโอที่มีการซื้อ
    purchased_courses = CourseOrder.objects.values("course_name").annotate(purchase_count=Count("id"))

    return render(request, "instructor/sales.html", {
        "booked_courses": booked_courses,
        "course_details_dict": course_details_dict,  # ✅ ส่งข้อมูล CourseDetails ไปให้ Template
        "purchased_courses": purchased_courses,
        "active_tab": active_tab,

    })


@login_required
def instructor_booking_detail(request, course_id):

        # ✅ ดึง Course จาก `course_id`
    course = get_object_or_404(Course, id=course_id)

    search_query = request.GET.get("search", "")

    # ✅ ดึงข้อมูลการจองจาก `CourseBooking`
    bookings = CourseBooking.objects.select_related("user").filter(course=course).order_by("-booking_date")


    if search_query:
        bookings = bookings.filter(student_name__icontains=search_query)

    paginator = Paginator(bookings, 10)
    page_number = request.GET.get("page")
    bookings_page = paginator.get_page(page_number)

    return render(request, "instructor/booking_detail.html", {
        "course": course,
        "bookings": bookings_page,
    })


@login_required
def instructor_video_order_detail(request,  order_id):

    orders = CourseOrder.objects.filter(course_name=order_id)

    return render(request, "instructor/video_order_detail.html", {
        "course": orders.first(),
        "orders": orders,
    })



@login_required
def user_booking_history(request):
    # ✅ ดึงประวัติการจองของผู้ใช้ที่ล็อกอินอยู่
    bookings = CourseBooking.objects.filter(user=request.user).order_by("-booking_date")

    return render(request, "booking_history.html", {
        "bookings": bookings
    })

@login_required
def my_courses(request):
    """ แสดงเฉพาะคอร์สที่ผู้ใช้คนปัจจุบันจอง """
    bookings = CourseBooking.objects.filter(user=request.user).order_by("-booking_date")
    return render(request, 'my_courses.html', {'bookings': bookings})

@login_required
def booking_my_courses(request, course_id):
    """ แสดงรายละเอียดข้อมูลของคอร์สที่ผู้ใช้คนปัจจุบันจอง """
    course = get_object_or_404(Course, id=course_id)

    # ✅ ดึงข้อมูลการจองที่เป็นของ `request.user` เท่านั้น
    bookings = CourseBooking.objects.filter(course=course, user=request.user).order_by("-booking_date")

    # ✅ ถ้าผู้ใช้ไม่มีการจองคอร์สนี้เลย ให้แจ้งเตือนหรือแสดงเป็นหน้า error
    if not bookings.exists():
        return render(request, "error.html", {"message": "คุณไม่มีสิทธิ์ดูข้อมูลการจองนี้"})

    return render(request, "booking_my_courses.html", {
        "course": course,
        "bookings": bookings
    })





@login_required
def profile_admin(request):
    return render(request, 'admin/profile_admin.html', {'user': request.user, 'profile': request.user.profile})

@login_required
def update_profile_admin(request):
    if request.method == 'POST':
        user = request.user
        profile = user.profile

        user.username = request.POST.get('username', user.username)
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.email = request.POST.get('email', user.email)
        user.save()

        if 'profile_picture' in request.FILES:
            profile.profile_picture = request.FILES['profile_picture']
            profile.save()  # ✅ บันทึกการเปลี่ยนแปลง
            
        messages.success(request, "บันทึกข้อมูลเรียบร้อยแล้ว!")
        return redirect(reverse('profile_admin')) 
    
    return render(request, 'admin/update_profile_admin.html', {'user': request.user, 'profile': request.user.profile})




def generate_pin():
    return ''.join(random.choices(string.digits, k=6))


def request_reset_password(request):
    if request.method == "POST":
        email = request.POST["email"]
        try:
            user = User.objects.get(email=email)
            pin = generate_pin()
            
            # ✅ ตั้งค่าเวลาหมดอายุของ PIN (5 นาที)
            request.session["reset_pin"] = {
                "pin": pin,
                "expires_at": (now() + datetime.timedelta(minutes=5)).isoformat()
            }
            request.session["reset_email"] = email

            # ✅ ส่งอีเมล PIN ให้ผู้ใช้
            send_mail(
                "รหัส PIN รีเซ็ตรหัสผ่าน",
                f"รหัส PIN ของคุณคือ {pin} (หมดอายุใน 5 นาที)",
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            return redirect("verify_reset_pin")
        except User.DoesNotExist:
            messages.error(request, "ไม่พบอีเมลนี้ในระบบ")
    
    return render(request, "reset_password_request.html")

# ✅ 2. หน้า "ยืนยันรหัส PIN"
def verify_reset_password(request):
    if request.method == "POST":
        entered_pin = "".join([
            request.POST.get("pin1", ""),
            request.POST.get("pin2", ""),
            request.POST.get("pin3", ""),
            request.POST.get("pin4", ""),
            request.POST.get("pin5", ""),
            request.POST.get("pin6", ""),
        ])
        
        session_data = request.session.get("reset_pin", {})

        if not session_data:
            messages.error(request, "รหัส PIN หมดอายุ กรุณาขอใหม่")
            return redirect("reset_password_request")  

        stored_pin = session_data.get("pin")
        expires_at = session_data.get("expires_at")

        # ✅ ตรวจสอบว่ารหัส PIN หมดอายุหรือยัง
        if expires_at and now() > datetime.datetime.fromisoformat(expires_at):
            del request.session["reset_pin"]
            messages.error(request, "รหัส PIN หมดอายุ กรุณาขอใหม่")
            return redirect("reset_password_request")

        # ✅ ตรวจสอบว่ารหัส PIN ตรงกันหรือไม่
        if entered_pin == stored_pin:
            return redirect("reset_password")  # ✅ ตรวจสอบว่า `name="reset_password"` ตรงกับ `urls.py`
        else:
            messages.error(request, "รหัส PIN ไม่ถูกต้อง กรุณาลองอีกครั้ง")

    return render(request, "reset_password_verify.html")


# ✅ 3. หน้า "ตั้งรหัสผ่านใหม่"
def is_valid_password(password):
    """✅ ตรวจสอบว่ารหัสผ่านแข็งแกร่งพอหรือไม่"""
    return (
        len(password) >= 8 and
        re.search(r"[0-9]", password)
    )

def reset_password(request):
    if request.method == "POST":
        new_password = request.POST["new_password"]
        confirm_password = request.POST["confirm_password"]

        if new_password != confirm_password:
            messages.error(request, "รหัสผ่านไม่ตรงกัน")
            return render(request, "reset_password_form.html")

        if not is_valid_password(new_password):
            messages.error(request, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัว และประกอบด้วยตัวพิมพ์เล็ก, ตัวพิมพ์ใหญ่, และตัวเลข")
            return render(request, "reset_password_form.html")

        email = request.session.get("reset_email")
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()

            # ✅ ลบข้อมูล PIN ออกจาก session หลังจากเปลี่ยนรหัสผ่านสำเร็จ
            request.session.pop("reset_pin", None)
            request.session.pop("reset_email", None)

            return render(request, "reset_password_form.html", {"success": True})  # ✅ ส่ง success=True ไปยัง Template
        except User.DoesNotExist:
            messages.error(request, "ไม่พบบัญชีผู้ใช้")

    return render(request, "reset_password_form.html")


@login_required
def cancel_booking(request, booking_id):
    booking = get_object_or_404(CourseBooking, id=booking_id, user=request.user)

    # ✅ เช็คว่าสถานะต้องเป็น "pending" ถึงจะยกเลิกได้
    if booking.booking_status == "pending":
        booking.booking_status = "canceled"
        booking.save()
        messages.success(request, "✅ คุณได้ยกเลิกการจองคอร์สเรียบร้อยแล้ว")
    else:
        messages.error(request, "⚠ ไม่สามารถยกเลิกได้ เนื่องจากการจองนี้ได้รับการยืนยันแล้ว")

    return redirect("my_courses")


@login_required
@instructor_required
def close_course(request, course_id):
    """ ปิดรับสมัครคอร์ส """
    print(f"🔍 กำลังปิดรับสมัครของคอร์ส: {course_id}")

    try:
        # ใช้ course_id ที่ถูกต้องจาก myapp_coursebooking
        course = get_object_or_404(Course, id=course_id)

        print(f"🔍 ก่อนอัปเดต: {course.is_closed}")

        course.is_closed = True
        course.save()

        print(f"✅ หลังอัปเดต: {course.is_closed}")
        messages.success(request, "✅ สิ้นสุดการรับสมัครของคอร์สเรียบร้อยแล้ว")
    except Course.DoesNotExist:
        print("❌ ไม่พบคอร์ส")
        messages.error(request, "❌ ไม่พบคอร์สที่ต้องการปิดรับสมัคร")

    return redirect("reservation_courses")




@login_required
@instructor_required
def reopen_course(request, course_id):
    """ เปิดรับสมัครคอร์สอีกครั้ง """
    print(f"🔍 กำลังเปิดรับสมัครของคอร์ส: {course_id}")

    try:
        # ใช้ course_id ที่ถูกต้องจาก myapp_coursebooking
        course = get_object_or_404(Course, id=course_id)

        print(f"🔍 ก่อนอัปเดต: {course.is_closed}")

        course.is_closed = False
        course.save()

        print(f"✅ หลังอัปเดต: {course.is_closed}")
        messages.success(request, "✅ เปิดรับสมัครของคอร์สนี้อีกครั้งเรียบร้อยแล้ว")
    except Course.DoesNotExist:
        print("❌ ไม่พบคอร์ส")
        messages.error(request, "❌ ไม่พบคอร์สที่ต้องการเปิดรับสมัคร")

    return redirect("reservation_courses")
