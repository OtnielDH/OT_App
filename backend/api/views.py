from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Project, Employee
from .serializers import ProjectSerializer, EmployeeSerializer

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
