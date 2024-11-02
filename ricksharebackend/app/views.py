from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from utils.permission import JWTUtils
from utils.response import CustomResponse
from utils.permission import JWTAuth
from .serializers import TripSerializer,TripDetailSerializer
from .models import Trip,Tripmate

class TripCardAPI(APIView):
    authentication_classes = [JWTAuth]
    
    def post(self, request):
        data = request.data.copy()
        user_id = JWTUtils.fetch_user_id(request)
        data['created_by'] = user_id
        serializer = TripSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse(message="New trip added").get_success_response()
        else:
            return CustomResponse(message=serializer.errors).get_failure_response()
    
    def get(self, request):
        search_name = request.query_params.get('name')
        search_starting = request.query_params.get('starting')
        search_destination = request.query_params.get('destination')
        search_date = request.query_params.get('date')
        search_created_by = request.query_params.get('created_by')

        filters = Q()
        if search_name:
            filters &= Q(name__icontains=search_name)
        if search_starting:
            filters &= Q(starting__icontains=search_starting)
        if search_destination:
            filters &= Q(destination__icontains=search_destination)
        if search_date:
            filters &= Q(date=search_date)

        trips = Trip.objects.filter(filters)
        serializer = TripSerializer(trips, many=True)
        return CustomResponse(response=serializer.data).get_success_response()
    

class JoinTripAPI(APIView):
    authentication_classes = [JWTAuth]

    def post(self, request, trip_id):
        user_id = JWTUtils.fetch_user_id(request)
        trip = get_object_or_404(Trip, id=trip_id)

        if trip.created_by_id == user_id:
            return CustomResponse(message="Trip owners cannot join their own trips").get_failure_response()

        total_members = Tripmate.objects.filter(trip=trip).count() + 1  # +1 to include the owner
        if total_members >= 4:
            return CustomResponse(message="This trip has reached its maximum capacity of 4 members").get_failure_response()

        if Tripmate.objects.filter(trip=trip, member_id=user_id).exists():
            return CustomResponse(message="You have already joined this trip").get_failure_response()

        Tripmate.objects.create(trip=trip, member_id=user_id)
        return CustomResponse(message="You have successfully joined the trip").get_success_response()

class RemoveMemberAPI(APIView):
    authentication_classes = [JWTAuth]

    def post(self, request, trip_id, member_id):
        user_id = JWTUtils.fetch_user_id(request)
        
        trip = get_object_or_404(Trip, id=trip_id)

        if trip.created_by_id != user_id:
            return CustomResponse(message="Only the trip owner can remove members").get_failure_response()

        tripmate = Tripmate.objects.filter(trip=trip, member_id=member_id).first()
        
        if not tripmate:
            return CustomResponse(message="This member is not part of the trip").get_failure_response()

        tripmate.delete()
        return CustomResponse(message="Member has been removed from the trip").get_success_response()


class ExitFromTripAPI(APIView):
    authentication_classes = [JWTAuth]

    def post(self, request, trip_id):
        user_id = JWTUtils.fetch_user_id(request)
        trip = get_object_or_404(Trip, id=trip_id)

        if trip.created_by_id == user_id:
            return CustomResponse(message="Trip owners cannot exit their own trips").get_failure_response()

        tripmate = Tripmate.objects.filter(trip=trip, member_id=user_id).first()
        if not tripmate:
            return CustomResponse(message="You are not part of this trip").get_failure_response()

        tripmate.delete()
        return CustomResponse(message="You have successfully exited the trip").get_success_response()
    
class TripDetailView(APIView):
    authentication_classes = [JWTAuth]

    def get(self, request, trip_id):
        trip = get_object_or_404(Trip, id=trip_id)
        serializer = TripDetailSerializer(trip)
        return CustomResponse(response=serializer.data).get_success_response()