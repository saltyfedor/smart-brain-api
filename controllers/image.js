const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '7521640716244576a8ddfe57f7e8aa68'
});

const handleImage = (req,res, db)=>{
    const { id } = req.body;
        db('users')
        .where('id', '=' , id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries =>{
            res.json(entries)
            })
        .catch(err=> res.status(400).json('unable to get entries'))
        
};

const handleApiRequest = (req, res) => {
    const requrl = req.body.url;
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, requrl)
    .then(data => res.json(data))
}

module.exports = {
    handleImage: handleImage,
    handleApiRequest: handleApiRequest
};