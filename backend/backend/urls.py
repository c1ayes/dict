from django.contrib import admin
from django.urls import path
from translator.views import Translate, SaveWord, DeleteWord, UpdateWord, Essay, RegisterView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/translate/', Translate.as_view()),
    path('api/save/', SaveWord.as_view()),
    path('api/delete/<int:pk>/', DeleteWord.as_view()),
    path('api/update/<int:pk>/', UpdateWord.as_view()),
    path('api/essay/', Essay.as_view()),

    path('api/auth/register/', RegisterView.as_view()),
    path('api/auth/login/', TokenObtainPairView.as_view()),
    path('api/auth/refresh/', TokenRefreshView.as_view()),
    path('api/auth/logout/', TokenBlacklistView.as_view()),
]
