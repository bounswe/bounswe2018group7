from smtplib import SMTPException

from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail
from django.db import models, IntegrityError
from django.template.loader import render_to_string
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

    @property
    def admin(self):
        return self.is_superuser

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

    def create_confirmation_token(self):
        """
        Creates an email confirmation token for this User and saves to database.
        :return: None
        """
        while True:
            self.confirmation_token = Token().generate_key()
            try:
                self.save(update_fields=['confirmation_token'])
                break
            except IntegrityError:  # If token is not unique
                continue

    def send_confirmation_email(self):
        """
        Creates an email confirmation token for this User and saves to database.
        Then, sends an confirmation email to the User.
        :return: True, if process is successsful. False, otherwise.
        """
        self.create_confirmation_token()

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
