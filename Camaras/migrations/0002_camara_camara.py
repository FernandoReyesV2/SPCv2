# Generated by Django 5.1.2 on 2024-10-10 03:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Camaras', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='camara',
            name='camara',
            field=models.ImageField(blank=True, upload_to='camaras/'),
        ),
    ]