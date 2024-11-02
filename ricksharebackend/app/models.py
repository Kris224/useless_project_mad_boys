from django.db import models
import uuid

class Trip(models.Model):
    id = models.CharField(max_length=36,primary_key=True,default=uuid.uuid4)
    name = models.CharField(max_length=100)
    starting = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    date = models.DateField()
    time =  models.TimeField()
    created_by = models.ForeignKey("user.User",related_name='created_trips',on_delete=models.CASCADE)

class Tripmate(models.Model):
    trip = models.ForeignKey(Trip,related_name='tripmates',on_delete=models.CASCADE)
    member = models.ForeignKey("user.User",related_name='joined_trips',on_delete=models.CASCADE)
