from django.db import models

# Create your models here.

class CreateTweet(models.Model):
    story=models.CharField(max_length=200)
    username=models.CharField(max_length=100)
    tags=models.CharField(max_length=100)
