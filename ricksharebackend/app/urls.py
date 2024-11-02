from django.urls import path
from .views import TripCardAPI, JoinTripAPI, RemoveMemberAPI, ExitFromTripAPI, TripDetailView

urlpatterns = [
    path('trip-card/', TripCardAPI.as_view(), name='trip_card'),  # GET for list and POST for creating a trip
    path('trip-card/<str:trip_id>/', TripDetailView.as_view(), name='trip_detail'), 
    path('trip-card/<str:trip_id>/join/', JoinTripAPI.as_view(), name='join_trip'),  # POST to join a trip
    path('trip-card/<str:trip_id>/remove/<str:member_id>/', RemoveMemberAPI.as_view(), name='remove_member'),   # POST to remove a member
    path('trip-card/<str:trip_id>/exit/', ExitFromTripAPI.as_view(), name='exit_from_trip'),  # POST to exit from a trip
]
