from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import GoogleAuthSerializer


class GoogleLoginView(APIView):
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
