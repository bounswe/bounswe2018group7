from  django import forms

from .models import *


class CreateTweet(forms.ModelForm):
    class Meta:
        model = CreateTweet
        fields = ('story', 'username','tags')