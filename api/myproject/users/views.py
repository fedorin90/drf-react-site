import logging
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Subquery, OuterRef, Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
import requests
from .serializers import GoogleAuthSerializer, ChatMessageSerializer, UserSerializer
from .models import ToDo, Image, ChatMessage
from .serializers import ToDoSerializer, ImageSerializer
from .pagination import NinePerPagePagination


logger = logging.getLogger(__name__)
User = get_user_model()


class GoogleLoginView(APIView):
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ToDoViewSet(viewsets.ModelViewSet):
    queryset = ToDo.objects.all()
    serializer_class = ToDoSerializer
    permission_classes = [IsAuthenticated]
    # pagination_class = TwentyPerPagePagination

    def get_queryset(self):
        return ToDo.objects.filter(user=self.request.user)

    @action(detail=False, methods=["delete"])
    def delete_all(self, request):
        self.queryset.delete()
        return Response(
            {"message": "All todos have been deleted"},
            status=status.HTTP_204_NO_CONTENT,
        )

    @action(detail=False, methods=["delete"])
    def delete_completed(self, request):
        completed_todos = self.queryset.filter(is_completed=True)
        count = completed_todos.count()
        completed_todos.delete()
        return Response(
            {"message": f"{count} completed todos deleted"},
            status=status.HTTP_204_NO_CONTENT,
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = NinePerPagePagination

    def get_queryset(self):
        return Image.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def retrieve_unsplash_image(self, request):
        query = request.query_params.get("query")
        if not query:
            return Response(
                {"error": "Query parameter is missing"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        headers = {"Authorization": f"Client-ID {settings.UNSPLASH_KEY}"}
        params = {"query": query}
        response = requests.get(settings.UNSPLASH_URL, headers=headers, params=params)

        try:
            response.raise_for_status()
            data = response.json()

            if "errors" in data:
                return Response(
                    {"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND
                )

            extracted_data = {
                "unsplash_id": data["id"],
                "url": data["urls"]["small"],
                "description": data.get("description")
                or data.get("alt_description")
                or "No description",
                "author": data["user"]["name"]
                or data["user"]["username"]
                or "No author",
                "author_url": data["user"]["links"]["html"]
                or data["user"]["portfolio_url"],
            }
        except requests.exceptions.HTTPError as e:
            return Response(
                {"error": str(e), "details": response.text}, status=response.status_code
            )
        except KeyError as e:
            return Response(
                {"error": f"Missing key in Unsplash response: {str(e)}"}, status=500
            )

        return Response(extracted_data)


class InboxView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        user_id = self.request.user.id
        user_kw_id = self.kwargs["user_id"]

        if str(user_id) != user_kw_id:
            return ChatMessage.objects.none()

        messages = ChatMessage.objects.filter(
            id__in=Subquery(
                User.objects.filter(
                    Q(sender__receiver=user_id) | Q(receiver__sender=user_id)
                )
                .distinct()
                .annotate(
                    last_msg=Subquery(
                        ChatMessage.objects.filter(
                            Q(sender=OuterRef("id"), receiver=user_id)
                            | Q(receiver=OuterRef("id"), sender=user_id)
                        )
                        .order_by("-id")[:1]
                        .values_list("id", flat=True)
                    )
                )
                .values_list("last_msg", flat=True)
                .order_by("-id")
            )
        ).order_by("-id")

        return messages


class GetMessages(generics.ListAPIView):
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        user_id = self.request.user.id
        sender_id = self.kwargs["sender_id"]
        receiver_id = self.kwargs["receiver_id"]

        if str(user_id) not in [sender_id, receiver_id]:
            return ChatMessage.objects.none()

        messages = ChatMessage.objects.filter(
            sender__in=[sender_id, receiver_id], receiver__in=[sender_id, receiver_id]
        )

        unread_incoming = messages.filter(receiver=user_id, is_read=False)
        unread_incoming.update(is_read=True)

        return messages


class SendMessage(generics.CreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        sender_id = self.request.user.id
        receiver_id = self.request.data.get("receiver")

        if sender_id != int(self.request.data.get("sender")):
            raise PermissionDenied("You can only send messages on your own behalf.")

        serializer.save(sender_id=sender_id, receiver_id=receiver_id)


class SearchUser(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        email = self.kwargs["email"]
        logged_in_user = self.request.user
        users = User.objects.filter(
            (
                Q(email__icontains=email)
                | Q(first_name__icontains=email)
                | Q(last_name__icontains=email)
            )
            & ~Q(id=logged_in_user.id)
        )

        if not users.exists():
            return Response(
                {"detail": "No users found."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
