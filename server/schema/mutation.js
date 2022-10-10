const graphql = require('graphql')
const UserType = require('./types/user_type')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID
} = graphql
const mongoose=require('mongoose')
const Song = mongoose.model('song');
const Lyric = mongoose.model('lyric')
const AuthService = require("../services/auth")
const SongType = require('./types/song_type');
const LyricType = require('./types/lyric_type');
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password }, req) {
                if(!email || !password){
                     throw new Error('Email and Password are required field!!')
                }
                return AuthService.signup({ email, password, req })

            }
        },
        logout: {
            type: UserType,
            resolve(parentValue, args, req) {
                return AuthService.logout(req)

            }
        },
        login:{
            type:UserType,
            args:{
                email:{type:GraphQLString},
                password:{type:GraphQLString}
            },
            resolve(parentValue,{email,password},req){
                console.log("-----Login connect attempted-----")
            
                return  AuthService.login({email,password,req})
            }
        },
        addSong:{
            type:SongType,
            args:{
                title:{type:GraphQLString}
            },
            resolve(parentValue,{title}){
                
                return (new Song({title})).save()
            }
        },
        addLyricToSong:{
            type:SongType,
            args:{
                content:{type:GraphQLString},
                songId:{type:graphql.GraphQLID}
            },
            resolve(parentValue,{content,songId}){
               
                return Song.addLyric(songId,content)
            }
        },
        likeLyric: {
            type: LyricType,
            args: { 
                id: { type: GraphQLID },
                user:{type:GraphQLString}
             },
            resolve(parentValue, {id,user}) {
               return Lyric.like(id,user)
            }
          },
          deleteSong: {
            type: SongType,
            args: { id: { type: GraphQLID } },
            resolve(parentValue, { id }) {
                console.log(id)
              return Song.findByIdAndRemove(id);
            }
          }



    }
})

module.exports = { mutation }