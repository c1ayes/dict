from django.db import models
from django.contrib.auth.models import User

class Word(models.Model):
    original = models.CharField(max_length=250)
    translated = models.CharField(max_length=250)
    theme = models.CharField(max_length=250, default='common')
    learnt = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)