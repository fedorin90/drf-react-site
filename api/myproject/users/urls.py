from django.urls import path, include

from .views import GoogleLoginView

urlpatterns = [
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
    path("auth/google/", GoogleLoginView.as_view(), name="google_login"),
]
