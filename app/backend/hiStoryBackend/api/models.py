from django.core.validators import RegexValidator, EmailValidator
from django.db import models


class User(models.Model):
    username = models.CharField(null=False,
                                unique=True,
                                max_length=32,
                                validators=[RegexValidator(r'^[a-zA-Z][a-zA-Z0-9]+$')],
                                db_index=True
                                )
    email = models.CharField(null=False,
                             unique=True,
                             max_length=255,
                             validators=[EmailValidator],
                             db_index=True
                             )
    password_hash = models.CharField(null=False,
                                     max_length=255
                                     )
    real_name = models.CharField(max_length=255,
                                 validators=[RegexValidator(r'^[a-zA-Z]{2,}[a-zA-Z ]*$')]
                                 )

    admin = models.BooleanField(null=False, default=False)
    banned = models.BooleanField(null=False, default=False)
    logged_in = models.BooleanField(null=False, default=False)
    confirmed = models.BooleanField(null=False, default=False)
    confirmation_token = models.CharField(blank=True,
                                          max_length=255
                                          )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
