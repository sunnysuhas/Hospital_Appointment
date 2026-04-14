from datetime import date as date_cls

from django.db.models import Q
from rest_framework import generics, status, viewsets, serializers
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Doctor, Slot, Appointment, Patient, User
from .permissions import IsPatient, IsDoctor, IsAdmin
from .serializers import (
    PatientRegisterSerializer,
    PatientLoginSerializer,
    DoctorLoginSerializer,
    AdminLoginSerializer,
    DoctorSerializer,
    SlotSerializer,
    AppointmentSerializer,
)


class PatientRegisterView(generics.CreateAPIView):
    serializer_class = PatientRegisterSerializer
    permission_classes = [AllowAny]


class PatientLoginView(generics.GenericAPIView):
    serializer_class = PatientLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class DoctorLoginView(generics.GenericAPIView):
    serializer_class = DoctorLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class AdminLoginView(generics.GenericAPIView):
    serializer_class = AdminLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Doctor.objects.select_related('user').all()
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        specialization = self.request.query_params.get('specialization')
        if specialization:
            qs = qs.filter(specialization__icontains=specialization)
        return qs

    @action(detail=True, methods=['get'], url_path='slots')
    def slots(self, request, pk=None):
        doctor = self.get_object()
        # Show only slots that are NOT booked (approved or pending)
        slots = doctor.slots.exclude(
            appointment__status__in=[Appointment.Status.APPROVED, Appointment.Status.PENDING]
        )
        serializer = SlotSerializer(slots, many=True)
        return Response(serializer.data)


class SlotViewSet(viewsets.ModelViewSet):
    serializer_class = SlotSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        return Slot.objects.filter(doctor__user=self.request.user)

    def perform_create(self, serializer):
        doctor = getattr(self.request.user, 'doctor_profile', None)
        if not doctor:
             raise serializers.ValidationError({'detail': 'Doctor profile not found.'})
        serializer.save(doctor=doctor)


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsPatient]
        elif self.action == 'list':
            permission_classes = [IsAuthenticated]
        elif self.action in ['approve', 'reject', 'cancel']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        return [perm() for perm in permission_classes]

    def get_queryset(self):
        user = self.request.user
        qs = Appointment.objects.select_related('patient', 'doctor', 'slot')
        if user.role == 'PATIENT':
            return qs.filter(patient__user=user)
        if user.role == 'DOCTOR':
            return qs.filter(doctor__user=user)
        if user.role == 'ADMIN':
            doctor_id = self.request.query_params.get('doctor_id')
            status_param = self.request.query_params.get('status')
            date_param = self.request.query_params.get('date')
            if doctor_id:
                qs = qs.filter(doctor_id=doctor_id)
            if status_param:
                qs = qs.filter(status=status_param)
            if date_param:
                qs = qs.filter(slot__date=date_param)
            return qs
        return Appointment.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        patient = user.patient_profile
        slot = serializer.validated_data['slot']
        # Double check availability in case of race conditions
        if Appointment.objects.filter(slot=slot).exclude(status=Appointment.Status.REJECTED).exists():
            raise serializers.ValidationError({"slot_id": "This slot has just been taken."})
        
        serializer.save(patient=patient, doctor=slot.doctor)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        appointment = self.get_object()
        user = request.user
        if user.role not in ['DOCTOR', 'ADMIN']:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        if user.role == 'DOCTOR' and appointment.doctor.user != user:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        
        appointment.status = Appointment.Status.APPROVED
        appointment.save()
        return Response(self.get_serializer(appointment).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        appointment = self.get_object()
        user = request.user
        if user.role not in ['DOCTOR', 'ADMIN']:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        if user.role == 'DOCTOR' and appointment.doctor.user != user:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        
        appointment.status = Appointment.Status.REJECTED
        appointment.save()
        return Response(self.get_serializer(appointment).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        if appointment.patient.user != request.user and request.user.role != 'ADMIN':
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        
        appointment.status = Appointment.Status.CANCELLED
        appointment.save()
        return Response(self.get_serializer(appointment).data)


class AdminDoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.select_related('user').all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        data = request.data
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        specialization = data.get('specialization')
        
        if not all([email, password, name, specialization]):
            return Response({'detail': 'email, password, name, specialization are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'detail': 'User with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=email, email=email, password=password, role=User.Roles.DOCTOR)
        doctor = Doctor.objects.create(user=user, name=name, specialization=specialization, phone=data.get('phone', ''))
        return Response(self.get_serializer(doctor).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Manually update user email if provided
        data = request.data
        if 'email' in data:
            user = instance.user
            user.email = data['email']
            user.username = data['email']
            user.save()
            
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = instance.user
        instance.delete()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminPatientListView(generics.ListAPIView):
    queryset = Patient.objects.select_related('user').all()
    permission_classes = [IsAdmin]

    class OutputSerializer(serializers.ModelSerializer):
        email = serializers.EmailField(source='user.email')

        class Meta:
            model = Patient
            fields = ['id', 'full_name', 'age', 'gender', 'phone', 'medical_history', 'email']

    serializer_class = OutputSerializer
