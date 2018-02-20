const Artist = require("./models/artist");
const Comment = require("./models/comment");

const data = [{
    name: "Lana del Rey",
    image: "https://pbs.twimg.com/profile_images/915657692869521415/F97HCCDB.jpg",
    description: "Elizabeth Woolridge Grant (born June 21, 1985),[1] known professionally as Lana Del Rey, is an American singer, songwriter, record producer, and model. "
},
    {
        name: "Lana del Rey",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Lana_Del_Rey_at_KROQ_Weenie_Roast_2017_%28cropped%29.jpg/220px-Lana_Del_Rey_at_KROQ_Weenie_Roast_2017_%28cropped%29.jpg",
        description: "Elizabeth Woolridge Grant (born June 21, 1985),[1] known professionally as Lana Del Rey, is an American singer, songwriter, record producer, and model. "
    },
    {
        name: "Lana del Rey",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Lana_Del_Rey_at_KROQ_Weenie_Roast_2017_%28cropped%29.jpg/220px-Lana_Del_Rey_at_KROQ_Weenie_Roast_2017_%28cropped%29.jpg",
        description: "Elizabeth Woolridge Grant (born June 21, 1985),[1] known professionally as Lana Del Rey, is an American singer, songwriter, record producer, and model. "
    }

];

function seedDB() {
    //REMOVE ALL ARTISTS
    Artist.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed artists");
    });
    // ADD A FEW ARTISTS
    data.forEach(function (seed) {
        Artist.create(seed, function (err, artist) {
            if (err) {
                console.log(err);
            } else {
                console.log("added an artist");
                //create a comment on each artist
                Comment.create({
                    text: "Nice",
                    author: "Marge"
                }, function (err, comment) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("artist:" + artist);
                        console.log("comment:" + comment);
                        let comments = [];
                        comments.push(comment);
                        // artist.comments = comments;
                        artist.comments.push(comment._id);
                        artist.markModified('comments');
                        artist.save(function (err) {
                            if (err) {
                                console.log("dupa:" + err);
                            }
                            // saved!
                        });
                        console.log("new artist:" + artist);
                        console.log("Created new comment");
                    }
                });
            }
        });
    });

    //add a few comments
}

module.exports = seedDB;