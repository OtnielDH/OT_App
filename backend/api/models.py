from django.db import models

# Create your models here.
class Project(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    is_enabled = models.BooleanField(default=True)

    class Meta:
        db_table = 'projects'
        managed = False

    def __str__(self):
        return self.name

class Employee(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    emp_id = models.CharField(max_length=20)
    is_enabled = models.BooleanField(default=True)

    class Meta:
        db_table = 'employees'
        managed = False

    def __str__(self):
        return self.name
    

class OvertimeRequest(models.Model):
    id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    request_date = models.DateField()
    time_start = models.TimeField()
    time_end = models.TimeField()
    total_hours = models.DecimalField(max_digits=4, decimal_places=2)
    has_break = models.BooleanField(default=False)
    break_start_time = models.TimeField(null=True, blank=True)
    break_end_time = models.TimeField(null=True, blank=True)
    break_hours = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'overtime_requests'
        managed = False

    def __str__(self):
        return f"{self.employee.name} - {self.request_date}"