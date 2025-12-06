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
        slots = doctor.slots.all()
        serializer = SlotSerializer(slots, many=True)
        return Response(serializer.data)


class SlotViewSet(viewsets.ModelViewSet):
    serializer_class = SlotSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        return Slot.objects.filter(doctor__user=self.request.user)

    def perform_create(self, serializer):
        doctor = self.request.user.doctor_profile
        serializer.save(doctor=doctor)


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Use role-specific permissions only where necessary; otherwise rely on IsAuthenticated
        if self.action == 'create':
            # Only patients can create appointments; role is further checked in get_queryset/perform_create
            permission_classes = [IsPatient]
        elif self.action == 'list':
            # All authenticated roles can list; role-based scoping is in get_queryset
            permission_classes = [IsAuthenticated]
        elif self.action in ['approve', 'reject']:
            # Any authenticated user reaches the view; role/ownership checks happen in the action methods
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
        appointment = serializer.save(patient=patient, doctor=slot.doctor)
        return appointment

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
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)

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
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)


class AdminDoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.select_related('user').all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        # Admin creates a new doctor user + profile
        data = request.data
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        specialization = data.get('specialization')
        phone = data.get('phone', '')
        if not all([email, password, name, specialization]):
            return Response({'detail': 'email, password, name, specialization are required.'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=email, email=email, password=password, role=User.Roles.DOCTOR)
        doctor = Doctor.objects.create(user=user, name=name, specialization=specialization, phone=phone)
        serializer = self.get_serializer(doctor)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data
        instance.name = data.get('name', instance.name)
        instance.specialization = data.get('specialization', instance.specialization)
        instance.phone = data.get('phone', instance.phone)
        instance.save()
        if 'email' in data:
            instance.user.email = data['email']
            instance.user.username = data['email']
            instance.user.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = instance.user
        self.perform_destroy(instance)
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
