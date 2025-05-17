from django.contrib import admin

from .models import CustomUser, ToDo, ChatMessage


class UserAdmin(admin.ModelAdmin):
    list_display = ["email"]


class TodoAdmin(admin.ModelAdmin):
    list_editable = ["is_completed"]
    list_display = ["user", "text", "is_completed", "created_at"]


class ChatMessageAdmin(admin.ModelAdmin):
    list_editable = ["is_read", "message"]
    list_display = ["user", "sender", "receiver", "is_read", "message"]


admin.site.register(CustomUser, UserAdmin)
admin.site.register(ToDo, TodoAdmin)
admin.site.register(ChatMessage, ChatMessageAdmin)
