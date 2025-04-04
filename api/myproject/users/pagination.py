from rest_framework.pagination import PageNumberPagination


class NinePerPagePagination(PageNumberPagination):
    page_size = 9


class TwentyPerPagePagination(PageNumberPagination):
    page_size = 20
