import datetime
from smtplib import SMTPException

from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail
from django.db import models, IntegrityError
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.template.loader import render_to_string
from jsonfield import JSONField
from rest_framework.authtoken.models import Token

from hiStoryBackend import settings


class User(AbstractUser):
    email = models.EmailField(
        null=False,
        unique=True,
        db_index=True
    )

    confirmed = models.BooleanField(null=False, default=False)
    confirmation_token = models.CharField(
        max_length=40,
        unique=True,
        db_index=True,
        null=True,
        blank=True,
        default=None
    )

    password_reset_token = models.CharField(
        max_length=40,
        unique=True,
        db_index=True,
        null=True,
        blank=True,
        default=None
    )

    @property
    def admin(self):
        return self.is_staff

    @property
    def banned(self):
        return not self.is_active

    def ban(self, ban):
        """
        Ban or unban the User
        :param ban: True, if the User should be banned. Otherwise, False
        :return: None
        """
        self.is_active = not ban
        self.save(update_fields=['is_active'])
        if ban:
            try:
                self.auth_token.delete()
            except User.auth_token.RelatedObjectDoesNotExist:
                pass

    def create_token_for(self, token_field_name):
        """
        Creates an email confirmation token or password reset token for this User and saves to database.
        :return: None
        """
        while True:
            if token_field_name == 'confirmation_token':
                self.confirmation_token = Token().generate_key()
            else:
                self.password_reset_token = Token().generate_key()

            try:
                self.save(update_fields=[token_field_name])
                break
            except IntegrityError:  # If token is not unique
                continue

    def send_confirmation_email(self):
        """
        Creates an email confirmation token for this User and saves to database.
        Then, sends a confirmation email to the User.
        :return: True, if process is successful. False, otherwise.
        """
        self.create_token_for('confirmation_token')

        text_message = render_to_string('../templates/auth/email_confirmation.txt',
                                        {'user': self, 'base_url': settings.FRONTEND_CONFIRMATION_BASE_URL})
        html_message = render_to_string('../templates/auth/email_confirmation.html',
                                        {'user': self, 'base_url': settings.FRONTEND_CONFIRMATION_BASE_URL})

        try:
            sent_email_count = send_mail(
                'hiStory - Email Confirmation',
                text_message,
                settings.GMAIL_USERNAME,
                [self.email],
                html_message=html_message
            )
            return sent_email_count != 0
        except SMTPException:
            return False

    def send_password_reset_email(self):
        """
        Creates a password reset token for this User and saves to database.
        Then, sends a password reset email to the User.
        :return: True, if process is successful. False, otherwise.
        """
        self.create_token_for('password_reset_token')

        text_message = render_to_string('../templates/auth/password_reset.txt',
                                        {'user': self, 'base_url': settings.FRONTEND_PASSWORD_RESET_BASE_URL})
        html_message = render_to_string('../templates/auth/password_reset.html',
                                        {'user': self, 'base_url': settings.FRONTEND_PASSWORD_RESET_BASE_URL})

        try:
            sent_email_count = send_mail(
                'hiStory - Password Reset',
                text_message,
                settings.GMAIL_USERNAME,
                [self.email],
                html_message=html_message
            )
            return sent_email_count != 0
        except SMTPException:
            return False


# hiStory Models


class BaseModel(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class MemoryPost(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    story = JSONField()
    time = JSONField()
    location = JSONField()


def upload_memory_media_to(instance, filename):
    """
    Returns a custom name for the file stored in 'file' field of Memory Media.
    :param instance: MemoryMedia object
    :param filename: Name of the file stored in 'file' field
    :return: A string in the format <memory_post_id>_<year>-<month>-<day>_<hour>_<minute>_<second>_<original_file_name>
    """
    return 'memory_post/{0}_{1}_{2}_{3}'.format(
        instance.memory_post.id,
        instance.order,
        datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S'),
        filename
    )


class MemoryMedia(BaseModel):
    memory_post = models.ForeignKey(MemoryPost, on_delete=models.CASCADE)
    type = models.CharField(max_length=64)
    order = models.IntegerField()
    file = models.FileField(upload_to=upload_memory_media_to)


@receiver(post_delete, sender=MemoryMedia)
def submission_delete(sender, instance, **kwargs):
    """
    This method makes sure to delete the actual file when the related MemoryMedia object is deleted.
    """
    instance.file.delete(False)
