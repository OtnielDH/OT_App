# Generated by Django 5.1.4 on 2024-12-29 09:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='overtimerequest',
            old_name='break_end_time',
            new_name='break_end',
        ),
        migrations.RenameField(
            model_name='overtimerequest',
            old_name='break_start_time',
            new_name='break_start',
        ),
    ]