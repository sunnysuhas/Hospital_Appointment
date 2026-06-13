import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from booking.models import Doctor

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates an admin user and sample doctors from environment-provided credentials.'

    def handle(self, *args, **options):
        admin_email = os.environ.get('SEED_ADMIN_EMAIL')
        admin_password = os.environ.get('SEED_ADMIN_PASSWORD')
        doctor_password = os.environ.get('SEED_DOCTOR_PASSWORD')

        if not all([admin_email, admin_password, doctor_password]):
            raise CommandError(
                'SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, and SEED_DOCTOR_PASSWORD are required.'
            )

        if not User.objects.filter(email=admin_email).exists():
            User.objects.create_user(
                username=admin_email,
                email=admin_email,
                password=admin_password,
                role=User.Roles.ADMIN,
                is_staff=True,
                is_superuser=True,
            )
            self.stdout.write(self.style.SUCCESS('Admin user created successfully.'))
            self.stdout.write(self.style.SUCCESS(f'Email: {admin_email}'))
        else:
            self.stdout.write(self.style.WARNING(f'Admin user already exists: {admin_email}'))

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
            'Endocrinology',
        ]

        doctors_created = 0
        doctors_skipped = 0

        for i, specialization in enumerate(specializations, 1):
            doctor_email = f'doctor{i}@hospital.com'
            doctor_name = f'Dr. {specialization.split()[0]} Specialist {i}'
            doctor_phone = f'+123456789{i:02d}'

            if User.objects.filter(email=doctor_email).exists():
                doctors_skipped += 1
                self.stdout.write(self.style.WARNING(f'Doctor already exists: {doctor_email}'))
                continue

            user = User.objects.create_user(
                username=doctor_email,
                email=doctor_email,
                password=doctor_password,
                role=User.Roles.DOCTOR,
            )
            Doctor.objects.create(
                user=user,
                name=doctor_name,
                specialization=specialization,
                phone=doctor_phone,
            )
            doctors_created += 1
            self.stdout.write(self.style.SUCCESS(f'Created doctor: {doctor_name} - {specialization}'))

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('Setup complete.'))
        self.stdout.write(self.style.SUCCESS(f'Created {doctors_created} new doctors.'))
        if doctors_skipped:
            self.stdout.write(self.style.WARNING(f'Skipped {doctors_skipped} existing doctors.'))
