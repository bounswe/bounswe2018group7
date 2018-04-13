from django import forms

class PostCreateForm(forms.Form):
    story = forms.CharField(widget=forms.Textarea)
    username = forms.CharField()
    tags = forms.CharField(required=False)
