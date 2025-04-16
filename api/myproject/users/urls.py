from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ToDoViewSet,
    ImageViewSet,
    GetMessages,
    GoogleLoginView,
    InboxView,
    SendMessage,
    SearchUser,
)

router = DefaultRouter()
router.register(r"todos", ToDoViewSet, basename="todo")
router.register(r"images", ImageViewSet, basename="image")


urlpatterns = [
    path("todo-app/", include(router.urls)),
    path("images-gallery/", include(router.urls)),
    # auth urls:
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
    path("auth/google/", GoogleLoginView.as_view(), name="google_login"),
    # inbox urls:
    path("my-inbox/<user_id>/", InboxView.as_view()),
    path("get-messages/<sender_id>/<reciever_id>/", GetMessages.as_view()),
    path("send-messages/", SendMessage.as_view()),
    path("search/<email>/", SearchUser.as_view()),
]
