from django.db import models
from django.utils.timezone import now
import json
import os


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(default=now, editable=False, db_index=True)
    updated_at = models.DateTimeField(default=now, editable=False)

    def save(self, *args, **kwargs):
        if not self.pk:     # On;y on creation
            self.created_at = now()
        self.updated_at = now()
        super().save(*args, **kwargs)

    class Meta:
        abstract = True

# Create your models here.
class Project(TimestampedModel):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    is_enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Employee(TimestampedModel):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    emp_id = models.CharField(max_length=20)
    is_enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    

class OvertimeRequest(TimestampedModel):
    id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    employee_name = models.CharField(max_length=100, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=50, blank=True)   
    request_date = models.DateField()
    time_start = models.TimeField()
    time_end = models.TimeField()
    total_hours = models.DecimalField(max_digits=4, decimal_places=2)
    has_break = models.BooleanField(default=False)
    break_start = models.TimeField(null=True, blank=True)
    break_end = models.TimeField(null=True, blank=True)
    break_hours = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee.name} - {self.request_date}"