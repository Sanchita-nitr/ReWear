from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import OTPVerification

User = get_user_model()


class OTPSendSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        email = value.lower()
        if not email.endswith('@gmail.com'):
            raise serializers.ValidationError('Only @gmail.com addresses are allowed.')
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError('No user found with this email address.')
        return email

    def create(self, validated_data):
        email = validated_data['email']
        OTPVerification.objects.filter(email=email).delete()
        otp_obj = OTPVerification.objects.create(email=email)

        subject = 'Your OTP for Verification'
        context = {
            'otp': otp_obj.otp,
            'expiry_minutes': getattr(settings, 'OTP_EXPIRY_MINUTES', 30),
        }
        html_message = render_to_string('otp_email.html', context)
        plain_message = strip_tags(html_message)

        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        return otp_obj


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data['email'].lower()
        otp = data['otp']
        try:
            otp_obj = OTPVerification.objects.get(email=email, otp=otp)
        except OTPVerification.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Invalid email or OTP.'})

        if otp_obj.is_expired():
            otp_obj.delete()
            raise serializers.ValidationError({'detail': 'OTP has expired.'})

        data['otp_obj'] = otp_obj
        return data

    def create(self, validated_data):
        otp_obj = validated_data['otp_obj']
        otp_obj.is_verified = True
        otp_obj.save(update_fields=['is_verified'])
        return otp_obj


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'number', 'is_verified',
            'created_at', 'updated_at',
            'is_staff', 'is_superuser'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at',
            'is_verified', 'is_staff', 'is_superuser'
        ]


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True,
        style={'input_type': 'password'},
        min_length=8
    )
    otp = serializers.CharField(
        write_only=True, required=True,
        max_length=6
    )

    class Meta:
        model = User
        fields = [
            'email', 'password', 'otp',
            'first_name', 'last_name',
            'number'
        ]
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name' : {'required': True},
            'number'    : {'required': True},
        }

    def validate_email(self, value):
        email = value.lower()
        if not email.endswith('@gmail.com'):
            raise serializers.ValidationError('Only @gmail.com addresses are allowed.')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return email

    def validate(self, data):
        email = data['email']
        otp = data['otp']
        try:
            otp_obj = OTPVerification.objects.get(email=email, otp=otp, is_verified=True)
        except OTPVerification.DoesNotExist:
            raise serializers.ValidationError({'otp': 'Invalid or unverified OTP.'})

        if otp_obj.is_expired():
            otp_obj.delete()
            raise serializers.ValidationError({'otp': 'OTP has expired.'})

        data['otp_obj'] = otp_obj
        return data

    def create(self, validated_data):
        # Remove OTP from user-creation payload
        validated_data.pop('otp')
        validated_data.pop('otp_obj')

        email = validated_data['email']
        password = validated_data.pop('password')

        user = User.objects.create_user(
            email=email,
            password=password,
            **validated_data
        )
        user.is_verified = True
        user.save(update_fields=['is_verified'])
        return user



class UserUpdateSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(
        write_only=True, required=False,
        style={'input_type': 'password'}
    )
    password = serializers.CharField(
        write_only=True, required=False,
        style={'input_type': 'password'},
        min_length=8
    )
    email = serializers.EmailField(read_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name',
            'number', 'current_password', 'password'
        ]

    def validate(self, data):
        curr = data.get('current_password')
        new_pw = data.get('password')
        if new_pw and not curr:
            raise serializers.ValidationError({
                'current_password': 'Current password is required to set a new password.'
            })
        if curr and not self.instance.check_password(curr):
            raise serializers.ValidationError({
                'current_password': 'Current password is incorrect.'
            })
        return data

    def update(self, instance, validated_data):
        validated_data.pop('current_password', None)
        new_pw = validated_data.pop('password', None)

        for attr, val in validated_data.items():
            setattr(instance, attr, val)

        if new_pw:
            instance.set_password(new_pw)

        instance.save()
        return instance