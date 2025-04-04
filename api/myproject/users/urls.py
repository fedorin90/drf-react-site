from django.urls import path, include
from .views import GoogleLoginView
from rest_framework.routers import DefaultRouter
from .views import ToDoViewSet, ImageViewSet

router = DefaultRouter()
router.register(r"todos", ToDoViewSet, basename="todo")
router.register(r"images", ImageViewSet, basename="image")


urlpatterns = [
    path("todo-app/", include(router.urls)),
    path("images-gallery/", include(router.urls)),
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
    path("auth/google/", GoogleLoginView.as_view(), name="google_login"),
]
