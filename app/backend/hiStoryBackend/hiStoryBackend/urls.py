from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

urlpatterns = [
    path('', lambda request : homepage_json()),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls'))
]


# This response will be shown on the homepage of the server
def homepage_json():
    return JsonResponse(
        {
            'title': 'Backend of the Project of Group7/BOUN',
            'year': '2018',
            'project_title': 'Living History',
            'project_name': 'hiStory',
            'github_page': 'https://github.com/bounswe/bounswe2018group7',
            'api_details': 'https://github.com/bounswe/bounswe2018group7/wiki/API-Endpoints',
            'group_name': 'se7en',
            'group_members': [
                'Bekir Burak Aslan',
                'Cemal Burak Aygün',
                'Dilruba Reyyan Kılıç',
                'Enes Koşar',
                'Faik Emre Derin',
                'Muhammed Fatih Balın',
                'Ramazan Arslan',
                'Serdar Ada'
            ],
            'old_group_members': [
                'Ferhat Melih Dal',
                'Neval Tüllük'
            ]
        }
    )
