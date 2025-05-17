import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender = self.scope["url_route"]["kwargs"]["sender"]
        self.receiver = self.scope["url_route"]["kwargs"]["receiver"]

        # Создание названия комнаты
        ids = sorted([self.sender, self.receiver])
        self.room_group_name = f"chat_{ids[0]}_{ids[1]}"

        # Добавляем соединение в группу
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Receives a message from a client, saves it in the database and sends it to other clients.
        """
        try:
            data = json.loads(text_data)

            # 🔍 Логируем данные, которые пришли от клиента
            print("Received client message:", data, flush=True)
            data = json.loads(text_data)
            user = data.get("user")
            message = data.get("message")
            sender = data.get("sender")
            receiver = data.get("receiver")

            if not all([user, message, sender, receiver]):
                print("⚠️ Lack of data:", data, flush=True)
                return

            # Сохраняем в базу данных
            serialized_message = await self.save_message(
                user, sender, receiver, message
            )
            # Отправляем обратно в группу (всем подключённым клиентам)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message_data": serialized_message,
                },
            )
        except Exception as e:
            print("Error in receive():", str(e), flush=True)

    async def chat_message(self, event):
        """
        Sends data via WebSocket to the client
        """
        await self.send(text_data=json.dumps(event["message_data"]))

    @database_sync_to_async
    def save_message(self, user, sender, receiver, message):
        from .models import ChatMessage
        from .serializers import ChatMessageSerializer

        User = get_user_model()

        user = User.objects.get(id=user)
        sender = User.objects.get(id=sender)
        receiver = User.objects.get(id=receiver)
        msg_obj = ChatMessage.objects.create(
            user=user, sender=sender, receiver=receiver, message=message
        )
        return ChatMessageSerializer(msg_obj).data
