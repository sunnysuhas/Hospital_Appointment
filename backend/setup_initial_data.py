import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from booking.models import Doctor

User = get_user_model()

def main():
    # Create Admin User
    admin_email = 'admin@hospital.com'
    admin_password = 'Admin@123'
    
    admin_user, created = None, False
    if not User.objects.filter(email=admin_email).exists():
        admin_user = User.objects.create_user(
            username=admin_email,
            email=admin_email,
            password=admin_password,
            role=User.Roles.ADMIN,
            is_staff=True,
            is_superuser=True
        )
        created = True
        sys.stdout.write('SUCCESS: Admin user created!\n')
        sys.stdout.write(f'Email: {admin_email}\n')
        sys.stdout.write(f'Password: {admin_password}\n')
        sys.stdout.flush()
    else:
        admin_user = User.objects.get(email=admin_email)
        sys.stdout.write('INFO: Admin user already exists\n')
        sys.stdout.flush()

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

    doctors_created = 0
    doctors_skipped = 0

    for i, specialization in enumerate(specializations, 1):
        doctor_email = f'doctor{i}@hospital.com'
        doctor_password = 'Doctor@123'
        # Better doctor names
        name_parts = specialization.split()
        if len(name_parts) > 1 and name_parts[0] == 'ENT':
            doctor_name = f'Dr. {specialization} Specialist'
        else:
            doctor_name = f'Dr. {name_parts[0]} Specialist'
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
            sys.stdout.write(f'Created: {doctor_name} - {specialization}\n')
            sys.stdout.flush()
        else:
            doctors_skipped += 1

    sys.stdout.write(f'\nTotal doctors created: {doctors_created}\n')
    if doctors_skipped > 0:
        sys.stdout.write(f'Doctors skipped (already exist): {doctors_skipped}\n')
    sys.stdout.write('\n' + '='*60 + '\n')
    sys.stdout.write('ADMIN LOGIN CREDENTIALS:\n')
    sys.stdout.write('='*60 + '\n')
    sys.stdout.write(f'Email: {admin_email}\n')
    sys.stdout.write(f'Password: {admin_password}\n')
    sys.stdout.write('='*60 + '\n')
    sys.stdout.flush()

if __name__ == '__main__':
    main()

