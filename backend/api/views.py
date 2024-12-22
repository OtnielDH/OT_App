from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Project, Employee, OvertimeRequest
from .serializers import ProjectSerializer, EmployeeSerializer, OvertimeSerializer

# Create your views here.

class SampleAPIView(APIView):
    def get(self, request):
        return Response({"message": "Hello from Django!"})
    
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class OvertimeRequestViewSet(viewsets.ModelViewSet):
    queryset = OvertimeRequest.objects.all()
    serializer_class = OvertimeSerializer

    def get_queryset(self):
        queryset = OvertimeRequest.objects.all()
        employee = self.request.query_params.get('employee', None)
        date = self.request.query_params.get('request_date', None)
        
        if employee and date:
            queryset = queryset.filter(
                employee=employee,
                request_date=date
            )
        return queryset