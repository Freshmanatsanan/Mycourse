const DJANGO_API_URL = 'https://mycourse-production.up.railway.app';

export const LOGIN_API_URL = `${DJANGO_API_URL}/api/login/`;
export const REGISTER_API_URL = `${DJANGO_API_URL}/api/register/`;
export const COURSES_API_URL = `${DJANGO_API_URL}/api/approved-courses/`;
export const BANNERS_API_URL = `${DJANGO_API_URL}/api/banners/`; 
export const STAFFS_API_URL = `${DJANGO_API_URL}/api/staffs/`; 
export const PROFILE_API_URL = `${DJANGO_API_URL}/api/profile/`;
export const UPDATE_PROFILE_API_URL = `${DJANGO_API_URL}/api/profile/update/`;

// ✅ API สำหรับตรวจสอบคอร์สเรียนแบบวิดีโอ
export const REVIEW_VIDEO_COURSES_API_URL = `${DJANGO_API_URL}/api/review-video-courses/`; // ✅ ดึงคอร์สวิดีโอที่รอการตรวจสอบ
export const APPROVE_VIDEO_COURSE_API_URL = (courseId) => `${DJANGO_API_URL}/api/approve-video-course/${courseId}/`; // ✅ อนุมัติคอร์สวิดีโอ
export const SEND_BACK_VIDEO_COURSE_API_URL = (courseId) => `${DJANGO_API_URL}/api/send-back-video-course/${courseId}/`; // ✅ ส่งกลับไปแก้ไข
export const UPLOAD_VIDEO_COURSE_QR_API_URL = (courseId) => `${DJANGO_API_URL}/api/upload-video-course-qr/${courseId}/`; // ✅ อัปโหลด QR Code การชำระเงิน

export const ADD_VIDEO_COURSE_API_URL = `${DJANGO_API_URL}/api/add-video-course/`;
export const ADD_VIDEO_COURSE_DETAILS_API_URL = (courseId) => `${DJANGO_API_URL}/api/add-video-course-details/${courseId}/`;
export const ADD_VIDEO_LESSON_API_URL = (courseId) => `${DJANGO_API_URL}/api/add-video-lesson/${courseId}/`;
export const DELETE_VIDEO_COURSE_API_URL = (courseId) => `${DJANGO_API_URL}/api/delete-video-course/${courseId}/`;

// ✅ API แก้ไขข้อมูลหลักของคอร์สวิดีโอ
export const EDIT_VIDEO_COURSE_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/edit-video-course/${courseId}/`;
  
  // ✅ API แก้ไขรายละเอียดของคอร์สวิดีโอ
  export const EDIT_VIDEO_COURSE_DETAILS_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/edit-video-course-details/${courseId}/`;

  export const GET_VIDEO_COURSE_DETAILS_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/get-video-course-details/${courseId}/`;
  
  // ✅ API แก้ไขบทเรียนวิดีโอ
  export const EDIT_VIDEO_LESSON_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/edit-video-lesson-api/${courseId}/`;
  

  export const GET_VIDEO_LESSON_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/get-video-lesson/${courseId}/`;
  

export const VIDEO_COURSE_ORDERS_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/video-order-detail-instructor/${courseId}/`;

export const VIDEO_COURSES_API_URL = `${DJANGO_API_URL}/api/video-courses/`;


// ✅ **API ดึงรายละเอียดคอร์สเรียนวิดีโอ**
export const VIDEO_COURSE_DETAILS_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/video-course/${courseId}/`;
// ✅ **API สำหรับซื้อคอร์สวิดีโอ**
export const PURCHASE_VIDEO_COURSE_API_URL = (courseId) => 
    `${DJANGO_API_URL}/api/purchase-video-course-api/${courseId}/`;

export const VIDEO_LESSONS_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/video-lessons/${courseId}/`;

export const GET_RESERVATION_COURSE_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/get-course/${courseId}/`;

export const COURSE_DETAILS_API_URL = (courseId) => 
    `${DJANGO_API_URL}/api/course/${courseId}/`;

export const EDIT_COURSE_DETAILS_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/edit-course-details-api/${courseId}/`;

