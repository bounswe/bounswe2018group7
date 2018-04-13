"""twitterApiProject URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from rest_framework.urlpatterns import format_suffix_patterns
from Api import views
from Ui import views as ui_views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/memory_posts/create.json', views.createMemoryPost.as_view()),
    url(r'^api/memory_posts/search.json', views.searchMemoryPosts.as_view()),
    url(r'^api/memory_posts/all.json', views.allMemoryPosts.as_view()),
    url(r'^api/memory_posts/geturl.json/$', views.getOnlyUrlsTweet.as_view()),
    url(r'^ui/get_only_url_tweets', ui_views.getUrlsUi,name="geturl"),
]
