from rest_framework import serializers
from .models import Trip,Tripmate

class TripSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ['id']
    
class TripmateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tripmate
        fields = ['member']  # You can also include other fields if necessary

class TripDetailSerializer(serializers.ModelSerializer):
    members = TripmateSerializer(many=True, source='tripmates')

    class Meta:
        model = Trip
        fields = ['id', 'name', 'starting', 'destination', 'date', 'time', 'created_by', 'members']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Modify members representation to show name and ID
        representation['members'] = [{'id': mate.member.id, 'name': mate.member.username} for mate in instance.tripmates.all()]
        return representation