# Generated by Django 2.1.2 on 2018-10-27 14:52

from django.db import migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_memorymedia_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='memorypost',
            name='location',
            field=jsonfield.fields.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='memorypost',
            name='story',
            field=jsonfield.fields.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='memorypost',
            name='time',
            field=jsonfield.fields.JSONField(blank=True, null=True),
        ),
    ]
