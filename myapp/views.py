
from django.shortcuts import render, redirect,get_object_or_404
from django.contrib.auth.models import User
from django.contrib import messages
from .models import Course,VideoCourse
from .models import CourseDetails
from django.http import HttpResponse
from .models import Banner
from .models import Staff
from .models import BookingCourse
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
        email = request.POST['email']
        password = request.POST['password']

        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
            if user:
                login(request, user)

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

#-----------------------------------------------------------------สำหรับ API ------------------------------------------------------------------------------------------------------------------------------------------------------------------


def user_list(request):
    members = UserProfile.objects.filter(role='member')
    teachers = UserProfile.objects.filter(role='teacher')
    return render(request, 'admin/users_teachers.html', {'members': members, 'teachers': teachers})

def sales(request):
    orders = CourseOrder.objects.all()
    return render(request, 'admin/sales.html', {'orders': orders})

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
    if request.method == 'POST':
        course = get_object_or_404(BookingCourse, id=course_id)
        payment_qr = request.FILES.get('payment_qr')
        if payment_qr:
            course.payment_qr = payment_qr
            course.save()
            return redirect('review_booking_courses')
        else:
            return HttpResponse("กรุณาอัปโหลดไฟล์รูปภาพ QR Code")
    return HttpResponse("ไม่อนุญาตให้เข้าถึง")

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
@instructor_required
def add_banner(request):
    if request.method == 'POST':
        image = request.FILES.get('banner_image')
        if image:
            Banner.objects.create(image=image)
            messages.success(request, "เพิ่มสไลด์เบนเนอร์สำเร็จ!")
            return redirect('banners')
        else:
            messages.error(request, "กรุณาเลือกไฟล์รูปภาพ")
    return render(request, 'instructor/add_banner.html')

def banners(request):
    # ดึงข้อมูลเบนเนอร์ทั้งหมดจากฐานข้อมูล
    banners = Banner.objects.all()
    return render(request, 'instructor/banners.html', {'banners': banners})

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


@instructor_required
def instructor_sales(request):
    return render(request, 'instructor/sales.html')

def contact(request):
    return render(request, 'contact.html')

def staff_list(request):
    staffs = Staff.objects.all()  # ดึงข้อมูลบุคลากรทั้งหมด
    return render(request, 'staff.html', {'staffs': staffs}) 

def user_list(request):
    """ ดึงรายชื่อสมาชิกและผู้สอนจาก Django Group """
    try:
        instructor_group = Group.objects.get(name="Instructor")
        instructors = User.objects.filter(groups=instructor_group).order_by("first_name")
    except Group.DoesNotExist:
        instructors = []

    try:
        member_group = Group.objects.get(name="Member")
        members = User.objects.filter(groups=member_group).order_by("first_name")
    except Group.DoesNotExist:
        members = []

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
    banners = Banner.objects.filter(is_active=True)
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
    # ดึงเฉพาะคอร์สที่มีสถานะเป็น 'approved'
    approved_courses = Course.objects.filter(status='approved')

    # ตรวจสอบว่าผู้ใช้เข้าสู่ระบบหรือไม่
    if request.user.is_authenticated:
        # หากเข้าสู่ระบบแล้ว แสดงหน้า `all_courses.html`
        return render(request, 'all_courses.html', {'courses': approved_courses})
    else:
        # หากยังไม่ได้เข้าสู่ระบบ แสดงหน้า `guest_all_courses.html`
        return render(request, 'guest_all_courses.html', {'courses': approved_courses})


@login_required
def profile_view(request):
    return render(request, 'profile.html', {'user': request.user})

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


def update_profile(request):
    if request.method == 'POST':
        user = request.user
        user.username = request.POST['username']
        user.first_name = request.POST['first_name']
        user.last_name = request.POST['last_name']
        user.email = request.POST['email']
        user.save()
        return redirect('profile')
    return render(request, 'edit_profile.html')

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