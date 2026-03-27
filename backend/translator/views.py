from rest_framework.views import APIView
from rest_framework.response import Response
from deep_translator import GoogleTranslator
from .serializers import WordSerializer, SaveSerializer, RegisterSerializer
from rest_framework import status
from rest_framework import generics
from .models import Word
import random
from rest_framework.permissions import IsAuthenticated

class Translate(APIView):
    def post(self, request):
        serializer = WordSerializer(data = request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            original = data['text']
            from_lang = data['from_lang']
            to_lang = data['to_lang']
            translated = GoogleTranslator(source=from_lang, target=to_lang).translate(original)
            return Response({'translation': translated}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SaveWord(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SaveSerializer
    def get_queryset(self):
        return Word.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

class DeleteWord(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SaveSerializer
    def get_queryset(self):
        return Word.objects.filter(user=self.request.user)
    

class UpdateWord(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SaveSerializer
    def get_queryset(self):
        return Word.objects.filter(user=self.request.user)
    

class Essay(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        themes = Word.objects.filter(user=request.user).exclude(theme = 'common').values_list('theme', flat=True)
        if list(themes):
            random_theme = random.choice(themes)
        else:
            random_theme = 'Свободная тема(отсутсвуют темы)'
        commonWords = list(Word.objects.filter(user = request.user,theme = 'common', learnt = False).values_list('translated', flat=True))
        randomCommonWords = []
        if commonWords:
            word_number = random.randint(1, len(commonWords))
            randomCommonWords = random.sample(commonWords, word_number)
        else:
            randomCommonWords = 'У вас нет обычных слов'

        return Response({'random_theme':random_theme, 'randomCommonWords': randomCommonWords})


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': "Пользователь успешно создан."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)