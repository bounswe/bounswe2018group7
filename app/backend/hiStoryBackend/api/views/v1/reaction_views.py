from rest_framework import mixins, generics
from rest_framework.permissions import IsAuthenticated

from api.helpers.custom_helpers import IsOwnerOrAdmin
from api.models import Reaction
from api.serializers import ReactionSerializer
from api.helpers import json_response_helpers as jrh


class ReactionView(mixins.DestroyModelMixin,
                   generics.GenericAPIView):

    permission_classes = (IsAuthenticated, IsOwnerOrAdmin)
    queryset = Reaction.objects.all()
    serializer_class = ReactionSerializer
    lookup_field = 'id'

    def post(self, request, *args, **kwargs):
        try:
            reaction = Reaction.objects.get(user=request.user, memory_post_id=request.data.get('memory_post'))
            reaction_serializer = ReactionSerializer(reaction,
                                                     {'like': request.data.get('like')},
                                                     partial=True
                                                     )
        except Reaction.DoesNotExist:
            reaction_serializer = ReactionSerializer(data=request.data)

        if reaction_serializer.is_valid():
            reaction_serializer.save(user=request.user)
            return jrh.success(reaction_serializer.data)
        else:
            return jrh.fail(reaction_serializer.errors_arr)

    def delete(self, request, *args, **kwargs):
        if not kwargs.get("id"):
            return jrh.fail(["'id' URL parameter is missing."])

        return self.destroy(request, *args, **kwargs)  # Comes from DestroyModelMixin
