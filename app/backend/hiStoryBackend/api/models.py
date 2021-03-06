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


def upload_profile_picture_to(instance, filename):
    """
    Returns a custom name for the profile picture of User.
    :param instance: User object
    :param filename: Name of the file stored in 'profile_picture' field
    :return: A string in the format pp_<user_id>_<year>-<month>-<day>_<hour>_<minute>_<second>_<original_file_name>
    """
    return 'profile_picture/pp_{0}_{1}_{2}'.format(
        instance.id,
        datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S'),
        filename
    )


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

    profile_picture = models.ImageField(blank=True, null=True, default=None, upload_to=upload_profile_picture_to)

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
                settings.EMAIL_HOST_USER,
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
                settings.EMAIL_HOST_USER,
                [self.email],
                html_message=html_message
            )
            return sent_email_count != 0
        except SMTPException:
            return False


@receiver(post_delete, sender=User)
def delete_profile_picture(sender, instance, **kwargs):
    """
    This method makes sure to delete the profile picture when the related User object is deleted.
    """
    instance.profile_picture.delete(False)


# hiStory Models


class BaseModel(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class MemoryPost(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    story = JSONField(blank=True, default=[])
    time = JSONField(blank=True, null=True)
    tags = JSONField(blank=True, default=[])
    location = JSONField(blank=True, default=[])


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
def delete_memory_media_file(sender, instance, **kwargs):
    """
    This method makes sure to delete the actual file when the related MemoryMedia object is deleted.
    """
    instance.file.delete(False)


class Comment(BaseModel):
    user = models.ForeignKey(User, related_name='comments', on_delete=models.CASCADE)
    memory_post = models.ForeignKey(MemoryPost, related_name='comments', on_delete=models.CASCADE)
    content = models.TextField()


class Reaction(BaseModel):
    user = models.ForeignKey(User, related_name='reactions', on_delete=models.CASCADE)
    memory_post = models.ForeignKey(MemoryPost, related_name='reactions', on_delete=models.CASCADE)
    like = models.BooleanField()

    class Meta:
        unique_together = (('user', 'memory_post'),)


class Annotation(BaseModel):
    user = models.ForeignKey(User, related_name='annotations', on_delete=models.CASCADE)
    body = JSONField(db_index=True)
    target = JSONField(db_index=True)

    class Meta:
        unique_together = (('user', 'body', 'target'),)


@receiver(post_delete, sender=Annotation)
def delete_annotation_media_file(sender, instance, **kwargs):
    """
    This method makes sure to delete the media file when the related Annotation object is deleted.
    """
    id_key = instance.body.get('id')
    if id_key:
        try:
            media_upload = MediaUpload.objects.get(file__contains=id_key.split('/')[-1])
            media_upload.delete()
        except MediaUpload.DoesNotExist:
            pass


def upload_media_to(instance, filename):
    """
    Returns a custom name for the file stored in 'file' field of MediaUpload.
    :param instance: MediaUpload object
    :param filename: Name of the file stored in 'file' field
    :return: A string in the format <type>_<user_id>_<year>-<month>-<day>_<hour>_<minute>_<second>_<original_file_name>
    """
    return '{0}/{1}_{2}_{3}_{4}'.format(
        instance.type,
        instance.type,
        instance.user.id,
        datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S'),
        filename
    )


class MediaUpload(BaseModel):
    user = models.ForeignKey(User, related_name='media', on_delete=models.CASCADE)
    type = models.CharField(max_length=64)
    file = models.FileField(upload_to=upload_media_to, db_index=True)


@receiver(post_delete, sender=MediaUpload)
def delete_media_file(sender, instance, **kwargs):
    """
    This method makes sure to delete the actual file when the related MediaUpload object is deleted.
    """
    instance.file.delete(False)
