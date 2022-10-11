const graphql = require('graphql');
const mongoose = require('mongoose');
const LyricType = require('../types/lyric_type');
const SongType = require('../types/song_type');
const UserType = require('../types/user_type');
const { GraphQLObjectType, GraphQLID, GraphQLList,GraphQLNonNull } = graphql;
const Lyric = mongoose.model('lyric');
const Song = mongoose.model('song');




const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      resolve(parentValue, args, req) {
        console.log("-----Requesting user---------")
        console.log(req.user)
        console.log(req.session.passport.user)
        console.log(req._passport)
        return req._passport
      }
    },
    songs: {
      type: new GraphQLList(SongType),
      resolve() {
        return Song.find({})
      }
    },
    song:{
      type:SongType,
      args:{
        id:{type:new GraphQLNonNull(GraphQLID)}
      },
      resolve(parentValue,{id}){
        return Song.findById(id);

      }
    },
    lyric:{
      type:LyricType,
      args:{
      id:{type:new GraphQLNonNull(GraphQLID) }

      },
      resolve(parentValue,{id}){
        return Lyric.findById(id)
      }
    }
  }
});

module.exports = RootQuery;
