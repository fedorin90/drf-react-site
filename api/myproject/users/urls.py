from django.urls import path, include
from .views import GoogleLoginView
from rest_framework.routers import DefaultRouter
from .views import ToDoViewSet

router = DefaultRouter()
router.register(r"todos", ToDoViewSet, basename="todo")


urlpatterns = [
    path("todo-app/", include(router.urls)),
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
    path("auth/google/", GoogleLoginView.as_view(), name="google_login"),
]
