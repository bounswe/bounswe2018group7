from django import forms

class PostCreateForm(forms.Form):
    story = forms.CharField()
    username = forms.CharField()
    tags = forms.CharField(required=False)
