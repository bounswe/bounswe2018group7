from django.conf.urls import url
from django.contrib import admin
from rest_framework.urlpatterns import format_suffix_patterns
from Api import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^create/$', views.createMemoryPost.as_view(),name='create'),
    url(r'^api/memory_posts/search.json', views.searchMemoryPosts.as_view(),name='search'),
    url(r'^api/memory_posts/all.json', views.allMemoryPosts.as_view(),name='all'),
    url(r'^geturl/$', views.findOnlyUrlTweet.as_view(),name='geturl'),
    url(r'^', views.index.as_view(),name='index'),
]
