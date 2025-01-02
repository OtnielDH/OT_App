import calendar
from django.db import models
from django.utils.timezone import now
from django.utils import timezone
from django.conf import settings
from django.db import transaction
import json
import os
from .utils.excel_generator import ExcelGenerator


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
    is_weekend = models.BooleanField(default=False)
    is_holiday = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Auto-calculate is_weekend based on request_date
        if self.request_date:
            self.is_weekend = calendar.weekday(
                self.request_date.year, 
                self.request_date.month, 
                self.request_date.day
            ) >= 5  # 5=Saturday, 6=Sunday
        super().save(*args, **kwargs)


    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.employee.name} - {self.request_date}"
    
    @classmethod
    def export_daily_json(cls, date):
        try:
            export_dir = "D:/Project/VSCode/OT_app/data"
            print(f"Starting export for date: {date}")
            os.makedirs(export_dir, exist_ok=True)
            filename = date.strftime('%Y%m%d.json')
            filepath = os.path.join(export_dir, filename)
            
            # Get data inside transaction
            with transaction.atomic():
                daily_requests = list(cls.objects
                    .select_for_update()
                    .filter(request_date=date)
                    .select_related('employee', 'project')
                    .order_by('time_start'))
            
            # Process data outside transaction
            export_data = [{
                "employee_id": request.employee.emp_id,
                "employee_name": request.employee.name,
                "project": request.project.name,
                "time_start": request.time_start.strftime('%H:%M'),
                "time_end": request.time_end.strftime('%H:%M'),
                "total_hours": str(request.total_hours),
                "has_break": request.has_break,
                "break_start": request.break_start.strftime('%H:%M') if request.break_start else None,
                "break_end": request.break_end.strftime('%H:%M') if request.break_end else None,
                "break_hours": str(request.break_hours) if request.break_hours else None,
                "reason": request.reason,
                "is_weekend": request.is_weekend,
                "is_holiday": request.is_holiday,
                "created_at": timezone.localtime(request.created_at).strftime('%Y-%m-%d %H:%M:%S'),
                "updated_at": timezone.localtime(request.updated_at).strftime('%Y-%m-%d %H:%M:%S')
            } for request in daily_requests]

            # Write file outside transaction
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(export_data, f, indent=2, ensure_ascii=False)

            # Generate Excel after JSON
            if daily_requests:
                excel_path = os.path.join(export_dir, 'excel')
                os.makedirs(excel_path, exist_ok=True)
                
                excel_file, summary_file = ExcelGenerator.generate_excel_files(
                    export_data,
                    date
                )
                
                return {
                    'json_file': filepath,
                    'excel_file': excel_file,
                    'summary_file': summary_file
                }

            return filepath
        except Exception as e:
            print(f"Error exporting files: {str(e)}")
            raise
            
