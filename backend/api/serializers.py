from rest_framework import serializers
from .models import Project, Employee
from .models import OvertimeRequest

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'is_enabled']

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'emp_id', 'is_enabled']

class OvertimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OvertimeRequest
        fields = '__all__'