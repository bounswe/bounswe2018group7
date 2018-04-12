from Api.twitter_keys import TwitterKeys
import tweepy



def getTweetIncludeUrls():
    # Sets authorization for Twitter API
    auth = tweepy.OAuthHandler(TwitterKeys.CONSUMER_KEY, TwitterKeys.CONSUMER_SECRET)
    auth.set_access_token(TwitterKeys.ACCESS_TOKEN, TwitterKeys.ACCESS_SECRET)

    api = tweepy.API(auth)
    public_tweets = api.home_timeline()
    filterOnlyUrls=[]
    for tweet in public_tweets:
        if  str(tweet.text).__contains__("http"):
            filterOnlyUrls.append(tweet.text)

    return filterOnlyUrls
