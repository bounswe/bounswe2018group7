# Generated by Django 2.1.2 on 2018-10-27 11:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_memorymedia'),
    ]

    operations = [
        migrations.AddField(
            model_name='memorymedia',
            name='order',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
