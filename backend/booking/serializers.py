from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Patient, Doctor, Slot, Appointment


class PatientRegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    age = serializers.IntegerField(write_only=True)
    gender = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True)
    medical_history = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'full_name', 'age', 'gender', 'phone', 'medical_history']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False, 'allow_blank': True},
        }

    def validate(self, attrs):
        password = attrs.get('password')
        validate_password(password)
        return attrs

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        age = validated_data.pop('age')
        gender = validated_data.pop('gender')
        phone = validated_data.pop('phone')
        medical_history = validated_data.pop('medical_history', '')

        email = validated_data.get('email')
        username = validated_data.get('username') or email

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            role=User.Roles.PATIENT,
        )
        patient = Patient.objects.create(
            user=user,
            full_name=full_name,
            age=age,
            gender=gender,
            phone=phone,
            medical_history=medical_history,
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def _generate_tokens(self, user):
        refresh = RefreshToken.for_user(user)
        refresh['role'] = user.role
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': user.role,
        }


class PatientLoginSerializer(LoginSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        try:
            user = User.objects.get(email=email, role=User.Roles.PATIENT)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid credentials')
        if not user.check_password(password):
            raise serializers.ValidationError('Invalid credentials')
        tokens = self._generate_tokens(user)
        return {**tokens, 'user_id': user.id, 'patient_id': user.patient_profile.id}


class DoctorLoginSerializer(LoginSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        try:
            user = User.objects.get(email=email, role=User.Roles.DOCTOR)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid credentials')
        if not user.check_password(password):
            raise serializers.ValidationError('Invalid credentials')
        tokens = self._generate_tokens(user)
        return {**tokens, 'user_id': user.id, 'doctor_id': user.doctor_profile.id}


class AdminLoginSerializer(LoginSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        try:
            user = User.objects.get(email=email, role=User.Roles.ADMIN)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid credentials')
        if not user.check_password(password):
            raise serializers.ValidationError('Invalid credentials')
        tokens = self._generate_tokens(user)
        return {**tokens, 'user_id': user.id}


class DoctorSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialization', 'phone', 'email']


class SlotSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(source='doctor', queryset=Doctor.objects.all(), write_only=True, required=False)

    class Meta:
        model = Slot
        fields = ['id', 'doctor', 'doctor_id', 'date', 'start_time', 'end_time']


class AppointmentSerializer(serializers.ModelSerializer):
    patient = serializers.StringRelatedField(read_only=True)
    doctor = DoctorSerializer(read_only=True)
    slot = SlotSerializer(read_only=True)
    slot_id = serializers.PrimaryKeyRelatedField(source='slot', queryset=Slot.objects.all(), write_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'slot', 'slot_id', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']
