from Api.twitter_keys import TwitterKeys
import tweepy
import re

def searchTweets(memory_post):
	# Sets authorization for Twitter API
	
	auth = tweepy.OAuthHandler(TwitterKeys.CONSUMER_KEY, TwitterKeys.CONSUMER_SECRET)
	auth.set_access_token(TwitterKeys.ACCESS_TOKEN, TwitterKeys.ACCESS_SECRET)

	api = tweepy.API(auth)

	try:
		userTweets = tweepy.Cursor(api.user_timeline,id='history_g7',tweet_mode='extended').items()
	except:
		return error('RETRIEVAL_ERROR')

	
	data = {}
	if 'username' in memory_post:		# Checks for 'username' key in `memory_post`
		# We are searching tweets by 'username'
		username = memory_post['username'].split()[0]		# Discards the words except the first one.

		if len(username) < 3:
			return error('USERNAME_LENGTH_UNDER_50')
		for tweet in userTweets:
			if "AUTHOR: " in tweet.full_text:
				if (username == tweet.full_text.split("AUTHOR: ")[1].split(" ")[0]):
					data[tweet.id] = {'body' : tweet.full_text, 'created_at' : tweet.created_at}

	elif 'tags' in memory_post: #Checks for 'tags' key in 'memory_post'
		# We are searching tweets by 'tags'
		tags = memory_post['tags']
		if type(tags) != list:		# Expects 'tags' to be a List
			return error('INVALID_TAGS_FORMAT')

		for tweet in userTweets:
			contains_all_tags = 1
			for tag in tags:
				if re.search("#" + tag , tweet.full_text) == None:
					contains_all_tags = 0
			if contains_all_tags:
				data[tweet.id] = {'body' : tweet.full_text, 'created_at' : tweet.created_at}
	else:
		return error('INVALID_SEARCH')


	return success(data)



def error(message):
	return {
		'result' : 'error',
		'message' : message
		}


def success(data):
	return {
		'result' : 'success',
		'data' : data
		}
