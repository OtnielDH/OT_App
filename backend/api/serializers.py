from rest_framework import serializers
from .models import Project, Employee

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'is_enabled']

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['emp_id', 'name', 'employee_code', 'is_enabled']