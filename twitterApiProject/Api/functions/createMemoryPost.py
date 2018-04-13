from Api.twitter_keys import TwitterKeys
import tweepy

def createMemoryPostTweet(memory_post):
	""" 
		Creates a Tweet in @hiStory_g7 account on Twitter.

		PARAMETERS:
		'memory_ post': A Dictionary object expected in the form:
		{
			'story': <A String of Tweet text>,
			'username': <A String of username>,
			'tags': <A List of Strings representing the hashtags of the Tweet. Each String should consists of a single word WITHOUT # sign.>
		}

		RETURNS:
			A Dictionary object consisting of two keys only: 'result' and 'message'.
			'result' will be either 'error' or 'success' (String).
			'message' will contain the posted Tweet in case of 'success'.
			'message' will contain a specific error message in case of 'error'.

		EXAMPLE: 
			{
				'story': 'According to a legend, Maiden's Tower was built by king who wished to protect his daughter from a prophecy telling that the daughter will die at her 18th birthday.',
				'username': 'ahmet_abi',
				'tags': ['uskudar', 'maidens', 'tower']
			}

		NOTES:
			* 'story' and 'username' fields are mandatory. 'tags' fied is optional.
			* If 'username' consists of multiple words, the words after the first one will be discarded.
			* If a tag in 'tags' consists of multiple words, the words after the first one will be discarded.
			* 'story' must be at least 50 characters long.
			* 'username' must be at least 3 characters long.
	"""

	if 'story' in memory_post:			# Checks for 'story' key in `memory_post`
		story = memory_post['story']
		if len(story) < 10:
			return error('STORY_LENGTH_UNDER_10')
	else:
		return error('MISSING_STORY')
		
	if 'username' in memory_post:		# Checks for 'username' key in `memory_post`
		username = memory_post['username'].split()[0]		# Discards the words except the first one.
		if len(username) < 3:
			return error('USERNAME_LENGTH_UNDER_3')
	else:
		return error('MISSING_USERNAME')

	tags = []						# Tags are optional
	if 'tags' in memory_post:		# Checks for 'tags' key in `memory_post`
		tags = memory_post['tags']
		if type(tags) != list:		# Expects 'tags' to be a List
			return error('INVALID_TAGS_FORMAT')

	hashtags = ["#{}".format(x.split()[0]) for x in tags if len(x) > 0]		# Prefixes each tag in 'tags' with # sign. Discards the words except the first one in each tag.
	tweet = "{text} AUTHOR: {author} {hashtags}".format(text = story, author = username, hashtags = ' '.join(hashtags))

	# Sets authorization for Twitter API
	auth = tweepy.OAuthHandler(TwitterKeys.CONSUMER_KEY, TwitterKeys.CONSUMER_SECRET)
	auth.set_access_token(TwitterKeys.ACCESS_TOKEN, TwitterKeys.ACCESS_SECRET)

	api = tweepy.API(auth)
	try:
		response = api.update_status(tweet)		 # Posts tweet
	except tweepy.TweepError as err:
		return error(str(err))
	
	return success(response.text)


def error(message):
	return {
			'result' : 'error',
			'message' : message
			}


def success(message):
	return {
			'result' : 'success',
			'message' : message
			}
