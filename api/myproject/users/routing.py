from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(
        r"ws/users/(?P<sender>\d+)/(?P<receiver>\d+)/$",
        consumers.ChatConsumer.as_asgi(),
    ),
]
