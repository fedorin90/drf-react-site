from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import GoogleAuthSerializer
from .models import ToDo
from .serializers import ToDoSerializer

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
