const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const LyricSchema = new Schema({
    song: {
      type: Schema.Types.ObjectId,
      ref: 'song'
    },
    likes: { type: Number, default: 0 },
    likers:[{type:String}],
    content: { type: String }
  });
  
LyricSchema.statics.like=function(id,user){
    const Lyric=mongoose.model("lyric");
    console.log(user)
    return Lyric.findById(id)
   
    .then(lyric=>{
      console.log(!lyric.likers.includes(user))
      if(lyric.likers.includes(user)){
        console.log("user present")
   
    
        const index=lyric.likers.indexOf(user)
        if(index>-1){
          lyric.likers.splice(index,1)
        }
            --lyric.likes
        return lyric.save()

      }
      else{
        console.log("user not present")
        lyric.likers.push(user)
        ++lyric.likes

        return lyric.save()
    

      }
     
    })
}
mongoose.model('lyric',LyricSchema)