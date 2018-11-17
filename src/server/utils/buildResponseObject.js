module.exports = (req,res) => {
    return {
        meta: {
            date: Date.now()
        },
        messages:{
            error:[],
            info:[],
            success:[],
            warning:[]
        }
    }
}