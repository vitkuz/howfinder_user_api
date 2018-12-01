module.exports = (req,res) => {
    return {
        meta: {
            lang: req.locale,
            date: Date.now(),
            type: 'success',
            code: null,
            status: null,
            time: null
        },
        messages:{
            error:[],
            info:[],
            success:[],
            warning:[]
        },
        logTime: function() {
            this.meta.time = Date.now() - this.meta.date;
            return this;
        },
        addMessage: function(type,message) {
            this.messages[type].push(message);
            return this;
        }
    }
}