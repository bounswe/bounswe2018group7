from Api.twitter_keys import TwitterKeys
import tweepy



def getTweetIncludeUrls():
    # Sets authorization for Twitter API
    auth = tweepy.OAuthHandler(TwitterKeys.CONSUMER_KEY, TwitterKeys.CONSUMER_SECRET)
    auth.set_access_token(TwitterKeys.ACCESS_TOKEN, TwitterKeys.ACCESS_SECRET)

    api = tweepy.API(auth)
    userTweets = tweepy.Cursor(api.user_timeline, id='history_g7').items()

    filterOnlyUrls = []

    for tweet in userTweets:
        print(tweet.text.encode('utf-8'))
        if  str(tweet.text).__contains__("http"):
            filterOnlyUrls.append(tweet.text)
    return filterOnlyUrls
