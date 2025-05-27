from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)

from django.db import models


class CustomUserManager(BaseUserManager):
    """Manager for creating a model with email instead of login"""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        admin_user = CustomUser.objects.filter(is_superuser=True).first()
        if admin_user:
            ChatMessage.objects.create(
                user=admin_user,
                sender=admin_user,
                receiver=user,
                message="Welcome to the site! We are glad to see you.",
                is_read=False,
            )

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """Custom user model with email instead of login"""

    email = models.EmailField(unique=True, null=False, blank=False)
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    avatar = models.ImageField(upload_to="user_images", default="default.jpg")
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return str(self.email)


class ToDo(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()

    def __str__(self):
        return str(self.text)


class Image(models.Model):
    title = models.CharField(null=True, max_length=250)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    unsplash_id = models.CharField(null=True, blank=True)
    url = models.URLField()
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.CharField(null=True, max_length=250)
    author_url = models.URLField(null=True)

    objects = models.Manager()


class ChatMessage(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user"
    )
    sender = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="sender"
    )
    receiver = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="receiver"
    )
    message = models.CharField(max_length=1000)
    is_read = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date"]
        verbose_name_plural = "Message"

    def __str__(self):
        return f"{self.sender} - {self.receiver}"

    @property
    def sender_profile(self):
        sender_profile = CustomUser.objects.get(email=self.sender.email)
        return sender_profile

    @property
    def receiver_profile(self):
        receiver_profile = CustomUser.objects.get(email=self.receiver.email)
        return receiver_profile
