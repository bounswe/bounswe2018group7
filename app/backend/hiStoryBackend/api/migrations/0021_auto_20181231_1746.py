# Generated by Django 2.1.2 on 2018-12-31 17:46

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_mediaupload'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mediaupload',
            name='file',
            field=models.FileField(db_index=True, upload_to=api.models.upload_media_to),
        ),
    ]