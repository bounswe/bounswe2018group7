from django.conf.urls import url

from api.views.v1.annotation_views import AnnotationView
from .views.v1.reaction_views import ReactionView
from .views.v1.comment_views import CommentView
from .views.v1.auth_views import SignUpView, SignInView, SignOutView, EmailConfirmationView, PasswordResetView
from .views.v1.memory_post_views import MemoryPostView
from .views.v1.profile_views import ProfileView

app_name = 'api'

urlpatterns = [
	url(r'^v1/signup/?$', SignUpView.as_view()),
	url(r'^v1/signin/?$', SignInView.as_view()),
	url(r'^v1/signout/?$', SignOutView.as_view()),
	url(r'^v1/email_confirmation/?$', EmailConfirmationView.as_view()),
	url(r'^v1/password_reset/?$', PasswordResetView.as_view()),

	url(r'^v1/memory_posts/?(/(?P<id>\d+)/?)?$', MemoryPostView.as_view()),

	url(r'^v1/comments/?(/(?P<id>\d+)/?)?$', CommentView.as_view()),

	url(r'^v1/reactions/?(/(?P<id>\d+)/?)?$', ReactionView.as_view()),

	url(r'^v1/profiles/?(/(?P<username>[^/]+)/?)?$', ProfileView.as_view()),

	url(r'^v1/annotations/?(/(?P<id>\d+)/?)?$', AnnotationView.as_view())
]
