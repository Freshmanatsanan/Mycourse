from django.urls import path
from . import views
from .views import register, login_view
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    # สำหรับ Web
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('', views.home, name='home'),  # เพิ่มเส้นทาง root
    path('update_profile/', views.update_profile, name='update_profile'),
    path('check-password/', views.check_password, name='check_password'),
    path('verify-password/', views.verify_password, name='verify_password'),
    path('change-password/', views.change_password, name='change_password'),
    path('all-courses/', views.all_courses, name='all_courses'),
    path('user-list/', views.user_list, name='user_list'),  # ✅ ตรวจสอบเส้นทาง
    path('staff/add/<int:user_id>/', views.add_staff, name='add_staff'),  # ✅ เพิ่ม <int:user_id>
    path('contact/', views.contact, name='contact'),  # เพิ่ม path สำหรับหน้าติดต่อเรา
    path('instructor/', views.instructor_sales, name='instructor_sales'),
    path('ireservation/', views.reservation_courses, name='reservation_courses'),
    path('add_course/', views.add_course, name='add_course'),
    path('edit-course/<int:course_id>/', views.edit_course, name='edit_course'),
    path('video_courses/', views.video_courses, name='instructor_live_courses'),
    path('add_video_course/', views.add_video_course, name='add_video_course'),
    path('add_course_details/<int:course_id>/', views.add_course_details, name='add_course_details'),
    path('edit-course-details/<int:course_id>/', views.edit_course_details, name='edit_course_details'),
    path('add_video_course_details/', views.add_video_course_details, name='add_video_course_details'),
    path('submit_course_for_review/<int:course_id>/', views.submit_course_for_review, name='submit_course_for_review'),
    path('banners/', views.banners, name='banners'),
    path('add_banner/', views.add_banner, name='add_banner'),
    path('delete_banner/<int:banner_id>/', views.delete_banner, name='delete_banner'),
    path('admin_dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('review_booking_courses/', views.review_booking_courses, name='review_booking_courses'),
    path('approve_course/<int:course_id>/', views.approve_course, name='approve_course'),
    path('send-back-course/<int:course_id>/', views.send_back_course, name='send_back_course'),
    path('upload_payment_qr/<int:course_id>/', views.upload_payment_qr, name='upload_payment_qr'),
    path('review_video_lessons/', views.review_video_courses, name='review_video_courses'),  # เปลี่ยนเส้นทาง URL
    path('approve_video_lesson/<int:course_id>/', views.approve_video_course, name='approve_video_course'),
    path('send_back_video_lesson/<int:course_id>/', views.send_back_video_course, name='send_back_video_course'),
    path('sales/', views.sales, name='sales'),
    path('user-list/', views.user_list, name='user_list'),
    path('delete-selected-courses/', views.delete_selected_courses, name='delete_selected_courses'),
    path('profile/', views.profile_view, name='profile'),
    path('logout/', views.logout_view, name='logout'),
    path('instructor/logout/', views.instructor_logout, name='instructor_logout'),  # Logout สำหรับ Instructor
    path('admin_logout/', views.admin_logout, name='admin_logout'), 
    path('courses/<int:course_id>/', views.course_details, name='course_details'),
    path('register-instructor/', views.register_instructor, name='register_instructor'),
    path('staff/', views.instructor_list, name='instructor_list'),
    path('admin_banners/', views.banners_admin, name='banners_admin'),
    path('approve_banner/<int:banner_id>/', views.approve_banner, name='approve_banner'),
    path('reject_banner/<int:banner_id>/', views.reject_banner, name='reject_banner'),
    path('course_details_admin/<int:course_id>/', views.course_details_admin, name='course_details_admin'),
    path('booking/<int:course_id>/', views.booking_course, name='booking_course'),
    path("submit-booking/<int:course_details_id>/", views.submit_booking, name="submit_booking"),

    path("payment/<int:booking_id>/", views.payment_page, name="payment_page"),
    path("submit-payment/<int:booking_id>/", views.submit_payment, name="submit_payment"),
    path('success/', views.success_page, name='success_page'),  # ✅ หน้าแสดงผลสำเร็จ
        
    path("sales/booking/<int:course_id>/", views.booking_detail, name="booking_detail"),
    path("sales/video/<int:order_id>/", views.video_order_detail, name="video_order_detail"),

    path("instructor/sales/", views.instructor_sales, name="instructor_sales"),
    path("instructor/booking/<int:course_id>/", views.instructor_booking_detail, name="instructor_booking_detail"),
    path("instructor/video/<int:order_id>/", views.instructor_video_order_detail, name="instructor_video_order_detail"),
    path("booking-history/", views.user_booking_history, name="booking_history"),



    
    
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    # สำหรับ API
    path('api/register/', views.register_api, name='register_api'),
    path('api/login/', views.login_api, name='login_api'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # สำหรับ Refresh Token
    path('api/user/', views.get_user_data, name='get_user_data'),
    path('api/approved-courses/', views.get_approved_courses, name='get_approved_courses'),
    path('api/banners/', views.banners_api, name='banners_api'),  # API สำหรับดึงแบนเนอร์
    path('api/staffs/', views.staff_list_api, name='staff_list_api'),

]





