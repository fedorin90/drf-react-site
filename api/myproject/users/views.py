from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
import requests
from rest_framework.permissions import IsAuthenticated
from .serializers import GoogleAuthSerializer
from .models import ToDo, Image
from .serializers import ToDoSerializer, ImageSerializer
from .pagination import TwentyPerPagePagination, NinePerPagePagination

import logging

logger = logging.getLogger(__name__)


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
