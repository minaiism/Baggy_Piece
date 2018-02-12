const Google = require('googleapis');

const Authorization = require('./authorization.js');

let YouTubeApi = {};
/**
 * Gets sorted list of links for given Youtube channel
 *
 * Example call:
 * getLinksByUsername("JessicaCornish", function (links) {
    console.log("Got: " + links.length + " links");
   });
 *
 * @param username Youtube channel username
 * @param callback returns a sorted list of video links
 */
class Video {
    constructor(link, title){
        this.link = link;
        this.title = title;
    }
}

YouTubeApi.getLinksByUsername = function (username, callback) {
    //TODO: Finish OAuth
    // Authorization.authorize((oauth2Client) => {
    //     getLinksFromPlaylist(oauth2Client, username, (items) => {
    //         let links = [];
    //
    //         items.sort((a, b) => {
    //             return b.statistics.viewCount - a.statistics.viewCount;
    //         });
    //
    //         items.forEach((item) => {
    //             if (typeof item.statistics.viewCount !== "undefined") {
    //                 let link = "https://www.youtube.com/watch?v=" + item.id;
    //                 console.log(link + " views: %s", item.statistics.viewCount);
    //                 links.push(link);
    //             }
    //         });
    //
    //         callback(links);
    //     });
    // });
    getLinksFromPlaylist(process.env.API_KEY, username, (videoItems) => {
        let links = [];

        videoItems.sort((a, b) => {
            return b.statistics.viewCount - a.statistics.viewCount;
        });

        videoItems.forEach((videoItem) => {
            if (typeof videoItem.statistics.viewCount !== "undefined") {
                let link = "https://www.youtube.com/watch?v=" + videoItem.id;
                let title = videoItem.snippet.title;

                let video = new Video(link, title);
                // console.log(link + " views: %s", video.statistics.viewCount);
                links.push(video);
            }
        });

        callback(links.splice(0,10));
    });
};

/**
 *
 * @param {Google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param playlistItemIds Videos id list to retrieve
 * @param callback YoutubeApi callback
 * @param videoItems Recurrence callback
 */
function getVideos(auth, playlistItemIds, callback, videoItems = []) {
    let service = Google.youtube('v3');
    let videoIdsStr = "";

    let reducedItemIdsArray = playlistItemIds;

    if (playlistItemIds.length > 50) {
        reducedItemIdsArray = playlistItemIds.splice(0, 50);
    } else {
        reducedItemIdsArray = playlistItemIds.splice(0, playlistItemIds.length);
    }

    reducedItemIdsArray.forEach((itemId) => {
        if (videoIdsStr === "") {
            videoIdsStr += itemId;
        } else {
            videoIdsStr += ",".concat(itemId)
        }
    });

    service.videos.list({
        auth: auth,
        part: "statistics, snippet",
        id: videoIdsStr
    }, (err, response) => {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        videoItems = videoItems.concat(response.items);

        if (playlistItemIds.length === 0) {
            callback(videoItems);
        } else {
            getVideos(auth, playlistItemIds, callback, videoItems);
        }
    });
}

/**
 * Retrieve all playlist items
 *
 * @param nextPageToken Token of the next query page
 * @param {Google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param playlistId Playlist id
 * @param callback YoutubeApi callback
 * @param playlistItemIds Recurrence callback
 */
function getPlaylistItems(nextPageToken, auth, playlistId, callback, playlistItemIds = []) {
    let service = Google.youtube('v3');
    let requestBody = {
        auth: auth,
        part: 'contentDetails',
        playlistId: playlistId,
        maxResults: 50
    };

    if (nextPageToken) {
        requestBody.pageToken = nextPageToken;
    }

    service.playlistItems.list(requestBody, (err, response) => {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        response.items.forEach((item) => {
            playlistItemIds.push(item.contentDetails.videoId);
        });

        if (response.nextPageToken) {
            getPlaylistItems(response.nextPageToken, auth, playlistId, callback, playlistItemIds);
        } else {
            console.log("YouTubeApi got %s videos from upload playlist", response.pageInfo.totalResults);
            getVideos(auth, playlistItemIds, callback);
        }
    });
}

/**
 * Retrieve upload playlist id for given username
 *
 * @param {Google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param username Youtube channel username
 * @param callback YoutubeApi callback
 */
function getLinksFromPlaylist(auth, username, callback) {
    let service = Google.youtube('v3');
    service.channels.list({
        auth: auth,
        part: 'contentDetails',
        forUsername: username,
    }, (err, response) => {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        let channels = response.items;

        if (channels.length === 0) {
            console.log('No channel found.');
        } else {
            let playlistArray = channels[0].contentDetails.relatedPlaylists;
            let playlistId = playlistArray["uploads"];

            getPlaylistItems(null, auth, playlistId, callback);
        }
    });
}

module.exports = YouTubeApi;