# Generated by Django 5.1.7 on 2025-03-31 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_alter_image_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='title',
            field=models.CharField(max_length=250, null=True),
        ),
    ]
