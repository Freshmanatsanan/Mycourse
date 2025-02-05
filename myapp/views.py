
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
from rest_framework.permissions import AllowAny
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
from .serializers import CourseDetailsSerializer, AddCourseSerializer 

def register(request):
    if request.method == 'POST':    
        username = request.POST['username']
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

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

                messages.success(request, 'สร้างบัญชีสำเร็จแล้ว')
                return redirect('login')

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


#-----------------------------------------------------------------สำหรับ API ------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
        approved_courses = Course.objects.filter(status='approved')
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
    approved_courses = Course.objects.filter(status='approved')
    
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
    # ค้นหาคอร์สที่มีสถานะ 'approved'
    query = request.GET.get('q', '')  # รับค่าค้นหาจากช่องค้นหา
    approved_courses = Course.objects.filter(status='approved')

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

def success_page(request):
    return render(request, "success.html")


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