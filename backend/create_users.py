import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "hospital_backend.settings")
django.setup()

from booking.models import User, Patient, Doctor

print("Creating dummy users...")

admin, _ = User.objects.update_or_create(
    email="sunnysuhas108@gmail.com",
    defaults={
        "username": "sunnysuhas108@gmail.com",
        "role": User.Roles.ADMIN,
    },
)
admin.set_password("suhas2005")
admin.save()


doctor_user, _ = User.objects.update_or_create(
    email="doctor1@example.com",
    defaults={
        "username": "doctor1@example.com",
        "role": User.Roles.DOCTOR,
    },
)
doctor_user.set_password("doctor123")
doctor_user.save()

Doctor.objects.update_or_create(
    user=doctor_user,
    defaults={
        "name": "Dr. Smith",
        "specialization": "Cardiology",
        "phone": "555-0100"
    }
)


patient_user, _ = User.objects.update_or_create(
    email="patient1@example.com",
    defaults={
        "username": "patient1@example.com",
        "role": User.Roles.PATIENT,
    },
)
patient_user.set_password("patient123")
patient_user.save()

Patient.objects.update_or_create(
    user=patient_user,
    defaults={
        "full_name": "John Doe",
        "age": 30,
        "gender": "Male",
        "phone": "555-0200"
    }
)

print("Demo users successfully created")
