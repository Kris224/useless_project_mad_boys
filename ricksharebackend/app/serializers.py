from rest_framework import serializers
from .models import Trip,Tripmate

class TripSerializer(serializers.ModelSerializer):
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = ['id', 'name', 'starting', 'destination', 'date', 'time', 'created_by', 'is_member']
        read_only_fields = ['id']

    def get_is_member(self, instance):
        user = self.context.get('user')
        # Check if the user is in the list of tripmates for this trip
        return instance.created_by == user or Tripmate.objects.filter(trip=instance, member_id=user).exists()
    
class TripmateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tripmate
        fields = ['member']  # You can also include other fields if necessary

class TripDetailSerializer(serializers.ModelSerializer):
    members = TripmateSerializer(many=True, source='tripmates')
    is_member = serializers.SerializerMethodField()


    class Meta:
        model = Trip
        fields = ['id', 'name', 'starting', 'destination', 'date', 'time', 'created_by', 'is_member', 'members']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Modify members representation to show name and ID
        representation['members'] = [{'id': mate.member.id, 'name': mate.member.username} for mate in instance.tripmates.all()]
        return representation
    
    def get_is_member(self, instance):
        user = self.context.get('user')
        # Check if the user is in the list of tripmates for this trip
        return instance.created_by == user or Tripmate.objects.filter(trip=instance, member_id=user).exists()