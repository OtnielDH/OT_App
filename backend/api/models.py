from django.db import models

# Create your models here.
class Project(models.Model):
    id = models.CharField(primary_key=True, max_length=10)
    name = models.CharField(max_length=50)
    is_enabled = models.BooleanField(default=True)

    class Meta:
        db_table = 'projects'
        managed = False

    def __str__(self):
        return self.name

class Employee(models.Model):
    emp_id = models.CharField(primary_key=True, max_length=10)
    name = models.CharField(max_length=100)
    employee_code = models.CharField(max_length=20)
    is_enabled = models.BooleanField(default=True)

    class Meta:
        db_table = 'employees'
        managed = False

    def __str__(self):
        return self.name