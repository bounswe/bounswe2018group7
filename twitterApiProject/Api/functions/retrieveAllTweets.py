from Api.twitter_keys import TwitterKeys
import tweepy

def retrieveAllTweets():
	# Sets authorization for Twitter API
	
	auth = tweepy.OAuthHandler(TwitterKeys.CONSUMER_KEY, TwitterKeys.CONSUMER_SECRET)
	auth.set_access_token(TwitterKeys.ACCESS_TOKEN, TwitterKeys.ACCESS_SECRET)

	api = tweepy.API(auth)

	userTweets = tweepy.Cursor(api.user_timeline,id='history_g7',tweet_mode='extended').items()
	
	data = {}
	
	for tweet in userTweets:
		data[tweet.id] = {'body' : tweet.full_text,
							'created_at' : tweet.created_at}
	
	return data