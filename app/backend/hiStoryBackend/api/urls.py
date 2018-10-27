from django.conf.urls import url
from .views.v1.auth_views import SignUpView, SignInView, SignOutView, EmailConfirmationView, PasswordResetView
from .views.v1.memory_post_views import MemoryPostView

app_name = 'api'

urlpatterns = [
    url(r'^v1/signup/?$', SignUpView.as_view()),
    url(r'^v1/signin/?$', SignInView.as_view()),
    url(r'^v1/signout/?$', SignOutView.as_view()),
    url(r'^v1/email_confirmation/?$', EmailConfirmationView.as_view()),
    url(r'^v1/password_reset/?$', PasswordResetView.as_view()),
    url(r'^v1/memory_posts/?$', MemoryPostView.as_view())
]
