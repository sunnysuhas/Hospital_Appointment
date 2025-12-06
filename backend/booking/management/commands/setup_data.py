from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from booking.models import User, Doctor

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates admin user and sample doctors with different specializations'

    def handle(self, *args, **options):
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
            self.stdout.write(
                self.style.SUCCESS(f'✓ Admin user created successfully!')
            )
            self.stdout.write(
                self.style.SUCCESS(f'  Email: {admin_email}')
            )
            self.stdout.write(
                self.style.SUCCESS(f'  Password: {admin_password}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Admin user already exists with email: {admin_email}')
            )

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
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created doctor: {doctor_name} - {specialization}')
                )
            else:
                doctors_skipped += 1
                self.stdout.write(
                    self.style.WARNING(f'⊘ Doctor already exists: {doctor_email}')
                )

        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS(f'✓ Setup complete!')
        )
        self.stdout.write(
            self.style.SUCCESS(f'  Created {doctors_created} new doctors')
        )
        if doctors_skipped > 0:
            self.stdout.write(
                self.style.WARNING(f'  Skipped {doctors_skipped} existing doctors')
            )
        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS('=' * 60)
        )
        self.stdout.write(
            self.style.SUCCESS('ADMIN LOGIN CREDENTIALS:')
        )
        self.stdout.write(
            self.style.SUCCESS('=' * 60)
        )
        self.stdout.write(
            self.style.SUCCESS(f'Email: {admin_email}')
        )
        self.stdout.write(
            self.style.SUCCESS(f'Password: {admin_password}')
        )
        self.stdout.write(
            self.style.SUCCESS('=' * 60)
        )

