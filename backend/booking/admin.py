from django.contrib import admin

from .models import User, Patient, Doctor, Slot, Appointment


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'role', 'is_staff')
    list_filter = ('role',)
    search_fields = ('username', 'email')


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'age', 'gender', 'phone')
    search_fields = ('full_name', 'phone')


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'specialization', 'phone')
    search_fields = ('name', 'specialization')


@admin.register(Slot)
class SlotAdmin(admin.ModelAdmin):
    list_display = ('id', 'doctor', 'date', 'start_time', 'end_time')
    list_filter = ('date', 'doctor')


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'slot', 'status', 'created_at')
    list_filter = ('status', 'doctor', 'slot__date')