export const GET_COURSE_DETAILS_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/get-course-details/${courseId}/`;

// ✅ การจองคอร์ส
export const BOOK_COURSE_API_URL = (courseId) => 
    `${DJANGO_API_URL}/api/book-course/${courseId}/`;

export const PAYMENT_DETAILS_API_URL = (bookingId) => 
    `${DJANGO_API_URL}/api/payment-details/${bookingId}/`;

export const SUBMIT_PAYMENT_API_URL = (bookingId) => 
    `${DJANGO_API_URL}/api/submit-payment/${bookingId}/`;

export const BOOKING_STATUS_API_URL = (bookingId) => 
    `${DJANGO_API_URL}/api/booking-status/${bookingId}/`;

export const MY_COURSES_API_URL = `${DJANGO_API_URL}/api/my-courses/`;

export const BOOKING_MY_COURSES_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/booking-my-courses/${courseId}/`;

// ✅ **API ดึงประวัติการจองของผู้ใช้**
export const USER_BOOKING_HISTORY_API_URL = `${DJANGO_API_URL}/api/user-booking-history/`;

export const INSTRUCTORS_API_URL = `${DJANGO_API_URL}/api/instructors/`;
export const VERIFY_PASSWORD_API_URL = `${DJANGO_API_URL}/api/verify-password/`;
export const CHANGE_PASSWORD_API_URL = `${DJANGO_API_URL}/api/change-password/`;


// ✅ **เพิ่ม API สำหรับ Instructor**
export const INSTRUCTOR_PROFILE_API_URL = `${DJANGO_API_URL}/api/instructor-profile/`;
export const UPDATE_INSTRUCTOR_PROFILE_API_URL = `${DJANGO_API_URL}/api/update-instructor-profile/`;

// ✅ **เพิ่ม API สำหรับ Admin**
export const ADMIN_PROFILE_API_URL = `${DJANGO_API_URL}/api/profile-admin/`; // ดึงข้อมูลโปรไฟล์แอดมิน
export const UPDATE_ADMIN_PROFILE_API_URL = `${DJANGO_API_URL}/api/update-profile-admin/`; // อัปเดตโปรไฟล์แอดมิน

export const INSTRUCTOR_SALES_API_URL = `${DJANGO_API_URL}/api/instructor-sales/`;
export const INSTRUCTOR_BOOKING_DETAIL_API_URL = (courseId) => `${DJANGO_API_URL}/api/instructor-booking-detail/${courseId}/`;

export const BANNERS_LIST_API_URL = `${DJANGO_API_URL}/api/banners_list/`;
export const ADD_BANNER_API_URL = `${DJANGO_API_URL}/api/banners/add/`;  // เพิ่มแบนเนอร์
export const PENDING_BANNERS_API_URL = `${DJANGO_API_URL}/api/banners/pending/`;  // ดึงแบนเนอร์ที่รออนุมัติ
export const APPROVE_BANNER_API_URL = (bannerId) => `${DJANGO_API_URL}/api/banners/${bannerId}/approve/`;  // อนุมัติแบนเนอร์
export const REJECT_BANNER_API_URL = (bannerId) => `${DJANGO_API_URL}/api/banners/${bannerId}/reject/`;  // ปฏิเสธแบนเนอร์
export const DELETE_BANNER_API_URL = (bannerId) => `${DJANGO_API_URL}/api/banners/${bannerId}/delete/`; // ✅ ลบแบนเนอร์

export const ADD_COURSE_API_URL = `${DJANGO_API_URL}/api/add-course/`;

export const ADD_COURSE_DETAILS_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/add-course-details/${courseId}/`;

export const LIST_RESERVATION_COURSES_API_URL = `${DJANGO_API_URL}/api/list_reservation_courses_api/`;

export const EDIT_COURSE_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/edit-course/${courseId}/`;

