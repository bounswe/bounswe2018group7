import tweepy

def retrieveAllTweets():
	# Sets authorization for Twitter API
	CONSUMER_KEY = 'JkVIMDAYOtg5MzhfTR3ngrXIQ'
	CONSUMER_SECRET = 'G1SsWHmLtzkPRZm3zMYxFakaPhNrvC56SPlAKXvz9idNiQAMDV'
	ACCESS_TOKEN = '981630640457240576-ZhcQ3CDiTNddIFJi10rsyBBcI0KwACl'
	ACCESS_SECRET = 'DSZGvnav3WdHzDnsfMAXzJTKnJJ0bjaDk82p8UyzwevED'
	auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
	auth.set_access_token(ACCESS_TOKEN,ACCESS_SECRET)

	api = tweepy.API(auth)

	#  get tweets of theUser

	theUser = 'hiStory_g7'

	userTweets = tweepy.Cursor(api.user_timeline,id=theUser).items()
	
	# print tweet info

	return userTweets

