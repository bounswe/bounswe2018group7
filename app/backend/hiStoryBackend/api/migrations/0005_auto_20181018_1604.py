# Generated by Django 2.1.2 on 2018-10-18 16:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_user_confirmation_token'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='confirmation_token',
            field=models.CharField(blank=True, db_index=True, default=None, max_length=40, null=True, unique=True),
        ),
    ]