export const GET_VIDEO_COURSE_BY_ID_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/get-video-course_api/${courseId}/`;
  



export const SUBMIT_COURSE_REVIEW_API_URL = (courseId) =>
    `${DJANGO_API_URL}/api/submit-course-review/${courseId}/`;

export const DELETE_COURSE_API_URL = (courseId) => `${DJANGO_API_URL}/api/delete-course/${courseId}/`; // ✅ ลบคอร์สเดี่ยว
export const DELETE_SELECTED_COURSES_API_URL = `${DJANGO_API_URL}/api/delete-selected-courses/`; // ✅ ลบหลายคอร์ส

// ✅ API สำหรับปิดการรับสมัครคอร์ส
export const CLOSE_COURSE_API_URL = (courseId) => 
    `${DJANGO_API_URL}/api/close-course/${courseId}/`;

// ✅ API สำหรับเปิดรับสมัครคอร์สอีกครั้ง
export const REOPEN_COURSE_API_URL = (courseId) => 
    `${DJANGO_API_URL}/api/reopen-course/${courseId}/`;


export const SALES_API_URL = `${DJANGO_API_URL}/api/sales/`;
export const ADMIN_BOOKING_DETAIL_API_URL = (courseId) => `${DJANGO_API_URL}/api/Admin-booking-detail-api/${courseId}/`;

export const USER_LIST_API = `${DJANGO_API_URL}/api/users/`; 
export const REGISTER_INSTRUCTOR_API_URL = `${DJANGO_API_URL}/api/register-instructor/`;

// ✅ ดึงแบนเนอร์ที่รออนุมัติ (Admin Only)
export const ADMIN_PENDING_BANNERS_API_URL = `${DJANGO_API_URL}/api/banners_pending/`;

// ✅ อนุมัติแบนเนอร์ (Admin Only)
export const ADMIN_APPROVE_BANNER_API_URL = (bannerId) => 
    `${DJANGO_API_URL}/api/Admin_banners/approve/${bannerId}/`;

// ✅ ปฏิเสธแบนเนอร์ (Admin Only)
export const ADMIN_REJECT_BANNER_API_URL = (bannerId) => 
    `${DJANGO_API_URL}/api/Admin_banners/reject/${bannerId}/`;

export const REVIEW_BOOKING_COURSES_API_URL = `${DJANGO_API_URL}/api/review_booking_courses/`; // ✅ ตรวจสอบการจองคอร์ส
export const APPROVE_COURSE_API_URL = (courseId) => `${DJANGO_API_URL}/api/approve_course/${courseId}/`; // ✅ อนุมัติคอร์ส
export const SEND_BACK_COURSE_API_URL = (courseId) => `${DJANGO_API_URL}/api/send_back_course/${courseId}/`; // ✅ ส่งคอร์สกลับให้แก้ไข
export const UPLOAD_PAYMENT_QR_API_URL = (courseId) => `${DJANGO_API_URL}/api/upload_payment_qr/${courseId}/`; // ✅ อัปโหลด QR การชำระเงิน

export const UPDATE_BOOKING_STATUS_API_URL = (bookingId) =>
    `${DJANGO_API_URL}/api/booking/${bookingId}/update-status/`;

// ✅ API รายได้รวม (สำหรับ Mobile)
export const ADMIN_DASHBOARD_API_URL = `${DJANGO_API_URL}/api/admin/dashboard/`;

// ✅ API รายได้แยกตามคอร์ส
export const COURSE_REVENUE_API_URL = `${DJANGO_API_URL}/api/admin/course-revenue/`;

// ✅ API รายได้แยกตามเดือน
export const MONTHLY_INCOME_API_URL = `${DJANGO_API_URL}/api/admin/monthly-income/`;

export const REQUEST_RESET_PASSWORD_API_URL = `${DJANGO_API_URL}/api/request-reset-password/`; // ขอรหัส PIN
export const VERIFY_RESET_PASSWORD_API_URL = `${DJANGO_API_URL}/api/verify-reset-password/`; // ตรวจสอบ PIN
export const RESET_PASSWORD_API_URL = `${DJANGO_API_URL}/api/reset-password/`; // รีเซ็ตรหัสผ่าน


export const VIDEO_ORDER_DETAIL_API_URL = (courseId) => `${DJANGO_API_URL}/api/video-order-detail/${courseId}`;
export const CONFIRM_VIDEO_ORDER_API_URL = (orderId) =>
    `${DJANGO_API_URL}/api/confirm-video-order-api/${orderId}/`;

export const REJECT_VIDEO_ORDER_API_URL = (orderId) =>
    `${DJANGO_API_URL}/api/reject-video-order/${orderId}/`;


export default DJANGO_API_URL;
