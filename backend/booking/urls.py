from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PatientRegisterView,
    PatientLoginView,
    DoctorLoginView,
    AdminLoginView,
    DoctorViewSet,
    SlotViewSet,
    AppointmentViewSet,
    AdminDoctorViewSet,
    AdminPatientListView,
)

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet, basename='doctor')
router.register(r'slots', SlotViewSet, basename='slot')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'admin/doctors', AdminDoctorViewSet, basename='admin-doctor')

urlpatterns = [
    path('patient/register', PatientRegisterView.as_view(), name='patient-register'),
    path('patient/login', PatientLoginView.as_view(), name='patient-login'),
    path('doctor/login', DoctorLoginView.as_view(), name='doctor-login'),
    path('admin/login', AdminLoginView.as_view(), name='admin-login'),
    path('admin/patients', AdminPatientListView.as_view(), name='admin-patients'),
]

urlpatterns += router.urls
