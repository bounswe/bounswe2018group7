from random import randint

import requests
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import MemoryPost
from api.serializers import MemoryPostSerializer
from hiStoryBackend import settings


def get_distinct_random_ints(upper_bound, number_of_elements):
	"""
	Returns an Array with length `number_of_elements` containing distinct integers
	selected randomly from [0, `upper_bound]
	"""
	result = []
	while len(result) < number_of_elements:
		next_int = randint(0, upper_bound)
		if next_int not in result:
			result.append(next_int)

	return result


class RecommendationView(APIView):
	def get(self, request, format=None):
		number_of_random_user_posts_to_process = settings.REC_NUMBER_OF_RANDOM_USER_POSTS
		number_of_random_other_posts_to_process = settings.REC_NUMBER_OF_RANDOM_OTHER_POSTS
		number_of_max_memory_posts_to_return = settings.REC_NUMBER_OF_RESULTS

		user = request.user

		# Array of Arrays: [[<tag1>, <tag2>, ...], [<tag1>, <tag2>, ...], ...]
		user_post_tags = MemoryPost.objects.filter(user=user).values_list('tags', flat=True)
		number_of_user_posts = len(user_post_tags)

		if number_of_user_posts > number_of_random_user_posts_to_process:
			random_indices = get_distinct_random_ints(number_of_user_posts-1, number_of_random_user_posts_to_process)
			user_post_tags = [user_post_tags[i] for i in random_indices]

		# Array of Dicts [{'id': <id>, 'tags': [<tag1>, <tag2>, ...]}, ...]
		other_posts = MemoryPost.objects.exclude(user=user).values('id', 'tags')
		number_of_other_posts = len(other_posts)

		if number_of_other_posts > number_of_random_other_posts_to_process:
			random_indices = get_distinct_random_ints(number_of_other_posts-1, number_of_random_other_posts_to_process)
			other_posts = [other_posts[i] for i in random_indices]

		similarity_dict = {}  # Maps post <id> to <similarity>

		for user_tags in user_post_tags:
			if len(user_tags) == 0:
				continue

			request_body = ""

			for other_post in other_posts:  # other_post is in the form {'id': <id>, 'tags': [<tag1>, <tag2>, ...]}
				other_post_tags = other_post['tags']
				request_body += "{0} {1} {2} {3}\n".format(
					len(user_tags),
					len(other_post_tags),
					' '.join(user_tags),
					' '.join(other_post_tags)
				)

			if len(request_body) == 0:
				continue

			response = requests.get(settings.REC_REQUEST_URL, data=request_body)
			if response.ok:
				results = [float(similarity) for similarity in response.text.split('\n') if len(similarity) != 0]

				for i in range(0, len(other_posts)):
					other_post_id = other_posts[i]['id']
					result = results[i]

					if (other_post_id not in similarity_dict) or (result > similarity_dict[other_post_id]):
						similarity_dict[other_post_id] = result

		# Sorts `similarity_dict` by values (similarities) in decreasing order and gets an Array of <id>s
		sorted_ids = sorted(similarity_dict, key=similarity_dict.get, reverse=True)

		return Response(
			MemoryPostSerializer(
				MemoryPost.objects.filter(id__in=sorted_ids[0:number_of_max_memory_posts_to_return]),
				many=True,
				context={'request': request}
			).data
		)
