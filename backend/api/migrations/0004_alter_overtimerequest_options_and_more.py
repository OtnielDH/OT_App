# Generated by Django 5.1.4 on 2025-01-02 01:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_overtimerequest_employee_name_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='overtimerequest',
            options={'ordering': ['-created_at']},
        ),
        migrations.AddField(
            model_name='overtimerequest',
            name='is_holiday',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='overtimerequest',
            name='is_weekend',
            field=models.BooleanField(default=False),
        ),
    ]