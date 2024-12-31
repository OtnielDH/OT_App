from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Project, Employee, OvertimeRequest
from rest_framework.filters import SearchFilter
from .serializers import ProjectSerializer, EmployeeSerializer, OvertimeSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.decorators import action
from datetime import datetime

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name'] 

    @swagger_auto_schema(
        operation_summary="List all projects",
        responses={200: ProjectSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create a project",
        request_body=ProjectSerializer,
        responses={201: ProjectSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name', 'emp_id']

    @swagger_auto_schema(
        operation_summary="List all employees",
        responses={200: EmployeeSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class OvertimeRequestViewSet(viewsets.ModelViewSet):
    queryset = OvertimeRequest.objects.all()
    serializer_class = OvertimeSerializer
    filter_backends = [SearchFilter]
    search_fields = ['employee__name', 'request_date']

    @swagger_auto_schema(
        operation_summary="List overtime requests",
        operation_description="Get list of overtime requests with optional employee and date filters",
        manual_parameters=[
            openapi.Parameter(
                name='employee',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                required=False,
                description="Filter by employee ID"
            ),
            openapi.Parameter(
                name='request_date',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_DATE,
                required=False,
                description="Filter by date (YYYY-MM-DD)"
            )
        ],
        responses={
            200: OvertimeSerializer(many=True),
            400: openapi.Response(
                description="Bad Request",
                examples={"application/json": {"error": "Invalid parameters"}}
            )
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        employee = self.request.query_params.get('employee')
        date = self.request.query_params.get('request_date')
        
        if employee:
            queryset = queryset.filter(employee=employee)
        if date:
            queryset = queryset.filter(request_date=date)
            
        return queryset


    @swagger_auto_schema(
        operation_summary="Create overtime request",
        request_body=OvertimeSerializer,
        responses={
            201: OvertimeSerializer(),
            400: "Validation Error"
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update overtime request",
        request_body=OvertimeSerializer,
        responses={
            200: OvertimeSerializer(),
            404: "Not Found"
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @action(detail=False, methods=['post'])
    def export_json(self, request):
        try:
            print("Received export request:", request.data)
            date = datetime.strptime(request.data['date'], '%Y-%m-%d').date()
            print("Parsed date:", date)
            
            filepath = OvertimeRequest.export_daily_json(date)
            print("Export completed to:", filepath)
            
            return Response({
                'status': 'success',
                'message': f'JSON exported to {filepath}'
            })
        except Exception as e:
            print("Export error:", str(e))
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=400)