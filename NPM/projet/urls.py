from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/utilisateurs/', include('utilisateurs.urls')),
]
from django.urls import path, include

urlpatterns = [
    path('api/utilisateurs/', include('utilisateurs.urls')),
]
