#!/usr/bin/env python
"""
Script to create admin user and sample doctors with different specializations
Run with: docker-compose exec django-backend python create_admin_and_doctors.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from booking.models import Doctor

User = get_user_model()


# Create Admin User
admin_email = 'admin@hospital.com'
admin_password = 'Admin@123'

if not User.objects.filter(email=admin_email).exists():
    admin_user = User.objects.create_user(
        username=admin_email,
        email=admin_email,
        password=admin_password,
        role=User.Roles.ADMIN,
        is_staff=True,
        is_superuser=True
    )
    print(f'✓ Admin user created successfully!')
    print(f'  Email: {admin_email}')
    print(f'  Password: {admin_password}')
else:
    print(f'⊘ Admin user already exists with email: {admin_email}')

# Medical Specializations/Departments
specializations = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Oncology',
    'Psychiatry',
    'Gynecology',
    'Urology',
    'Ophthalmology',
    'ENT (Ear, Nose, Throat)',
    'General Medicine',
    'Emergency Medicine',
    'Radiology',
    'Anesthesiology',
    'Internal Medicine',
    'Surgery',
    'Gastroenterology',
    'Pulmonology',
    'Endocrinology'
]

# Create sample doctors for each specialization
doctors_created = 0
doctors_skipped = 0

for i, specialization in enumerate(specializations, 1):
    doctor_email = f'doctor{i}@hospital.com'
    doctor_password = 'Doctor@123'
    doctor_name = f'Dr. {specialization.split()[0]} Specialist {i}'
    doctor_phone = f'+123456789{i:02d}'

    if not User.objects.filter(email=doctor_email).exists():
        user = User.objects.create_user(
            username=doctor_email,
            email=doctor_email,
            password=doctor_password,
            role=User.Roles.DOCTOR
        )
        Doctor.objects.create(
            user=user,
            name=doctor_name,
            specialization=specialization,
            phone=doctor_phone
        )
        doctors_created += 1
        print(f'✓ Created doctor: {doctor_name} - {specialization}')
    else:
        doctors_skipped += 1
        print(f'⊘ Doctor already exists: {doctor_email}')

print('')
print('=' * 60)
print('SETUP COMPLETE!')
print('=' * 60)
print(f'Created {doctors_created} new doctors')
if doctors_skipped > 0:
    print(f'Skipped {doctors_skipped} existing doctors')
print('')
print('=' * 60)
print('ADMIN LOGIN CREDENTIALS:')
print('=' * 60)
print(f'Email: {admin_email}')
print(f'Password: {admin_password}')
print('=' * 60)

