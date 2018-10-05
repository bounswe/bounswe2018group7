from django.urls import path

from .views.auth import views_v1 as auth_views_v1
from .views.memory_post import views_v1 as memory_post_views_v1

app_name = 'api'

urlpatterns = [
    # AUTH
    path('v1/signin/', auth_views_v1.sign_in),
    path('v1/signup/', auth_views_v1.sign_up),

    # Memory Posts
    path('v1/memory_posts/', memory_post_views_v1.response),
]
